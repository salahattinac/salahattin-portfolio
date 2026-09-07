// Salahattin Açıkgöz Portföyü — Admin Yönetim Paneli JS
// Tam Senkronizasyon & Canlı Güncelleme Motoru

document.addEventListener('DOMContentLoaded', () => {

    const API_BASE = window.location.origin.includes('http') ? window.location.origin : 'http://localhost:3000';
    let authToken = localStorage.getItem('agy_admin_token') || '';

    // BroadcastChannel for 0ms instantaneous cross-tab live synchronization
    const syncChannel = ('BroadcastChannel' in window) ? new BroadcastChannel('portfolio_sync') : null;

    function broadcastSync(section, data) {
        if (syncChannel) {
            try {
                syncChannel.postMessage({
                    type: 'SYNC_UPDATE',
                    section,
                    data,
                    timestamp: Date.now()
                });
            } catch (err) {
                console.warn('[SYNC ERROR]', err);
            }
        }
    }

    // State cache
    let cachedMessages = [];
    let cachedProjects = [];
    let cachedProfile = {};
    let cachedExperience = {};
    let cachedSkills = [];
    let activeMessageId = null;

    // Elements
    const loginView = document.getElementById('login-view');
    const appView = document.getElementById('app-view');
    const loginForm = document.getElementById('login-form');
    const loginError = document.getElementById('login-error');
    const loginErrorText = document.getElementById('login-error-text');
    const togglePasswordBtn = document.getElementById('toggle-password');
    const passwordInput = document.getElementById('login-password');
    const logoutBtn = document.getElementById('logout-btn');

    // Sidebar & Navigation
    const navTabs = document.querySelectorAll('.nav-tab');
    const tabContents = document.querySelectorAll('.tab-content');
    const topbarTitle = document.getElementById('topbar-title');
    const openSidebarBtn = document.getElementById('open-sidebar-btn');
    const closeSidebarBtn = document.getElementById('close-sidebar-btn');
    const sidebar = document.getElementById('sidebar');

    // Modals
    const messageModal = document.getElementById('message-modal');
    const closeMsgModalBtn = document.getElementById('close-msg-modal-btn');
    const modalMsgName = document.getElementById('modal-msg-name');
    const modalMsgEmail = document.getElementById('modal-msg-email');
    const modalMsgTopic = document.getElementById('modal-msg-topic');
    const modalMsgDate = document.getElementById('modal-msg-date');
    const modalMsgBody = document.getElementById('modal-msg-body');
    const modalMsgReplyLink = document.getElementById('modal-msg-reply-link');
    const modalMsgDeleteBtn = document.getElementById('modal-msg-delete-btn');

    const projectModal = document.getElementById('project-modal');
    const closeProjModalBtn = document.getElementById('close-proj-modal-btn');
    const cancelProjModalBtn = document.getElementById('cancel-proj-modal-btn');
    const openNewProjectModalBtn = document.getElementById('open-new-project-modal-btn');
    const projectForm = document.getElementById('project-form');

    const skillModal = document.getElementById('skill-modal');
    const closeSkillModalBtn = document.getElementById('close-skill-modal-btn');
    const cancelSkillModalBtn = document.getElementById('cancel-skill-modal-btn');
    const openNewSkillModalBtn = document.getElementById('open-new-skill-modal-btn');
    const skillForm = document.getElementById('skill-form');

    // Toast Notification
    function showToast(message, type = 'success') {
        const container = document.getElementById('toast-container');
        if (!container) return;

        const toast = document.createElement('div');
        const isSuccess = type === 'success';
        toast.className = `px-4 py-3 rounded-2xl ${isSuccess ? 'bg-yellow-400 text-black' : 'bg-red-500 text-white'} font-semibold text-xs shadow-2xl flex items-center gap-2 pointer-events-auto transition-all transform translate-y-2 opacity-0`;
        
        toast.innerHTML = `
            <i data-lucide="${isSuccess ? 'check-circle-2' : 'alert-circle'}" class="w-4 h-4 flex-shrink-0"></i>
            <span>${escapeHtml(message)}</span>
        `;

        container.appendChild(toast);
        if (window.lucide) lucide.createIcons();

        requestAnimationFrame(() => {
            toast.classList.remove('translate-y-2', 'opacity-0');
        });

        setTimeout(() => {
            toast.classList.add('opacity-0', 'translate-y-2');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    // Custom Dark Confirmation Modal (replaces native window.confirm)
    function showConfirmModal({
        title = 'İşlemi Onaylayın',
        message = 'Bu işlemi gerçekleştirmek istediğinize emin misiniz?',
        confirmText = 'Evet, Sil',
        cancelText = 'Vazgeç',
        danger = true
    } = {}) {
        return new Promise((resolve) => {
            const modal = document.getElementById('confirm-modal');
            const card = document.getElementById('confirm-modal-card');
            const titleEl = document.getElementById('confirm-modal-title');
            const msgEl = document.getElementById('confirm-modal-message');
            const okBtn = document.getElementById('confirm-modal-ok-btn');
            const cancelBtn = document.getElementById('confirm-modal-cancel-btn');
            const iconWrapper = document.getElementById('confirm-modal-icon-wrapper');

            if (!modal || !card) {
                resolve(false);
                return;
            }

            if (titleEl) titleEl.textContent = title;
            if (msgEl) msgEl.textContent = message;
            if (okBtn) okBtn.textContent = confirmText;
            if (cancelBtn) cancelBtn.textContent = cancelText;

            if (iconWrapper) {
                if (danger) {
                    iconWrapper.className = 'w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center mx-auto';
                    iconWrapper.innerHTML = '<i data-lucide="trash-2" class="w-6 h-6"></i>';
                    if (okBtn) okBtn.className = 'flex-1 px-4 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold text-xs transition-all shadow-lg shadow-red-500/20 cursor-pointer';
                } else {
                    iconWrapper.className = 'w-12 h-12 rounded-2xl bg-yellow-400/10 border border-yellow-400/20 text-yellow-400 flex items-center justify-center mx-auto';
                    iconWrapper.innerHTML = '<i data-lucide="help-circle" class="w-6 h-6"></i>';
                    if (okBtn) okBtn.className = 'flex-1 px-4 py-2.5 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-black font-bold text-xs transition-all shadow-lg shadow-yellow-400/20 cursor-pointer';
                }
            }

            if (window.lucide) lucide.createIcons();

            modal.classList.remove('opacity-0', 'pointer-events-none');
            card.classList.remove('scale-95');
            card.classList.add('scale-100');

            function cleanup(result) {
                modal.classList.add('opacity-0', 'pointer-events-none');
                card.classList.remove('scale-100');
                card.classList.add('scale-95');
                if (okBtn) okBtn.onclick = null;
                if (cancelBtn) cancelBtn.onclick = null;
                modal.onclick = null;
                resolve(result);
            }

            if (okBtn) okBtn.onclick = () => cleanup(true);
            if (cancelBtn) cancelBtn.onclick = () => cleanup(false);
            modal.onclick = (e) => {
                if (e.target === modal) cleanup(false);
            };
        });
    }

    // Toggle Password Visibility
    if (togglePasswordBtn && passwordInput) {
        togglePasswordBtn.addEventListener('click', () => {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            const icon = togglePasswordBtn.querySelector('i');
            if (icon) {
                icon.setAttribute('data-lucide', type === 'password' ? 'eye' : 'eye-off');
                if (window.lucide) lucide.createIcons();
            }
        });
    }

    // Sidebar Mobile Toggle
    if (openSidebarBtn) {
        openSidebarBtn.addEventListener('click', () => {
            sidebar.classList.remove('-translate-x-full');
        });
    }
    if (closeSidebarBtn) {
        closeSidebarBtn.addEventListener('click', () => {
            sidebar.classList.add('-translate-x-full');
        });
    }

    // API Request with Auth
    async function apiRequest(endpoint, method = 'GET', body = null) {
        const headers = { 'Content-Type': 'application/json' };
        if (authToken) headers['Authorization'] = `Bearer ${authToken}`;

        try {
            const res = await fetch(`${API_BASE}${endpoint}`, {
                method,
                headers,
                body: body ? JSON.stringify(body) : null
            });
            const data = await res.json();
            return { ok: res.ok, status: res.status, data };
        } catch (err) {
            console.warn(`[API FETCH ERROR] ${endpoint}:`, err.message);
            return { ok: false, status: 0, networkError: true };
        }
    }

    // ================= AUTH CHECK & LOGIN (100% FIREBASE AUTHENTICATION) =================
    async function checkAuth() {
        if (window.firebaseAuth) {
            window.firebaseAuth.onAuthStateChanged(async (user) => {
                if (user) {
                    try {
                        authToken = await user.getIdToken();
                        localStorage.setItem('agy_admin_token', authToken);
                        const emailEl = document.getElementById('sidebar-admin-email');
                        if (emailEl) emailEl.textContent = user.email;
                    } catch (e) {}
                    showApp();
                    loadAllData();
                } else {
                    showLogin();
                }
            });
            return;
        }
        showLogin();
    }

    function showLogin() {
        loginView.classList.remove('hidden');
        appView.classList.add('hidden');
        if (window.lucide) lucide.createIcons();
    }

    function showApp() {
        loginView.classList.add('hidden');
        appView.classList.remove('hidden');
        if (window.lucide) lucide.createIcons();
    }

    async function logout() {
        if (window.firebaseAuth) {
            try {
                await window.firebaseAuth.signOut();
            } catch (e) {}
        }
        authToken = '';
        localStorage.removeItem('agy_admin_token');
        showLogin();
        showToast('Oturum kapatıldı.', 'success');
    }

    if (logoutBtn) logoutBtn.addEventListener('click', logout);

    // Login Form Submit (100% Firebase Authentication)
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            loginError.classList.add('hidden');

            const email = document.getElementById('login-username').value.trim();
            const password = passwordInput.value.trim();

            if (!email || !password) {
                loginError.classList.remove('hidden');
                loginErrorText.textContent = 'Lütfen e-posta ve şifrenizi girin.';
                return;
            }

            if (window.firebaseAuth) {
                const submitBtn = document.getElementById('login-submit-btn');
                if (submitBtn) {
                    submitBtn.disabled = true;
                    submitBtn.innerHTML = '<span>Doğrulanıyor...</span>';
                }

                try {
                    const userCredential = await window.firebaseAuth.signInWithEmailAndPassword(email, password);
                    authToken = await userCredential.user.getIdToken();
                    localStorage.setItem('agy_admin_token', authToken);
                    showApp();
                    loadAllData();
                    showToast('Giriş başarılı! Hoş geldiniz.', 'success');
                    return;
                } catch (fbErr) {
                    console.warn('[FIREBASE AUTH LOGIN FAILED]', fbErr.code, fbErr.message);
                    loginError.classList.remove('hidden');

                    if (fbErr.code === 'auth/wrong-password' || fbErr.code === 'auth/invalid-credential') {
                        loginErrorText.textContent = 'Hatalı e-posta veya şifre!';
                    } else if (fbErr.code === 'auth/user-not-found') {
                        loginErrorText.textContent = 'Bu e-posta ile kayıtlı kullanıcı bulunamadı!';
                    } else if (fbErr.code === 'auth/invalid-email') {
                        loginErrorText.textContent = 'Geçersiz e-posta adresi formatı!';
                    } else if (fbErr.code === 'auth/too-many-requests') {
                        loginErrorText.textContent = 'Çok fazla başarısız deneme yapıldı. Lütfen biraz bekleyin.';
                    } else {
                        loginErrorText.textContent = fbErr.message || 'Giriş başarısız!';
                    }
                } finally {
                    if (submitBtn) {
                        submitBtn.disabled = false;
                        submitBtn.innerHTML = '<span>Giriş Yap</span><i data-lucide="arrow-right" class="w-4 h-4"></i>';
                        if (window.lucide) lucide.createIcons();
                    }
                }
                return;
            }

            loginError.classList.remove('hidden');
            loginErrorText.textContent = 'Firebase başlatılamadı. Lütfen sayfayı yenileyin.';
        });
    }

    // ================= NAVIGATION TABS =================
    const tabTitles = {
        dashboard: 'Genel Bakış & İstatistikler',
        messages: 'Gelen İletişim Kutusu',
        profile: 'Profil Bilgileri & Hero Alanı',
        about: 'Hakkımda & Biyografi',
        experience: 'Deneyimler & Asbank Süreci',
        skills: 'Yetenekler & Teknolojiler',
        projects: 'Proje Yönetimi & Vitrin CMS',
        contact: 'İletişim Kanalları & Canlı Durum',
        security: 'Şifre & Güvenlik Ayarları'
    };

    navTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const target = tab.getAttribute('data-tab');

            navTabs.forEach(t => {
                t.classList.remove('active', 'bg-yellow-400/10', 'border-yellow-400/30', 'text-yellow-400');
                t.classList.add('text-gray-400', 'border-transparent');
            });
            tab.classList.add('active', 'bg-yellow-400/10', 'border-yellow-400/30', 'text-yellow-400');
            tab.classList.remove('text-gray-400', 'border-transparent');

            tabContents.forEach(content => {
                content.classList.toggle('hidden', content.getAttribute('id') !== `tab-${target}`);
            });

            if (topbarTitle && tabTitles[target]) {
                topbarTitle.textContent = tabTitles[target];
            }

            if (sidebar) sidebar.classList.add('-translate-x-full');
            if (window.lucide) lucide.createIcons();
        });
    });

    document.querySelectorAll('.view-all-messages-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const msgTab = document.querySelector('.nav-tab[data-tab="messages"]');
            if (msgTab) msgTab.click();
        });
    });

    // ================= DATA FETCHING & INITIALIZATION =================
    async function loadAllData() {
        await Promise.all([
            fetchStats(),
            fetchMessages(),
            fetchProjects(),
            fetchProfile(),
            fetchExperience(),
            fetchSkills()
        ]);
        if (window.lucide) lucide.createIcons();
    }

    // 1. Stats
    async function fetchStats() {
        if (window.firebaseDb) {
            try {
                const [projSnap, msgSnap] = await Promise.all([
                    window.firebaseDb.collection('projects').get(),
                    window.firebaseDb.collection('messages').get()
                ]);
                const totalProjects = projSnap.size;
                const totalMessages = msgSnap.size;
                let unreadMessages = 0;
                msgSnap.forEach(d => { if (!d.data().read) unreadMessages++; });

                document.getElementById('stat-projects-count').textContent = totalProjects;
                document.getElementById('stat-unread-count').textContent = unreadMessages;
                document.getElementById('stat-total-messages').textContent = totalMessages;
                
                const badge = document.getElementById('sidebar-unread-badge');
                if (badge) {
                    badge.textContent = unreadMessages;
                    badge.classList.toggle('hidden', unreadMessages === 0);
                }
                return;
            } catch (e) {
                console.warn('[FIRESTORE GET STATS]', e);
            }
        }

        const res = await apiRequest('/api/stats');
        if (res.ok) {
            document.getElementById('stat-projects-count').textContent = res.data.totalProjects;
            document.getElementById('stat-unread-count').textContent = res.data.unreadMessages;
            document.getElementById('stat-total-messages').textContent = res.data.totalMessages;
            
            const badge = document.getElementById('sidebar-unread-badge');
            if (badge) {
                badge.textContent = res.data.unreadMessages;
                badge.classList.toggle('hidden', res.data.unreadMessages === 0);
            }
        }
    }

    // 2. Messages
    async function fetchMessages() {
        if (window.firebaseDb) {
            try {
                const snap = await window.firebaseDb.collection('messages').orderBy('createdAt', 'desc').get();
                if (!snap.empty) {
                    cachedMessages = [];
                    snap.forEach(doc => cachedMessages.push({ id: doc.id, ...doc.data() }));
                    renderMessages();
                    renderRecentMessages();
                    updateMessageBadges();
                    return;
                }
            } catch (err) {
                console.warn('[FIRESTORE ADMIN MSGS]', err.message);
            }
        }

        const res = await apiRequest('/api/messages');
        if (res.ok) {
            cachedMessages = res.data;
        } else {
            cachedMessages = JSON.parse(localStorage.getItem('agy_local_messages') || '[]');
        }

        renderMessages();
        renderRecentMessages();
        updateMessageBadges();
    }

    function updateMessageBadges() {
        const unread = cachedMessages.filter(m => !m.read).length;
        const total = cachedMessages.length;

        const statUnread = document.getElementById('stat-unread-count');
        const statTotal = document.getElementById('stat-total-messages');
        const inboxTotal = document.getElementById('inbox-total-count');
        const inboxUnread = document.getElementById('inbox-unread-count');
        const badge = document.getElementById('sidebar-unread-badge');

        if (statUnread) statUnread.textContent = unread;
        if (statTotal) statTotal.textContent = total;
        if (inboxTotal) inboxTotal.textContent = total;
        if (inboxUnread) inboxUnread.textContent = unread;
        if (badge) {
            badge.textContent = unread;
            badge.classList.toggle('hidden', unread === 0);
        }
    }

    function renderRecentMessages() {
        const tbody = document.getElementById('recent-messages-tbody');
        if (!tbody) return;

        if (cachedMessages.length === 0) {
            tbody.innerHTML = `<tr><td colspan="5" class="py-6 text-center text-gray-500">Henüz gelen bir mesaj bulunmuyor.</td></tr>`;
            return;
        }

        const recent = cachedMessages.slice(0, 5);
        tbody.innerHTML = recent.map(msg => `
            <tr class="hover:bg-white/[0.02] transition-colors cursor-pointer msg-row ${!msg.read ? 'font-bold bg-yellow-400/[0.02]' : ''}" data-id="${msg.id}">
                <td class="py-3 px-4">
                    <div class="flex items-center gap-2">
                        ${!msg.read ? '<span class="w-2 h-2 rounded-full bg-yellow-400 flex-shrink-0"></span>' : ''}
                        <span class="text-white">${escapeHtml(msg.name)}</span>
                    </div>
                </td>
                <td class="py-3 px-4">
                    <span class="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-yellow-400 text-[10px]">
                        ${escapeHtml(msg.topic)}
                    </span>
                </td>
                <td class="py-3 px-4 text-gray-400 max-w-xs truncate">
                    ${escapeHtml(msg.message)}
                </td>
                <td class="py-3 px-4 text-gray-500 font-mono text-[11px]">
                    ${formatDate(msg.createdAt)}
                </td>
                <td class="py-3 px-4 text-right">
                    <button class="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-yellow-400 hover:text-black text-gray-300 text-xs transition-all open-msg-btn cursor-pointer" data-id="${msg.id}">
                        İncele
                    </button>
                </td>
            </tr>
        `).join('');

        attachMessageListeners();
    }

    function renderMessages(filterUnreadOnly = false) {
        const container = document.getElementById('messages-list-container');
        if (!container) return;

        let list = cachedMessages;
        if (filterUnreadOnly) {
            list = list.filter(m => !m.read);
        }

        if (list.length === 0) {
            container.innerHTML = `
                <div class="p-12 text-center text-gray-500 space-y-2">
                    <i data-lucide="inbox" class="w-8 h-8 mx-auto text-gray-600"></i>
                    <div>${filterUnreadOnly ? 'Okunmamış mesaj bulunmuyor.' : 'Gelen kutusu boş.'}</div>
                </div>
            `;
            if (window.lucide) lucide.createIcons();
            return;
        }

        container.innerHTML = list.map(msg => `
            <div class="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-white/[0.02] transition-colors msg-card ${!msg.read ? 'bg-yellow-400/[0.02] border-l-2 border-yellow-400' : ''}" data-id="${msg.id}">
                <div class="flex items-start gap-3.5 min-w-0">
                    <div class="w-9 h-9 rounded-xl ${!msg.read ? 'bg-yellow-400 text-black' : 'bg-white/5 text-gray-400'} flex items-center justify-center flex-shrink-0">
                        <i data-lucide="${!msg.read ? 'mail' : 'mail-open'}" class="w-4 h-4"></i>
                    </div>
                    <div class="min-w-0">
                        <div class="flex items-center gap-2 flex-wrap">
                            <span class="text-sm font-bold text-white">${escapeHtml(msg.name)}</span>
                            <span class="text-xs text-gray-500">&lt;${escapeHtml(msg.email)}&gt;</span>
                            <span class="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-yellow-400 text-[10px] font-semibold">
                                ${escapeHtml(msg.topic)}
                            </span>
                        </div>
                        <div class="text-xs text-gray-300 font-medium mt-0.5">${escapeHtml(msg.subject || 'Konu Yok')}</div>
                        <p class="text-xs text-gray-400 mt-1 line-clamp-1 max-w-2xl">${escapeHtml(msg.message)}</p>
                    </div>
                </div>

                <div class="flex items-center gap-2 self-end sm:self-center flex-shrink-0">
                    <span class="text-[11px] text-gray-500 font-mono mr-2">${formatDate(msg.createdAt)}</span>
                    <button class="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-all open-msg-btn cursor-pointer" title="Detayı Gör" data-id="${msg.id}">
                        <i data-lucide="eye" class="w-4 h-4"></i>
                    </button>
                    ${!msg.read ? `
                        <button class="p-2 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 transition-all mark-read-btn cursor-pointer" title="Okundu Yap" data-id="${msg.id}">
                            <i data-lucide="check" class="w-4 h-4"></i>
                        </button>
                    ` : ''}
                    <button class="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-all delete-msg-btn cursor-pointer" title="Sil" data-id="${msg.id}">
                        <i data-lucide="trash-2" class="w-4 h-4"></i>
                    </button>
                </div>
            </div>
        `).join('');

        attachMessageListeners();
        if (window.lucide) lucide.createIcons();
    }

    function attachMessageListeners() {
        document.querySelectorAll('.open-msg-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const id = btn.getAttribute('data-id');
                openMessageModal(id);
            });
        });

        document.querySelectorAll('.mark-read-btn').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                e.stopPropagation();
                const id = btn.getAttribute('data-id');
                await markMessageRead(id);
            });
        });

        document.querySelectorAll('.delete-msg-btn').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                e.stopPropagation();
                const id = btn.getAttribute('data-id');
                await deleteMessage(id);
            });
        });
    }

    // Filter Buttons
    const filterAllBtn = document.getElementById('filter-all-messages');
    const filterUnreadBtn = document.getElementById('filter-unread-messages');
    if (filterAllBtn && filterUnreadBtn) {
        filterAllBtn.addEventListener('click', () => {
            filterAllBtn.className = 'px-3.5 py-1.5 rounded-xl bg-yellow-400 text-black font-bold text-xs transition-all cursor-pointer';
            filterUnreadBtn.className = 'px-3.5 py-1.5 rounded-xl bg-white/5 text-gray-300 hover:text-white text-xs font-semibold transition-all border border-white/5 cursor-pointer';
            renderMessages(false);
        });

        filterUnreadBtn.addEventListener('click', () => {
            filterUnreadBtn.className = 'px-3.5 py-1.5 rounded-xl bg-yellow-400 text-black font-bold text-xs transition-all cursor-pointer';
            filterAllBtn.className = 'px-3.5 py-1.5 rounded-xl bg-white/5 text-gray-300 hover:text-white text-xs font-semibold transition-all border border-white/5 cursor-pointer';
            renderMessages(true);
        });
    }

    // Message Modal
    function openMessageModal(id) {
        const msg = cachedMessages.find(m => m.id === id);
        if (!msg) return;

        activeMessageId = id;
        modalMsgName.textContent = msg.name;
        modalMsgEmail.textContent = msg.email;
        modalMsgTopic.textContent = `${msg.topic} — ${msg.subject || 'Konu Yok'}`;
        modalMsgDate.textContent = formatDate(msg.createdAt);
        modalMsgBody.textContent = msg.message;
        modalMsgReplyLink.setAttribute('href', `mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject || 'İletişim Talebi')}`);

        messageModal.classList.remove('opacity-0', 'pointer-events-none');
        if (window.lucide) lucide.createIcons();

        if (!msg.read) {
            markMessageRead(id, false);
        }
    }

    function closeMessageModal() {
        messageModal.classList.add('opacity-0', 'pointer-events-none');
        activeMessageId = null;
    }

    if (closeMsgModalBtn) closeMsgModalBtn.addEventListener('click', closeMessageModal);
    if (modalMsgDeleteBtn) {
        modalMsgDeleteBtn.addEventListener('click', async () => {
            if (activeMessageId) {
                await deleteMessage(activeMessageId);
                closeMessageModal();
            }
        });
    }

    async function markMessageRead(id, refresh = true) {
        if (window.firebaseDb) {
            try {
                await window.firebaseDb.collection('messages').doc(id).update({ read: true });
            } catch (e) {
                console.warn('[FIRESTORE MSG READ]', e);
            }
        }

        const res = await apiRequest(`/api/messages/${id}/read`, 'PUT');
        if (res.ok || res.networkError || window.firebaseDb) {
            const target = cachedMessages.find(m => m.id === id);
            if (target) target.read = true;
            localStorage.setItem('agy_local_messages', JSON.stringify(cachedMessages));
            if (refresh) {
                renderMessages();
                renderRecentMessages();
                updateMessageBadges();
            }
        }
    }

    async function deleteMessage(id) {
        const confirmed = await showConfirmModal({
            title: 'Mesajı Sil',
            message: 'Bu mesajı silmek istediğinize emin misiniz? Bu işlem geri alınamaz.',
            confirmText: 'Evet, Sil',
            cancelText: 'Vazgeç',
            danger: true
        });
        if (!confirmed) return;

        if (window.firebaseDb) {
            try {
                await window.firebaseDb.collection('messages').doc(id).delete();
            } catch (e) {
                console.warn('[FIRESTORE MSG DEL]', e);
            }
        }

        const res = await apiRequest(`/api/messages/${id}`, 'DELETE');
        if (res.ok || res.networkError || window.firebaseDb) {
            cachedMessages = cachedMessages.filter(m => m.id !== id);
            localStorage.setItem('agy_local_messages', JSON.stringify(cachedMessages));
            renderMessages();
            renderRecentMessages();
            updateMessageBadges();
            showToast('Mesaj silindi.', 'success');
        }
    }

    // ================= TAB 3 & 4 & 8: PROFILE / HERO / ABOUT / CONTACT =================
    async function fetchProfile() {
        if (window.firebaseDb) {
            try {
                const doc = await window.firebaseDb.collection('content').doc('profile').get();
                if (doc.exists) {
                    cachedProfile = doc.data();
                    populateProfileForms();
                    return;
                }
            } catch (e) {
                console.warn('[FIRESTORE GET PROFILE]', e);
            }
        }

        const res = await apiRequest('/api/profile');
        if (res.ok) {
            cachedProfile = res.data;
        } else {
            cachedProfile = JSON.parse(localStorage.getItem('agy_local_profile') || '{}');
        }

        populateProfileForms();
    }

    async function saveProfile(updatedProfile, successMsg = 'Profil güncellendi!') {
        if (window.firebaseDb) {
            try {
                await window.firebaseDb.collection('content').doc('profile').set(updatedProfile, { merge: true });
            } catch (e) {
                console.warn('[FIRESTORE PROFILE WRITE]', e);
            }
        }

        const res = await apiRequest('/api/profile', 'PUT', updatedProfile);
        if (res.ok || res.networkError || window.firebaseDb) {
            cachedProfile = updatedProfile;
            localStorage.setItem('agy_local_profile', JSON.stringify(cachedProfile));
            const statWorkStatus = document.getElementById('stat-work-status');
            if (statWorkStatus && updatedProfile.statusBadge) statWorkStatus.textContent = updatedProfile.statusBadge;
            broadcastSync('profile', cachedProfile);
            showToast(successMsg, 'success');
            return true;
        } else {
            showToast('Güncelleme sırasında bir hata oluştu.', 'error');
            return false;
        }
    }

    function populateProfileForms() {
        // Tab 3: Hero & Profile
        const nameInput = document.getElementById('prof-name');
        const titleInput = document.getElementById('prof-title');
        const rolesInput = document.getElementById('prof-roles');
        const bioInput = document.getElementById('prof-bio-text');
        const quoteInput = document.getElementById('prof-quote');
        const cvInput = document.getElementById('prof-cv-url');
        const githubInput = document.getElementById('prof-github');
        const linkedinInput = document.getElementById('prof-linkedin');

        if (nameInput) nameInput.value = cachedProfile.name || 'Salahattin Açıkgöz';
        if (titleInput) titleInput.value = cachedProfile.title || 'Yazılım Geliştirici & RPA Uzmanı';
        if (rolesInput) rolesInput.value = (cachedProfile.roles || []).join(', ');
        if (bioInput) bioInput.value = cachedProfile.bioText || '';
        if (quoteInput) quoteInput.value = cachedProfile.quote || '';
        if (cvInput) cvInput.value = cachedProfile.cvUrl || 'assets/cv/salahattin-acikgoz-cv.pdf';
        if (githubInput) githubInput.value = cachedProfile.github || '';
        if (linkedinInput) linkedinInput.value = cachedProfile.linkedin || '';

        // Sidebar name
        const sidebarName = document.getElementById('sidebar-admin-name');
        if (sidebarName && cachedProfile.name) sidebarName.textContent = cachedProfile.name;

        // Tab 4: About
        const aboutBadgesInput = document.getElementById('about-badges-input');
        const aboutP1Input = document.getElementById('about-p1-input');
        const aboutP2Input = document.getElementById('about-p2-input');

        if (aboutBadgesInput) aboutBadgesInput.value = (cachedProfile.aboutBadges || []).join(', ');
        if (aboutP1Input) aboutP1Input.value = cachedProfile.aboutP1 || '';
        if (aboutP2Input) aboutP2Input.value = cachedProfile.aboutP2 || '';

        // Tab 8: Contact & Status
        const statusBadgeInput = document.getElementById('contact-form-badge');
        const statusTitleInput = document.getElementById('contact-form-title');
        const statusDescInput = document.getElementById('contact-form-desc');
        const emailInput = document.getElementById('contact-form-email');
        const locationInput = document.getElementById('contact-form-location');
        const slaInput = document.getElementById('contact-form-sla');

        if (statusBadgeInput) statusBadgeInput.value = cachedProfile.statusBadge || 'Aktif & Müsait';
        if (statusTitleInput) statusTitleInput.value = cachedProfile.statusTitle || 'Yeni Projelere & Fırsatlara Açık';
        if (statusDescInput) statusDescInput.value = cachedProfile.statusDesc || '';
        if (emailInput) emailInput.value = cachedProfile.email || 'salahattin.acikgoz@example.com';
        if (locationInput) locationInput.value = cachedProfile.location || '';
        if (slaInput) slaInput.value = cachedProfile.statusSla || '';

        const statWorkStatus = document.getElementById('stat-work-status');
        if (statWorkStatus) statWorkStatus.textContent = cachedProfile.statusBadge || 'Projelere Açık';
    }

    // Hero Form Submit
    const heroForm = document.getElementById('hero-form');
    if (heroForm) {
        heroForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const rolesArr = document.getElementById('prof-roles').value.split(',').map(s => s.trim()).filter(Boolean);
            const updatedProfile = {
                ...cachedProfile,
                name: document.getElementById('prof-name').value.trim(),
                title: document.getElementById('prof-title').value.trim(),
                roles: rolesArr.length > 0 ? rolesArr : (cachedProfile.roles || []),
                bioText: document.getElementById('prof-bio-text').value.trim(),
                quote: document.getElementById('prof-quote').value.trim(),
                cvUrl: document.getElementById('prof-cv-url').value.trim(),
                github: document.getElementById('prof-github').value.trim(),
                linkedin: document.getElementById('prof-linkedin').value.trim()
            };

            await saveProfile(updatedProfile, 'Hero ve profil alanı başarıyla güncellendi!');
        });
    }

    // About Form Submit
    const aboutForm = document.getElementById('about-form');
    if (aboutForm) {
        aboutForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const badgesArr = document.getElementById('about-badges-input').value.split(',').map(s => s.trim()).filter(Boolean);
            const updatedProfile = {
                ...cachedProfile,
                aboutBadges: badgesArr,
                aboutP1: document.getElementById('about-p1-input').value.trim(),
                aboutP2: document.getElementById('about-p2-input').value.trim()
            };

            await saveProfile(updatedProfile, 'Hakkımda alanı anında güncellendi!');
        });
    }

    // Contact Settings Form Submit
    const contactSettingsForm = document.getElementById('contact-settings-form');
    if (contactSettingsForm) {
        contactSettingsForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const updatedProfile = {
                ...cachedProfile,
                statusBadge: document.getElementById('contact-form-badge').value.trim(),
                statusTitle: document.getElementById('contact-form-title').value.trim(),
                statusDesc: document.getElementById('contact-form-desc').value.trim(),
                email: document.getElementById('contact-form-email').value.trim(),
                location: document.getElementById('contact-form-location').value.trim(),
                statusSla: document.getElementById('contact-form-sla').value.trim()
            };

            await saveProfile(updatedProfile, 'İletişim ve çalışma durumu güncellendi!');
        });
    }

    // ================= TAB 5: EXPERIENCE =================
    async function fetchExperience() {
        if (window.firebaseDb) {
            try {
                const doc = await window.firebaseDb.collection('content').doc('experience').get();
                if (doc.exists) {
                    cachedExperience = doc.data();
                    populateExperienceForm();
                    return;
                }
            } catch (e) {
                console.warn('[FIRESTORE GET EXP]', e);
            }
        }

        const res = await apiRequest('/api/experience');
        if (res.ok) {
            cachedExperience = res.data;
        } else {
            cachedExperience = JSON.parse(localStorage.getItem('agy_local_experience') || '{}');
        }

        populateExperienceForm();
    }

    function populateExperienceForm() {
        const roleEl = document.getElementById('exp-form-role');
        const companyEl = document.getElementById('exp-form-company');
        const deptEl = document.getElementById('exp-form-dept');
        const periodEl = document.getElementById('exp-form-period');
        const descEl = document.getElementById('exp-form-desc');
        const techsEl = document.getElementById('exp-form-techs');

        if (roleEl) roleEl.value = cachedExperience.role || 'Yazılım Geliştirme & RPA Stajyeri';
        if (companyEl) companyEl.value = cachedExperience.company || 'Asbank';
        if (deptEl) deptEl.value = cachedExperience.department || 'Bankacılık & Finans Teknolojileri';
        if (periodEl) periodEl.value = cachedExperience.period || '2024 – Günümüz';
        if (descEl) descEl.value = cachedExperience.description || '';

        const techNames = (cachedExperience.technologies || []).map(t => typeof t === 'string' ? t : t.name);
        if (techsEl) techsEl.value = techNames.join(', ');

        renderPillarsEditor();
    }

    function renderPillarsEditor() {
        const container = document.getElementById('exp-pillars-editor');
        if (!container) return;

        const pillars = cachedExperience.pillars || [
            { icon: 'bot', title: 'RPA & Süreç Otomasyonu', description: '' },
            { icon: 'globe', title: 'Web & API Entegrasyonu', description: '' },
            { icon: 'database', title: 'Veritabanı & Portal Mimarisi', description: '' },
            { icon: 'message-square', title: 'Akıllı Chatbot Entegrasyonu', description: '' }
        ];

        container.innerHTML = pillars.map((p, idx) => `
            <div class="p-4 rounded-2xl bg-black/60 border border-white/10 space-y-2.5">
                <div class="flex items-center justify-between text-yellow-400 font-mono text-[11px] font-bold">
                    <span>Sütun 0${idx + 1} //</span>
                    <span class="text-gray-500 uppercase text-[10px]">${escapeHtml(p.icon || 'star')}</span>
                </div>
                <div>
                    <label class="block text-[10px] text-gray-400 uppercase font-semibold mb-1">Başlık</label>
                    <input type="text" class="pillar-title-input w-full px-3 py-1.5 rounded-lg bg-zinc-900 border border-white/10 text-white text-xs focus:outline-none focus:border-yellow-400" value="${escapeHtml(p.title || '')}" data-index="${idx}">
                </div>
                <div>
                    <label class="block text-[10px] text-gray-400 uppercase font-semibold mb-1">Açıklama</label>
                    <textarea class="pillar-desc-input w-full px-3 py-1.5 rounded-lg bg-zinc-900 border border-white/10 text-white text-xs focus:outline-none focus:border-yellow-400 resize-none" rows="2" data-index="${idx}">${escapeHtml(p.description || '')}</textarea>
                </div>
            </div>
        `).join('');
    }

    const expForm = document.getElementById('exp-form');
    if (expForm) {
        expForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Collect 4 pillars
            const titleInputs = document.querySelectorAll('.pillar-title-input');
            const descInputs = document.querySelectorAll('.pillar-desc-input');
            const updatedPillars = [];
            const defaultIcons = ['bot', 'globe', 'database', 'message-square'];

            titleInputs.forEach((inp, idx) => {
                const desc = descInputs[idx] ? descInputs[idx].value.trim() : '';
                const existingIcon = (cachedExperience.pillars && cachedExperience.pillars[idx]) ? cachedExperience.pillars[idx].icon : defaultIcons[idx % defaultIcons.length];
                updatedPillars.push({
                    icon: existingIcon,
                    title: inp.value.trim(),
                    description: desc
                });
            });

            // Collect techs
            const techsRaw = document.getElementById('exp-form-techs').value.split(',').map(s => s.trim()).filter(Boolean);
            const iconMap = {
                'python': 'python',
                'uipath': 'uipath',
                'sql': 'mssql',
                'mssql': 'mssql',
                'rest': 'postman',
                'api': 'postman',
                'javascript': 'javascript',
                'html': 'html5',
                'css': 'html5',
                'veritabanı': 'database'
            };

            const updatedTechnologies = techsRaw.map(name => {
                const lower = name.toLowerCase();
                let icon = 'code';
                for (const k in iconMap) {
                    if (lower.includes(k)) {
                        icon = iconMap[k];
                        break;
                    }
                }
                return { name, icon };
            });

            const updatedExperience = {
                role: document.getElementById('exp-form-role').value.trim(),
                company: document.getElementById('exp-form-company').value.trim(),
                department: document.getElementById('exp-form-dept').value.trim(),
                period: document.getElementById('exp-form-period').value.trim(),
                description: document.getElementById('exp-form-desc').value.trim(),
                pillars: updatedPillars,
                technologies: updatedTechnologies
            };

            if (window.firebaseDb) {
                try {
                    await window.firebaseDb.collection('content').doc('experience').set(updatedExperience, { merge: true });
                } catch (e) {
                    console.warn('[FIRESTORE EXP WRITE]', e);
                }
            }

            const res = await apiRequest('/api/experience', 'PUT', updatedExperience);
            if (res.ok || res.networkError || window.firebaseDb) {
                cachedExperience = updatedExperience;
                localStorage.setItem('agy_local_experience', JSON.stringify(cachedExperience));
                broadcastSync('experience', cachedExperience);
                showToast('Deneyim alanı ve 4 sütun anında güncellendi!', 'success');
            } else {
                showToast('Deneyim güncellenirken hata oluştu.', 'error');
            }
        });
    }

    // ================= TAB 6: SKILLS & TOOLS =================
    async function fetchSkills() {
        if (window.firebaseDb) {
            try {
                const snap = await window.firebaseDb.collection('skills').get();
                if (!snap.empty) {
                    cachedSkills = [];
                    snap.forEach(d => cachedSkills.push({ id: d.id, ...d.data() }));
                    renderSkillsList();
                    return;
                }
            } catch (e) {
                console.warn('[FIRESTORE GET SKILLS]', e);
            }
        }

        const res = await apiRequest('/api/skills');
        if (res.ok) {
            cachedSkills = res.data;
        } else {
            cachedSkills = JSON.parse(localStorage.getItem('agy_local_skills') || '[]');
        }

        renderSkillsList();
    }

    function renderSkillsList() {
        const container = document.getElementById('skills-list-container');
        if (!container) return;

        if (cachedSkills.length === 0) {
            container.innerHTML = `<div class="col-span-2 p-8 text-center text-gray-500">Henüz kayıtlı teknoloji bulunmuyor.</div>`;
            return;
        }

        container.innerHTML = cachedSkills.map(skill => {
            let iconHtml = '';
            if (skill.iconType === 'img' || skill.iconSrc) {
                iconHtml = `<img src="${escapeHtml(skill.iconSrc)}" alt="${escapeHtml(skill.name)}" class="w-6 h-6 object-contain">`;
            } else if (skill.iconSvg) {
                iconHtml = `<div class="w-6 h-6 flex items-center justify-center">${skill.iconSvg}</div>`;
            } else {
                iconHtml = `<i data-lucide="cpu" class="w-5 h-5 text-yellow-400"></i>`;
            }

            return `
                <div class="p-5 rounded-2xl bg-zinc-900/60 border border-white/10 flex flex-col justify-between space-y-3 hover:border-yellow-400/30 transition-all">
                    <div class="space-y-2">
                        <div class="flex items-center justify-between">
                            <div class="flex items-center gap-3">
                                <div class="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
                                    ${iconHtml}
                                </div>
                                <div>
                                    <h4 class="text-sm font-bold text-white">${escapeHtml(skill.name)}</h4>
                                    <span class="text-[10px] text-yellow-400 font-mono">${escapeHtml(skill.category || 'Teknoloji')}</span>
                                </div>
                            </div>
                            <div class="flex items-center gap-1">
                                <button class="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-all edit-skill-btn cursor-pointer" data-id="${skill.id}" title="Düzenle">
                                    <i data-lucide="edit-3" class="w-3.5 h-3.5"></i>
                                </button>
                                <button class="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-all delete-skill-btn cursor-pointer" data-id="${skill.id}" title="Sil">
                                    <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
                                </button>
                            </div>
                        </div>

                        <p class="text-xs text-gray-400 line-clamp-2">${escapeHtml(skill.whatIs || '')}</p>
                    </div>

                    <div class="pt-2 border-t border-white/5 text-[11px] text-gray-500 truncate">
                        <span class="text-gray-400 font-semibold">Kullanım: </span>${escapeHtml(skill.usage || 'Kurumsal projeler')}
                    </div>
                </div>
            `;
        }).join('');

        attachSkillListeners();
        if (window.lucide) lucide.createIcons();
    }

    function attachSkillListeners() {
        document.querySelectorAll('.edit-skill-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.getAttribute('data-id');
                openSkillModal(id);
            });
        });

        document.querySelectorAll('.delete-skill-btn').forEach(btn => {
            btn.addEventListener('click', async () => {
                const id = btn.getAttribute('data-id');
                const confirmed = await showConfirmModal({
                    title: 'Teknolojiyi Sil',
                    message: 'Bu teknolojiyi yetenekler listesinden silmek istediğinize emin misiniz?',
                    confirmText: 'Evet, Sil',
                    cancelText: 'Vazgeç',
                    danger: true
                });
                if (confirmed) {
                    if (window.firebaseDb) {
                        try {
                            await window.firebaseDb.collection('skills').doc(id).delete();
                        } catch (e) {
                            console.warn('[FIRESTORE DEL SKILL]', e);
                        }
                    }

                    cachedSkills = cachedSkills.filter(s => s.id !== id);
                    const res = await apiRequest('/api/skills', 'PUT', cachedSkills);
                    if (res.ok || res.networkError || window.firebaseDb) {
                        localStorage.setItem('agy_local_skills', JSON.stringify(cachedSkills));
                        renderSkillsList();
                        broadcastSync('skills', cachedSkills);
                        showToast('Teknoloji silindi.', 'success');
                    }
                }
            });
        });
    }

    function openSkillModal(id = null) {
        const titleEl = document.getElementById('skill-modal-title-text');
        skillForm.reset();

        if (id) {
            const skill = cachedSkills.find(s => s.id === id);
            if (!skill) return;
            titleEl.textContent = 'Teknolojiyi Düzenle';
            document.getElementById('skill-form-id').value = skill.id;
            document.getElementById('skill-form-name').value = skill.name || '';
            document.getElementById('skill-form-category').value = skill.category || '';
            document.getElementById('skill-form-icon-type').value = skill.iconType || 'img';
            document.getElementById('skill-form-icon-src').value = skill.iconSrc || skill.iconSvg || '';
            document.getElementById('skill-form-what-is').value = skill.whatIs || '';
            document.getElementById('skill-form-usage').value = skill.usage || '';
        } else {
            titleEl.textContent = 'Yeni Teknoloji Ekle';
            document.getElementById('skill-form-id').value = '';
        }

        skillModal.classList.remove('opacity-0', 'pointer-events-none');
        if (window.lucide) lucide.createIcons();
    }

    function closeSkillModal() {
        skillModal.classList.add('opacity-0', 'pointer-events-none');
    }

    if (openNewSkillModalBtn) openNewSkillModalBtn.addEventListener('click', () => openSkillModal(null));
    if (closeSkillModalBtn) closeSkillModalBtn.addEventListener('click', closeSkillModal);
    if (cancelSkillModalBtn) cancelSkillModalBtn.addEventListener('click', closeSkillModal);

    if (skillForm) {
        skillForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const id = document.getElementById('skill-form-id').value;
            const iconType = document.getElementById('skill-form-icon-type').value;
            const iconSrcVal = document.getElementById('skill-form-icon-src').value.trim();

            const skillData = {
                id: id || ('skill_' + Date.now()),
                name: document.getElementById('skill-form-name').value.trim(),
                category: document.getElementById('skill-form-category').value.trim(),
                iconType: iconType,
                whatIs: document.getElementById('skill-form-what-is').value.trim(),
                usage: document.getElementById('skill-form-usage').value.trim()
            };

            if (iconType === 'img') {
                skillData.iconSrc = iconSrcVal;
            } else {
                skillData.iconSvg = iconSrcVal;
            }

            if (id) {
                const idx = cachedSkills.findIndex(s => s.id === id);
                if (idx !== -1) cachedSkills[idx] = skillData;
            } else {
                cachedSkills.push(skillData);
            }

            if (window.firebaseDb) {
                try {
                    await window.firebaseDb.collection('skills').doc(skillData.id).set(skillData, { merge: true });
                } catch (e) {
                    console.warn('[FIRESTORE WRITE SKILL]', e);
                }
            }

            const res = await apiRequest('/api/skills', 'PUT', cachedSkills);
            if (res.ok || res.networkError || window.firebaseDb) {
                localStorage.setItem('agy_local_skills', JSON.stringify(cachedSkills));
                renderSkillsList();
                broadcastSync('skills', cachedSkills);
                closeSkillModal();
                showToast(id ? 'Teknoloji güncellendi!' : 'Yeni teknoloji eklendi!', 'success');
            } else {
                showToast('İşlem sırasında hata oluştu.', 'error');
            }
        });
    }

    // ================= TAB 7: PROJECTS CMS =================
    async function fetchProjects() {
        if (window.firebaseDb) {
            try {
                const snap = await window.firebaseDb.collection('projects').get();
                if (!snap.empty) {
                    cachedProjects = [];
                    snap.forEach(d => cachedProjects.push({ id: d.id, ...d.data() }));
                    renderProjects();
                    const statProj = document.getElementById('stat-projects-count');
                    const sideProj = document.getElementById('sidebar-projects-count');
                    if (statProj) statProj.textContent = cachedProjects.length;
                    if (sideProj) sideProj.textContent = cachedProjects.length;
                    return;
                }
            } catch (e) {
                console.warn('[FIRESTORE GET PROJECTS]', e);
            }
        }

        const res = await apiRequest('/api/projects');
        if (res.ok) {
            cachedProjects = res.data;
        } else {
            cachedProjects = JSON.parse(localStorage.getItem('agy_local_projects') || '[]');
        }

        renderProjects();
        const statProj = document.getElementById('stat-projects-count');
        const sideProj = document.getElementById('sidebar-projects-count');
        if (statProj) statProj.textContent = cachedProjects.length;
        if (sideProj) sideProj.textContent = cachedProjects.length;
    }

    function renderProjects() {
        const grid = document.getElementById('projects-grid-container');
        if (!grid) return;

        if (cachedProjects.length === 0) {
            grid.innerHTML = `<div class="col-span-2 p-12 text-center text-gray-500">Henüz kayıtlı proje bulunmuyor.</div>`;
            return;
        }

        grid.innerHTML = cachedProjects.map(proj => `
            <div class="p-6 rounded-3xl bg-zinc-950 border border-white/10 flex flex-col justify-between space-y-4 hover:border-yellow-400/30 transition-all">
                <div class="space-y-3">
                    <div class="flex items-center justify-between">
                        <span class="px-2.5 py-1 rounded-full bg-yellow-400/10 border border-yellow-400/20 text-yellow-400 text-[10px] font-semibold">
                            ${escapeHtml(proj.category || 'Yazılım')}
                        </span>
                        <div class="flex items-center gap-1.5">
                            <button class="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-all edit-proj-btn cursor-pointer" data-id="${proj.id}" title="Düzenle">
                                <i data-lucide="edit-3" class="w-4 h-4"></i>
                            </button>
                            <button class="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-all delete-proj-btn cursor-pointer" data-id="${proj.id}" title="Sil">
                                <i data-lucide="trash-2" class="w-4 h-4"></i>
                            </button>
                        </div>
                    </div>

                    <h4 class="text-base font-bold text-white">${escapeHtml(proj.title)}</h4>
                    <p class="text-xs text-gray-400 leading-relaxed">${escapeHtml(proj.description)}</p>

                    <div class="flex flex-wrap gap-1.5 pt-1">
                        ${(proj.techStack || []).map(t => `
                            <span class="px-2 py-0.5 rounded-md bg-white/5 text-[10px] font-mono text-gray-400">
                                ${escapeHtml(t)}
                            </span>
                        `).join('')}
                    </div>
                </div>

                <div class="pt-3 border-t border-white/5 flex items-center justify-between text-xs text-gray-500">
                    <span>${(proj.metrics || []).length > 0 ? proj.metrics[0].label + ': ' + proj.metrics[0].value : 'Vitrin Projesi'}</span>
                    ${proj.githubUrl ? `<a href="${proj.githubUrl}" target="_blank" class="hover:text-yellow-400 flex items-center gap-1"><i data-lucide="github" class="w-3.5 h-3.5"></i> Kod</a>` : ''}
                </div>
            </div>
        `).join('');

        attachProjectListeners();
        if (window.lucide) lucide.createIcons();
    }

    function attachProjectListeners() {
        document.querySelectorAll('.edit-proj-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.getAttribute('data-id');
                openProjectModal(id);
            });
        });

        document.querySelectorAll('.delete-proj-btn').forEach(btn => {
            btn.addEventListener('click', async () => {
                const id = btn.getAttribute('data-id');
                const confirmed = await showConfirmModal({
                    title: 'Projeyi Sil',
                    message: 'Bu projeyi portföy vitrininden kaldırmak istediğinize emin misiniz?',
                    confirmText: 'Evet, Projeyi Sil',
                    cancelText: 'Vazgeç',
                    danger: true
                });
                if (confirmed) {
                    if (window.firebaseDb) {
                        try {
                            await window.firebaseDb.collection('projects').doc(id).delete();
                        } catch (e) {
                            console.warn('[FIRESTORE DEL PROJ]', e);
                        }
                    }

                    const res = await apiRequest(`/api/projects/${id}`, 'DELETE');
                    if (res.ok || res.networkError || window.firebaseDb) {
                        cachedProjects = cachedProjects.filter(p => p.id !== id);
                        localStorage.setItem('agy_local_projects', JSON.stringify(cachedProjects));
                        renderProjects();
                        broadcastSync('projects', cachedProjects);
                        showToast('Proje silindi.', 'success');
                    }
                }
            });
        });
    }

    function openProjectModal(id = null) {
        const titleEl = document.getElementById('proj-modal-title-text');
        projectForm.reset();

        if (id) {
            const proj = cachedProjects.find(p => p.id === id);
            if (!proj) return;
            titleEl.textContent = 'Projeyi Düzenle';
            document.getElementById('proj-form-id').value = proj.id;
            document.getElementById('proj-form-title').value = proj.title || '';
            document.getElementById('proj-form-category').value = proj.category || '';
            document.getElementById('proj-form-description').value = proj.description || '';
            document.getElementById('proj-form-techs').value = (proj.techStack || []).join(', ');
            document.getElementById('proj-form-github').value = proj.githubUrl || '';
            document.getElementById('proj-form-live').value = proj.liveUrl || '';
        } else {
            titleEl.textContent = 'Yeni Proje Ekle';
            document.getElementById('proj-form-id').value = '';
        }

        projectModal.classList.remove('opacity-0', 'pointer-events-none');
        if (window.lucide) lucide.createIcons();
    }

    function closeProjectModal() {
        projectModal.classList.add('opacity-0', 'pointer-events-none');
    }

    if (openNewProjectModalBtn) openNewProjectModalBtn.addEventListener('click', () => openProjectModal(null));
    if (closeProjModalBtn) closeProjModalBtn.addEventListener('click', closeProjectModal);
    if (cancelProjModalBtn) cancelProjModalBtn.addEventListener('click', closeProjectModal);

    if (projectForm) {
        projectForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const id = document.getElementById('proj-form-id').value;
            const projectData = {
                title: document.getElementById('proj-form-title').value.trim(),
                category: document.getElementById('proj-form-category').value.trim(),
                description: document.getElementById('proj-form-description').value.trim(),
                techStack: document.getElementById('proj-form-techs').value.split(',').map(s => s.trim()).filter(Boolean),
                githubUrl: document.getElementById('proj-form-github').value.trim(),
                liveUrl: document.getElementById('proj-form-live').value.trim(),
                badge: 'Kurumsal Çözüm'
            };

            if (id) {
                if (window.firebaseDb) {
                    try {
                        await window.firebaseDb.collection('projects').doc(id).set(projectData, { merge: true });
                    } catch (e) {
                        console.warn('[FIRESTORE UPDATE PROJ]', e);
                    }
                }

                const res = await apiRequest(`/api/projects/${id}`, 'PUT', projectData);
                if (res.ok || res.networkError || window.firebaseDb) {
                    const idx = cachedProjects.findIndex(p => p.id === id);
                    if (idx !== -1) cachedProjects[idx] = { ...cachedProjects[idx], ...projectData };
                    localStorage.setItem('agy_local_projects', JSON.stringify(cachedProjects));
                    broadcastSync('projects', cachedProjects);
                    showToast('Proje güncellendi!', 'success');
                }
            } else {
                const newId = 'proj_' + Date.now();
                const newProj = { id: newId, ...projectData };

                if (window.firebaseDb) {
                    try {
                        await window.firebaseDb.collection('projects').doc(newId).set(newProj);
                    } catch (e) {
                        console.warn('[FIRESTORE ADD PROJ]', e);
                    }
                }

                const res = await apiRequest('/api/projects', 'POST', projectData);
                if (res.ok || res.networkError || window.firebaseDb) {
                    const addedProj = (res.ok && res.data.project) ? res.data.project : newProj;
                    cachedProjects.unshift(addedProj);
                    localStorage.setItem('agy_local_projects', JSON.stringify(cachedProjects));
                    broadcastSync('projects', cachedProjects);
                    showToast('Yeni proje eklendi!', 'success');
                }
            }

            closeProjectModal();
            renderProjects();
        });
    }

    // ================= TAB 9: SECURITY & PASSWORD (FIREBASE AUTH & LOCAL) =================
    const passwordForm = document.getElementById('password-form');
    if (passwordForm) {
        passwordForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const currentPassword = document.getElementById('curr-password').value;
            const newPassword = document.getElementById('new-password').value;

            // 1. Firebase Auth Kullanıcısı Şifre Güncelleme
            if (window.firebaseAuth && window.firebaseAuth.currentUser) {
                try {
                    await window.firebaseAuth.currentUser.updatePassword(newPassword);
                    showToast('Firebase Auth şifreniz başarıyla güncellendi!', 'success');
                    passwordForm.reset();
                    return;
                } catch (fbErr) {
                    console.warn('[FIREBASE PASSWORD UPDATE ERROR]', fbErr.code, fbErr.message);
                    if (fbErr.code === 'auth/requires-recent-login') {
                        showToast('Güvenlik nedeniyle lütfen çıkış yapıp tekrar giriş yapın.', 'error');
                        return;
                    }
                }
            }

            // 2. REST API / Yerel Fallback
            const res = await apiRequest('/api/change-password', 'POST', { currentPassword, newPassword });
            if (res.ok && res.data.success) {
                showToast('Şifreniz başarıyla değiştirildi!', 'success');
                passwordForm.reset();
            } else {
                showToast(res.data?.message || 'Şifre değiştirilemedi!', 'error');
            }
        });
    }

    // Helpers
    function formatDate(isoString) {
        if (!isoString) return '';
        try {
            const date = new Date(isoString);
            return date.toLocaleDateString('tr-TR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
        } catch (e) {
            return isoString;
        }
    }

    function escapeHtml(str) {
        if (!str) return '';
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    // Start App
    checkAuth();
});
