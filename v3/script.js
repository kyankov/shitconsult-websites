/* ===== DEVICE DETECTION ===== */
const isMobile = window.matchMedia('(max-width: 768px)').matches
    || ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);

/* ===== GSAP SETUP ===== */
gsap.registerPlugin(ScrollTrigger);

/* ===== NAVBAR ===== */
const navbar = document.getElementById('navbar');
const navLinksEl = document.getElementById('navLinks');
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
    if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 50);
    updateActiveNav();
});

function updateActiveNav() {
    const pos = window.scrollY + 200;
    sections.forEach(sec => {
        const top = sec.offsetTop;
        const h = sec.offsetHeight;
        const id = sec.getAttribute('id');
        /* Desktop nav links are inside #navLinks <ul> */
        const link = navLinksEl ? navLinksEl.querySelector(`a[href="#${id}"]`) : null;
        if (link) link.classList.toggle('active', pos >= top && pos < top + h);
    });
}

/* Mobile menu */
const overlay = document.createElement('div');
overlay.className = 'nav-overlay';
document.body.appendChild(overlay);

if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
        const isOpen = mobileMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
        overlay.classList.toggle('active');
        document.body.style.overflow = isOpen ? 'hidden' : '';
        hamburger.setAttribute('aria-expanded', isOpen);
    });
}

overlay.addEventListener('click', closeMenu);
/* Close menu when clicking any link in mobile nav */
if (mobileMenu) {
    mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
}

function closeMenu() {
    if (hamburger) hamburger.classList.remove('active');
    if (mobileMenu) mobileMenu.classList.remove('active');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
    if (hamburger) hamburger.setAttribute('aria-expanded', 'false');
}

/* Smooth scroll */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(anchor.getAttribute('href'));
        if (target) {
            const offset = navbar ? navbar.offsetHeight + 20 : 80;
            const top = target.getBoundingClientRect().top + window.scrollY - offset;
            window.scrollTo({ top, behavior: 'smooth' });
        }
    });
});

/* ===== ENTRANCE ANIMATIONS ===== */
function runEntrance() {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    tl.from('.hero-badge', { y: 20, opacity: 0, duration: 0.6 })
      .from('.hero-title', { y: 40, opacity: 0, duration: 0.9 }, '-=0.3')
      .from('.hero-subtitle', { y: 20, opacity: 0, duration: 0.7 }, '-=0.4')
      .from('.hero-ctas', { y: 20, opacity: 0, duration: 0.7 }, '-=0.3')
      .from('.hero-stat', { y: 30, opacity: 0, duration: 0.5, stagger: 0.1 }, '-=0.3')
      .from('.hero-scroll-indicator', { opacity: 0, duration: 0.5 }, '-=0.2');

    initScrollAnimations();
}

/* ===== SCROLL ANIMATIONS ===== */
function initScrollAnimations() {
    // Fade in elements
    gsap.utils.toArray('[data-animate="fade-up"]').forEach(el => {
        gsap.from(el, {
            scrollTrigger: { trigger: el, start: 'top 88%', once: true },
            y: 40, opacity: 0, duration: 0.7, ease: 'power3.out',
        });
    });

    // Section headers
    gsap.utils.toArray('.section-label, .section-tag, .section-title').forEach(el => {
        gsap.from(el, {
            scrollTrigger: { trigger: el, start: 'top 88%', once: true },
            y: 25, opacity: 0, duration: 0.6, ease: 'power3.out',
        });
    });

    // About section
    const aboutVisual = document.querySelector('.about-visual');
    const aboutContent = document.querySelector('.about-content');
    if (aboutVisual) {
        gsap.from(aboutVisual, {
            scrollTrigger: { trigger: '.about-grid', start: 'top 75%', once: true },
            x: -50, opacity: 0, duration: 0.8, ease: 'power3.out',
        });
    }
    if (aboutContent) {
        gsap.from(aboutContent, {
            scrollTrigger: { trigger: '.about-grid', start: 'top 75%', once: true },
            x: 50, opacity: 0, duration: 0.8, delay: 0.15, ease: 'power3.out',
        });
    }

    // Float cards bounce in
    gsap.utils.toArray('.about-float-card').forEach((card, i) => {
        gsap.from(card, {
            scrollTrigger: { trigger: card, start: 'top 85%', once: true },
            scale: 0, opacity: 0, duration: 0.5, delay: i * 0.15, ease: 'back.out(1.7)',
        });
    });

    // Team cards
    gsap.utils.toArray('.team-card').forEach((card, i) => {
        gsap.from(card, {
            scrollTrigger: { trigger: card, start: 'top 85%', once: true },
            y: 50, opacity: 0, duration: 0.6, delay: i * 0.1, ease: 'power3.out',
        });
    });

    // Testimonials
    gsap.utils.toArray('.testimonial-card').forEach((card, i) => {
        gsap.from(card, {
            scrollTrigger: { trigger: card, start: 'top 85%', once: true },
            y: 40, opacity: 0, duration: 0.6, delay: i * 0.1, ease: 'power3.out',
        });
    });

    // FAQ items
    gsap.utils.toArray('.faq-item').forEach((item, i) => {
        gsap.from(item, {
            scrollTrigger: { trigger: item, start: 'top 88%', once: true },
            x: 30, opacity: 0, duration: 0.5, delay: i * 0.08, ease: 'power3.out',
        });
    });

    // CTA banner
    const ctaBanner = document.querySelector('.cta-banner-content');
    if (ctaBanner) {
        gsap.from(ctaBanner, {
            scrollTrigger: { trigger: ctaBanner, start: 'top 80%', once: true },
            y: 40, opacity: 0, duration: 0.8, ease: 'power3.out',
        });
    }

    // Contact
    const contactGrid = document.querySelector('.contact-grid');
    if (contactGrid) {
        gsap.from('.contact-info', {
            scrollTrigger: { trigger: contactGrid, start: 'top 75%', once: true },
            x: -40, opacity: 0, duration: 0.7, ease: 'power3.out',
        });
        gsap.from('.contact-form', {
            scrollTrigger: { trigger: contactGrid, start: 'top 75%', once: true },
            x: 40, opacity: 0, duration: 0.7, delay: 0.1, ease: 'power3.out',
        });
    }

    // Stat counters (HTML uses data-target)
    document.querySelectorAll('[data-target]').forEach(el => {
        const target = parseInt(el.dataset.target);
        ScrollTrigger.create({
            trigger: el,
            start: 'top 85%',
            once: true,
            onEnter: () => {
                gsap.to(el, {
                    innerText: target,
                    duration: 2,
                    snap: { innerText: 1 },
                    ease: 'power2.out',
                });
            }
        });
    });
}

/* ===== 3D CARD TILT (desktop only) ===== */
if (!isMobile) {
    document.querySelectorAll('.bento-card, .service-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;

            card.style.transform = `perspective(800px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translateY(-4px)`;

            // Glow follow
            const glowX = ((e.clientX - rect.left) / rect.width) * 100;
            const glowY = ((e.clientY - rect.top) / rect.height) * 100;
            card.style.setProperty('--glow-x', glowX + '%');
            card.style.setProperty('--glow-y', glowY + '%');
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });

    // Magnetic buttons
    document.querySelectorAll('.btn-primary, .btn-secondary').forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
        });
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = '';
        });
    });
}

/* ===== FAQ ACCORDION ===== */
document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
        const item = btn.parentElement;
        const wasActive = item.classList.contains('active');
        document.querySelectorAll('.faq-item.active').forEach(a => a.classList.remove('active'));
        if (!wasActive) item.classList.add('active');
    });
});

/* ===== CONTACT FORM ===== */
const form = document.getElementById('contactForm');
if (form) {
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const btn = form.querySelector('button[type="submit"]');
        const btnSpan = btn.querySelector('span');
        const origText = btnSpan ? btnSpan.textContent : btn.textContent;
        if (btnSpan) btnSpan.textContent = 'Изпращане...';
        else btn.textContent = 'Изпращане...';
        btn.disabled = true;

        setTimeout(() => {
            const successMsg = document.getElementById('formSuccess');
            if (successMsg) {
                successMsg.hidden = false;
                setTimeout(() => { successMsg.hidden = true; }, 5000);
            }
            form.reset();
            if (btnSpan) btnSpan.textContent = origText;
            else btn.textContent = origText;
            btn.disabled = false;
        }, 1500);
    });
}

/* ===== GRADIENT MESH ANIMATION (desktop) ===== */
if (!isMobile) {
    const hero = document.querySelector('.hero');
    if (hero) {
        hero.addEventListener('mousemove', (e) => {
            const rect = hero.getBoundingClientRect();
            const xRatio = (e.clientX - rect.left) / rect.width;
            const yRatio = (e.clientY - rect.top) / rect.height;
            hero.style.setProperty('--mouse-x', (xRatio * 100) + '%');
            hero.style.setProperty('--mouse-y', (yRatio * 100) + '%');
        });
    }
}

/* ===== INIT ===== */
/* No preloader in V3 HTML, so run entrance immediately on load */
window.addEventListener('load', () => {
    runEntrance();
});

if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 50);
updateActiveNav();
