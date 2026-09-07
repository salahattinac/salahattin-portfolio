// Salahattin Açıkgöz Portföyü — REST API, Firestore Entegrasyonu & Statik Web Sunucusu
// Firebase Firestore + Auth ve Yerel Fallback Hibrit Motoru

const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const url = require('url');

const PORT = process.env.PORT || 3000;
const ROOT_DIR = __dirname;
const DATA_DIR = path.join(ROOT_DIR, 'data');

// ================= FIREBASE ADMIN SDK & FIRESTORE BAĞLANTISI =================
let admin = null;
let firestoreDb = null;

try {
    admin = require('firebase-admin');
    const possibleKeyPaths = [
        process.env.FIREBASE_SERVICE_ACCOUNT,
        path.join(ROOT_DIR, 'serviceAccountKey.json'),
        path.join(ROOT_DIR, 'firebase-service-account.json')
    ].filter(Boolean);

    let keyPath = possibleKeyPaths.find(p => fs.existsSync(p));
    if (keyPath) {
        const serviceAccount = JSON.parse(fs.readFileSync(keyPath, 'utf8'));
        admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
        firestoreDb = admin.firestore();
        console.log(`[FIREBASE] Service Account (${path.basename(keyPath)}) ile Firestore aktif!`);
    } else if (process.env.GOOGLE_APPLICATION_CREDENTIALS || process.env.GCLOUD_PROJECT) {
        admin.initializeApp();
        firestoreDb = admin.firestore();
        console.log('[FIREBASE] Application Default Credentials ile Firestore aktif!');
    } else {
        console.log('[FIREBASE] Service Account anahtarı henüz eklenmedi. Yerel JSON fallback devrede.');
    }
} catch (e) {
    console.log('[FIREBASE] firebase-admin başlatılamadı veya yüklü değil. Yerel JSON fallback devrede.');
}

// Güvenli oturum token havuzu (Yerel fallback)
const activeSessions = new Map();

// Canlı SSE istemci havuzu (Anlık senkronizasyon için)
const sseClients = new Set();

function broadcastUpdate(section, data) {
    const payload = JSON.stringify({ type: 'DATA_UPDATED', section, data, timestamp: Date.now() });
    for (const client of sseClients) {
        try {
            client.write(`data: ${payload}\n\n`);
        } catch (e) {
            sseClients.delete(client);
        }
    }
}

// Helper: JSON dosyasını güvenle oku (Yedek / Fallback)
function readJsonFile(filename, defaultValue = {}) {
    const filePath = path.join(DATA_DIR, filename);
    try {
        if (!fs.existsSync(filePath)) {
            fs.writeFileSync(filePath, JSON.stringify(defaultValue, null, 2), 'utf8');
            return defaultValue;
        }
        const raw = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(raw);
    } catch (err) {
        console.error(`[DATA ERROR] ${filename} okunamadı:`, err.message);
        return defaultValue;
    }
}

// Helper: JSON dosyasına yaz (Yedek / Fallback)
function writeJsonFile(filename, data) {
    const filePath = path.join(DATA_DIR, filename);
    try {
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
        return true;
    } catch (err) {
        console.error(`[DATA ERROR] ${filename} yazılamadı:`, err.message);
        return false;
    }
}

// MIME Tipleri
const MIME_TYPES = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.mp4': 'video/mp4',
    '.webm': 'video/webm',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
    '.ttf': 'font/ttf',
    '.pdf': 'application/pdf'
};

// Request Body Parser
function parseRequestBody(req) {
    return new Promise((resolve, reject) => {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
            if (body.length > 1e6) { // 1MB limit
                req.destroy();
                reject(new Error('Payload Too Large'));
            }
        });
        req.on('end', () => {
            if (!body) return resolve({});
            try {
                resolve(JSON.parse(body));
            } catch (e) {
                resolve({});
            }
        });
        req.on('error', reject);
    });
}

// JSON Yanıt Yardımcısı
function sendJson(res, statusCode, data) {
    res.writeHead(statusCode, {
        'Content-Type': 'application/json; charset=utf-8',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    });
    res.end(JSON.stringify(data));
}

// Auth Doğrulama (Firebase ID Token ve Yerel Token Hibrit Desteği)
async function isAuthenticated(req) {
    const authHeader = req.headers['authorization'] || '';
    const token = authHeader.replace(/^Bearer\s+/i, '').trim();
    if (!token) return false;

    // 1. Firebase Auth ID Token Kontrolü
    if (admin && token.length > 100) {
        try {
            const decoded = await admin.auth().verifyIdToken(token);
            if (decoded && decoded.uid) return true;
        } catch (e) {
            // Firebase token değilse yerel oturuma bak
        }
    }

    // 2. Yerel Oturum Kontrolü
    const session = activeSessions.get(token);
    if (!session) return false;
    if (Date.now() > session.expiresAt) {
        activeSessions.delete(token);
        return false;
    }
    return true;
}

// HTTP Sunucu
const server = http.createServer(async (req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;
    const method = req.method;

    // CORS Preflight
    if (method === 'OPTIONS') {
        res.writeHead(204, {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization'
        });
        return res.end();
    }

    // ================= REST API ROUTES =================

    // 1. Auth: Giriş Yap (Firebase Auth öncelikli)
    if (pathname === '/api/login' && method === 'POST') {
        const body = await parseRequestBody(req);
        const auth = readJsonFile('auth.json', {});

        if (auth.password && body.username === auth.username && body.password === auth.password) {
            const token = crypto.randomBytes(32).toString('hex');
            activeSessions.set(token, {
                username: auth.username,
                createdAt: Date.now(),
                expiresAt: Date.now() + (24 * 60 * 60 * 1000) // 24 saat
            });
            return sendJson(res, 200, {
                success: true,
                token,
                user: { name: auth.name || 'Salahattin Açıkgöz', username: auth.username }
            });
        } else {
            return sendJson(res, 401, { success: false, message: 'Geçersiz e-posta veya şifre!' });
        }
    }

    // 2. Auth: Oturum Kontrolü
    if (pathname === '/api/check-auth' && method === 'GET') {
        const authed = await isAuthenticated(req);
        if (authed) {
            return sendJson(res, 200, { authenticated: true });
        }
        return sendJson(res, 401, { authenticated: false });
    }

    // 3. Auth: Şifre Değiştir
    if (pathname === '/api/change-password' && method === 'POST') {
        const authed = await isAuthenticated(req);
        if (!authed) return sendJson(res, 401, { message: 'Yetkisiz erişim!' });
        const body = await parseRequestBody(req);
        const auth = readJsonFile('auth.json');
        
        if (body.currentPassword !== auth.password) {
            return sendJson(res, 400, { success: false, message: 'Mevcut şifre hatalı!' });
        }
        if (!body.newPassword || body.newPassword.length < 4) {
            return sendJson(res, 400, { success: false, message: 'Yeni şifre en az 4 karakter olmalıdır!' });
        }

        auth.password = body.newPassword;
        auth.updatedAt = new Date().toISOString();
        writeJsonFile('auth.json', auth);
        return sendJson(res, 200, { success: true, message: 'Şifreniz başarıyla güncellendi!' });
    }

    // 4. Stats: Dashboard İstatistikleri (Firestore veya JSON)
    if (pathname === '/api/stats' && method === 'GET') {
        const authed = await isAuthenticated(req);
        if (!authed) return sendJson(res, 401, { message: 'Yetkisiz erişim!' });

        let totalProjects = 0;
        let totalMessages = 0;
        let unreadCount = 0;

        if (firestoreDb) {
            try {
                const projSnap = await firestoreDb.collection('projects').get();
                totalProjects = projSnap.size;
                const msgSnap = await firestoreDb.collection('messages').get();
                totalMessages = msgSnap.size;
                msgSnap.forEach(doc => {
                    if (!doc.data().read) unreadCount++;
                });
            } catch (err) {
                console.warn('[FIRESTORE STATS ERROR]', err.message);
                const projects = readJsonFile('projects.json', []);
                const messages = readJsonFile('messages.json', []);
                totalProjects = projects.length;
                totalMessages = messages.length;
                unreadCount = messages.filter(m => !m.read).length;
            }
        } else {
            const projects = readJsonFile('projects.json', []);
            const messages = readJsonFile('messages.json', []);
            totalProjects = projects.length;
            totalMessages = messages.length;
            unreadCount = messages.filter(m => !m.read).length;
        }

        return sendJson(res, 200, {
            totalProjects,
            totalMessages,
            unreadMessages: unreadCount,
            serverUptime: Math.floor(process.uptime()),
            storageBackend: firestoreDb ? 'Firestore' : 'Local JSON'
        });
    }

    // 5. Mesajlar: İletişim Formu (Açık Uç Nokta)
    if (pathname === '/api/messages' && method === 'POST') {
        const body = await parseRequestBody(req);
        if (!body.name || !body.email || !body.message) {
            return sendJson(res, 400, { success: false, message: 'Zorunlu alanlar eksik!' });
        }

        const newMessage = {
            id: 'msg_' + Date.now(),
            name: body.name.trim(),
            email: body.email.trim(),
            topic: body.topic || 'Genel Görüşme',
            subject: body.subject || `${body.topic || 'İletişim'} Talebi`,
            message: body.message.trim(),
            createdAt: new Date().toISOString(),
            read: false
        };

        if (firestoreDb) {
            try {
                await firestoreDb.collection('messages').doc(newMessage.id).set(newMessage);
            } catch (err) {
                console.warn('[FIRESTORE MSG WRITE ERROR]', err.message);
            }
        }

        // Yerel yedeği de daima tut
        const messages = readJsonFile('messages.json', []);
        messages.unshift(newMessage);
        writeJsonFile('messages.json', messages);

        return sendJson(res, 201, { success: true, message: 'Mesajınız başarıyla iletildi!', id: newMessage.id });
    }

    // 6. Mesajlar: Listeleme (Yetkili)
    if (pathname === '/api/messages' && method === 'GET') {
        const authed = await isAuthenticated(req);
        if (!authed) return sendJson(res, 401, { message: 'Yetkisiz erişim!' });

        if (firestoreDb) {
            try {
                const snapshot = await firestoreDb.collection('messages').orderBy('createdAt', 'desc').get();
                const msgs = [];
                snapshot.forEach(doc => msgs.push({ id: doc.id, ...doc.data() }));
                return sendJson(res, 200, msgs);
            } catch (err) {
                console.warn('[FIRESTORE MSG READ ERROR]', err.message);
            }
        }

        const messages = readJsonFile('messages.json', []);
        return sendJson(res, 200, messages);
    }

    // 7. Mesajlar: Okundu Olarak İşaretle (Yetkili)
    if (pathname.startsWith('/api/messages/') && pathname.endsWith('/read') && method === 'PUT') {
        const authed = await isAuthenticated(req);
        if (!authed) return sendJson(res, 401, { message: 'Yetkisiz erişim!' });
        const parts = pathname.split('/');
        const msgId = parts[3];

        if (firestoreDb) {
            try {
                await firestoreDb.collection('messages').doc(msgId).update({ read: true });
            } catch (err) {
                console.warn('[FIRESTORE MSG UPDATE ERROR]', err.message);
            }
        }

        const messages = readJsonFile('messages.json', []);
        const target = messages.find(m => m.id === msgId);
        if (target) {
            target.read = true;
            writeJsonFile('messages.json', messages);
        }
        return sendJson(res, 200, { success: true, message: 'Okundu olarak işaretlendi.' });
    }

    // 8. Mesajlar: Sil (Yetkili)
    if (pathname.startsWith('/api/messages/') && method === 'DELETE') {
        const authed = await isAuthenticated(req);
        if (!authed) return sendJson(res, 401, { message: 'Yetkisiz erişim!' });
        const parts = pathname.split('/');
        const msgId = parts[3];

        if (firestoreDb) {
            try {
                await firestoreDb.collection('messages').doc(msgId).delete();
            } catch (err) {
                console.warn('[FIRESTORE MSG DELETE ERROR]', err.message);
            }
        }

        let messages = readJsonFile('messages.json', []);
        messages = messages.filter(m => m.id !== msgId);
        writeJsonFile('messages.json', messages);
        return sendJson(res, 200, { success: true, message: 'Mesaj silindi.' });
    }

    // 9. Projeler: Listele (Açık ve Yetkili)
    if (pathname === '/api/projects' && method === 'GET') {
        if (firestoreDb) {
            try {
                const snapshot = await firestoreDb.collection('projects').get();
                if (!snapshot.empty) {
                    const projs = [];
                    snapshot.forEach(doc => projs.push({ id: doc.id, ...doc.data() }));
                    return sendJson(res, 200, projs);
                }
            } catch (err) {
                console.warn('[FIRESTORE PROJ READ ERROR]', err.message);
            }
        }
        const projects = readJsonFile('projects.json', []);
        return sendJson(res, 200, projects);
    }

    // 10. Projeler: Ekle (Yetkili)
    if (pathname === '/api/projects' && method === 'POST') {
        const authed = await isAuthenticated(req);
        if (!authed) return sendJson(res, 401, { message: 'Yetkisiz erişim!' });
        const body = await parseRequestBody(req);

        const newProj = {
            id: body.id || 'proj_' + Date.now(),
            badge: body.badge || 'Kurumsal Çözüm',
            category: body.category || 'Yazılım',
            title: body.title || 'Yeni Proje',
            description: body.description || '',
            longDescription: body.longDescription || '',
            techStack: Array.isArray(body.techStack) ? body.techStack : (body.techStack || '').split(',').map(s => s.trim()).filter(Boolean),
            metrics: Array.isArray(body.metrics) ? body.metrics : [],
            featured: body.featured !== false,
            githubUrl: body.githubUrl || '',
            liveUrl: body.liveUrl || ''
        };

        if (firestoreDb) {
            try {
                await firestoreDb.collection('projects').doc(newProj.id).set(newProj);
            } catch (err) {
                console.warn('[FIRESTORE PROJ WRITE ERROR]', err.message);
            }
        }

        const projects = readJsonFile('projects.json', []);
        projects.unshift(newProj);
        writeJsonFile('projects.json', projects);
        broadcastUpdate('projects', projects);
        return sendJson(res, 201, { success: true, project: newProj });
    }

    // 11. Projeler: Güncelle (Yetkili)
    if (pathname.startsWith('/api/projects/') && method === 'PUT') {
        const authed = await isAuthenticated(req);
        if (!authed) return sendJson(res, 401, { message: 'Yetkisiz erişim!' });
        const parts = pathname.split('/');
        const projId = parts[3];
        const body = await parseRequestBody(req);

        const updatedData = {
            ...body,
            techStack: Array.isArray(body.techStack) ? body.techStack : (body.techStack || '').split(',').map(s => s.trim()).filter(Boolean)
        };

        if (firestoreDb) {
            try {
                await firestoreDb.collection('projects').doc(projId).set(updatedData, { merge: true });
            } catch (err) {
                console.warn('[FIRESTORE PROJ UPDATE ERROR]', err.message);
            }
        }

        const projects = readJsonFile('projects.json', []);
        const idx = projects.findIndex(p => p.id === projId);
        if (idx !== -1) {
            projects[idx] = { ...projects[idx], ...updatedData };
            writeJsonFile('projects.json', projects);
            broadcastUpdate('projects', projects);
            return sendJson(res, 200, { success: true, project: projects[idx] });
        }
        return sendJson(res, 200, { success: true, project: updatedData });
    }

    // 12. Projeler: Sil (Yetkili)
    if (pathname.startsWith('/api/projects/') && method === 'DELETE') {
        const authed = await isAuthenticated(req);
        if (!authed) return sendJson(res, 401, { message: 'Yetkisiz erişim!' });
        const parts = pathname.split('/');
        const projId = parts[3];

        if (firestoreDb) {
            try {
                await firestoreDb.collection('projects').doc(projId).delete();
            } catch (err) {
                console.warn('[FIRESTORE PROJ DELETE ERROR]', err.message);
            }
        }

        let projects = readJsonFile('projects.json', []);
        projects = projects.filter(p => p.id !== projId);
        writeJsonFile('projects.json', projects);
        broadcastUpdate('projects', projects);
        return sendJson(res, 200, { success: true, message: 'Proje silindi.' });
    }

    // ================= REAL-TIME SSE BROADCAST =================
    if (pathname === '/api/live-stream' && method === 'GET') {
        res.writeHead(200, {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
            'Access-Control-Allow-Origin': '*'
        });
        res.write(': connected\n\n');
        sseClients.add(res);
        req.on('close', () => {
            sseClients.delete(res);
        });
        return;
    }

    // 13. Profil: Oku & Güncelle
    if (pathname === '/api/profile' && method === 'GET') {
        if (firestoreDb) {
            try {
                const doc = await firestoreDb.collection('content').doc('profile').get();
                if (doc.exists) return sendJson(res, 200, doc.data());
            } catch (err) {
                console.warn('[FIRESTORE PROFILE GET ERROR]', err.message);
            }
        }
        const profile = readJsonFile('profile.json', {});
        return sendJson(res, 200, profile);
    }
    if (pathname === '/api/profile' && method === 'PUT') {
        const authed = await isAuthenticated(req);
        if (!authed) return sendJson(res, 401, { message: 'Yetkisiz erişim!' });
        const body = await parseRequestBody(req);

        if (firestoreDb) {
            try {
                await firestoreDb.collection('content').doc('profile').set(body, { merge: true });
            } catch (err) {
                console.warn('[FIRESTORE PROFILE PUT ERROR]', err.message);
            }
        }

        const profile = readJsonFile('profile.json', {});
        const updated = { ...profile, ...body };
        writeJsonFile('profile.json', updated);
        broadcastUpdate('profile', updated);
        return sendJson(res, 200, { success: true, profile: updated });
    }

    // 14. Deneyim: Oku & Güncelle
    if (pathname === '/api/experience' && method === 'GET') {
        if (firestoreDb) {
            try {
                const doc = await firestoreDb.collection('content').doc('experience').get();
                if (doc.exists) return sendJson(res, 200, doc.data());
            } catch (err) {
                console.warn('[FIRESTORE EXP GET ERROR]', err.message);
            }
        }
        const exp = readJsonFile('experience.json', {});
        return sendJson(res, 200, exp);
    }
    if (pathname === '/api/experience' && method === 'PUT') {
        const authed = await isAuthenticated(req);
        if (!authed) return sendJson(res, 401, { message: 'Yetkisiz erişim!' });
        const body = await parseRequestBody(req);

        if (firestoreDb) {
            try {
                await firestoreDb.collection('content').doc('experience').set(body, { merge: true });
            } catch (err) {
                console.warn('[FIRESTORE EXP PUT ERROR]', err.message);
            }
        }

        writeJsonFile('experience.json', body);
        broadcastUpdate('experience', body);
        return sendJson(res, 200, { success: true, experience: body });
    }

    // 15. Yetenekler: Oku & Güncelle
    if (pathname === '/api/skills' && method === 'GET') {
        if (firestoreDb) {
            try {
                const snapshot = await firestoreDb.collection('skills').get();
                if (!snapshot.empty) {
                    const skills = [];
                    snapshot.forEach(doc => skills.push({ id: doc.id, ...doc.data() }));
                    return sendJson(res, 200, skills);
                }
            } catch (err) {
                console.warn('[FIRESTORE SKILLS GET ERROR]', err.message);
            }
        }
        const skills = readJsonFile('skills.json', []);
        return sendJson(res, 200, skills);
    }
    if (pathname === '/api/skills' && method === 'PUT') {
        const authed = await isAuthenticated(req);
        if (!authed) return sendJson(res, 401, { message: 'Yetkisiz erişim!' });
        const body = await parseRequestBody(req);

        if (firestoreDb && Array.isArray(body)) {
            try {
                const batch = firestoreDb.batch();
                for (const item of body) {
                    const docId = item.id || String(Date.now());
                    const ref = firestoreDb.collection('skills').doc(docId);
                    batch.set(ref, item, { merge: true });
                }
                await batch.commit();
            } catch (err) {
                console.warn('[FIRESTORE SKILLS PUT ERROR]', err.message);
            }
        }

        writeJsonFile('skills.json', body);
        broadcastUpdate('skills', body);
        return sendJson(res, 200, { success: true, skills: body });
    }

    // ================= STATIC FILE SERVING =================
    let reqPath = pathname;
    if (reqPath === '/' || reqPath === '') reqPath = '/index.html';
    if (reqPath === '/admin') reqPath = '/admin.html';

    const safePath = path.normalize(reqPath).replace(/^(\.\.[\/\\])+/, '');
    const filePath = path.join(ROOT_DIR, safePath);

    fs.stat(filePath, (err, stats) => {
        if (err || !stats.isFile()) {
            res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
            return res.end('404 — Sayfa veya kaynak bulunamadı.');
        }

        const ext = path.extname(filePath).toLowerCase();
        const contentType = MIME_TYPES[ext] || 'application/octet-stream';

        res.writeHead(200, {
            'Content-Type': contentType,
            'Cache-Control': 'no-cache'
        });

        const stream = fs.createReadStream(filePath);
        stream.pipe(res);
    });
});

server.listen(PORT, () => {
    console.log(`
===========================================================
  Salahattin Açıkgöz Portföy & Firebase API Sunucusu Aktif!
===========================================================
  -> Portföy Web Sitesi : http://localhost:${PORT}
  -> Admin Yönetim Paneli : http://localhost:${PORT}/admin
  -> Firestore Durumu     : ${firestoreDb ? 'Bağlı (Online)' : 'Yerel Yedek Modu (Offline)'}
===========================================================
`);
});
