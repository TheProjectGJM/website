/**
 * Aimdal - Interactive Landing Page Scripts
 * Handles animations, particles, scroll effects, and UI interactions
 */

document.addEventListener('DOMContentLoaded', () => {
    initParticles();
    initNavbar();
    initMobileMenu();
    initScrollAnimations();
    initCounterAnimations();
    initSmoothScroll();
});

/**
 * Particle Background System - Enhanced with diverse shapes
 */
function initParticles() {
    const container = document.getElementById('particles-container');
    if (!container) return;

    const particleCount = 60;

    for (let i = 0; i < particleCount; i++) {
        createParticle(container);
    }
}

function createParticle(container) {
    const particle = document.createElement('div');

    // Shape types with their weights (more dots, fewer complex shapes)
    const shapes = [
        { type: 'dot', weight: 35 },
        { type: 'ring', weight: 10 },
        { type: 'square', weight: 15 },
        { type: 'line', weight: 15 },
        { type: 'diamond', weight: 15 },
        { type: 'cross', weight: 10 }
    ];

    // Weighted random selection
    const totalWeight = shapes.reduce((sum, s) => sum + s.weight, 0);
    let random = Math.random() * totalWeight;
    let selectedShape = 'dot';

    for (const shape of shapes) {
        random -= shape.weight;
        if (random <= 0) {
            selectedShape = shape.type;
            break;
        }
    }

    particle.className = `particle particle--${selectedShape}`;

    // Random position
    particle.style.left = Math.random() * 100 + '%';
    particle.style.top = Math.random() * 100 + '%';

    // Size based on shape type
    let size;
    switch (selectedShape) {
        case 'ring':
            size = Math.random() * 10 + 8;
            break;
        case 'cross':
            size = Math.random() * 8 + 6;
            break;
        case 'line':
            size = Math.random() * 15 + 10;
            particle.style.height = '2px';
            particle.style.setProperty('--rotation', Math.random() * 360 + 'deg');
            particle.style.transform = `rotate(${Math.random() * 360}deg)`;
            break;
        case 'diamond':
            size = Math.random() * 5 + 4;
            break;
        case 'square':
            size = Math.random() * 4 + 3;
            break;
        default: // dot
            size = Math.random() * 4 + 2;
    }

    particle.style.width = size + 'px';
    if (selectedShape !== 'line') {
        particle.style.height = size + 'px';
    }

    // Lighter, more varied color palette
    const colors = [
        'rgba(139, 92, 246, 0.8)',   // purple
        'rgba(6, 182, 212, 0.8)',     // cyan  
        'rgba(236, 72, 153, 0.7)',    // pink
        'rgba(59, 130, 246, 0.8)',    // blue
        'rgba(167, 139, 250, 0.7)',   // light purple
        'rgba(34, 211, 238, 0.7)',    // light cyan
        'rgba(255, 255, 255, 0.5)',   // soft white
        'rgba(129, 140, 248, 0.7)'    // indigo
    ];

    const selectedColor = colors[Math.floor(Math.random() * colors.length)];

    if (selectedShape === 'ring') {
        particle.style.borderColor = selectedColor;
        particle.style.color = selectedColor;
    } else if (selectedShape === 'cross') {
        particle.style.color = selectedColor;
    } else {
        particle.style.background = selectedColor;
    }

    // Random animation duration and delay
    particle.style.animationDuration = (Math.random() * 25 + 12) + 's';
    particle.style.animationDelay = (Math.random() * 8) + 's';

    container.appendChild(particle);
}

/**
 * Navbar Scroll Effect
 */
function initNavbar() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;

    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    });
}

/**
 * Mobile Menu Toggle
 */
function initMobileMenu() {
    const menuBtn = document.getElementById('mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    if (!menuBtn || !navLinks) return;

    menuBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        menuBtn.classList.toggle('active');
    });

    // Close menu when clicking a link
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            menuBtn.classList.remove('active');
        });
    });
}

/**
 * Scroll-triggered Animations
 */
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll(
        '.feature-card, .step, .testimonial-card, .experience-item, .requirement-card'
    );

    if (animatedElements.length === 0) return;

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    animatedElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = `opacity 0.35s ease ${index * 0.05}s, transform 0.35s ease ${index * 0.05}s`;
        observer.observe(el);
    });
}

/**
 * Counter Animation for Statistics
 */
function initCounterAnimations() {
    const counters = document.querySelectorAll('.stat-number[data-count]');
    if (counters.length === 0) return;

    const observerOptions = {
        threshold: 0.5
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    counters.forEach(counter => observer.observe(counter));
}

function animateCounter(element) {
    const target = parseInt(element.dataset.count);
    const duration = 2000;
    const start = 0;
    const startTime = performance.now();

    function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Easing function for smooth animation
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const current = Math.floor(start + (target - start) * easeOutQuart);

        // Format number with K or M suffix
        if (current >= 1000000) {
            element.textContent = (current / 1000000).toFixed(1) + 'M+';
        } else if (current >= 1000) {
            element.textContent = (current / 1000).toFixed(0) + 'K+';
        } else {
            element.textContent = current + '+';
        }

        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        }
    }

    requestAnimationFrame(updateCounter);
}

/**
 * Smooth Scroll for Anchor Links
 */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;

            e.preventDefault();
            const target = document.querySelector(href);

            if (target) {
                const navHeight = document.getElementById('navbar')?.offsetHeight || 0;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * Audio Wave Animation Enhancement
 */
function initAudioWaves() {
    const waves = document.querySelectorAll('.audio-wave span');
    if (waves.length === 0) return;

    waves.forEach((wave, index) => {
        const randomHeight = () => Math.random() * 20 + 10;

        setInterval(() => {
            wave.style.height = randomHeight() + 'px';
        }, 200 + index * 50);
    });
}

/**
 * Parallax Effect for Hero Section
 */
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');

    if (hero && scrolled < window.innerHeight) {
        const rate = scrolled * 0.3;
        hero.style.backgroundPositionY = rate + 'px';
    }
});

/**
 * Mouse Move Effect for Glow
 */
document.addEventListener('mousemove', (e) => {
    const glowElements = document.querySelectorAll('.phone-glow, .phones-glow');

    glowElements.forEach(glow => {
        const rect = glow.parentElement.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        glow.style.transform = `translate(calc(-50% + ${x * 0.05}px), calc(-50% + ${y * 0.05}px))`;
    });
});

/**
 * Lazy Loading for Images
 */
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');

    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
}

/**
 * Form Handling (for future newsletter/contact forms)
 */
function handleFormSubmit(formId, callback) {
    const form = document.getElementById(formId);
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(form);
        const data = Object.fromEntries(formData);

        try {
            // Add your form submission logic here
            if (callback) callback(data);
            form.reset();
        } catch (error) {
            console.error('Form submission error:', error);
        }
    });
}

// Initialize audio waves after DOM load
setTimeout(initAudioWaves, 1000);

// Console Easter Egg
console.log('%c✈️ Aimdal', 'font-size: 24px; font-weight: bold; color: #8B5CF6;');
console.log('%cExplore the world with AI', 'font-size: 14px; color: #06B6D4;');
