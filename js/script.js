/**
 * Aimdal - Interactive Landing Page Scripts
 * Handles animations, particles, scroll effects, and UI interactions
 */

document.addEventListener('DOMContentLoaded', () => {
    initCustomCursor();
    initScrollProgress();
    initParticles();
    initNavbar();
    initMobileMenu();
    initScrollAnimations();
    initCounterAnimations();
    initSmoothScroll();
    init3DTilt();
});

/**
 * 3D Tilt Effect for Cards
 */
function init3DTilt() {
    // Only initialize on non-touch devices
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const cards = document.querySelectorAll('.feature-card, .step, .testimonial-card');

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            // Calculate rotation based on cursor position relative to card center
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -10; // Max 10 deg rotation
            const rotateY = ((x - centerX) / centerX) * 10;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
            card.style.transition = 'none';
            card.style.zIndex = '10';
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
            card.style.transition = 'transform 0.5s cubic-bezier(0.23, 1, 0.32, 1)';
            card.style.zIndex = '1';
        });

        card.addEventListener('mouseenter', () => {
            card.style.transition = 'none';
        });
    });
}

/**
 * Custom Cursor Implementation
 */
function initCustomCursor() {
    // Only initialize on non-touch devices
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';

    const cursorFollower = document.createElement('div');
    cursorFollower.className = 'custom-cursor-follower';

    document.body.appendChild(cursor);
    document.body.appendChild(cursorFollower);

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;

        // Update main cursor instantly
        cursor.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
    });

    // We'll update the follower position via requestAnimationFrame
    let followerX = mouseX;
    let followerY = mouseY;

    function updateFollower() {
        // Simple easing
        followerX += (mouseX - followerX) * 0.15;
        followerY += (mouseY - followerY) * 0.15;

        cursorFollower.style.transform = `translate3d(${followerX}px, ${followerY}px, 0)`;
        requestAnimationFrame(updateFollower);
    }

    updateFollower();

    // Add hover effect for clickable elements
    const updateHoverState = () => {
        const clickables = document.querySelectorAll('a, button, .feature-card, .step, .map-marker, .pbr-listen-btn, .testimonial-card');

        clickables.forEach(el => {
            // Prevent duplicate listeners by marking the element
            if (el.dataset.cursorTracked) return;
            el.dataset.cursorTracked = "true";

            el.addEventListener('mouseenter', () => {
                cursor.classList.add('cursor-hover');
                cursorFollower.classList.add('cursor-hover');
            });
            el.addEventListener('mouseleave', () => {
                cursor.classList.remove('cursor-hover');
                cursorFollower.classList.remove('cursor-hover');
            });
        });
    };

    // Call once, and potentially call again if DOM changes drastically
    updateHoverState();
}

/**
 * Scroll Progress Bar
 */
function initScrollProgress() {
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress-bar';
    document.body.appendChild(progressBar);

    const updateScroll = () => {
        const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (window.scrollY / windowHeight) * 100;
        progressBar.style.width = `${scrolled}%`;
    };

    window.addEventListener('scroll', updateScroll);
    updateScroll(); // Initial call
}

/**
 * Particle Background System - Enhanced with diverse shapes
 */
function initParticles() {
    const container = document.getElementById('particles-container');
    if (!container) return;

    const particleCount = 60;
    const fragment = document.createDocumentFragment();

    for (let i = 0; i < particleCount; i++) {
        createParticle(fragment);
    }

    container.appendChild(fragment);
}

function createParticle(parent) {
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

    parent.appendChild(particle);
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
        '.feature-card, .step, .testimonial-card, .experience-item, .requirement-card, .tutorial-chapter, .chapter-info, .chapter-visual, .summary-card'
    );

    const progressFills = document.querySelectorAll('.feature-card .progress-fill');

    if (animatedElements.length === 0 && progressFills.length === 0) return;

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (entry.target.classList.contains('progress-fill')) {
                    entry.target.classList.add('animate-progress');
                } else {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
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

    progressFills.forEach(el => observer.observe(el));
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
(() => {
    const hero = document.querySelector('.hero');
    let ticking = false;

    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const scrolled = window.pageYOffset;

                if (hero && scrolled < window.innerHeight) {
                    const rate = scrolled * 0.3;
                    hero.style.backgroundPositionY = rate + 'px';
                }
                ticking = false;
            });
            ticking = true;
        }
    });
})();

/**
 * Mouse Move Effect for Glow
 */
let glowElements = null;
let glowTicking = false;
let mouseX = 0;
let mouseY = 0;

function updateGlowElements() {
    if (!glowElements) {
        glowElements = document.querySelectorAll('.phone-glow, .phones-glow, .pbr-phone-glow');
    }

    glowElements.forEach(glow => {
        const rect = glow.parentElement.getBoundingClientRect();
        const x = mouseX - rect.left - rect.width / 2;
        const y = mouseY - rect.top - rect.height / 2;

        glow.style.transform = `translate(calc(-50% + ${x * 0.05}px), calc(-50% + ${y * 0.05}px))`;
    });

    glowTicking = false;
}

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    if (!glowTicking) {
        requestAnimationFrame(updateGlowElements);
        glowTicking = true;
    }
});

// Initialize audio waves after DOM load
setTimeout(initAudioWaves, 1000);

// Console Easter Egg
console.log('%c✈️ Aimdal', 'font-size: 24px; font-weight: bold; color: #8B5CF6;');
console.log('%cExplore the world with AI', 'font-size: 14px; color: #06B6D4;');

