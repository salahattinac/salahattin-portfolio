// Salahattin Açıkgöz Portföyü — Firebase Yapılandırma & Başlatma Modülü
// Firebase Console > Project Settings > General > Your apps > Web App alanındaki bilgileri buraya yapıştırabilirsiniz.

const defaultFirebaseConfig = {
    apiKey: "AIzaSyDVe9tOZAsuH6HEvxW62u5SE8nqcVtUtD0",
    authDomain: "salahattin-portfolio.firebaseapp.com",
    projectId: "salahattin-portfolio",
    storageBucket: "salahattin-portfolio.firebasestorage.app",
    messagingSenderId: "722456668298",
    appId: "1:722456668298:web:425e81fc40321cb44ce573",
    measurementId: "G-P514NMFN9H"
};

// Varsa localStorage'dan özel ayarı yükle, yoksa varsayılanı kullan
const savedFirebaseConfig = (() => {
    try {
        const stored = localStorage.getItem('agy_firebase_config');
        return stored ? JSON.parse(stored) : null;
    } catch (e) {
        return null;
    }
})();

const firebaseConfig = savedFirebaseConfig || defaultFirebaseConfig;

let firebaseApp = null;
let firebaseDb = null;
let firebaseAuth = null;

try {
    if (typeof firebase !== 'undefined') {
        if (!firebase.apps || !firebase.apps.length) {
            firebaseApp = firebase.initializeApp(firebaseConfig);
        } else {
            firebaseApp = firebase.app();
        }

        firebaseDb = firebase.firestore();
        firebaseAuth = firebase.auth();

        // Yerel test ortamı veya çevrimdışı önbellek desteği
        if (firebaseDb && typeof firebaseDb.enablePersistence === 'function') {
            firebaseDb.enablePersistence({ synchronizeTabs: true }).catch((err) => {
                if (err.code === 'failed-precondition') {
                    // Birden fazla sekme açıkken ilk sekme persistence alır
                } else if (err.code === 'unimplemented') {
                    // Tarayıcı persistence desteklemiyor
                }
            });
        }

        console.log('[FIREBASE] Başarıyla başlatıldı. Project ID:', firebaseConfig.projectId);
    }
} catch (err) {
    console.warn('[FIREBASE INIT WARN]', err.message);
}

// Global olarak erişilebilir kıl
window.firebaseConfig = firebaseConfig;
window.firebaseApp = firebaseApp;
window.firebaseDb = firebaseDb;
window.firebaseAuth = firebaseAuth;
