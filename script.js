// ===============================
// Main JS for Interactive Portfolio
// ===============================

// -------------------------------
// Particle Canvas Background
// -------------------------------
class ParticleCanvas {
    constructor() {
        this.canvas = document.getElementById('particles-canvas');
        if (!this.canvas) return;

        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.mouseX = 0;
        this.mouseY = 0;
        this.resize();
        this.init();
        this.animate();

        window.addEventListener('resize', () => this.resize());
        window.addEventListener('mousemove', (e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
        });
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    init() {
        const particleCount = Math.min(100, Math.floor((this.canvas.width * this.canvas.height) / 15000));
        this.particles = [];
        for (let i = 0; i < particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                radius: Math.random() * 2 + 1,
                opacity: Math.random() * 0.5 + 0.2
            });
        }
    }

    drawParticle(p) {
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        this.ctx.fillStyle = `rgba(255,107,53,${p.opacity})`;
        this.ctx.fill();

        // Glow
        const gradient = this.ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius * 3);
        gradient.addColorStop(0, `rgba(255,107,53,${p.opacity * 0.8})`);
        gradient.addColorStop(1, 'rgba(255,107,53,0)');
        this.ctx.fillStyle = gradient;
        this.ctx.fill();
    }

    drawConnections() {
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const dx = this.particles[i].x - this.particles[j].x;
                const dy = this.particles[i].y - this.particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < 150) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                    this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                    this.ctx.strokeStyle = `rgba(0,217,255,${0.15 * (1 - distance / 150)})`;
                    this.ctx.lineWidth = 1;
                    this.ctx.stroke();
                }
            }
        }
    }

    updateParticle(p) {
        p.x += p.vx;
        p.y += p.vy;

        const dx = this.mouseX - p.x;
        const dy = this.mouseY - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 150) {
            const force = (150 - dist) / 150;
            p.vx -= (dx / dist) * force * 0.1;
            p.vy -= (dy / dist) * force * 0.1;
        }

        // Bounce off walls
        if (p.x < 0 || p.x > this.canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > this.canvas.height) p.vy *= -1;

        p.x = Math.max(0, Math.min(this.canvas.width, p.x));
        p.y = Math.max(0, Math.min(this.canvas.height, p.y));

        p.vx *= 0.99;
        p.vy *= 0.99;
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawConnections();
        this.particles.forEach(p => {
            this.updateParticle(p);
            this.drawParticle(p);
        });
        requestAnimationFrame(() => this.animate());
    }
}

// -------------------------------
// Navbar: Scroll + Mobile + Smooth
// -------------------------------
function initNavbar() {
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) navbar.classList.add('scrolled');
        else navbar.classList.remove('scrolled');
    });

    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close mobile menu when clicking anywhere on the screen
    document.addEventListener('click', (e) => {
        if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
        });
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const target = document.querySelector(targetId);
            if (target) {
                const offset = target.offsetTop - navbar.offsetHeight - 20;
                window.scrollTo({ top: offset, behavior: 'smooth' });
            }
        });
    });
}

// -------------------------------
// Skills Animation
// -------------------------------
function initSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress');
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.width = entry.target.getAttribute('data-progress') + '%';
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    skillBars.forEach(bar => observer.observe(bar));
}

// -------------------------------
// Back To Top Button
// -------------------------------
function initBackToTop() {
    const btn = document.getElementById('backToTop');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) btn.classList.add('show');
        else btn.classList.remove('show');
    });
    btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

// -------------------------------
// Intersection Animations
// -------------------------------
function initScrollAnimations() {
    const els = document.querySelectorAll('[data-aos]');
    const obs = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-' + entry.target.getAttribute('data-aos'));
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -100px 0px' });
    els.forEach(el => obs.observe(el));
}

// -------------------------------
// Card Hover Effects
// -------------------------------
function initCardEffects() {
    const cards = document.querySelectorAll('.project-card, .contact-card, .timeline-content, .highlight-item');
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = card.classList.contains('timeline-content') ? 'translateX(10px)' : 'translateY(-8px)';
        });
        card.addEventListener('mouseleave', () => { card.style.transform = ''; });
    });
}

// -------------------------------
// Section Reveal on Scroll
// -------------------------------
function initSectionReveals() {
    const sections = document.querySelectorAll('.section');
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('section-visible');
            }
        });
    }, { threshold: 0.1 });

    sections.forEach(section => {
        section.classList.add('section-hidden');
        observer.observe(section);
    });
}

// -------------------------------
// Active Navigation Link on Scroll
// -------------------------------
function initActiveNav() {
    const sections = document.querySelectorAll('.section, .hero');
    const links = document.querySelectorAll('.nav-link');
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(sec => {
            if (window.scrollY >= sec.offsetTop - 100) current = sec.getAttribute('id');
        });
        links.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === '#' + current);
        });
    });
}

// -------------------------------
// Typing Effect
// -------------------------------
function typeWriter(el, text, speed = 100) {
    let i = 0;
    el.textContent = '';
    function type() {
        if (i < text.length) {
            el.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    type();
}

// -------------------------------
// Glitch Effect on Hover
// -------------------------------
function initGlitchEffect() {
    const els = document.querySelectorAll('.gradient-text');
    els.forEach(el => {
        el.addEventListener('mouseenter', () => {
            el.style.animation = 'none';
            setTimeout(() => { el.style.animation = 'gradientShift 3s ease infinite'; }, 10);
        });
    });
}

// -------------------------------
// Cursor Trail
// -------------------------------
function initCursorTrail() {
    if (window.innerWidth <= 768) return;
    const trail = [];
    const length = 20;
    for (let i = 0; i < length; i++) {
        const dot = document.createElement('div');
        dot.className = 'cursor-trail';
        dot.style.cssText = `position:fixed;width:4px;height:4px;background:rgba(255,107,53,${1-i/length});border-radius:50%;pointer-events:none;z-index:9999;transition:all 0.1s ease;`;
        document.body.appendChild(dot);
        trail.push(dot);
    }
    let mouseX = 0, mouseY = 0;
    document.addEventListener('mousemove', e => { mouseX = e.clientX; mouseY = e.clientY; });

    function animateTrail() {
        let x = mouseX, y = mouseY;
        trail.forEach((dot, i) => {
            dot.style.left = x + 'px';
            dot.style.top = y + 'px';
            const next = trail[i+1] || trail[0];
            x += (parseInt(next.style.left) - x) * 0.3;
            y += (parseInt(next.style.top) - y) * 0.3;
        });
        requestAnimationFrame(animateTrail);
    }
    animateTrail();
}

// -------------------------------
// Project Stats Animation on Scroll
// -------------------------------
function initProjectStatsAnimation() {
    const projectCards = document.querySelectorAll('.project-card');
    
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const stats = entry.target.querySelectorAll('.stat');
                stats.forEach((stat, index) => {
                    stat.style.opacity = '0';
                    stat.style.transform = 'translateX(-20px)';
                    setTimeout(() => {
                        stat.style.transition = 'all 0.4s ease';
                        stat.style.opacity = '1';
                        stat.style.transform = 'translateX(0)';
                    }, index * 100);
                });
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });
    
    projectCards.forEach(card => observer.observe(card));
}

// -------------------------------
// Scroll Gradient Shift
// -------------------------------
function initScrollGradient() {
    const texts = document.querySelectorAll('.gradient-text');
    window.addEventListener('scroll', () => {
        const percent = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
        texts.forEach(t => t.style.filter = `hue-rotate(${percent*60}deg)`);
    });
}

// -------------------------------
// Utility: Debounce
// -------------------------------
function debounce(func, wait) {
    let timeout;
    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
}

// -------------------------------
// Initialize Everything
// -------------------------------
document.addEventListener('DOMContentLoaded', () => {
    new ParticleCanvas();
    initNavbar();
    initSkillBars();
    initBackToTop();
    initScrollAnimations();
    initCardEffects();
    initSectionReveals();
    initActiveNav();
    initGlitchEffect();
    initProjectStatsAnimation();
    if (window.innerWidth > 768) initCursorTrail();
    initScrollGradient();

    // Page fade-in
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
});

// Optimize scroll events
window.addEventListener('scroll', debounce(() => {}, 10));

// Visibility handling for performance
document.addEventListener('visibilitychange', () => {
    console.log(document.hidden ? 'Page hidden' : 'Page visible');
});

// Detect touch devices
if ('ontouchstart' in window || navigator.maxTouchPoints > 0) document.body.classList.add('touch-device');

// Prevent FOUC
window.addEventListener('load', () => document.body.classList.add('loaded'));
