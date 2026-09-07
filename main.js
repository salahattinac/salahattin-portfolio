// Main JavaScript - Typewriter, Toast Notifications, Interactive Modals & Instant Live Sync

document.addEventListener('DOMContentLoaded', () => {

    const API_BASE = window.location.origin.includes('http') ? window.location.origin : 'http://localhost:3000';

    // ================= DUAL LANGUAGE (TR / EN) DICTIONARY =================
    const i18nData = {
        tr: {
            nav: {
                hero: "Ana Sayfa",
                about: "Hakkımda",
                skills: "Yetenekler",
                experience: "Deneyimler",
                projects: "Projeler",
                contact: "İletişim",
                contactBtn: "İletişime Geç"
            },
            hero: {
                prefix: "Ben bir",
                roles: [
                    "Yazılım Geliştirici",
                    "API Entegrasyon Uzmanı",
                    "Veritabanı Mimarı",
                    "RPA Otomasyon Mühendisi"
                ],
                bio: 'Web Geliştirme, API Entegrasyonları, Veritabanı Tasarımı ve RPA Otomasyonu alanlarında <span class="text-yellow-400 font-semibold">yüksek performanslı</span> ve modern dijital çözümler üretiyorum.',
                cvBtn: "CV İndir",
                scroll: "Hakkımda Keşfet"
            },
            about: {
                title: "Hakkımda",
                badges: [
                    "Yazılım Geliştirici",
                    "Web Geliştirme, API Entegrasyonları ve Veritabanı Tasarımı",
                    "Robotik Süreç Otomasyonu (RPA)"
                ],
                p1: 'Merhaba! Ben <strong class="text-white font-bold">Salahattin Açıkgöz</strong>. Teknolojiye ve kodlamaya olan tutkumu; kullanıcı odaklı modern web platformları, kesintisiz kurumsal API veri haberleşmesi, yüksek hacimli SQL veritabanı mimarisi ve 7/24 otonom çalışan Robotik Süreç Otomasyonu (RPA) çözümleriyle birleştiriyorum.',
                p2: 'Tekrarlayan operasyonel iş yüklerini <span class="text-yellow-400 font-semibold">UiPath</span> ve <span class="text-yellow-400 font-semibold">Python</span> botlarıyla sıfır hataya indirmek, farklı sistemler arasında güvenli <span class="text-cyan-400 font-semibold">REST/SOAP API</span> köprüleri kurmak ve büyük veri kümelerinde milisaniyeler içinde yanıt veren <span class="text-purple-400 font-semibold">SQL mimarileri</span> tasarlamak üzerine uzmanlaştım.'
            },
            skills: {
                title: "Teknolojiler & Araçlar"
            },
            experience: {
                title: "İş Deneyimleri & Roller",
                role: "Yazılım Geliştirme & RPA Stajyeri",
                company: "Asbank",
                dept: "Bilgi Teknolojileri (BT) & Yazılım Departmanı",
                period: "Temmuz 2024 – Ağustos 2024",
                desc: "Bankanın dijital dönüşüm süreçlerine destek sağlanan staj programında; web sitesi yeniden yapılandırma, chatbot entegrasyonu, sözleşme/lisans takip portalı geliştirme ve RPA çalışmaları yürütülmüştür. Tekrarlayan iş süreçlerinin otomatizasyonu, veri tabanı tasarımı ve frontend-backend entegrasyonlarında aktif görev alınmıştır.",
                pillars: [
                    {
                        icon: "bot",
                        title: "RPA & Süreç Otomasyonu",
                        desc: "Tekrarlayan bankacılık ve veri aktarım operasyonlarının otonom botlarla sıfır hata payıyla kurgulanması."
                    },
                    {
                        icon: "globe",
                        title: "Web & API Entegrasyonu",
                        desc: "Kurumsal web platformunun modernizasyonu, RESTful API bağlantıları ve slider mimarisi."
                    },
                    {
                        icon: "database",
                        title: "Veritabanı & Portal Mimarisi",
                        desc: "MS SQL üzerinde ilişkisel şema tasarımı ve sözleşme/lisans takip sistemi modellemesi."
                    },
                    {
                        icon: "message-square",
                        title: "Akıllı Chatbot Entegrasyonu",
                        desc: "Kullanıcı deneyimi odaklı ön yüz (UI) ve servis katmanıyla asenkron haberleşme köprüsü."
                    }
                ]
            },
            projects: {
                title: "Öne Çıkan Çalışmalar"
            },
            contact: {
                badge: "İletişim & İş Birliği",
                title: "Yeni Bir Fikri Birlikte Hayata Geçirelim",
                subtitle: "RPA süreç otomasyonu, modern web geliştirme, API mimarisi ve kurumsal yazılım projeleriniz için doğrudan iletişime geçebilirsiniz.",
                statusBadge: "Aktif & Müsait",
                statusTitle: "Yeni Projelere & Fırsatlara Açık",
                statusDesc: "Bankacılık & finans teknolojileri, kurumsal RPA botları ve uçtan uca modern web geliştirme süreçlerinde değer katmaya hazırım.",
                locationVal: "Kuzey Kıbrıs / Türkiye • Remote & Hibrit",
                slaVal: 'Mesajlarınıza genellikle <strong class="text-white">en geç 24 saat içinde</strong> geri dönüş sağlanır.',
                formTitle: "Hızlı Mesaj Gönderin",
                formSubtitle: "Aşağıdaki formu doldurarak projenizin detaylarını veya sorularınızı iletebilirsiniz.",
                formTopicLabel: "Hizmet / İlgi Alanı",
                topics: ["RPA & Otomasyon", "Web & API Entegrasyonu", "Veritabanı / SQL", "Genel Görüşme"],
                labelName: "Adınız Soyadınız",
                placeholderName: "Adınız Soyadınız",
                labelEmail: "E-posta Adresiniz",
                placeholderEmail: "ornek@alanadi.com",
                labelSubject: "Konu Başlığı",
                placeholderSubject: "Örn: RPA Süreç Analizi ve Otomasyon Talebi",
                labelMessage: "Mesajınız",
                placeholderMessage: "Proje hedefleriniz, ihtiyaç duyduğunuz çözümler veya danışmak istedikleriniz...",
                submitBtn: "Mesaj Gönder",
                privacyText: "Bilgileriniz üçüncü şahıslarla paylaşılmaz ve yalnızca iletişim için kullanılır.",
                toastCopied: "E-posta kopyalandı:",
                toastCopiedBtn: "Kopyalandı!",
                toastSuccess: "Mesajınız başarıyla iletildi!"
            },
            footer: "Salahattin Açıkgöz © 2026 • Portföy Web Sitesi"
        },
        en: {
            nav: {
                hero: "Home",
                about: "About",
                skills: "Skills",
                experience: "Experience",
                projects: "Projects",
                contact: "Contact",
                contactBtn: "Contact Me"
            },
            hero: {
                prefix: "I am a",
                roles: [
                    "Software Developer",
                    "API Integration Specialist",
                    "Database Architect",
                    "RPA Automation Engineer"
                ],
                bio: 'Building <span class="text-yellow-400 font-semibold">high-performance</span>, modern digital solutions across Web Development, API Integrations, Database Design, and RPA Process Automation.',
                cvBtn: "Download CV",
                scroll: "Explore About"
            },
            about: {
                title: "About Me",
                badges: [
                    "Software Developer",
                    "Web Development, API Integrations & Database Architecture",
                    "Robotic Process Automation (RPA)"
                ],
                p1: 'Hello! I am <strong class="text-white font-bold">Salahattin Açıkgöz</strong>. Combining my passion for technology and coding with user-centric modern web platforms, resilient enterprise API communications, high-throughput SQL database architectures, and 24/7 autonomous Robotic Process Automation (RPA) solutions.',
                p2: 'Specialized in eliminating repetitive operational workloads with zero error rate using <span class="text-yellow-400 font-semibold">UiPath</span> and <span class="text-yellow-400 font-semibold">Python</span> bots, engineering secure <span class="text-cyan-400 font-semibold">REST/SOAP API</span> bridges between disparate systems, and architecting sub-millisecond <span class="text-purple-400 font-semibold">SQL architectures</span> for enterprise scale.'
            },
            skills: {
                title: "Technologies & Tools"
            },
            experience: {
                title: "Work Experience & Roles",
                role: "Software Development & RPA Intern",
                company: "Asbank",
                dept: "Information Technology (IT) & Software Dept",
                period: "July 2024 – August 2024",
                desc: "Contributed to core digital transformation initiatives during the internship at Asbank: corporate website modernization, chatbot integration, vendor contract/license tracking portal development, and RPA automation. Actively engineered process automations, relational database designs, and front-to-backend system integrations.",
                pillars: [
                    {
                        icon: "bot",
                        title: "RPA & Process Automation",
                        desc: "Building autonomous bots for recurring banking and data transmission operations with zero error margin."
                    },
                    {
                        icon: "globe",
                        title: "Web & API Integrations",
                        desc: "Corporate web platform modernization, resilient RESTful API connections, and custom slider engines."
                    },
                    {
                        icon: "database",
                        title: "Database & Portal Architecture",
                        desc: "Relational schema design on MS SQL and full software tracking portal modeling."
                    },
                    {
                        icon: "message-square",
                        title: "Intelligent Chatbot Integration",
                        desc: "User-experience focused modern UI and asynchronous communication bridge with backend services."
                    }
                ]
            },
            projects: {
                title: "Featured Projects"
            },
            contact: {
                badge: "Contact & Collaboration",
                title: "Let's Bring A New Idea To Life",
                subtitle: "Feel free to reach out directly for RPA process automation, modern web development, API architecture, and enterprise software projects.",
                statusBadge: "Active & Available",
                statusTitle: "Open to New Projects & Roles",
                statusDesc: "Ready to deliver high value across fintech, enterprise RPA bots, and end-to-end modern web systems.",
                locationVal: "Northern Cyprus / Turkey • Remote & Hybrid",
                slaVal: 'Messages typically receive a response <strong class="text-white">within 24 hours</strong>.',
                formTitle: "Send a Direct Message",
                formSubtitle: "Fill out the form below with your project details or inquiries.",
                formTopicLabel: "Service / Area of Interest",
                topics: ["RPA & Automation", "Web & API Integration", "Database / SQL", "General Inquiry"],
                labelName: "Full Name",
                placeholderName: "Your Full Name",
                labelEmail: "Email Address",
                placeholderEmail: "user@example.com",
                labelSubject: "Subject Line",
                placeholderSubject: "e.g. RPA Process Analysis & Automation Request",
                labelMessage: "Your Message",
                placeholderMessage: "Your project goals, needed solutions, or questions...",
                submitBtn: "Send Message",
                privacyText: "Your information is never shared with third parties and is used solely for communication.",
                toastCopied: "Email copied to clipboard:",
                toastCopiedBtn: "Copied!",
                toastSuccess: "Your message has been successfully sent!"
            },
            footer: "Salahattin Açıkgöz © 2026 • Executive Portfolio"
        }
    };

    let activeLang = localStorage.getItem('agy_lang') || 'tr';
    window.currentLang = activeLang;

    // ================= 1. TYPEWRITER SUBTITLE ANIMATION =================
    const typedTextSpan = document.getElementById('typed-text');
    let currentRoles = (i18nData[activeLang] || i18nData.tr).hero.roles;
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typewriterTimeout = null;

    function type() {
        if (!typedTextSpan || currentRoles.length === 0) return;
        if (roleIndex >= currentRoles.length) roleIndex = 0;

        const currentRole = currentRoles[roleIndex];

        if (isDeleting) {
            typedTextSpan.textContent = currentRole.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typedTextSpan.textContent = currentRole.substring(0, charIndex + 1);
            charIndex++;
        }

        let typeSpeed = isDeleting ? 40 : 80;

        if (!isDeleting && charIndex === currentRole.length) {
            typeSpeed = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % currentRoles.length;
            typeSpeed = 500;
        }

        typewriterTimeout = setTimeout(type, typeSpeed);
    }

    function updateTypewriterRoles(newRoles) {
        if (Array.isArray(newRoles) && newRoles.length > 0) {
            currentRoles = newRoles;
            roleIndex = 0;
            charIndex = 0;
            isDeleting = false;
            if (typewriterTimeout) clearTimeout(typewriterTimeout);
            type();
        }
    }

    if (typedTextSpan) {
        type();
    }

    // ================= 2. TOAST NOTIFICATIONS =================
    function showToast(message) {
        const container = document.getElementById('toast-container');
        if (!container) return;

        const toast = document.createElement('div');
        toast.className = 'px-4 py-3 rounded-full bg-yellow-400 text-black font-semibold text-xs shadow-2xl flex items-center gap-2 transition-all';
        toast.innerHTML = `<i data-lucide="check" class="w-4 h-4"></i><span>${escapeHtml(message)}</span>`;

        container.appendChild(toast);
        if (window.lucide) lucide.createIcons();

        setTimeout(() => toast.remove(), 3000);
    }

    // ================= 3. COPY EMAIL BUTTONS =================
    const copyEmailButtons = document.querySelectorAll('#copy-email-btn, #copy-contact-email, [data-copy-email]');
    copyEmailButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const email = btn.getAttribute('data-email') || 'salahattin.acikgoz@example.com';
            navigator.clipboard.writeText(email).then(() => {
                const lang = localStorage.getItem('agy_lang') || 'tr';
                const t = (i18nData[lang] || i18nData.tr).contact;
                showToast(`${t.toastCopied} ${email}`);
                
                const textSpan = btn.querySelector('span');
                if (textSpan) {
                    const originalText = textSpan.textContent;
                    textSpan.textContent = t.toastCopiedBtn;
                    setTimeout(() => {
                        textSpan.textContent = originalText;
                    }, 2000);
                }
            });
        });
    });

    // ================= 4. CONTACT FORM TOPIC CHIPS & SUBMIT =================
    const topicChips = document.querySelectorAll('.topic-chip');
    const selectedTopicInput = document.getElementById('selected-topic');
    const contactSubjectInput = document.getElementById('contact-subject');

    topicChips.forEach(chip => {
        chip.addEventListener('click', () => {
            topicChips.forEach(c => {
                c.classList.remove('active', 'bg-yellow-400', 'text-black', 'border-yellow-400', 'shadow-sm');
                c.classList.add('border-white/10', 'text-gray-300', 'bg-white/5');
            });
            chip.classList.add('active', 'bg-yellow-400', 'text-black', 'border-yellow-400', 'shadow-sm');
            chip.classList.remove('border-white/10', 'text-gray-300', 'bg-white/5');

            const topic = chip.getAttribute('data-topic');
            if (selectedTopicInput) selectedTopicInput.value = topic;
            const lang = localStorage.getItem('agy_lang') || 'tr';
            if (contactSubjectInput && (!contactSubjectInput.value.trim() || contactSubjectInput.value.includes('Talebi') || contactSubjectInput.value.includes('Request'))) {
                contactSubjectInput.value = lang === 'en' ? `${topic} Process & Project Request` : `${topic} Süreç & Proje Talebi`;
            }
        });
    });

    const form = document.getElementById('contact-form');
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const nameInput = document.getElementById('contact-name');
            const emailInput = document.getElementById('contact-email');
            const subjectInput = document.getElementById('contact-subject');
            const messageInput = document.getElementById('contact-message');

            const payload = {
                name: (nameInput ? nameInput.value : '').trim(),
                email: (emailInput ? emailInput.value : '').trim(),
                topic: (selectedTopicInput ? selectedTopicInput.value : 'RPA & Otomasyon'),
                subject: (subjectInput ? subjectInput.value : '').trim(),
                message: (messageInput ? messageInput.value : '').trim(),
                createdAt: new Date().toISOString()
            };

            // 1. Send directly to Cloud Firestore
            if (window.firebaseDb) {
                try {
                    const msgId = 'msg_' + Date.now();
                    window.firebaseDb.collection('messages').doc(msgId).set({
                        id: msgId,
                        ...payload,
                        read: false
                    }).catch(err => console.warn('[FIRESTORE MSG WRITE ERROR]', err));
                } catch (e) {}
            }

            // 2. Send to backend REST API
            try {
                fetch(`${API_BASE}/api/messages`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                }).catch(() => {});
            } catch (err) {}

            // 3. Also keep a copy in localStorage for client-side admin view
            try {
                const localMsgs = JSON.parse(localStorage.getItem('agy_local_messages') || '[]');
                localMsgs.unshift({ id: 'msg_' + Date.now(), ...payload, read: false });
                localStorage.setItem('agy_local_messages', JSON.stringify(localMsgs));
            } catch (e) {}

            form.reset();
            
            // Reset topic chips to first
            if (topicChips.length > 0) {
                topicChips.forEach((c, idx) => {
                    if (idx === 0) {
                        c.classList.add('active', 'bg-yellow-400', 'text-black', 'border-yellow-400', 'shadow-sm');
                        c.classList.remove('border-white/10', 'text-gray-300', 'bg-white/5');
                    } else {
                        c.classList.remove('active', 'bg-yellow-400', 'text-black', 'border-yellow-400', 'shadow-sm');
                        c.classList.add('border-white/10', 'text-gray-300', 'bg-white/5');
                    }
                });
                if (selectedTopicInput) selectedTopicInput.value = topicChips[0].getAttribute('data-topic');
            }

            const lang = localStorage.getItem('agy_lang') || 'tr';
            const t = (i18nData[lang] || i18nData.tr).contact;
            showToast(t.toastSuccess);
        });
    }

    // ================= 5. ACTIVE NAV & SCROLL OBSERVERS =================
    const navLinks = document.querySelectorAll('nav .nav-link');
    const sections = document.querySelectorAll('.snap-section');

    if ('IntersectionObserver' in window && sections.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    navLinks.forEach(link => {
                        if (link.getAttribute('href') === `#${id}`) {
                            link.classList.add('text-yellow-400', 'font-bold');
                            link.classList.remove('text-gray-300');
                        } else {
                            link.classList.remove('text-yellow-400', 'font-bold');
                            link.classList.add('text-gray-300');
                        }
                    });
                }
            });
        }, { threshold: 0.4 });

        sections.forEach(sec => observer.observe(sec));
    }

    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const targetId = anchor.getAttribute('href');
            if (!targetId || targetId === '#') return;
            const targetEl = document.querySelector(targetId);
            if (targetEl) {
                e.preventDefault();
                document.documentElement.style.scrollSnapType = 'none';
                targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
                setTimeout(() => {
                    document.documentElement.style.scrollSnapType = 'y proximity';
                    history.pushState(null, null, targetId);
                }, 700);
            }
        });
    });

    // ================= 6. TECH DETAILS MODAL & DICTIONARY =================
    const techDetailsTR = {
        python: {
            name: 'Python',
            category: 'Programlama Dili & Otomasyon',
            iconHtml: '<img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg" alt="Python" class="w-8 h-8 object-contain">',
            whatIs: 'Veri analitiği, süreç otomasyonu, yapay zeka ve web servisleri geliştirmek için optimize edilmiş esnek ve güçlü bir programlama dili.',
            usage: 'Kurumsal veri aktarım (ETL) hatları, web scraping botları, asenkron arka plan servisleri ve özel RPA otomasyon betiklerinin geliştirilmesinde aktif olarak kullandım.'
        },
        uipath: {
            name: 'UiPath RPA',
            category: 'Robotik Süreç Otomasyonu (RPA)',
            iconHtml: '<svg class="w-8 h-8" viewBox="0 0 24 24" fill="#FA4616"><path d="M0 7.882v8.235h8.235V7.882H0Zm.852.852h6.53v6.53H.852v-6.53Zm22.268.695c-.514 0-.886.345-.886.873 0 .511.36.878.886.878.518 0 .88-.359.88-.878 0-.521-.359-.873-.88-.873Zm-17.023.055a.501.501 0 0 0-.522.522c0 .302.22.509.522.509.302 0 .522-.206.522-.509a.501.501 0 0 0-.522-.522Zm17.023.102c.437 0 .716.278.716.716 0 .426-.274.712-.716.712-.426 0-.719-.271-.719-.712 0-.44.278-.716.719-.716Zm-.347.213v.988h.197v-.318h.14l.176.318h.22l-.186-.347a.32.32 0 0 0 .206-.311c0-.203-.159-.33-.374-.33h-.379Zm-3.74.002v4.468h.853v-1.774c0-.571.302-.914.804-.914s.763.33.763.838v1.85h.852v-1.946c0-.88-.619-1.45-1.409-1.45-.509 0-.818.192-1.01.515V9.801h-.853Zm3.937.157h.157c.115 0 .193.064.193.171 0 .118-.078.181-.193.181h-.157v-.352Zm-21.375.049v2.495c0 1.141.625 1.808 1.684 1.808 1.079 0 1.718-.681 1.718-1.808v-2.495h-.852v2.495c0 .646-.275 1.004-.846 1.004-.591 0-.852-.378-.852-1.004v-2.495h-.852Zm7.547 0v4.262h.852v-1.375h.77c.928 0 1.533-.543 1.533-1.457 0-.88-.591-1.43-1.533-1.43H9.142Zm7.809 0v.914h-.399v.722h.399v1.45c0 .791.35 1.176 1.161 1.176h.447v-.729h-.337c-.33 0-.419-.144-.419-.44v-1.457h.749v-.722h-.749v-.914h-.852Zm-6.957.687h.681c.488 0 .756.276.756.743 0 .502-.268.776-.756.776h-.681v-1.519Zm4.138.186c-.921 0-1.546.728-1.546 1.718 0 .997.639 1.712 1.546 1.712.537 0 .887-.193 1.086-.516v.475h.853v-3.348h-.853v.523c-.206-.344-.563-.564-1.086-.564Zm-8.461.041v3.348h.852v-3.348h-.852Zm8.661.701c.543 0 .886.399.886.976 0 .585-.364.963-.886.963-.578 0-.88-.406-.88-.963 0-.598.337-.976.88-.976Z"/></svg>',
            whatIs: 'Kurumsal iş süreçlerini uçtan uca otomatikleştiren, yapay zeka ve OCR destekli pazar lideri RPA platformu.',
            usage: 'E-fatura ve irsaliye aktarımları, ERP/CRM sistemlerine otomatik veri işleme, banka mutabakatları ve 7/24 kesintisiz çalışan bot sistemlerinin mimarisinde kullandım.'
        },
        csharp: {
            name: 'C#',
            category: 'Nesne Yönelimli Programlama',
            iconHtml: '<img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/csharp/csharp-original.svg" alt="C#" class="w-8 h-8 object-contain">',
            whatIs: 'Microsoft tarafından geliştirilen, modern, tip güvenli ve kurumsal düzeyde yüksek performanslı yazılım dili.',
            usage: 'Kurumsal masaüstü araçları, Windows servisleri, arka plan görev zamanlayıcıları ve entegrasyon uygulamaları geliştirmede kullandım.'
        },
        dotnet: {
            name: '.NET Core',
            category: 'Framework & Platform',
            iconHtml: '<img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/dot-net/dot-net-original.svg" alt=".NET Core" class="w-8 h-8 object-contain">',
            whatIs: 'Platform bağımsız (cross-platform), ölçeklenebilir ve yüksek hızlı arka uç (backend) ve mikroservis geliştirme çatısı.',
            usage: 'Yüksek trafiğe dayanıklı RESTful API servisleri, veritabanı entegrasyon katmanları ve kurumsal mikroservis mimarilerinde kullandım.'
        },
        mssql: {
            name: 'MS SQL Server',
            category: 'İlişkisel Veritabanı',
            iconHtml: '<img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/microsoftsqlserver/microsoftsqlserver-original.svg" alt="MS SQL Server" class="w-8 h-8 object-contain">',
            whatIs: 'Kurumsal düzeyde yüksek işlem hacmi, güvenlik ve analitik sunan ilişkisel veritabanı yönetim sistemi (RDBMS).',
            usage: 'Karmaşık T-SQL saklı yordamları (stored procedures), triggerlar, indeks optimizasyonları ve ERP veri modellerinin yönetiminde kullandım.'
        },
        postgresql: {
            name: 'PostgreSQL',
            category: 'Açık Kaynak Veritabanı',
            iconHtml: '<img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/postgresql/postgresql-original.svg" alt="PostgreSQL" class="w-8 h-8 object-contain">',
            whatIs: 'Gelişmiş veri bütünlüğü, JSON desteği ve ölçeklenebilirliğiyle bilinen açık kaynaklı güçlü nesne-ilişkisel veritabanı.',
            usage: 'Mikroservis veri depoları, asenkron loglama ve yüksek veri tutarlılığı gerektiren sistemlerde veri mimarisi kurmak için kullandım.'
        },
        docker: {
            name: 'Docker',
            category: 'Konteynerizasyon',
            iconHtml: '<img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/docker/docker-original.svg" alt="Docker" class="w-8 h-8 object-contain">',
            whatIs: 'Uygulamaları tüm bağımlılıklarıyla birlikte izole konteynerlar içinde tutarlı ve taşınabilir biçimde çalıştırma platformu.',
            usage: 'Geliştirilen servislerin ve bot arka uçlarının farklı sunucu ve bulut ortamlarında sorunsuz ve hızlı bir şekilde ayağa kaldırılmasında kullandım.'
        },
        rest: {
            name: 'RESTful API & Postman',
            category: 'Servis Entegrasyonu & Test',
            iconHtml: '<img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/postman/postman-original.svg" alt="REST API" class="w-8 h-8 object-contain">',
            whatIs: 'Sistemlerin HTTP protokolü üzerinden JSON formatında hafif, ölçeklenebilir ve standart veri alışverişi yapmasını sağlayan mimari.',
            usage: 'Farklı üçüncü taraf servislerle (bankalar, e-fatura sağlayıcıları, ERP) iki yönlü veri entegrasyonu ve Postman ile uçtan uca API testlerinde kullandım.'
        },
        selenium: {
            name: 'Selenium & OCR',
            category: 'Web Otomasyonu & Görüntü İşleme',
            iconHtml: '<img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/selenium/selenium-original.svg" alt="Selenium" class="w-8 h-8 object-contain">',
            whatIs: 'Web tarayıcılarını programatik olarak kontrol eden otomasyon kütüphanesi ve dijital belgelerden metin tanıyan optik karakter tanıma araçları.',
            usage: 'API desteği bulunmayan web portallarından otomatik dosya/veri indirme, form doldurma ve taranmış PDF faturalardan veri ayrıştırmada kullandım.'
        },
        javascript: {
            name: 'JavaScript (ES6+)',
            category: 'Web Programlama',
            iconHtml: '<img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg" alt="JavaScript" class="w-8 h-8 object-contain">',
            whatIs: 'Dinamik, asenkron ve modern web arayüzleri oluşturan web dünyasının temel programlama dili.',
            usage: 'Kullanıcı dostu yönetim panelleri, dinamik veri tabloları ve tarayıcı içi etkileşimli arayüz bileşenleri geliştirmede kullandım.'
        },
        tailwind: {
            name: 'Tailwind CSS',
            category: 'CSS Framework',
            iconHtml: '<img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg" alt="Tailwind CSS" class="w-8 h-8 object-contain">',
            whatIs: 'Hızlı, modern, responsive ve temiz kullanıcı arayüzleri inşa etmeye yarayan utility-first CSS kütüphanesi.',
            usage: 'Portföy arayüzü, iç yönetim ekranları ve mobil uyumlu modern koyu tema tasarımlarında kullandım.'
        },
        html5: {
            name: 'HTML5 & CSS3',
            category: 'Web Standartları',
            iconHtml: '<img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/html5/html5-original.svg" alt="HTML5" class="w-8 h-8 object-contain">',
            whatIs: 'Modern web sayfalarının semantik iskeletini ve görsel tasarımını oluşturan endüstri standardı teknolojiler.',
            usage: 'Semantik, erişilebilir ve SEO dostu modern sayfa yapıları kurgulamada kullandım.'
        },
        git: {
            name: 'Git & GitHub',
            category: 'Versiyon Kontrol & CI/CD',
            iconHtml: '<img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/git/git-original.svg" alt="Git" class="w-8 h-8 object-contain">',
            whatIs: 'Yazılım projelerinde kaynak kod değişikliklerini izleyen, dallanma ve ekip iş birliği sağlayan dağıtık sürüm kontrol sistemi.',
            usage: 'Kod sürümlerinin takibi, güvenli branch yönetimi ve CI/CD süreçlerinin entegrasyonunda kullandım.'
        },
        soap: {
            name: 'SOAP / XML Servisleri',
            category: 'Kurumsal Web Servisleri',
            iconHtml: '<div class="w-8 h-8 rounded-lg bg-yellow-400/10 border border-yellow-400/20 text-yellow-400 flex items-center justify-center font-mono font-bold text-xs">&lt;/&gt;</div>',
            whatIs: 'Sıkı veri sözleşmeleri (WSDL) ve XML mesajlaşma protokolü ile kurumsal seviyede güvenli servis mimarisi.',
            usage: 'Geleneksel bankacılık, kamu sistemleri ve kurumsal ERP servisleri ile entegrasyon sağlama ve XML veri ayrıştırmada kullandım.'
        }
    };

    const techDetailsEN = {
        python: {
            name: 'Python',
            category: 'Programming Language & Automation',
            iconHtml: '<img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg" alt="Python" class="w-8 h-8 object-contain">',
            whatIs: 'A versatile and powerful programming language optimized for data analytics, process automation, artificial intelligence, and web services.',
            usage: 'Actively used for developing enterprise ETL data pipelines, web scraping bots, async background services, and custom RPA automation scripts.'
        },
        uipath: {
            name: 'UiPath RPA',
            category: 'Robotic Process Automation (RPA)',
            iconHtml: '<svg class="w-8 h-8" viewBox="0 0 24 24" fill="#FA4616"><path d="M0 7.882v8.235h8.235V7.882H0Zm.852.852h6.53v6.53H.852v-6.53Zm22.268.695c-.514 0-.886.345-.886.873 0 .511.36.878.886.878.518 0 .88-.359.88-.878 0-.521-.359-.873-.88-.873Zm-17.023.055a.501.501 0 0 0-.522.522c0 .302.22.509.522.509.302 0 .522-.206.522-.509a.501.501 0 0 0-.522-.522Zm17.023.102c.437 0 .716.278.716.716 0 .426-.274.712-.716.712-.426 0-.719-.271-.719-.712 0-.44.278-.716.719-.716Zm-.347.213v.988h.197v-.318h.14l.176.318h.22l-.186-.347a.32.32 0 0 0 .206-.311c0-.203-.159-.33-.374-.33h-.379Zm-3.74.002v4.468h.853v-1.774c0-.571.302-.914.804-.914s.763.33.763.838v1.85h.852v-1.946c0-.88-.619-1.45-1.409-1.45-.509 0-.818.192-1.01.515V9.801h-.853Zm3.937.157h.157c.115 0 .193.064.193.171 0 .118-.078.181-.193.181h-.157v-.352Zm-21.375.049v2.495c0 1.141.625 1.808 1.684 1.808 1.079 0 1.718-.681 1.718-1.808v-2.495h-.852v2.495c0 .646-.275 1.004-.846 1.004-.591 0-.852-.378-.852-1.004v-2.495h-.852Zm7.547 0v4.262h.852v-1.375h.77c.928 0 1.533-.543 1.533-1.457 0-.88-.591-1.43-1.533-1.43H9.142Zm7.809 0v.914h-.399v.722h.399v1.45c0 .791.35 1.176 1.161 1.176h.447v-.729h-.337c-.33 0-.419-.144-.419-.44v-1.457h.749v-.722h-.749v-.914h-.852Zm-6.957.687h.681c.488 0 .756.276.756.743 0 .502-.268.776-.756.776h-.681v-1.519Zm4.138.186c-.921 0-1.546.728-1.546 1.718 0 .997.639 1.712 1.546 1.712.537 0 .887-.193 1.086-.516v.475h.853v-3.348h-.853v.523c-.206-.344-.563-.564-1.086-.564Zm-8.461.041v3.348h.852v-3.348h-.852Zm8.661.701c.543 0 .886.399.886.976 0 .585-.364.963-.886.963-.578 0-.88-.406-.88-.963 0-.598.337-.976.88-.976Z"/></svg>',
            whatIs: 'Market-leading RPA platform powered by AI and OCR to automate enterprise workflows end-to-end.',
            usage: 'Used for automating invoice entry, bank reconciliations, ERP data synchronizations, and 24/7 autonomous unattended bots.'
        },
        csharp: {
            name: 'C#',
            category: 'Object-Oriented Programming',
            iconHtml: '<img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/csharp/csharp-original.svg" alt="C#" class="w-8 h-8 object-contain">',
            whatIs: 'A modern, type-safe, high-performance object-oriented programming language developed by Microsoft.',
            usage: 'Used for developing desktop enterprise utilities, Windows background services, and backend integration modules.'
        },
        dotnet: {
            name: '.NET Core',
            category: 'Framework & Platform',
            iconHtml: '<img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/dot-net/dot-net-original.svg" alt=".NET Core" class="w-8 h-8 object-contain">',
            whatIs: 'A cross-platform, high-speed, and scalable framework for building modern backend services and microservices.',
            usage: 'Employed in high-throughput RESTful API architectures and enterprise data access layers.'
        },
        mssql: {
            name: 'MS SQL Server',
            category: 'Relational Database',
            iconHtml: '<img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/microsoftsqlserver/microsoftsqlserver-original.svg" alt="MS SQL Server" class="w-8 h-8 object-contain">',
            whatIs: 'An enterprise relational database management system delivering high throughput, transaction reliability, and analytics.',
            usage: 'Engineered complex T-SQL stored procedures, triggers, index strategies, and multi-table normalized schemas.'
        },
        postgresql: {
            name: 'PostgreSQL',
            category: 'Open Source Database',
            iconHtml: '<img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/postgresql/postgresql-original.svg" alt="PostgreSQL" class="w-8 h-8 object-contain">',
            whatIs: 'A powerful, open-source object-relational database known for advanced data integrity, JSON support, and scalability.',
            usage: 'Utilized for microservice data stores, async audit logging, and resilient relational data structures.'
        },
        docker: {
            name: 'Docker',
            category: 'Containerization',
            iconHtml: '<img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/docker/docker-original.svg" alt="Docker" class="w-8 h-8 object-contain">',
            whatIs: 'A containerization platform that packages apps with all dependencies to run consistently across environments.',
            usage: 'Used to deploy isolated background worker services, bot runtimes, and local development environments.'
        },
        rest: {
            name: 'RESTful API & Postman',
            category: 'Service Integration & Testing',
            iconHtml: '<img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/postman/postman-original.svg" alt="REST API" class="w-8 h-8 object-contain">',
            whatIs: 'An architectural style enabling lightweight, standard, and secure JSON data exchange over HTTP protocols.',
            usage: 'Engineered two-way integrations with third-party banking/ERP services and built automated test collections in Postman.'
        },
        selenium: {
            name: 'Selenium & OCR',
            category: 'Web Automation & Document Parsing',
            iconHtml: '<img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/selenium/selenium-original.svg" alt="Selenium" class="w-8 h-8 object-contain">',
            whatIs: 'Browser automation framework combined with Optical Character Recognition tools to extract data from digital documents.',
            usage: 'Automated downloads from legacy portals lacking APIs and parsed scanned PDF invoices into structured databases.'
        },
        javascript: {
            name: 'JavaScript (ES6+)',
            category: 'Web Programming',
            iconHtml: '<img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg" alt="JavaScript" class="w-8 h-8 object-contain">',
            whatIs: 'The foundational language of the web for creating reactive, asynchronous, and interactive interfaces.',
            usage: 'Built responsive client-side controllers, interactive dashboards, and real-time event-driven widgets.'
        },
        tailwind: {
            name: 'Tailwind CSS',
            category: 'CSS Framework',
            iconHtml: '<img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg" alt="Tailwind CSS" class="w-8 h-8 object-contain">',
            whatIs: 'A utility-first CSS framework enabling rapid prototyping and polished, bespoke dark-mode user interfaces.',
            usage: 'Used across the portfolio and administrative dashboards for pixel-perfect obsidian styling and responsiveness.'
        },
        html5: {
            name: 'HTML5 & CSS3',
            category: 'Web Standards',
            iconHtml: '<img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/html5/html5-original.svg" alt="HTML5" class="w-8 h-8 object-contain">',
            whatIs: 'The foundational markup and styling standards governing semantic web content and responsive design.',
            usage: 'Structured semantic, accessible DOM hierarchies and smooth GPU-accelerated CSS animations.'
        },
        git: {
            name: 'Git & GitHub',
            category: 'Version Control & CI/CD',
            iconHtml: '<img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/git/git-original.svg" alt="Git" class="w-8 h-8 object-contain">',
            whatIs: 'A distributed version control system for tracking changes in source code and coordinating work among programmers.',
            usage: 'Used for source control, secure branch strategies, code reviews, and CI/CD pipelines.'
        },
        soap: {
            name: 'SOAP / XML Services',
            category: 'Enterprise Web Services',
            iconHtml: '<div class="w-8 h-8 rounded-lg bg-yellow-400/10 border border-yellow-400/20 text-yellow-400 flex items-center justify-center font-mono font-bold text-xs">&lt;/&gt;</div>',
            whatIs: 'A strict, protocol-based web service standard delivering high security and contractual message validation via XML.',
            usage: 'Handled legacy banking system connectors and structured WSDL-based financial transactions.'
        }
    };

    let techDetails = (activeLang === 'en' ? techDetailsEN : techDetailsTR);

    const modal = document.getElementById('tech-modal');
    const modalCard = document.getElementById('tech-modal-card');
    const closeIconBtn = document.getElementById('close-tech-modal');
    const closeBtn = document.getElementById('close-tech-modal-btn');
    const modalIconWrapper = document.getElementById('modal-icon-wrapper');
    const modalTitle = document.getElementById('modal-title');
    const modalCategory = document.getElementById('modal-category');
    const modalWhatIs = document.getElementById('modal-what-is');
    const modalUsage = document.getElementById('modal-usage');

    function openModal(techKey) {
        const data = techDetails[techKey];
        if (!data || !modal) return;

        modalIconWrapper.innerHTML = data.iconHtml;
        modalTitle.textContent = data.name;
        modalCategory.textContent = data.category;
        modalWhatIs.textContent = data.whatIs;
        modalUsage.textContent = data.usage;

        modal.classList.remove('opacity-0', 'pointer-events-none');
        modalCard.classList.remove('scale-95');
        modalCard.classList.add('scale-100');
        document.body.style.overflow = 'hidden';

        if (window.lucide) lucide.createIcons();
    }

    function closeModal() {
        if (!modal) return;
        modal.classList.add('opacity-0', 'pointer-events-none');
        modalCard.classList.remove('scale-100');
        modalCard.classList.add('scale-95');
        document.body.style.overflow = '';
    }

    function attachTechModalListeners() {
        document.querySelectorAll('.tech-logo-card').forEach(card => {
            card.onclick = () => {
                const techKey = card.getAttribute('data-tech');
                if (techKey) openModal(techKey);
            };
        });
    }

    attachTechModalListeners();

    if (closeIconBtn) closeIconBtn.addEventListener('click', closeModal);
    if (closeBtn) closeBtn.addEventListener('click', closeModal);

    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });
    }

    // ================= 7. EXPERTISE DETAILS MODAL =================
    const expertiseDataTR = {
        web: {
            code: '01 //',
            title: 'Web Geliştirme & Arayüz Mimarisi',
            subtitle: 'Modern UI/UX, Yüksek Hızlı Yönetim Panelleri & Kurumsal Portaller',
            status: 'Modern Standartlar',
            iconHtml: '<i data-lucide="layout" class="w-8 h-8 text-yellow-400"></i>',
            philosophy: 'Web platformlarında kullanıcı deneyimi sadece estetikten ibaret değildir; milisaniyelik sayfa yükleme performansı, responsive mobil uyum ve modüler mimari her projenin temelidir. Teknoloji tercihlerinde sürdürülebilirliği ve ölçeklenebilirliği esas alarak modern arayüzler inşa ediyorum.',
            capabilities: [
                'Responsive & Mobil Öncelikli (Mobile-First) Tasarım',
                'Tailwind CSS ile Modüler Tasarım Sistemleri',
                'JavaScript (ES6+) ile Dinamik & Asenkron Arayüzler',
                'SEO Uyumlu, Hızlı ve Optimize Kod Yapısı'
            ],
            caseStudy: 'Kurumsal operasyonlar için tasarlanan çoklu rol yetkilendirmeli yönetim paneli. Mobil ve masaüstünde kesintisiz çalışacak şekilde optimize edildi; sayfa açılış süreleri 1 saniyenin altına düşürülerek veri giriş performansı %60 hızlandırıldı.',
            techStack: ['JavaScript (ES6+)', 'Tailwind CSS', 'HTML5 / CSS3', 'REST API Client', 'Git'],
            metrics: [
                { label: 'Performans Puanı', value: '100/100' },
                { label: 'Ekran Yenileme', value: '60 FPS' },
                { label: 'Mobil Uyum', value: '%100' }
            ]
        },
        api: {
            code: '02 //',
            title: 'API Entegrasyonları & Veri Akışı',
            subtitle: 'Güvenli REST & SOAP Servisleri, Webhook ve Mikroservis Haberleşmesi',
            status: '7/24 Kesintisiz',
            iconHtml: '<i data-lucide="network" class="w-8 h-8 text-cyan-400"></i>',
            philosophy: 'Farklı yazılımların ve ekosistemlerin birbiriyle güvenli konuşabilmesi modern dijital mimarilerin kalbidir. API çözümlerinde katı hata toleransı (fault tolerance), JWT tabanlı yetkilendirme ve yüksek işlem hacimli asenkron kuyruk mekanizmalarını uyguluyorum.',
            capabilities: [
                'RESTful & SOAP Web Servis Mimarisi',
                'JWT, API Key & OAuth 2.0 Kimlik Doğrulama',
                'Postman ile Kapsamlı Test & Otomasyon',
                'JSON / XML Veri Ayrıştırma ve Hızlı Eşleme (Mapping)'
            ],
            caseStudy: 'Üçüncü parti e-ticaret pazar yerleri ile kurumsal ERP muhasebe programı arasında iki yönlü otomatik sipariş/stok entegrasyonu. Dakikada binlerce siparişi kuyruk yapısıyla işleyip stok uyumsuzluklarını sıfıra indiren hatasız servis mimarisi.',
            techStack: ['REST API', 'SOAP / XML', 'Postman', 'OAuth 2.0', 'C# .NET', 'JSON / Webhooks'],
            metrics: [
                { label: 'Ortalama Yanıt', value: '14 ms' },
                { label: 'Veri Bütünlüğü', value: '%100' },
                { label: 'Aktarım Hızı', value: '25K/dk' }
            ]
        },
        database: {
            code: '03 //',
            title: 'Veritabanı Mimarisi & Optimizasyon',
            subtitle: 'MS SQL Server, PostgreSQL, İndeksleme & Karmaşık T-SQL Sorguları',
            status: 'Yüksek Performans',
            iconHtml: '<i data-lucide="database" class="w-8 h-8 text-purple-400"></i>',
            philosophy: 'Veritabanı, bir uygulamanın en kritik performans noktasıdır. Doğru normalizasyon, akıllı indeksleme stratejileri ve optimize edilmiş Stored Procedure yapıları ile milyonlarca satırlık büyük tablolarda bile sorgu gecikmelerini milisaniyelere indiriyorum.',
            capabilities: [
                'İlişkisel Veritabanı Modelleme (ER Diyagramları)',
                'Clustered & Non-Clustered İndeks Stratejileri',
                'Stored Procedure, View & Trigger Geliştirme',
                'Execution Plan Analizi & Darboğaz (Bottleneck) Giderme'
            ],
            caseStudy: '10 milyondan fazla finansal hareket barındıran bir tabloda 40 saniyeyi bulan rapor sorgusunun, execution plan analizi, covering indexleme ve T-SQL optimizasyonları ile 180 milisaniyeye (yaklaşık 220 kat hızlanma) düşürülmesi sağlandı.',
            techStack: ['MS SQL Server', 'PostgreSQL', 'T-SQL', 'Index Tuning', 'Execution Plan', 'ETL'],
            metrics: [
                { label: 'Sorgu Hızlanması', value: '220x' },
                { label: 'İndeks Başarısı', value: '%99.8' },
                { label: 'Veri Tutarlılığı', value: 'ACID' }
            ]
        },
        rpa: {
            code: '04 //',
            title: 'RPA & Robotik Süreç Otomasyonu',
            subtitle: 'UiPath Studio, Python Botları, OCR ve 7/24 Otonom İş Akışları',
            status: '7/24 Otonom',
            iconHtml: '<i data-lucide="bot" class="w-8 h-8 text-emerald-400"></i>',
            philosophy: 'İnsanların tekrarlayan, monoton veri girişleri ve dosya aktarımlarıyla vakit kaybetmesi gerekmez. UiPath ve Python botları ile çalışan yazılım robotları sıfır hata toleransı ile 7 gün 24 saat kesintisiz çalışarak operasyonel verimliliği maksimize eder.',
            capabilities: [
                'UiPath REFramework Mimarisi & Queue (Kuyruk) Yönetimi',
                'Python (Selenium, Pandas, PyAutoGUI) ile Hibrit Botlar',
                'OCR, PDF, Excel ve E-Posta Otomatik Ayrıştırma',
                'Hata Yönetimi (Exception Handling) & Otomatik Raporlama'
            ],
            caseStudy: 'Her gün farklı kaynaklardan gelen yüzlerce e-arşiv faturayı OCR ve Regex ile okuyup verileri doğrulayan, ardından kurumsal SAP/ERP sistemine otomatik fiş kaydı oluşturan uçtan uca RPA botu. Günlük 6 saatlik insan iş gücünü sıfıra indirdi ve hatalı kayıt oranını %0 yaptı.',
            techStack: ['UiPath Studio', 'UiPath Orchestrator', 'Python RPA', 'Selenium', 'OCR / Regex', 'SAP/ERP'],
            metrics: [
                { label: 'İş Gücü Tasarrufu', value: '%95' },
                { label: 'İşlem Hata Payı', value: '%0' },
                { label: 'Çalışma Modu', value: '7/24' }
            ]
        }
    };

    const expertiseDataEN = {
        web: {
            code: '01 //',
            title: 'Web Development & UI Architecture',
            subtitle: 'Modern UI/UX, High-Performance Dashboards & Enterprise Portals',
            status: 'Modern Standards',
            iconHtml: '<i data-lucide="layout" class="w-8 h-8 text-yellow-400"></i>',
            philosophy: 'In web platforms, user experience goes beyond aesthetics; sub-second page loads, responsive layouts, and modular architecture form the core of every project. I engineer robust frontends focused on scalability and maintainability.',
            capabilities: [
                'Responsive & Mobile-First Architecture',
                'Modular Design Systems with Tailwind CSS',
                'Dynamic & Asynchronous Interfaces with JavaScript (ES6+)',
                'SEO-Optimized, Lean & Fast Codebase'
            ],
            caseStudy: 'Multi-role enterprise operations dashboard optimized for seamless desktop and mobile execution. Reduced initial load times below 1 second and accelerated internal data-entry workflows by 60%.',
            techStack: ['JavaScript (ES6+)', 'Tailwind CSS', 'HTML5 / CSS3', 'REST API Client', 'Git'],
            metrics: [
                { label: 'Performance Score', value: '100/100' },
                { label: 'Frame Rate', value: '60 FPS' },
                { label: 'Mobile Responsive', value: '100%' }
            ]
        },
        api: {
            code: '02 //',
            title: 'API Integrations & Data Pipelines',
            subtitle: 'Resilient REST & SOAP Services, Webhooks & Microservice Communications',
            status: '24/7 Resilient',
            iconHtml: '<i data-lucide="network" class="w-8 h-8 text-cyan-400"></i>',
            philosophy: 'Secure and reliable communication between independent software ecosystems is the backbone of modern digital architectures. I implement strict fault tolerance, JWT auth, and high-throughput async queue mechanisms.',
            capabilities: [
                'RESTful & SOAP Web Service Architecture',
                'JWT, API Key & OAuth 2.0 Authentication',
                'Automated E2E Testing with Postman',
                'JSON / XML Parsing & Fast Object Mapping'
            ],
            caseStudy: 'Bi-directional automated inventory and order synchronization between external e-commerce marketplaces and corporate ERP. Engineered asynchronous queues handling thousands of orders per minute with zero discrepancies.',
            techStack: ['REST API', 'SOAP / XML', 'Postman', 'OAuth 2.0', 'C# .NET', 'JSON / Webhooks'],
            metrics: [
                { label: 'Avg Latency', value: '14 ms' },
                { label: 'Data Integrity', value: '100%' },
                { label: 'Throughput', value: '25K/min' }
            ]
        },
        database: {
            code: '03 //',
            title: 'Database Architecture & Optimization',
            subtitle: 'MS SQL Server, PostgreSQL, Indexing & Complex T-SQL Queries',
            status: 'High Performance',
            iconHtml: '<i data-lucide="database" class="w-8 h-8 text-purple-400"></i>',
            philosophy: 'The database is the ultimate determinant of application performance. Through rigorous normalization, intelligent index structures, and tuned Stored Procedures, I minimize query latency even on multi-million record datasets.',
            capabilities: [
                'Relational Schema Modeling (ER Diagrams)',
                'Clustered & Non-Clustered Indexing Strategies',
                'Stored Procedure, View & Trigger Development',
                'Query Execution Plan Analysis & Tuning'
            ],
            caseStudy: 'Architected the relational schema for the internal contract and license management portal. Complex multi-table joins and aggregation queries were tuned to return within 18 milliseconds.',
            techStack: ['MS SQL Server', 'PostgreSQL', 'T-SQL', 'Query Optimization', 'Index Tuning', 'ETL'],
            metrics: [
                { label: 'Max Query Time', value: '< 20 ms' },
                { label: 'ACID Compliance', value: '100%' },
                { label: 'Index Gain', value: '4.5x' }
            ]
        },
        rpa: {
            code: '04 //',
            title: 'RPA & Autonomous Bot Workflows',
            subtitle: 'UiPath, Python Automation, OCR Parsing & 24/7 Unattended Bots',
            status: 'Zero-Error Execution',
            iconHtml: '<i data-lucide="bot" class="w-8 h-8 text-yellow-400"></i>',
            philosophy: 'Manual, high-volume repetitive tasks consume skilled workforce and carry human error risks. By designing rule-based intelligent RPA bots with comprehensive exception handling, I enable round-the-clock autonomous business continuity.',
            capabilities: [
                'UiPath Studio & Orchestrator Workflow Automation',
                'Hybrid Bots with Python (Selenium, Pandas, PyAutoGUI)',
                'Automated OCR, PDF, Excel & Email Parsing',
                'Robust Exception Handling & Automatic Alerting'
            ],
            caseStudy: 'End-to-end bot reading hundreds of daily e-archive invoices via OCR and Regex, validating data against accounting rules, and posting vouchers to SAP/ERP. Eliminated 6 hours of daily manual effort with 0% error rate.',
            techStack: ['UiPath Studio', 'UiPath Orchestrator', 'Python RPA', 'Selenium', 'OCR / Regex', 'SAP/ERP'],
            metrics: [
                { label: 'Labor Saved', value: '95%' },
                { label: 'Error Rate', value: '0%' },
                { label: 'Uptime Mode', value: '24/7' }
            ]
        }
    };

    let expertiseData = (activeLang === 'en' ? expertiseDataEN : expertiseDataTR);

    const expModal = document.getElementById('expertise-modal');
    const expModalCard = document.getElementById('expertise-modal-card');
    const closeExpIconBtn = document.getElementById('close-expertise-modal');
    const closeExpBtn = document.getElementById('close-expertise-modal-btn');
    const expModalContactBtn = document.getElementById('exp-modal-contact-btn');

    const expIconWrapper = document.getElementById('exp-modal-icon-wrapper');
    const expStatus = document.getElementById('exp-modal-status');
    const expCode = document.getElementById('exp-modal-code');
    const expTitle = document.getElementById('exp-modal-title');
    const expSubtitle = document.getElementById('exp-modal-subtitle');
    const expPhilosophy = document.getElementById('exp-modal-philosophy');
    const expCapabilities = document.getElementById('exp-modal-capabilities');
    const expCaseStudy = document.getElementById('exp-modal-case-study');
    const expTechStack = document.getElementById('exp-modal-tech-stack');
    const expMetrics = document.getElementById('exp-modal-metrics');

    function openExpertiseModal(key) {
        const item = expertiseData[key];
        if (!item || !expModal) return;

        expIconWrapper.innerHTML = item.iconHtml;
        expStatus.textContent = item.status;
        expCode.textContent = item.code;
        expTitle.textContent = item.title;
        expSubtitle.textContent = item.subtitle;
        expPhilosophy.textContent = item.philosophy;

        expCapabilities.innerHTML = item.capabilities.map(cap => `
            <div class="p-2.5 rounded-xl bg-white/5 border border-white/5 flex items-center gap-2 text-xs text-gray-300">
                <i data-lucide="check" class="w-3.5 h-3.5 text-emerald-400 flex-shrink-0"></i>
                <span>${escapeHtml(cap)}</span>
            </div>
        `).join('');

        expCaseStudy.textContent = item.caseStudy;

        expTechStack.innerHTML = item.techStack.map(tech => `
            <span class="px-2.5 py-1 rounded-lg bg-white/5 border border-white/5 text-xs font-mono text-gray-300">
                ${escapeHtml(tech)}
            </span>
        `).join('');

        expMetrics.innerHTML = item.metrics.map(m => `
            <div class="p-3 rounded-xl bg-white/5 border border-white/5">
                <div class="text-xl sm:text-2xl font-extrabold text-yellow-400 font-mono">${escapeHtml(m.value)}</div>
                <div class="text-[11px] text-gray-400 mt-0.5">${escapeHtml(m.label)}</div>
            </div>
        `).join('');

        expModal.classList.remove('opacity-0', 'pointer-events-none');
        expModalCard.classList.remove('scale-95');
        expModalCard.classList.add('scale-100');
        document.body.style.overflow = 'hidden';

        if (window.lucide) lucide.createIcons();
    }

    function closeExpertiseModal() {
        if (!expModal) return;
        expModal.classList.add('opacity-0', 'pointer-events-none');
        expModalCard.classList.remove('scale-100');
        expModalCard.classList.add('scale-95');
        document.body.style.overflow = '';
    }

    document.querySelectorAll('.expertise-box, .open-expertise-btn').forEach(el => {
        el.addEventListener('click', (e) => {
            const key = el.getAttribute('data-expertise') || el.closest('[data-expertise]')?.getAttribute('data-expertise');
            if (key) openExpertiseModal(key);
        });
    });

    if (closeExpIconBtn) closeExpIconBtn.addEventListener('click', closeExpertiseModal);
    if (closeExpBtn) closeExpBtn.addEventListener('click', closeExpertiseModal);
    if (expModalContactBtn) expModalContactBtn.addEventListener('click', closeExpertiseModal);

    if (expModal) {
        expModal.addEventListener('click', (e) => {
            if (e.target === expModal) closeExpertiseModal();
        });
    }

    // ================= 8. PROJECT DETAILS MODAL & DATA =================
    const projectDataTR = {
        'web-analiz': {
            badge: 'Kurumsal Çözüm',
            category: 'Web & Arayüz Mimarisi',
            iconHtml: '<img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg" alt="JavaScript" class="w-8 h-8 object-contain">',
            title: 'Web Sitesi Analizi ve Geliştirme',
            subtitle: 'Kurumsal Web Platformu Analizi, API Entegrasyonları & Slider Mimarisi',
            summary: 'Kurumsal web platformunun kullanıcı akışları ve sayfa performans analizleri gerçekleştirildi. Modern standartları karşılamak üzere sayfalar yeniden yapılandırıldı; dinamik veri akışları için RESTful API entegrasyonları kuruldu ve kod bazlı özel slider bileşenleri geliştirilerek ziyaretçi etkileşimi en üst seviyeye taşındı.',
            contributions: [
                'Kurumsal web arayüzünün frontend mimarisinin ve sayfa kullanıcı akışlarının detaylı teknik analizi',
                'Dinamik içerik sunumu ve servis iletişimi için RESTful API entegrasyonlarının kurulması',
                'Saf kod kullanılarak responsive, yüksek performanslı ve akıcı slider bileşenlerinin sıfırdan geliştirilmesi',
                'Farklı mobil, tablet ve masaüstü ekran çözünürlüklerinde kusursuz cross-browser uyumluluk testleri'
            ],
            tech: ['JavaScript (ES6+)', 'RESTful API', 'HTML5 & CSS3', 'Slider Mimarisi', 'UI/UX Optimizasyonu', 'Git'],
            metrics: [
                { standard: 'Core Web Vitals', label: 'Yüksek Hız Standardı', desc: 'LCP, FID ve sayfa performans optimizasyonu' },
                { standard: 'Cross-Browser', label: 'Kusursuz Uyumluluk', desc: 'Mobil, tablet ve tüm modern tarayıcı desteği' },
                { standard: '60 FPS Render', label: 'Donanım Hızlandırma', desc: 'Kod bazlı akıcı slider ve sıfır donma' }
            ]
        },
        'chatbot-entegrasyon': {
            badge: 'Yapay Zeka & Bot',
            category: 'Chatbot & Müşteri Deneyimi',
            iconHtml: '<svg class="w-8 h-8 fill-[#10A37F]" viewBox="0 0 24 24"><path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.872zm16.5963 3.8558L13.1038 8.364 15.1192 7.2a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.407-.667zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.4997-2.6067-1.4997Z"/></svg>',
            title: 'Akıllı Chatbot Entegrasyonu',
            subtitle: 'Kullanıcı Deneyimi Odaklı Akıllı Asistan & Uçtan Uca Entegrasyon',
            summary: 'Platform kullanıcılarının aradıkları bilgilere 7/24 anında ulaşabilmelerini ve işlemlerini hızlandırmalarını sağlayan modern bir chatbox çözümü entegre edildi. Projede hem kullanıcıyla doğrudan temas eden modern responsive ön yüz (UI) arayüzünde hem de arka planda servislerle haberleşen altyapı (backend) entegrasyonunda aktif rol alındı.',
            contributions: [
                'Kurumsal kimlikle uyumlu, responsive ve erişilebilir chatbox kullanıcı arayüzü (UI) tasarımı',
                'Kullanıcı mesajlaşma döngüsünü arka plan servislerine bağlayan asenkron API entegrasyon katmanı',
                'Kullanıcı sorgularının hızlı yanıtlanması ve ağ gecikmelerinin minimuma indirilmesi için veri akışı optimizasyonu',
                'Sistem stabilitesi ve uçtan uca kullanıcı deneyimi için hata yakalama ve geri bildirim mekanizmaları'
            ],
            tech: ['Chatbot UI/UX', 'JavaScript', 'REST API', 'Backend Entegrasyonu', 'Asenkron İletişim', 'JSON'],
            metrics: [
                { standard: 'Asenkron Akış', label: 'Modern Servis Mimarisi', desc: 'Ağ gecikmelerini önleyen dinamik veri katmanı' },
                { standard: 'Gerçek Zamanlı', label: 'Düşük Gecikme', desc: 'Anlık kullanıcı sorguları ve hızlı mesaj döngüsü' },
                { standard: 'Uçtan Uca (E2E)', label: 'Tam Entegrasyon', desc: 'Modern UI ön yüzden servis arka planına bağ' }
            ]
        },
        'sozlesme-portal': {
            badge: 'Veritabanı & Portal',
            category: 'Veritabanı Tasarımı & Kurumsal Portal',
            iconHtml: '<img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/microsoftsqlserver/microsoftsqlserver-original.svg" alt="MS SQL Server" class="w-8 h-8 object-contain">',
            title: 'Sözleşme ve Lisans Takip Portalı',
            subtitle: 'Kurumsal Sözleşme, Lisans Süreleri & İlişkisel Veritabanı Mimarisi',
            summary: 'Kurum bünyesinde kullanılan yazılım lisansları, tedarikçi sözleşmeleri ve kurumsal anlaşmaların süre bitimlerini, yenileme tarihlerini ve maliyetlerini merkezi olarak yönetmeyi sağlayan kurumsal bir portal geliştirildi. Projede ilişkisel veritabanı tasarımı, veri modelleme ve portal entegrasyon çalışmalarında kritik görevler üstlenildi.',
            contributions: [
                'Sözleşme ve lisans yaşam döngüsünü temsil eden çok tablolu ilişkisel veritabanı şemasının (MS SQL) tasarlanması',
                'Veri bütünlüğünü (referential integrity) ve normalizasyon kurallarını garanti altına alan yapı',
                'Sözleşme bitiş tarihleri öncesinde otomatik uyarı mekanizmaları için gerekli veri ve sorgu altyapısı',
                'Yönetim portalı backend servisleri ile veritabanı arasındaki CRUD ve raporlama sorgularının entegrasyonu'
            ],
            tech: ['MS SQL Server', 'Veritabanı Modelleme (ER)', 'T-SQL', 'Yönetim Portalı', 'Veri Entegrasyonu', 'Optimizasyon'],
            metrics: [
                { standard: 'Otomatik Alarm', label: 'Proaktif Takip', desc: 'Süre bitimi ve yenileme öncesi bildirim altyapısı' },
                { standard: 'ACID Uyumlu', label: 'Veri Bütünlüğü', desc: 'Referential integrity ve sıfır veri kaybı' },
                { standard: 'İlişkisel Şema', label: 'Normalizasyon', desc: '3. Normal Form kurallarına uygun çok tablolu yapı' }
            ]
        },
        'rpa-otomasyon': {
            badge: 'Süreç Otomasyonu',
            category: 'Robotik Süreç Otomasyonu (RPA)',
            iconHtml: '<img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg" alt="Python RPA" class="w-8 h-8 object-contain">',
            title: 'RPA Süreç Otomasyonu Çalışmaları',
            subtitle: 'Tekrarlayan Kurumsal Operasyonların Robotik Otonomlaştırılması',
            summary: 'Kurum içerisindeki tekrarlayan, manuel yürütülen ve zaman alan operasyonel iş süreçlerini otomatikleştirmek için kurumsal RPA uygulamaları geliştirildi. Bu sayede insan hatası tamamen ortadan kaldırıldı, iş süreçlerinin işlem hızı katlandı ve 7/24 güvenle çalışan otonom bir akış sağlandı.',
            contributions: [
                'Manuel operasyonların incelenmesi ve robotik otomasyona uygun süreç adımlarının haritalanması',
                'UiPath ile kural tabanlı robotik iş akışlarının (workflows) ve otomasyon senaryolarının kodlanması',
                'Sistemler arası veri aktarımı, dosya okuma/yazma ve otomatik kontrol adımlarının kurgulanması',
                'İstisna yönetimi (Try-Catch / Exception Handling) ile kesintisiz ve hatasız 7/24 bot çalışma güvencesi'
            ],
            tech: ['UiPath Studio', 'Python', 'RPA Botları', 'Süreç Otomasyonu', 'İş Akışı Tasarımı', 'Exception Handling'],
            metrics: [
                { standard: 'Tam Otonom', label: 'İş Süreci Otomasyonu', desc: 'İnsan müdahalesiz uçtan uca robotik akış' },
                { standard: 'Zero-Exception', label: 'Hata Toleransı', desc: 'Try-Catch ile kesintisiz ve güvenli işletim' },
                { standard: '7/24 Servis', label: 'Kesintisiz Çalışma', desc: 'Kural tabanlı otonom arka plan botları' }
            ]
        }
    };

    const projectDataEN = {
        'web-analiz': {
            badge: 'Enterprise Solution',
            category: 'Web & UI Architecture',
            iconHtml: '<img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg" alt="JavaScript" class="w-8 h-8 object-contain">',
            title: 'Website Analysis & Modernization',
            subtitle: 'Corporate Web Platform Analysis, API Integrations & Slider Architecture',
            summary: 'Conducted in-depth user flow and page performance audits for the enterprise web platform. Rebuilt pages to modern responsive standards, connected RESTful APIs for dynamic content streams, and engineered custom zero-dependency slider engines to maximize visitor engagement.',
            contributions: [
                'Technical analysis of frontend architecture and multi-step user navigation flows',
                'Integrated RESTful APIs for dynamic service communication and real-time updates',
                'Developed vanilla high-performance responsive slider components from scratch',
                'Conducted rigorous cross-browser and mobile device compatibility testing'
            ],
            tech: ['JavaScript (ES6+)', 'RESTful API', 'HTML5 & CSS3', 'Slider Mimarisi', 'UI/UX Optimizasyonu', 'Git'],
            metrics: [
                { standard: 'Core Web Vitals', label: 'High Speed Standard', desc: 'LCP, FID and page performance optimization' },
                { standard: 'Cross-Browser', label: 'Flawless Compatibility', desc: 'Full mobile, tablet, and modern browser support' },
                { standard: '60 FPS Render', label: 'Hardware Accelerated', desc: 'Fluid slider rendering with zero frame stutter' }
            ]
        },
        'chatbot-entegrasyon': {
            badge: 'AI & Bot Assistant',
            category: 'Chatbot & Customer Experience',
            iconHtml: '<svg class="w-8 h-8 fill-[#10A37F]" viewBox="0 0 24 24"><path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.872zm16.5963 3.8558L13.1038 8.364 15.1192 7.2a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.407-.667zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.4997-2.6067-1.4997Z"/></svg>',
            title: 'Intelligent Chatbot Integration',
            subtitle: 'UX-Focused Smart Assistant & End-to-End System Integration',
            summary: 'Integrated an intelligent chat assistant enabling users to instantly access corporate services 24/7. Actively contributed to both the accessible front-end user interface and the underlying asynchronous communication bridge connecting to backend services.',
            contributions: [
                'Designed brand-aligned, responsive and accessible chat interface UI',
                'Engineered asynchronous API integration layer handling message request loops',
                'Optimized data transmission flow for low network latency and rapid user feedback',
                'Implemented robust exception handling and fallback communication states'
            ],
            tech: ['Chatbot UI/UX', 'JavaScript', 'REST API', 'Backend Entegrasyonu', 'Asenkron İletişim', 'JSON'],
            metrics: [
                { standard: 'Async Pipeline', label: 'Modern Service Stack', desc: 'Dynamic data layer preventing network latency' },
                { standard: 'Real-Time', label: 'Ultra Low Latency', desc: 'Sub-second response cycle for user queries' },
                { standard: 'End-to-End (E2E)', label: 'Full System Bridge', desc: 'Seamless link between modern UI and backend APIs' }
            ]
        },
        'sozlesme-portal': {
            badge: 'Database & Portal',
            category: 'Database Design & Enterprise Portal',
            iconHtml: '<img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/microsoftsqlserver/microsoftsqlserver-original.svg" alt="MS SQL Server" class="w-8 h-8 object-contain">',
            title: 'Contract & License Tracking Portal',
            subtitle: 'Enterprise Contracts, License Lifecycles & Relational Database Architecture',
            summary: 'Engineered an internal management portal to centralize software licenses, vendor contracts, expiration schedules, and procurement costs. Spearheaded relational database schema modeling, data integrity constraints, and portal integration queries.',
            contributions: [
                'Designed multi-table relational schema on MS SQL representing contract lifecycle',
                'Enforced strict referential integrity and normalization standards (3NF)',
                'Structured automated alerting queries for upcoming contract expirations',
                'Integrated high-throughput CRUD and analytics queries with portal backend services'
            ],
            tech: ['MS SQL Server', 'Veritabanı Modelleme (ER)', 'T-SQL', 'Yönetim Portalı', 'Veri Entegrasyonu', 'Optimizasyon'],
            metrics: [
                { standard: 'Automated Alert', label: 'Proactive Monitoring', desc: 'Advance notifications prior to contract renewals' },
                { standard: 'ACID Compliant', label: 'Data Integrity', desc: 'Full relational constraints and zero data loss' },
                { standard: 'Relational 3NF', label: 'Normalized Schema', desc: 'Optimized multi-table relational architecture' }
            ]
        },
        'rpa-otomasyon': {
            badge: 'Process Automation',
            category: 'Robotic Process Automation (RPA)',
            iconHtml: '<img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg" alt="Python RPA" class="w-8 h-8 object-contain">',
            title: 'Enterprise RPA Process Automation',
            subtitle: 'Robotic Automation of Repetitive Corporate Workflows',
            summary: 'Engineered corporate Robotic Process Automation (RPA) bots to automate repetitive, manual, and high-volume operational workflows. Eliminated human errors completely, multiplied operational velocity, and delivered 24/7 uninterrupted autonomous processing.',
            contributions: [
                'Mapped and analyzed operational business steps for robotic automation suitability',
                'Programmed rule-based workflows and error-handling automation routines in UiPath',
                'Automated cross-system data transfer, document parsing, and file validation steps',
                'Engineered resilient exception handling (Try-Catch) for 24/7 zero-error operation'
            ],
            tech: ['UiPath Studio', 'Python', 'RPA Botları', 'Süreç Otomasyonu', 'İş Akışı Tasarımı', 'Exception Handling'],
            metrics: [
                { standard: 'Autonomous', label: 'Full Process Automation', desc: 'End-to-end bot execution with zero human intervention' },
                { standard: 'Zero-Exception', label: 'High Fault Tolerance', desc: 'Try-Catch architecture ensuring reliable 24/7 uptime' },
                { standard: '24/7 Operations', label: 'Always-On Execution', desc: 'Rule-based autonomous background robotic workflows' }
            ]
        }
    };

    let projectData = (activeLang === 'en' ? projectDataEN : projectDataTR);

    const projModal = document.getElementById('project-modal');
    const projModalCard = document.getElementById('project-modal-card');
    const closeProjIconBtn = document.getElementById('close-project-modal');
    const closeProjBtn = document.getElementById('close-project-modal-btn');
    const projModalContactBtn = document.getElementById('proj-modal-contact-btn');

    const projIconWrapper = document.getElementById('proj-modal-icon-wrapper');
    const projBadge = document.getElementById('proj-modal-badge');
    const projCategory = document.getElementById('proj-modal-category');
    const projTitle = document.getElementById('proj-modal-title');
    const projSubtitle = document.getElementById('proj-modal-subtitle');
    const projSummary = document.getElementById('proj-modal-summary');
    const projContributions = document.getElementById('proj-modal-contributions');
    const projTech = document.getElementById('proj-modal-tech');
    const projMetrics = document.getElementById('proj-modal-metrics');

    // Tech Logo Mapping & Badge Generator
    const techLogoMap = {
        'JavaScript (ES6+)': '<img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg" alt="JS" class="tech-badge-icon" loading="lazy">',
        'JavaScript': '<img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg" alt="JS" class="tech-badge-icon" loading="lazy">',
        'RESTful API': '<img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/postman/postman-original.svg" alt="REST" class="tech-badge-icon" loading="lazy">',
        'REST API': '<img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/postman/postman-original.svg" alt="REST" class="tech-badge-icon" loading="lazy">',
        'HTML5 & CSS3': '<img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/html5/html5-original.svg" alt="HTML5" class="tech-badge-icon" loading="lazy">',
        'HTML5/CSS3': '<img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/html5/html5-original.svg" alt="HTML5" class="tech-badge-icon" loading="lazy">',
        'Tailwind CSS': '<img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg" alt="Tailwind" class="tech-badge-icon" loading="lazy">',
        'Slider Mimarisi': '<svg class="tech-badge-icon text-yellow-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M10 4v16"/><path d="M14 4v16"/></svg>',
        'UI/UX Optimizasyonu': '<img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/figma/figma-original.svg" alt="Figma" class="tech-badge-icon" loading="lazy">',
        'Git': '<img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/git/git-original.svg" alt="Git" class="tech-badge-icon" loading="lazy">',
        'Chatbot UI/UX': '<svg class="tech-badge-icon fill-[#10A37F]" viewBox="0 0 24 24"><path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.872zm16.5963 3.8558L13.1038 8.364 15.1192 7.2a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.407-.667zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.4997-2.6067-1.4997Z"/></svg>',
        'Backend Entegrasyonu': '<img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-original.svg" alt="Backend" class="tech-badge-icon" loading="lazy">',
        'Asenkron İletişim': '<svg class="tech-badge-icon text-cyan-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>',
        'JSON': '<img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/json/json-original.svg" alt="JSON" class="tech-badge-icon" loading="lazy">',
        'MS SQL Server': '<img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/microsoftsqlserver/microsoftsqlserver-original.svg" alt="SQL" class="tech-badge-icon" loading="lazy">',
        'MS SQL': '<img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/microsoftsqlserver/microsoftsqlserver-original.svg" alt="SQL" class="tech-badge-icon" loading="lazy">',
        'Veritabanı Modelleme (ER)': '<svg class="tech-badge-icon text-yellow-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>',
        'T-SQL': '<img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/microsoftsqlserver/microsoftsqlserver-original.svg" alt="T-SQL" class="tech-badge-icon" loading="lazy">',
        'Yönetim Portalı': '<svg class="tech-badge-icon text-yellow-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>',
        'Veri Entegrasyonu': '<svg class="tech-badge-icon text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/></svg>',
        'Optimizasyon': '<svg class="tech-badge-icon text-yellow-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="m16.2 7.8-4.7 4.7"/><circle cx="12" cy="12" r="1"/></svg>',
        'UiPath Studio': '<svg class="tech-badge-icon" viewBox="0 0 24 24" fill="#FA4616"><path d="M0 7.882v8.235h8.235V7.882H0Zm.852.852h6.53v6.53H.852v-6.53Zm22.268.695c-.514 0-.886.345-.886.873 0 .511.36.878.886.878.518 0 .88-.359.88-.878 0-.521-.359-.873-.88-.873Zm-17.023.055a.501.501 0 0 0-.522.522c0 .302.22.509.522.509.302 0 .522-.206.522-.509a.501.501 0 0 0-.522-.522Zm17.023.102c.437 0 .716.278.716.716 0 .426-.274.712-.716.712-.426 0-.719-.271-.719-.712 0-.44.278-.716.719-.716Zm-.347.213v.988h.197v-.318h.14l.176.318h.22l-.186-.347a.32.32 0 0 0 .206-.311c0-.203-.159-.33-.374-.33h-.379Zm-3.74.002v4.468h.853v-1.774c0-.571.302-.914.804-.914s.763.33.763.838v1.85h.852v-1.946c0-.88-.619-1.45-1.409-1.45-.509 0-.818.192-1.01.515V9.801h-.853Zm3.937.157h.157c.115 0 .193.064.193.171 0 .118-.078.181-.193.181h-.157v-.352Zm-21.375.049v2.495c0 1.141.625 1.808 1.684 1.808 1.079 0 1.718-.681 1.718-1.808v-2.495h-.852v2.495c0 .646-.275 1.004-.846 1.004-.591 0-.852-.378-.852-1.004v-2.495h-.852Zm7.547 0v4.262h.852v-1.375h.77c.928 0 1.533-.543 1.533-1.457 0-.88-.591-1.43-1.533-1.43H9.142Zm7.809 0v.914h-.399v.722h.399v1.45c0 .791.35 1.176 1.161 1.176h.447v-.729h-.337c-.33 0-.419-.144-.419-.44v-1.457h.749v-.722h-.749v-.914h-.852Zm-6.957.687h.681c.488 0 .756.276.756.743 0 .502-.268.776-.756.776h-.681v-1.519Zm4.138.186c-.921 0-1.546.728-1.546 1.718 0 .997.639 1.712 1.546 1.712.537 0 .887-.193 1.086-.516v.475h.853v-3.348h-.853v.523c-.206-.344-.563-.564-1.086-.564Zm-8.461.041v3.348h.852v-3.348h-.852Zm8.661.701c.543 0 .886.399.886.976 0 .585-.364.963-.886.963-.578 0-.88-.406-.88-.963 0-.598.337-.976.88-.976Z"/></svg>',
        'UiPath': '<svg class="tech-badge-icon" viewBox="0 0 24 24" fill="#FA4616"><path d="M0 7.882v8.235h8.235V7.882H0Zm.852.852h6.53v6.53H.852v-6.53Zm22.268.695c-.514 0-.886.345-.886.873 0 .511.36.878.886.878.518 0 .88-.359.88-.878 0-.521-.359-.873-.88-.873Zm-17.023.055a.501.501 0 0 0-.522.522c0 .302.22.509.522.509.302 0 .522-.206.522-.509a.501.501 0 0 0-.522-.522Zm17.023.102c.437 0 .716.278.716.716 0 .426-.274.712-.716.712-.426 0-.719-.271-.719-.712 0-.44.278-.716.719-.716Zm-.347.213v.988h.197v-.318h.14l.176.318h.22l-.186-.347a.32.32 0 0 0 .206-.311c0-.203-.159-.33-.374-.33h-.379Zm-3.74.002v4.468h.853v-1.774c0-.571.302-.914.804-.914s.763.33.763.838v1.85h.852v-1.946c0-.88-.619-1.45-1.409-1.45-.509 0-.818.192-1.01.515V9.801h-.853Zm3.937.157h.157c.115 0 .193.064.193.171 0 .118-.078.181-.193.181h-.157v-.352Zm-21.375.049v2.495c0 1.141.625 1.808 1.684 1.808 1.079 0 1.718-.681 1.718-1.808v-2.495h-.852v2.495c0 .646-.275 1.004-.846 1.004-.591 0-.852-.378-.852-1.004v-2.495h-.852Zm7.547 0v4.262h.852v-1.375h.77c.928 0 1.533-.543 1.533-1.457 0-.88-.591-1.43-1.533-1.43H9.142Zm7.809 0v.914h-.399v.722h.399v1.45c0 .791.35 1.176 1.161 1.176h.447v-.729h-.337c-.33 0-.419-.144-.419-.44v-1.457h.749v-.722h-.749v-.914h-.852Zm-6.957.687h.681c.488 0 .756.276.756.743 0 .502-.268.776-.756.776h-.681v-1.519Zm4.138.186c-.921 0-1.546.728-1.546 1.718 0 .997.639 1.712 1.546 1.712.537 0 .887-.193 1.086-.516v.475h.853v-3.348h-.853v.523c-.206-.344-.563-.564-1.086-.564Zm-8.461.041v3.348h.852v-3.348h-.852Zm8.661.701c.543 0 .886.399.886.976 0 .585-.364.963-.886.963-.578 0-.88-.406-.88-.963 0-.598.337-.976.88-.976Z"/></svg>',
        'Python': '<img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg" alt="Python" class="tech-badge-icon" loading="lazy">',
        'RPA Botları': '<svg class="tech-badge-icon text-yellow-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="12" cy="5" r="2"/><path d="M12 7v4"/><line x1="8" y1="16" x2="8.01" y2="16"/><line x1="16" y1="16" x2="16.01" y2="16"/></svg>',
        'Süreç Otomasyonu': '<svg class="tech-badge-icon text-cyan-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>',
        'İş Akışı Tasarımı': '<svg class="tech-badge-icon text-purple-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="6" y1="3" x2="6" y2="15"/><circle cx="18" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M18 9a9 9 0 0 1-9 9"/></svg>',
        'Exception Handling': '<svg class="tech-badge-icon text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>'
    };

    function createTechBadgeHtml(tech) {
        const icon = techLogoMap[tech] || '<span class="w-3.5 h-3.5 rounded-full bg-yellow-400/20 text-yellow-400 flex items-center justify-center text-[9px] font-bold">#</span>';
        return `
            <div class="showcase-tech-badge">
                ${icon}
                <span class="text-xs font-mono font-medium text-gray-200">${escapeHtml(tech)}</span>
            </div>
        `;
    }

    function renderShowcaseMarquee(techList) {
        if (!Array.isArray(techList)) return '';
        const singleSet = techList.map(createTechBadgeHtml).join('');
        return singleSet + singleSet;
    }

    function openProjectModal(key) {
        const item = projectData[key];
        if (!item || !projModal) return;

        projIconWrapper.innerHTML = item.iconHtml;
        projBadge.textContent = item.badge;
        projCategory.textContent = item.category;
        projTitle.textContent = item.title;
        projSubtitle.textContent = item.subtitle;
        projSummary.textContent = item.summary;

        projContributions.innerHTML = (item.contributions || []).map((c, idx) => `
            <div class="p-3.5 rounded-2xl bg-white/[0.03] hover:bg-yellow-400/[0.04] border border-white/[0.07] hover:border-yellow-400/35 transition-all duration-300 group flex flex-col justify-between">
                <div class="flex items-center justify-between gap-2 mb-1.5">
                    <span class="text-[10px] font-mono font-bold text-yellow-400/80 group-hover:text-yellow-400">0${idx + 1} // MİMARİ ADIM</span>
                    <i data-lucide="check" class="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 group-hover:scale-110 transition-transform"></i>
                </div>
                <p class="text-xs text-gray-300 leading-relaxed group-hover:text-gray-100 transition-colors">${escapeHtml(c)}</p>
            </div>
        `).join('');

        projTech.innerHTML = (item.tech || []).map(createTechBadgeHtml).join('');

        projMetrics.innerHTML = (item.metrics || []).map(m => `
            <div class="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-b from-white/[0.05] to-white/[0.01] border border-white/10 hover:border-yellow-400/40 relative overflow-hidden group transition-all duration-300 text-center flex flex-col justify-center">
                <div class="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-yellow-400/30 to-transparent group-hover:via-yellow-400 transition-all"></div>
                <div class="text-sm sm:text-base font-extrabold text-yellow-400 font-mono tracking-tight group-hover:text-yellow-300 transition-colors uppercase py-0.5">${escapeHtml(m.standard)}</div>
                <div class="text-xs font-bold text-white mt-1">${escapeHtml(m.label)}</div>
                <div class="text-[11px] text-gray-400 mt-0.5 leading-snug">${escapeHtml(m.desc)}</div>
            </div>
        `).join('');

        projModal.classList.remove('opacity-0', 'pointer-events-none');
        projModalCard.classList.remove('scale-95');
        projModalCard.classList.add('scale-100');
        document.body.style.overflow = 'hidden';

        if (window.lucide) lucide.createIcons();
    }

    function closeProjectModal() {
        if (!projModal) return;
        projModal.classList.add('opacity-0', 'pointer-events-none');
        projModalCard.classList.remove('scale-100');
        projModalCard.classList.add('scale-95');
        document.body.style.overflow = '';
    }

    function attachProjectCardListeners() {
        document.querySelectorAll('.project-card, .open-project-btn').forEach(el => {
            el.onclick = (e) => {
                const card = el.closest('[data-project]');
                const key = card ? card.getAttribute('data-project') : el.getAttribute('data-project');
                if (key) openProjectModal(key);
            };
        });
    }

    attachProjectCardListeners();

    if (closeProjIconBtn) closeProjIconBtn.addEventListener('click', closeProjectModal);
    if (closeProjBtn) closeProjBtn.addEventListener('click', closeProjectModal);
    if (projModalContactBtn) projModalContactBtn.addEventListener('click', closeProjectModal);

    if (projModal) {
        projModal.addEventListener('click', (e) => {
            if (e.target === projModal) closeProjectModal();
        });
    }

    // ================= 9. INTERACTIVE PROJECT TAB SHOWCASE =================
    const showcaseCard = document.getElementById('showcase-card');
    const showcaseCategory = document.getElementById('showcase-category');
    const showcaseTitle = document.getElementById('showcase-title');
    const showcaseSubtitle = document.getElementById('showcase-subtitle');
    const showcaseSummary = document.getElementById('showcase-summary');
    const showcasePoints = document.getElementById('showcase-points');
    const showcaseTech = document.getElementById('showcase-tech');
    const showcaseOpenModalBtn = document.getElementById('showcase-open-modal-btn');

    let currentActiveProjectKey = 'web-analiz';

    function updateShowcase(key) {
        const item = projectData[key];
        if (!item || !showcaseCard) return;

        currentActiveProjectKey = key;

        showcaseCard.classList.add('opacity-50');
        setTimeout(() => {
            if (showcaseCategory) showcaseCategory.textContent = item.category;
            if (showcaseTitle) showcaseTitle.textContent = item.title;
            if (showcaseSubtitle) showcaseSubtitle.textContent = item.subtitle;
            if (showcaseSummary) showcaseSummary.textContent = item.summary;

            if (showcasePoints) {
                showcasePoints.innerHTML = (item.contributions || []).slice(0, 3).map(pt => `
                    <div class="flex items-center gap-2 text-xs text-gray-300">
                        <i data-lucide="check-circle-2" class="w-3.5 h-3.5 text-yellow-400 flex-shrink-0"></i>
                        <span class="truncate">${escapeHtml(pt)}</span>
                    </div>
                `).join('');
            }

            if (showcaseTech) {
                showcaseTech.innerHTML = renderShowcaseMarquee(item.tech);
            }

            if (window.lucide) lucide.createIcons();
            showcaseCard.classList.remove('opacity-50');
        }, 120);
    }

    function attachProjectTabListeners() {
        const tabs = document.querySelectorAll('.project-tab-btn');
        tabs.forEach(tab => {
            tab.onclick = () => {
                const key = tab.getAttribute('data-project');
                if (!key || key === currentActiveProjectKey) return;

                tabs.forEach(t => {
                    t.classList.remove('active');
                    const arrow = t.querySelector('.tab-arrow');
                    if (arrow) {
                        arrow.classList.remove('text-yellow-400');
                        arrow.classList.add('text-gray-500');
                    }
                });

                tab.classList.add('active');
                const arrow = tab.querySelector('.tab-arrow');
                if (arrow) {
                    arrow.classList.add('text-yellow-400');
                    arrow.classList.remove('text-gray-500');
                }

                updateShowcase(key);
            };
        });
    }

    attachProjectTabListeners();

    if (showcaseOpenModalBtn) {
        showcaseOpenModalBtn.addEventListener('click', () => {
            openProjectModal(currentActiveProjectKey);
        });
    }

    // Unified ESC listener
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeModal();
            closeExpertiseModal();
            closeProjectModal();
        }
    });

    // ================= DUAL LANGUAGE CONTROLLER =================
    function setLanguage(lang) {
        if (lang !== 'tr' && lang !== 'en') lang = 'tr';
        localStorage.setItem('agy_lang', lang);
        window.currentLang = lang;
        activeLang = lang;

        // Button styles
        const btnTr = document.getElementById('lang-btn-tr');
        const btnEn = document.getElementById('lang-btn-en');
        if (btnTr && btnEn) {
            if (lang === 'tr') {
                btnTr.className = 'px-2.5 py-1 rounded-full text-black bg-yellow-400 font-bold transition-all cursor-pointer';
                btnEn.className = 'px-2.5 py-1 rounded-full text-gray-400 hover:text-white font-medium transition-all cursor-pointer';
            } else {
                btnEn.className = 'px-2.5 py-1 rounded-full text-black bg-yellow-400 font-bold transition-all cursor-pointer';
                btnTr.className = 'px-2.5 py-1 rounded-full text-gray-400 hover:text-white font-medium transition-all cursor-pointer';
            }
        }

        const t = i18nData[lang] || i18nData.tr;

        // Navbar
        const navMap = {
            'nav-link-hero': t.nav.hero,
            'nav-link-about': t.nav.about,
            'nav-link-skills': t.nav.skills,
            'nav-link-experience': t.nav.experience,
            'nav-link-projects': t.nav.projects,
            'nav-link-contact': t.nav.contact,
            'nav-contact-btn': t.nav.contactBtn
        };
        Object.entries(navMap).forEach(([id, text]) => {
            const el = document.getElementById(id);
            if (el) el.textContent = text;
        });

        // Hero
        const heroPrefix = document.getElementById('hero-typewriter-prefix');
        if (heroPrefix) heroPrefix.textContent = t.hero.prefix;

        const heroBio = document.getElementById('hero-bio');
        if (heroBio) heroBio.innerHTML = t.hero.bio;

        const heroCvBtnText = document.getElementById('hero-cv-btn-text');
        if (heroCvBtnText) heroCvBtnText.textContent = t.hero.cvBtn;

        const heroScroll = document.getElementById('hero-scroll-text');
        if (heroScroll) heroScroll.textContent = t.hero.scroll;

        // Typewriter
        updateTypewriterRoles(t.hero.roles);

        // About
        const aboutTitle = document.getElementById('about-section-title');
        if (aboutTitle) aboutTitle.textContent = t.about.title;

        const aboutBadges = document.getElementById('about-badges-container');
        if (aboutBadges && Array.isArray(t.about.badges)) {
            aboutBadges.innerHTML = t.about.badges.map((badge, idx) => `
                <span class="px-3.5 py-1 rounded-full bg-yellow-400/10 border border-yellow-400/30 text-yellow-400 font-semibold">
                    ${escapeHtml(badge)}
                </span>
                ${idx < t.about.badges.length - 1 ? '<span class="text-yellow-400/40">•</span>' : ''}
            `).join('');
        }

        const aboutP1 = document.getElementById('about-p1');
        if (aboutP1) aboutP1.innerHTML = t.about.p1;

        const aboutP2 = document.getElementById('about-p2');
        if (aboutP2) aboutP2.innerHTML = t.about.p2;

        // Skills
        const skillsTitle = document.getElementById('skills-section-title');
        if (skillsTitle) skillsTitle.textContent = t.skills.title;

        // Experience
        const expTitle = document.getElementById('exp-section-title');
        if (expTitle) expTitle.textContent = t.experience.title;

        const expRole = document.getElementById('exp-role');
        if (expRole) expRole.textContent = t.experience.role;

        const expComp = document.getElementById('exp-company');
        if (expComp) expComp.textContent = t.experience.company;

        const expDept = document.getElementById('exp-dept');
        if (expDept) expDept.textContent = t.experience.dept;

        const expPeriod = document.getElementById('exp-period');
        if (expPeriod) expPeriod.textContent = t.experience.period;

        const expDesc = document.getElementById('exp-desc');
        if (expDesc) expDesc.textContent = t.experience.desc;

        const pillarsContainer = document.getElementById('exp-pillars-container');
        if (pillarsContainer && Array.isArray(t.experience.pillars)) {
            pillarsContainer.innerHTML = t.experience.pillars.map(p => `
                <div class="p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex items-start gap-3 hover:border-yellow-400/30 hover:bg-yellow-400/[0.02] transition-all">
                    <div class="w-8 h-8 rounded-xl bg-yellow-400/10 border border-yellow-400/20 flex items-center justify-center flex-shrink-0 text-yellow-400">
                        <i data-lucide="${escapeHtml(p.icon || 'star')}" class="w-4 h-4"></i>
                    </div>
                    <div>
                        <span class="text-xs sm:text-sm font-bold text-white block">${escapeHtml(p.title)}</span>
                        <span class="text-xs text-gray-400 mt-0.5 block leading-relaxed">${escapeHtml(p.desc)}</span>
                    </div>
                </div>
            `).join('');
        }

        // Projects
        const projTitle = document.getElementById('projects-section-title');
        if (projTitle) projTitle.textContent = t.projects.title;

        projectData = (lang === 'en' ? projectDataEN : projectDataTR);
        techDetails = (lang === 'en' ? techDetailsEN : techDetailsTR);
        expertiseData = (lang === 'en' ? expertiseDataEN : expertiseDataTR);

        // Update project tab buttons
        document.querySelectorAll('.project-tab-btn').forEach(btn => {
            const key = btn.getAttribute('data-project');
            const p = projectData[key];
            if (p) {
                const titleEl = btn.querySelector('h3');
                const subEl = btn.querySelector('p');
                if (titleEl) titleEl.textContent = p.title;
                if (subEl) subEl.textContent = p.subtitle;
            }
        });

        // Update active project showcase card
        updateShowcase(currentActiveProjectKey);

        // Contact section
        const cBadge = document.getElementById('contact-section-badge');
        if (cBadge) cBadge.textContent = t.contact.badge;

        const cTitle = document.getElementById('contact-section-title');
        if (cTitle) cTitle.textContent = t.contact.title;

        const cSub = document.getElementById('contact-section-subtitle');
        if (cSub) cSub.textContent = t.contact.subtitle;

        const cStatBadge = document.getElementById('contact-status-badge');
        if (cStatBadge) cStatBadge.textContent = t.contact.statusBadge;

        const cStatTitle = document.getElementById('contact-status-title');
        if (cStatTitle) cStatTitle.textContent = t.contact.statusTitle;

        const cStatDesc = document.getElementById('contact-status-desc');
        if (cStatDesc) cStatDesc.textContent = t.contact.statusDesc;

        const cLoc = document.getElementById('contact-location-val');
        if (cLoc) cLoc.textContent = t.contact.locationVal;

        const cSla = document.getElementById('contact-sla-val');
        if (cSla) cSla.innerHTML = t.contact.slaVal;

        // Contact Form
        const fTitle = document.getElementById('form-title');
        if (fTitle) fTitle.textContent = t.contact.formTitle;

        const fSub = document.getElementById('form-subtitle');
        if (fSub) fSub.textContent = t.contact.formSubtitle;

        const fTopicLabel = document.getElementById('form-topic-label');
        if (fTopicLabel) fTopicLabel.textContent = t.contact.formTopicLabel;

        // Topic chips
        const chips = document.querySelectorAll('.topic-chip');
        if (chips.length === t.contact.topics.length) {
            chips.forEach((chip, idx) => {
                chip.textContent = t.contact.topics[idx];
                chip.setAttribute('data-topic', t.contact.topics[idx]);
            });
            const selTopicInput = document.getElementById('selected-topic');
            const actChip = document.querySelector('.topic-chip.active');
            if (selTopicInput && actChip) {
                selTopicInput.value = actChip.getAttribute('data-topic');
            }
        }

        const lName = document.getElementById('label-name');
        if (lName) lName.textContent = t.contact.labelName;
        const iName = document.getElementById('contact-name');
        if (iName) iName.placeholder = t.contact.placeholderName;

        const lEmail = document.getElementById('label-email');
        if (lEmail) lEmail.textContent = t.contact.labelEmail;
        const iEmail = document.getElementById('contact-email');
        if (iEmail) iEmail.placeholder = t.contact.placeholderEmail;

        const lSubj = document.getElementById('label-subject');
        if (lSubj) lSubj.textContent = t.contact.labelSubject;
        const iSubj = document.getElementById('contact-subject');
        if (iSubj) iSubj.placeholder = t.contact.placeholderSubject;

        const lMsg = document.getElementById('label-message');
        if (lMsg) lMsg.textContent = t.contact.labelMessage;
        const iMsg = document.getElementById('contact-message');
        if (iMsg) iMsg.placeholder = t.contact.placeholderMessage;

        const btnSubmit = document.getElementById('form-submit-btn-text');
        if (btnSubmit) btnSubmit.textContent = t.contact.submitBtn;

        const pPrivacy = document.getElementById('form-privacy-text');
        if (pPrivacy) pPrivacy.textContent = t.contact.privacyText;

        // Footer
        const foot = document.getElementById('footer-text');
        if (foot) foot.textContent = t.footer;

        if (window.lucide) lucide.createIcons();
    }

    const langBtnTr = document.getElementById('lang-btn-tr');
    const langBtnEn = document.getElementById('lang-btn-en');
    if (langBtnTr) langBtnTr.addEventListener('click', () => setLanguage('tr'));
    if (langBtnEn) langBtnEn.addEventListener('click', () => setLanguage('en'));
    window.setLanguage = setLanguage;

    // Initialize Language
    setLanguage(activeLang);

    // ================= 10. DYNAMIC DATA HYDRATION & LIVE SYNC ENGINE =================

    // Helper: Escape HTML
    function escapeHtml(str) {
        if (!str) return '';
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    // Helper: Project Icon Picker
    function getProjectIconHtml(proj, sizeClass = 'w-8 h-8') {
        const cat = (proj.category || '').toLowerCase();
        const title = (proj.title || '').toLowerCase();
        const techs = (proj.techStack || []).join(' ').toLowerCase();

        if (cat.includes('rpa') || title.includes('rpa') || techs.includes('uipath')) {
            return `<svg class="${sizeClass}" viewBox="0 0 24 24" fill="#FA4616"><path d="M0 7.882v8.235h8.235V7.882H0Zm.852.852h6.53v6.53H.852v-6.53Zm22.268.695c-.514 0-.886.345-.886.873 0 .511.36.878.886.878.518 0 .88-.359.88-.878 0-.521-.359-.873-.88-.873Zm-17.023.055a.501.501 0 0 0-.522.522c0 .302.22.509.522.509.302 0 .522-.206.522-.509a.501.501 0 0 0-.522-.522Zm17.023.102c.437 0 .716.278.716.716 0 .426-.274.712-.716.712-.426 0-.719-.271-.719-.712 0-.44.278-.716.719-.716Zm-.347.213v.988h.197v-.318h.14l.176.318h.22l-.186-.347a.32.32 0 0 0 .206-.311c0-.203-.159-.33-.374-.33h-.379Zm-3.74.002v4.468h.853v-1.774c0-.571.302-.914.804-.914s.763.33.763.838v1.85h.852v-1.946c0-.88-.619-1.45-1.409-1.45-.509 0-.818.192-1.01.515V9.801h-.853Zm3.937.157h.157c.115 0 .193.064.193.171 0 .118-.078.181-.193.181h-.157v-.352Zm-21.375.049v2.495c0 1.141.625 1.808 1.684 1.808 1.079 0 1.718-.681 1.718-1.808v-2.495h-.852v2.495c0 .646-.275 1.004-.846 1.004-.591 0-.852-.378-.852-1.004v-2.495h-.852Zm7.547 0v4.262h.852v-1.375h.77c.928 0 1.533-.543 1.533-1.457 0-.88-.591-1.43-1.533-1.43H9.142Zm7.809 0v.914h-.399v.722h.399v1.45c0 .791.35 1.176 1.161 1.176h.447v-.729h-.337c-.33 0-.419-.144-.419-.44v-1.457h.749v-.722h-.749v-.914h-.852Zm-6.957.687h.681c.488 0 .756.276.756.743 0 .502-.268.776-.756.776h-.681v-1.519Zm4.138.186c-.921 0-1.546.728-1.546 1.718 0 .997.639 1.712 1.546 1.712.537 0 .887-.193 1.086-.516v.475h.853v-3.348h-.853v.523c-.206-.344-.563-.564-1.086-.564Zm-8.461.041v3.348h.852v-3.348h-.852Zm8.661.701c.543 0 .886.399.886.976 0 .585-.364.963-.886.963-.578 0-.88-.406-.88-.963 0-.598.337-.976.88-.976Z"/></svg>`;
        }
        if (cat.includes('chat') || title.includes('chat') || cat.includes('nlp')) {
            return `<svg class="${sizeClass} fill-[#10A37F]" viewBox="0 0 24 24"><path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.872zm16.5963 3.8558L13.1038 8.364 15.1192 7.2a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.407-.667zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.4997-2.6067-1.4997Z"/></svg>`;
        }
        if (cat.includes('veri') || cat.includes('sql') || techs.includes('sql')) {
            return `<img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/microsoftsqlserver/microsoftsqlserver-original.svg" alt="SQL" class="${sizeClass} object-contain">`;
        }
        return `<img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg" alt="Web" class="${sizeClass} object-contain">`;
    }

    // 10.1 Hydrate Profile & Hero & Contact
    function applyProfileData(profile) {
        if (!profile) return;

        // Brand Name
        const brandNameEl = document.getElementById('brand-name');
        if (brandNameEl && profile.name) brandNameEl.textContent = profile.name;

        // Hero Name
        const heroNameEl = document.getElementById('hero-name');
        if (heroNameEl && profile.name) heroNameEl.textContent = profile.name;

        // Hero Typewriter Roles
        if (Array.isArray(profile.roles) && profile.roles.length > 0) {
            updateTypewriterRoles(profile.roles);
        }

        // Hero Bio
        const heroBioEl = document.getElementById('hero-bio');
        if (heroBioEl && profile.bioText) {
            heroBioEl.innerHTML = escapeHtml(profile.bioText)
                .replace(/(yüksek performanslı)/gi, '<span class="text-yellow-400 font-semibold">$1</span>')
                .replace(/(modern dijital çözümler)/gi, '<span class="text-white font-medium">$1</span>');
        }

        // Hero Quote
        const heroQuoteEl = document.getElementById('hero-quote');
        if (heroQuoteEl && profile.quote) {
            heroQuoteEl.textContent = `"${profile.quote}"`;
        }

        // Hero Buttons & Social
        const heroCvBtn = document.getElementById('hero-cv-btn');
        if (heroCvBtn) {
            heroCvBtn.setAttribute('href', profile.cvUrl || 'assets/cv/salahattin-acikgoz-cv.pdf');
            heroCvBtn.setAttribute('download', 'Salahattin_Acikgoz_CV.pdf');
        }

        const heroGhLink = document.getElementById('hero-github-link');
        if (heroGhLink && profile.github) heroGhLink.setAttribute('href', profile.github);

        const heroLiLink = document.getElementById('hero-linkedin-link');
        if (heroLiLink && profile.linkedin) heroLiLink.setAttribute('href', profile.linkedin);

        const copyEmailBtn = document.getElementById('copy-email-btn');
        if (copyEmailBtn && profile.email) copyEmailBtn.setAttribute('data-email', profile.email);
        const copyContactEmailBtn = document.getElementById('copy-contact-email');
        if (copyContactEmailBtn && profile.email) copyContactEmailBtn.setAttribute('data-email', profile.email);

        // About Badges
        const aboutBadgesContainer = document.getElementById('about-badges-container');
        if (aboutBadgesContainer && Array.isArray(profile.aboutBadges)) {
            aboutBadgesContainer.innerHTML = profile.aboutBadges.map((badge, idx) => `
                <span class="px-3.5 py-1 rounded-full bg-yellow-400/10 border border-yellow-400/30 text-yellow-400 font-semibold">
                    ${escapeHtml(badge)}
                </span>
                ${idx < profile.aboutBadges.length - 1 ? '<span class="text-yellow-400/40">•</span>' : ''}
            `).join('');
        }

        // About Paragraphs
        const aboutP1El = document.getElementById('about-p1');
        if (aboutP1El && profile.aboutP1) {
            aboutP1El.innerHTML = escapeHtml(profile.aboutP1)
                .replace(/(Salahattin Açıkgöz)/gi, '<strong class="text-white font-bold">$1</strong>');
        }
        const aboutP2El = document.getElementById('about-p2');
        if (aboutP2El && profile.aboutP2) {
            aboutP2El.innerHTML = escapeHtml(profile.aboutP2)
                .replace(/(UiPath)/gi, '<span class="text-yellow-400 font-semibold">$1</span>')
                .replace(/(Python)/gi, '<span class="text-yellow-400 font-semibold">$1</span>')
                .replace(/(REST\/SOAP API)/gi, '<span class="text-cyan-400 font-semibold">$1</span>')
                .replace(/(SQL mimarileri)/gi, '<span class="text-purple-400 font-semibold">$1</span>');
        }

        // Contact Section Status & Channels
        const contactStatusBadge = document.getElementById('contact-status-badge');
        if (contactStatusBadge && profile.statusBadge) contactStatusBadge.textContent = profile.statusBadge;

        const contactStatusTitle = document.getElementById('contact-status-title');
        if (contactStatusTitle && profile.statusTitle) contactStatusTitle.textContent = profile.statusTitle;

        const contactStatusDesc = document.getElementById('contact-status-desc');
        if (contactStatusDesc && profile.statusDesc) contactStatusDesc.textContent = profile.statusDesc;

        const contactEmailVal = document.getElementById('contact-email-val');
        if (contactEmailVal && profile.email) contactEmailVal.textContent = profile.email;

        const contactLinkedinLink = document.getElementById('contact-linkedin-link');
        const contactLinkedinVal = document.getElementById('contact-linkedin-val');
        if (contactLinkedinLink && profile.linkedin) {
            contactLinkedinLink.setAttribute('href', profile.linkedin);
            if (contactLinkedinVal) contactLinkedinVal.textContent = profile.linkedin.replace(/^https?:\/\//i, '');
        }

        const contactGithubLink = document.getElementById('contact-github-link');
        const contactGithubVal = document.getElementById('contact-github-val');
        if (contactGithubLink && profile.github) {
            contactGithubLink.setAttribute('href', profile.github);
            if (contactGithubVal) contactGithubVal.textContent = profile.github.replace(/^https?:\/\//i, '');
        }

        const contactLocationVal = document.getElementById('contact-location-val');
        if (contactLocationVal && profile.location) contactLocationVal.textContent = profile.location;

        const contactSlaVal = document.getElementById('contact-sla-val');
        if (contactSlaVal && profile.statusSla) contactSlaVal.textContent = profile.statusSla;

        if (window.lucide) lucide.createIcons();
    }

    // 10.2 Hydrate Experience & 4 Pillars
    function applyExperienceData(exp) {
        if (!exp) return;

        const roleEl = document.getElementById('exp-role');
        const compEl = document.getElementById('exp-company');
        const deptEl = document.getElementById('exp-dept');
        const periodEl = document.getElementById('exp-period');
        const descEl = document.getElementById('exp-desc');

        if (roleEl && exp.role) roleEl.textContent = exp.role;
        if (compEl && exp.company) compEl.textContent = exp.company;
        if (deptEl && exp.department) deptEl.textContent = exp.department;
        if (periodEl && exp.period) periodEl.textContent = exp.period;
        if (descEl && exp.description) descEl.textContent = exp.description;

        // 4 Pillars
        const pillarsContainer = document.getElementById('exp-pillars-container');
        if (pillarsContainer && Array.isArray(exp.pillars)) {
            pillarsContainer.innerHTML = exp.pillars.map(p => `
                <div class="p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex items-start gap-3 hover:border-yellow-400/30 hover:bg-yellow-400/[0.02] transition-all">
                    <div class="w-8 h-8 rounded-xl bg-yellow-400/10 border border-yellow-400/20 flex items-center justify-center flex-shrink-0 text-yellow-400">
                        <i data-lucide="${escapeHtml(p.icon || 'star')}" class="w-4 h-4"></i>
                    </div>
                    <div>
                        <span class="text-xs sm:text-sm font-bold text-white block">${escapeHtml(p.title)}</span>
                        <span class="text-xs text-gray-400 mt-0.5 block leading-relaxed">${escapeHtml(p.description)}</span>
                    </div>
                </div>
            `).join('');
        }

        // Tech Badges
        const techContainer = document.getElementById('exp-tech-container');
        if (techContainer && Array.isArray(exp.technologies)) {
            techContainer.innerHTML = exp.technologies.map(t => {
                const name = typeof t === 'string' ? t : t.name;
                const iconKey = typeof t === 'string' ? t.toLowerCase() : (t.icon || t.name).toLowerCase();
                let iconMarkup = '';

                if (iconKey.includes('python')) {
                    iconMarkup = '<img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg" alt="Python" class="w-4 h-4 object-contain flex-shrink-0" loading="lazy">';
                } else if (iconKey.includes('uipath') || iconKey.includes('rpa')) {
                    iconMarkup = '<svg class="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="#FA4616"><title>UiPath</title><path d="M0 7.882v8.235h8.235V7.882H0Zm.852.852h6.53v6.53H.852v-6.53Zm22.268.695c-.514 0-.886.345-.886.873 0 .511.36.878.886.878.518 0 .88-.359.88-.878 0-.521-.359-.873-.88-.873Zm-17.023.055a.501.501 0 0 0-.522.522c0 .302.22.509.522.509.302 0 .522-.206.522-.509a.501.501 0 0 0-.522-.522Zm17.023.102c.437 0 .716.278.716.716 0 .426-.274.712-.716.712-.426 0-.719-.271-.719-.712 0-.44.278-.716.719-.716Zm-.347.213v.988h.197v-.318h.14l.176.318h.22l-.186-.347a.32.32 0 0 0 .206-.311c0-.203-.159-.33-.374-.33h-.379Zm-3.74.002v4.468h.853v-1.774c0-.571.302-.914.804-.914s.763.33.763.838v1.85h.852v-1.946c0-.88-.619-1.45-1.409-1.45-.509 0-.818.192-1.01.515V9.801h-.853Zm3.937.157h.157c.115 0 .193.064.193.171 0 .118-.078.181-.193.181h-.157v-.352Zm-21.375.049v2.495c0 1.141.625 1.808 1.684 1.808 1.079 0 1.718-.681 1.718-1.808v-2.495h-.852v2.495c0 .646-.275 1.004-.846 1.004-.591 0-.852-.378-.852-1.004v-2.495h-.852Zm7.547 0v4.262h.852v-1.375h.77c.928 0 1.533-.543 1.533-1.457 0-.88-.591-1.43-1.533-1.43H9.142Zm7.809 0v.914h-.399v.722h.399v1.45c0 .791.35 1.176 1.161 1.176h.447v-.729h-.337c-.33 0-.419-.144-.419-.44v-1.457h.749v-.722h-.749v-.914h-.852Zm-6.957.687h.681c.488 0 .756.276.756.743 0 .502-.268.776-.756.776h-.681v-1.519Zm4.138.186c-.921 0-1.546.728-1.546 1.718 0 .997.639 1.712 1.546 1.712.537 0 .887-.193 1.086-.516v.475h.853v-3.348h-.853v.523c-.206-.344-.563-.564-1.086-.564Zm-8.461.041v3.348h.852v-3.348h-.852Zm8.661.701c.543 0 .886.399.886.976 0 .585-.364.963-.886.963-.578 0-.88-.406-.88-.963 0-.598.337-.976.88-.976Z"/></svg>';
                } else if (iconKey.includes('sql')) {
                    iconMarkup = '<img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/microsoftsqlserver/microsoftsqlserver-original.svg" alt="MS SQL" class="w-4 h-4 object-contain flex-shrink-0" loading="lazy">';
                } else if (iconKey.includes('api') || iconKey.includes('rest')) {
                    iconMarkup = '<img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/postman/postman-original.svg" alt="REST API" class="w-4 h-4 object-contain flex-shrink-0" loading="lazy">';
                } else if (iconKey.includes('javascript') || iconKey.includes('js')) {
                    iconMarkup = '<img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg" alt="JavaScript" class="w-4 h-4 object-contain flex-shrink-0" loading="lazy">';
                } else if (iconKey.includes('html') || iconKey.includes('css')) {
                    iconMarkup = '<img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/html5/html5-original.svg" alt="HTML5" class="w-4 h-4 object-contain flex-shrink-0" loading="lazy">';
                } else {
                    iconMarkup = '<svg class="w-4 h-4 text-yellow-400 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>';
                }

                return `
                    <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/10 hover:border-yellow-400/40 hover:bg-yellow-400/[0.04] transition-all text-xs font-mono font-medium text-gray-200">
                        ${iconMarkup}
                        <span>${escapeHtml(name)}</span>
                    </div>
                `;
            }).join('');
        }

        if (window.lucide) lucide.createIcons();
    }

    // 10.3 Hydrate Skills & Marquee
    function applySkillsData(skills) {
        if (!Array.isArray(skills) || skills.length === 0) return;

        // Update dictionary for modal details
        skills.forEach(s => {
            let iconHtml = '';
            if (s.iconType === 'img' || s.iconSrc) {
                iconHtml = `<img src="${escapeHtml(s.iconSrc)}" alt="${escapeHtml(s.name)}" class="w-8 h-8 object-contain">`;
            } else if (s.iconSvg) {
                iconHtml = `<div class="w-8 h-8 flex items-center justify-center">${s.iconSvg}</div>`;
            } else {
                iconHtml = `<i data-lucide="cpu" class="w-8 h-8 text-yellow-400"></i>`;
            }

            techDetails[s.id] = {
                name: s.name,
                category: s.category || 'Teknoloji',
                iconHtml: iconHtml,
                whatIs: s.whatIs || '',
                usage: s.usage || ''
            };
        });

        // Split into 2 rows for Marquees
        const half = Math.ceil(skills.length / 2);
        const row1 = skills.slice(0, half);
        const row2 = skills.slice(half);

        const track1 = document.getElementById('marquee-track-1');
        const track2 = document.getElementById('marquee-track-2');

        function renderMarqueeCards(list) {
            const cards = list.map(s => {
                let iconEl = '';
                if (s.iconType === 'img' || s.iconSrc) {
                    iconEl = `<img src="${escapeHtml(s.iconSrc)}" alt="${escapeHtml(s.name)}" class="tech-icon" loading="lazy">`;
                } else if (s.iconSvg) {
                    iconEl = `<div class="tech-icon flex items-center justify-center">${s.iconSvg}</div>`;
                } else {
                    iconEl = `<i data-lucide="cpu" class="tech-icon text-yellow-400"></i>`;
                }

                return `
                    <div class="tech-logo-card" data-tech="${s.id}">
                        ${iconEl}
                        <span class="text-sm font-semibold text-white">${escapeHtml(s.name)}</span>
                    </div>
                `;
            }).join('');
            return cards + cards; // Duplicate for seamless infinite loop
        }

        if (track1 && row1.length > 0) track1.innerHTML = renderMarqueeCards(row1);
        if (track2 && row2.length > 0) track2.innerHTML = renderMarqueeCards(row2);

        attachTechModalListeners();
        if (window.lucide) lucide.createIcons();
    }

    // 10.4 Hydrate Projects CMS & Showcase
    function applyProjectsData(projects) {
        if (!Array.isArray(projects) || projects.length === 0) return;

        projects.forEach(p => {
            projectData[p.id] = {
                badge: p.badge || 'Kurumsal Çözüm',
                category: p.category || 'Yazılım & Mimarisi',
                iconHtml: getProjectIconHtml(p, 'w-8 h-8'),
                title: p.title,
                subtitle: p.subtitle || (p.description ? p.description.slice(0, 65) + '...' : ''),
                summary: p.longDescription || p.description,
                contributions: p.contributions || [
                    p.description,
                    'RESTful API ve servis entegrasyonları ile asenkron veri akışının sağlanması',
                    'Uçtan uca performans optimizasyonu ve mimari test süreçlerinin tamamlanması'
                ],
                tech: p.techStack || ['Python', 'UiPath', 'REST API', 'MS SQL'],
                metrics: (p.metrics && p.metrics.length > 0) ? p.metrics.map(m => ({
                    standard: m.value,
                    label: m.label,
                    desc: 'Mühendislik standardı ve kalite güvencesi'
                })) : [
                    { standard: '7/24', label: 'Çalışma Modu', desc: 'Kesintisiz otonom servis' },
                    { standard: '%100', label: 'Veri Tutarlılığı', desc: 'Güvenli işlem akışı' }
                ]
            };
        });

        // Render project selector tabs
        const tabsContainer = document.getElementById('project-tabs-container');
        if (tabsContainer) {
            tabsContainer.innerHTML = projects.map((p, idx) => {
                const isActive = (p.id === currentActiveProjectKey) || (idx === 0 && !projectData[currentActiveProjectKey]);
                if (isActive) currentActiveProjectKey = p.id;
                const iconSvg = getProjectIconHtml(p, 'w-5 h-5');

                return `
                    <button type="button" class="project-tab-btn ${isActive ? 'active' : ''} w-full p-4 rounded-2xl text-left transition-all duration-300 flex items-center justify-between group cursor-pointer flex-1" data-project="${p.id}">
                        <div class="flex items-center gap-3.5 min-w-0">
                            <div class="tab-icon-box w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0 transition-colors">
                                ${iconSvg}
                            </div>
                            <div class="min-w-0">
                                <div class="flex items-center gap-2">
                                    <span class="text-xs font-mono text-yellow-400 font-bold">0${idx + 1} //</span>
                                    <h3 class="text-sm sm:text-base font-bold text-white group-hover:text-yellow-400 transition-colors truncate">${escapeHtml(p.title)}</h3>
                                </div>
                                <p class="text-xs text-gray-400 mt-0.5 truncate">${escapeHtml(p.description || '')}</p>
                            </div>
                        </div>
                        <i data-lucide="chevron-right" class="tab-arrow w-4 h-4 ${isActive ? 'text-yellow-400' : 'text-gray-500'} transition-transform group-hover:translate-x-1 flex-shrink-0"></i>
                    </button>
                `;
            }).join('');

            attachProjectTabListeners();
            attachProjectCardListeners();
            updateShowcase(currentActiveProjectKey);
            if (window.lucide) lucide.createIcons();
        }
    }

    // ================= 11. FETCH & INITIALIZE ALL LIVE DATA =================
    async function loadLiveContent() {
        // Fetch Profile
        try {
            const res = await fetch(`${API_BASE}/api/profile`);
            if (res.ok) {
                const data = await res.json();
                applyProfileData(data);
            } else {
                const local = localStorage.getItem('agy_local_profile');
                if (local) applyProfileData(JSON.parse(local));
            }
        } catch (e) {
            const local = localStorage.getItem('agy_local_profile');
            if (local) applyProfileData(JSON.parse(local));
        }

        // Fetch Experience
        try {
            const res = await fetch(`${API_BASE}/api/experience`);
            if (res.ok) {
                const data = await res.json();
                applyExperienceData(data);
            } else {
                const local = localStorage.getItem('agy_local_experience');
                if (local) applyExperienceData(JSON.parse(local));
            }
        } catch (e) {
            const local = localStorage.getItem('agy_local_experience');
            if (local) applyExperienceData(JSON.parse(local));
        }

        // Fetch Skills
        try {
            const res = await fetch(`${API_BASE}/api/skills`);
            if (res.ok) {
                const data = await res.json();
                applySkillsData(data);
            } else {
                const local = localStorage.getItem('agy_local_skills');
                if (local) applySkillsData(JSON.parse(local));
            }
        } catch (e) {
            const local = localStorage.getItem('agy_local_skills');
            if (local) applySkillsData(JSON.parse(local));
        }

        // Fetch Projects
        try {
            const res = await fetch(`${API_BASE}/api/projects`);
            if (res.ok) {
                const data = await res.json();
                applyProjectsData(data);
            } else {
                const local = localStorage.getItem('agy_local_projects');
                if (local) applyProjectsData(JSON.parse(local));
            }
        } catch (e) {
            const local = localStorage.getItem('agy_local_projects');
            if (local) applyProjectsData(JSON.parse(local));
        }
    }

    loadLiveContent();

    // ================= 12. REAL-TIME EVENT LISTENERS (CROSS-TAB + SSE) =================
    function handleLiveSync(section, data) {
        if (!section) return;

        if (section === 'profile') {
            applyProfileData(data);
        } else if (section === 'experience') {
            applyExperienceData(data);
        } else if (section === 'skills') {
            applySkillsData(data);
        } else if (section === 'projects') {
            applyProjectsData(data);
        } else if (section === 'ALL') {
            loadLiveContent();
        }

        if (window.lucide) lucide.createIcons();
    }

    // A. 0ms Cross-tab sync via BroadcastChannel
    if ('BroadcastChannel' in window) {
        const syncChannel = new BroadcastChannel('portfolio_sync');
        syncChannel.onmessage = (event) => {
            const { section, data } = event.data || {};
            handleLiveSync(section, data);
        };
    }

    // B. Server-Sent Events (SSE) for remote/separate sessions
    try {
        const evtSource = new EventSource(`${API_BASE}/api/live-stream`);
        evtSource.onmessage = (event) => {
            try {
                const payload = JSON.parse(event.data);
                if (payload.type === 'SYNC_UPDATE' || payload.type === 'DATA_UPDATED') {
                    handleLiveSync(payload.section, payload.data);
                }
            } catch (err) {}
        };
    } catch (e) {}

    // C. Cloud Firestore onSnapshot Real-Time Synchronization (0ms Cloud Sync)
    if (window.firebaseDb) {
        try {
            // 1. Profil onSnapshot
            window.firebaseDb.collection('content').doc('profile').onSnapshot((doc) => {
                if (doc.exists) {
                    applyProfileData(doc.data());
                    if (window.lucide) lucide.createIcons();
                }
            }, (err) => console.warn('[FIRESTORE PROFILE SNAP ERR]', err));

            // 2. Deneyim onSnapshot
            window.firebaseDb.collection('content').doc('experience').onSnapshot((doc) => {
                if (doc.exists) {
                    applyExperienceData(doc.data());
                    if (window.lucide) lucide.createIcons();
                }
            }, (err) => console.warn('[FIRESTORE EXP SNAP ERR]', err));

            // 3. Yetenekler onSnapshot
            window.firebaseDb.collection('skills').onSnapshot((snapshot) => {
                if (!snapshot.empty) {
                    const skills = [];
                    snapshot.forEach(d => skills.push({ id: d.id, ...d.data() }));
                    applySkillsData(skills);
                    if (window.lucide) lucide.createIcons();
                }
            }, (err) => console.warn('[FIRESTORE SKILLS SNAP ERR]', err));

            // 4. Projeler onSnapshot
            window.firebaseDb.collection('projects').onSnapshot((snapshot) => {
                if (!snapshot.empty) {
                    const projects = [];
                    snapshot.forEach(d => projects.push({ id: d.id, ...d.data() }));
                    applyProjectsData(projects);
                    if (window.lucide) lucide.createIcons();
                }
            }, (err) => console.warn('[FIRESTORE PROJECTS SNAP ERR]', err));

            console.log('[FIREBASE] Real-time onSnapshot dinleyicileri aktif!');
        } catch (fbSnapErr) {
            console.warn('[FIRESTORE SNAPSHOT INIT ERROR]', fbSnapErr);
        }
    }

});
