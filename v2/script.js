/* ===== DEVICE DETECTION ===== */
const isMobile = window.matchMedia('(max-width: 768px)').matches ||
    ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);

/* ===== PRELOADER ===== */
const preloader = document.getElementById('preloader');
const preloaderFill = document.getElementById('preloaderFill');
let loadProgress = 0;

const loadInterval = setInterval(() => {
    loadProgress += Math.random() * 25;
    if (loadProgress >= 100) loadProgress = 100;
    preloaderFill.style.width = loadProgress + '%';
    if (loadProgress >= 100) {
        clearInterval(loadInterval);
        setTimeout(() => {
            gsap.to(preloader, {
                opacity: 0,
                duration: 0.6,
                onComplete: () => {
                    preloader.style.display = 'none';
                    initAnimations();
                }
            });
        }, 300);
    }
}, 150);

/* ===== LENIS SMOOTH SCROLL (desktop only) ===== */
let lenis;
if (!isMobile) {
    lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
    });
} else {
    // Stub so lenis.scrollTo calls don't break
    lenis = { scrollTo: (target, opts) => {
        const el = typeof target === 'string' ? document.querySelector(target) : target;
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, raf: () => {} };
}

if (!isMobile) {
    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
}

// Integrate with GSAP ScrollTrigger
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

if (!isMobile && lenis.on) {
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
}

/* ===== CUSTOM CURSOR (desktop only) ===== */
const cursor = document.getElementById('cursor');
const cursorDot = document.getElementById('cursorDot');

if (!isMobile) {
    let mouseX = 0, mouseY = 0, cursorX = 0, cursorY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        gsap.to(cursorDot, { x: mouseX, y: mouseY, duration: 0.1 });
    });

    gsap.ticker.add(() => {
        cursorX += (mouseX - cursorX) * 0.15;
        cursorY += (mouseY - cursorY) * 0.15;
        cursor.style.left = cursorX + 'px';
        cursor.style.top = cursorY + 'px';
    });

    document.querySelectorAll('a, button, .service-card, .team-card, .contact-card, .faq-q').forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
    });
}

/* ===== PARTICLES (desktop only) ===== */
const canvas = document.getElementById('heroParticles');

if (!isMobile && canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];

    function resizeCanvas() {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
    }

    function createParticles() {
        particles = [];
        const count = Math.min(80, Math.floor((canvas.width * canvas.height) / 15000));
        for (let i = 0; i < count; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: Math.random() * 1.5 + 0.5,
                speedX: (Math.random() - 0.5) * 0.3,
                speedY: (Math.random() - 0.5) * 0.3,
                opacity: Math.random() * 0.4 + 0.1,
            });
        }
    }

    function drawParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach((p, i) => {
            p.x += p.speedX;
            p.y += p.speedY;
            if (p.x < 0) p.x = canvas.width;
            if (p.x > canvas.width) p.x = 0;
            if (p.y < 0) p.y = canvas.height;
            if (p.y > canvas.height) p.y = 0;

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(201, 168, 76, ${p.opacity})`;
            ctx.fill();

            // Connect nearby particles (limit checks)
            const maxJ = Math.min(i + 10, particles.length);
            for (let j = i + 1; j < maxJ; j++) {
                const dx = p.x - particles[j].x;
                const dy = p.y - particles[j].y;
                const dist = dx * dx + dy * dy;
                if (dist < 14400) { // 120^2
                    const d = Math.sqrt(dist);
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(201, 168, 76, ${0.04 * (1 - d / 120)})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        });
        requestAnimationFrame(drawParticles);
    }

    resizeCanvas();
    createParticles();
    drawParticles();

    window.addEventListener('resize', () => {
        resizeCanvas();
        createParticles();
    });
}

/* ===== NAVBAR ===== */
const navbar = document.getElementById('navbar');
const navLinks = document.getElementById('navLinks');
const menuToggle = document.getElementById('menuToggle');
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
    updateActiveNav();
});

function updateActiveNav() {
    const scrollPos = window.scrollY + 200;
    sections.forEach(section => {
        const top = section.offsetTop;
        const height = section.offsetHeight;
        const id = section.getAttribute('id');
        const link = document.querySelector(`.nav-link[href="#${id}"]`);
        if (link) link.classList.toggle('active', scrollPos >= top && scrollPos < top + height);
    });
}

// Mobile menu
const overlay = document.createElement('div');
overlay.className = 'nav-overlay';
document.body.appendChild(overlay);

menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    navLinks.classList.toggle('active');
    overlay.classList.toggle('active');
    document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
});

overlay.addEventListener('click', closeMenu);
navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));

function closeMenu() {
    menuToggle.classList.remove('active');
    navLinks.classList.remove('active');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
}

/* ===== SMOOTH SCROLL LINKS ===== */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(anchor.getAttribute('href'));
        if (target) lenis.scrollTo(target, { offset: -80 });
    });
});

/* ===== GSAP ANIMATIONS ===== */
function initAnimations() {
    // Hero elements
    const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    heroTl
        .from('.hero-badge', { y: 30, opacity: 0, duration: 0.8 })
        .from('.hero-title', { y: 50, opacity: 0, duration: 1 }, '-=0.4')
        .from('.hero-desc', { y: 30, opacity: 0, duration: 0.8 }, '-=0.5')
        .from('.hero-actions', { y: 30, opacity: 0, duration: 0.8 }, '-=0.4')
        .from('.hero-stats', { y: 40, opacity: 0, duration: 0.8 }, '-=0.3')
        .from('.hero-scroll-indicator', { opacity: 0, duration: 0.6 }, '-=0.2')
        .from('.hero-watermark', { x: 100, opacity: 0, duration: 1.2 }, '-=0.8');

    // Counter animation
    const statNums = document.querySelectorAll('.hero-stat-num[data-count]');
    statNums.forEach(num => {
        const target = parseInt(num.dataset.count);
        ScrollTrigger.create({
            trigger: num,
            start: 'top 85%',
            once: true,
            onEnter: () => {
                gsap.to(num, {
                    innerText: target,
                    duration: 2,
                    snap: { innerText: 1 },
                    ease: 'power2.out',
                });
            }
        });
    });

    // Section labels + headings
    gsap.utils.toArray('.section-label, .section-heading, .section-sub').forEach(el => {
        gsap.from(el, {
            scrollTrigger: { trigger: el, start: 'top 85%', once: true },
            y: 30, opacity: 0, duration: 0.8, ease: 'power3.out',
        });
    });

    // Service cards stagger
    gsap.utils.toArray('.service-card').forEach((card, i) => {
        gsap.from(card, {
            scrollTrigger: { trigger: card, start: 'top 85%', once: true },
            y: 60, opacity: 0, duration: 0.8, delay: (i % 3) * 0.12, ease: 'power3.out',
        });
    });

    // About section
    gsap.from('.about-visual', {
        scrollTrigger: { trigger: '.about-layout', start: 'top 75%', once: true },
        x: -60, opacity: 0, duration: 1, ease: 'power3.out',
    });
    gsap.from('.about-text', {
        scrollTrigger: { trigger: '.about-layout', start: 'top 75%', once: true },
        x: 60, opacity: 0, duration: 1, delay: 0.2, ease: 'power3.out',
    });

    // Float cards
    gsap.from('.about-float-card', {
        scrollTrigger: { trigger: '.about-image-wrapper', start: 'top 70%', once: true },
        scale: 0, opacity: 0, duration: 0.6, stagger: 0.2, ease: 'back.out(1.7)',
    });

    // Team cards
    gsap.utils.toArray('.team-card').forEach((card, i) => {
        gsap.from(card, {
            scrollTrigger: { trigger: card, start: 'top 85%', once: true },
            y: 60, opacity: 0, duration: 0.8, delay: i * 0.15, ease: 'power3.out',
        });
    });

    // FAQ
    gsap.from('.faq-left', {
        scrollTrigger: { trigger: '.faq-layout', start: 'top 75%', once: true },
        x: -40, opacity: 0, duration: 0.8, ease: 'power3.out',
    });
    gsap.utils.toArray('.faq-item').forEach((item, i) => {
        gsap.from(item, {
            scrollTrigger: { trigger: item, start: 'top 85%', once: true },
            x: 40, opacity: 0, duration: 0.6, delay: i * 0.1, ease: 'power3.out',
        });
    });

    // Contact
    gsap.from('.contact-cards', {
        scrollTrigger: { trigger: '.contact-layout', start: 'top 75%', once: true },
        x: -40, opacity: 0, duration: 0.8, ease: 'power3.out',
    });
    gsap.from('.contact-form', {
        scrollTrigger: { trigger: '.contact-layout', start: 'top 75%', once: true },
        x: 40, opacity: 0, duration: 0.8, delay: 0.15, ease: 'power3.out',
    });

    // Parallax on hero watermark
    gsap.to('.hero-watermark', {
        scrollTrigger: {
            trigger: '.hero',
            start: 'top top',
            end: 'bottom top',
            scrub: 1,
        },
        y: -100,
        ease: 'none',
    });

    // Testimonials
    gsap.utils.toArray('.testimonial-card').forEach((card, i) => {
        gsap.from(card, {
            scrollTrigger: { trigger: card, start: 'top 85%', once: true },
            y: 50, opacity: 0, duration: 0.7, delay: i * 0.12, ease: 'power3.out',
        });
    });

    // CTA banner
    gsap.from('.cta-inner', {
        scrollTrigger: { trigger: '.cta-banner', start: 'top 80%', once: true },
        y: 40, opacity: 0, duration: 0.8, ease: 'power3.out',
    });

    // Marquee speed on scroll
    gsap.to('.marquee-content', {
        scrollTrigger: {
            trigger: '.marquee-section',
            start: 'top bottom',
            end: 'bottom top',
            scrub: 0.5,
        },
        x: -100,
        ease: 'none',
    });
}

/* ===== FAQ ACCORDION ===== */
document.querySelectorAll('.faq-q').forEach(btn => {
    btn.addEventListener('click', () => {
        const item = btn.parentElement;
        const wasActive = item.classList.contains('active');
        document.querySelectorAll('.faq-item.active').forEach(a => a.classList.remove('active'));
        if (!wasActive) item.classList.add('active');
    });
});

/* ===== CONTACT FORM ===== */
const form = document.getElementById('contactForm');
const formMsg = document.getElementById('formMsg');

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"] span');
    btn.textContent = 'Изпращане...';

    setTimeout(() => {
        formMsg.textContent = 'Благодарим ви! Ще се свържем с вас скоро.';
        formMsg.className = 'form-msg success';
        form.reset();
        btn.textContent = 'Изпратете запитване';
        setTimeout(() => { formMsg.className = 'form-msg'; }, 5000);
    }, 1500);
});

/* ===== SERVICE CARD GLOW FOLLOW (desktop only) ===== */
if (!isMobile) {
    document.querySelectorAll('.service-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            card.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(201, 168, 76, 0.04), var(--glass) 60%)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.background = '';
        });
    });
}

/* ===== INIT ===== */
navbar.classList.toggle('scrolled', window.scrollY > 60);
updateActiveNav();
