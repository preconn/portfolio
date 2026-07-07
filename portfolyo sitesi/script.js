/* ============================================
   SELİN ATEŞ — PORTFOLYO SCRIPT
============================================ */

document.addEventListener('DOMContentLoaded', () => {

    /* ---------- YÜKLEME EKRANI ---------- */
    const loader = document.getElementById('loader');

    // DOMContentLoaded tetiklendiğinde loader'ı kaldırmak en güvenli yoldur.
    // Bu kısım en başta ve tek başına çalışır: aşağıdaki bölümlerden biri
    // hata verse bile loader'ın kapanması bundan etkilenmez.
    setTimeout(() => {
        if (loader) loader.classList.add('hidden');
    }, 600);

    // Aşağıdaki tüm özellik başlatmaları try/catch içine alındı.
    // Böylece herhangi bir bölümde beklenmeyen bir hata oluşursa
    // diğer bölümler yine de çalışmaya devam eder.
    try {

        /* ---------- ÖZEL İMLEÇ ---------- */
        const cursorDot = document.getElementById('cursorDot');
        const cursorRing = document.getElementById('cursorRing');
        let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;

        if (window.matchMedia('(min-width: 901px)').matches && cursorDot && cursorRing) {
            window.addEventListener('mousemove', (e) => {
                mouseX = e.clientX;
                mouseY = e.clientY;
                cursorDot.style.left = mouseX + 'px';
                cursorDot.style.top = mouseY + 'px';
            });

            function animateRing() {
                ringX += (mouseX - ringX) * 0.15;
                ringY += (mouseY - ringY) * 0.15;
                cursorRing.style.left = ringX + 'px';
                cursorRing.style.top = ringY + 'px';
                requestAnimationFrame(animateRing);
            }
            animateRing();

            // Dinamik elementleri de kapsayacak şekilde hover algılama
            const refreshHovereffects = () => {
                const hoverables = document.querySelectorAll('a, button, .project-card, .mini-card, input, textarea, .filter-btn');
                hoverables.forEach(el => {
                    el.addEventListener('mouseenter', () => cursorRing.classList.add('hover'));
                    el.addEventListener('mouseleave', () => cursorRing.classList.remove('hover'));
                });
            };
            refreshHovereffects();
        }

        /* ---------- KIVILCIM PARÇACIK SİSTEMİ (CANVAS) ---------- */
        const canvas = document.getElementById('emberCanvas');
        const ctx = canvas ? canvas.getContext('2d') : null;
        if (canvas && ctx) {
            let W, H, particles = [];
            const PARTICLE_COUNT = window.innerWidth < 700 ? 35 : 70;

            function resizeCanvas() {
                W = canvas.width = window.innerWidth;
                H = canvas.height = window.innerHeight;
            }
            resizeCanvas();
            window.addEventListener('resize', resizeCanvas);

            function createParticle() {
                return {
                    x: Math.random() * W,
                    y: H + Math.random() * 100,
                    size: Math.random() * 2.5 + 0.5,
                    speedY: Math.random() * 0.8 + 0.3,
                    speedX: (Math.random() - 0.5) * 0.6,
                    opacity: Math.random() * 0.6 + 0.2,
                    hue: Math.random() > 0.5 ? '225,29,46' : '255,90,54',
                    flicker: Math.random() * 0.05
                };
            }

            for (let i = 0; i < PARTICLE_COUNT; i++) {
                const p = createParticle();
                p.y = Math.random() * H;
                particles.push(p);
            }

            let reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

            function animateParticles() {
                ctx.clearRect(0, 0, W, H);
                particles.forEach(p => {
                    p.y -= p.speedY;
                    p.x += Math.sin(p.y * 0.01) * p.speedX;
                    p.opacity += (Math.random() - 0.5) * p.flicker;
                    p.opacity = Math.max(0.1, Math.min(0.8, p.opacity));

                    if (p.y < -10) {
                        p.y = H + 10;
                        p.x = Math.random() * W;
                    }

                    ctx.beginPath();
                    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(${p.hue}, ${p.opacity})`;
                    ctx.shadowBlur = 8;
                    ctx.shadowColor = `rgba(${p.hue}, 0.8)`;
                    ctx.fill();
                });
                if (!reduceMotion) requestAnimationFrame(animateParticles);
            }
            animateParticles();
        }

        /* ---------- NAVBAR SCROLL DAVRANIŞI ---------- */
        const navbar = document.getElementById('navbar');
        const navToggle = document.getElementById('navToggle');
        const navLinks = document.getElementById('navLinks');
        const navLinkItems = document.querySelectorAll('.nav-link');
        const backTop = document.getElementById('backTop');

        window.addEventListener('scroll', () => {
            if (navbar) {
                if (window.scrollY > 60) navbar.classList.add('scrolled');
                else navbar.classList.remove('scrolled');
            }

            if (backTop) {
                if (window.scrollY > 500) backTop.classList.add('show');
                else backTop.classList.remove('show');
            }
            updateActiveLink();
        });

        if (navToggle && navLinks) {
            navToggle.addEventListener('click', () => {
                navToggle.classList.toggle('open');
                navLinks.classList.toggle('open');
            });
        }

        navLinkItems.forEach(link => {
            link.addEventListener('click', () => {
                if (navToggle) navToggle.classList.remove('open');
                if (navLinks) navLinks.classList.remove('open');
            });
        });

        if (backTop) {
            backTop.addEventListener('click', () => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        }

        /* ---------- AKTİF BAĞLANTI VURGUSU ---------- */
        const sections = document.querySelectorAll('main section, .hero');
        function updateActiveLink() {
            let current = 'hero';
            sections.forEach(sec => {
                const rect = sec.getBoundingClientRect();
                if (rect.top <= 120 && rect.bottom >= 120) {
                    current = sec.getAttribute('id');
                }
            });
            navLinkItems.forEach(link => {
                link.classList.toggle('active-link', link.getAttribute('href') === '#' + current);
            });
        }

        /* ---------- SCROLL REVEAL (IntersectionObserver) ---------- */
        const revealEls = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                }
            });
        }, { threshold: 0.15 });
        revealEls.forEach(el => revealObserver.observe(el));

        /* ---------- SAYAÇ ANİMASYONU (İSTATİSTİKLER) ---------- */
        const statNums = document.querySelectorAll('.stat-num');
        const statObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCount(entry.target);
                    statObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        statNums.forEach(el => statObserver.observe(el));

        function animateCount(el) {
            const target = parseInt(el.getAttribute('data-count'), 10);
            const duration = 1500;
            const start = performance.now();
            function step(now) {
                const progress = Math.min((now - start) / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 3);
                el.textContent = Math.floor(eased * target);
                if (progress < 1) requestAnimationFrame(step);
                else el.textContent = target;
            }
            requestAnimationFrame(step);
        }

        /* ---------- YETENEK ÇUBUKLARI ANİMASYONU ---------- */
        const skillFills = document.querySelectorAll('.skill-fill');
        const skillObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const fill = entry.target;
                    const width = fill.getAttribute('data-width');
                    fill.style.width = width + '%';
                    skillObserver.unobserve(fill);
                }
            });
        }, { threshold: 0.4 });
        skillFills.forEach(el => skillObserver.observe(el));

        /* ---------- PROJE FİLTRELEME (HATA DÜZELTİLDİ) ---------- */
        const filterBtns = document.querySelectorAll('.filter-btn');
        const projectCards = document.querySelectorAll('.project-card');

        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const filter = btn.getAttribute('data-filter');

                projectCards.forEach(card => {
                    const match = filter === 'all' || card.getAttribute('data-cat') === filter;
                    if (match) {
                        card.classList.remove('hidden-card');
                        card.style.animation = 'fadeInUp 0.5s ease forwards';
                    } else {
                        card.classList.add('hidden-card');
                        card.style.animation = 'none';
                    }
                });
            });
        });

        /* ---------- İLETİŞİM FORMU DOĞRULAMA ---------- */
        const form = document.getElementById('contactForm');
        const formSuccess = document.getElementById('formSuccess');

        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                let valid = true;

                const nameField = document.getElementById('name');
                const emailField = document.getElementById('email');
                const messageField = document.getElementById('message');

                valid = validateField(nameField, nameField.value.trim().length > 1) && valid;
                valid = validateField(emailField, /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailField.value.trim())) && valid;
                valid = validateField(messageField, messageField.value.trim().length > 3) && valid;

                if (valid) {
                    const submitBtn = form.querySelector('.btn-submit');
                    if (submitBtn) submitBtn.classList.add('sending');

                    setTimeout(() => {
                        if (submitBtn) submitBtn.classList.remove('sending');
                        if (formSuccess) formSuccess.classList.add('show');
                        form.reset();
                        setTimeout(() => {
                            if (formSuccess) formSuccess.classList.remove('show');
                        }, 4000);
                    }, 800);
                }
            });

            [document.getElementById('name'), document.getElementById('email'), document.getElementById('message')].forEach(field => {
                if (field) {
                    field.addEventListener('input', () => {
                        const row = field.closest('.form-row');
                        if (row) row.classList.remove('invalid');
                    });
                }
            });
        }

        function validateField(field, condition) {
            if (!field) return false;
            const row = field.closest('.form-row');
            if (!row) return false;

            if (!condition) {
                row.classList.add('invalid');
                return false;
            }
            row.classList.remove('invalid');
            return true;
        }

        /* ---------- İLK YÜKLEME KONTROLÜ ---------- */
        updateActiveLink();
        setTimeout(() => {
            document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right').forEach(el => {
                const rect = el.getBoundingClientRect();
                if (rect.top < window.innerHeight) el.classList.add('in-view');
            });
        }, 200);

    } catch (err) {
        // Bir özellik başlatılırken hata oluşsa bile bunu konsola yazıp
        // sayfanın geri kalanının (ve loader'ın kapanmasının) etkilenmesini engelliyoruz.
        console.error('Bir bölüm başlatılırken hata oluştu:', err);
    }

});