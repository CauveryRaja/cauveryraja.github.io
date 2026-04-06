// Nav: add .scrolled class on scroll
const nav = document.getElementById('site-nav');

window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }
});

// Scroll-in animations via IntersectionObserver
const animatedEls = document.querySelectorAll('.skill-card, .timeline__card');

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
            // Stagger cards slightly
            const delay = entry.target.closest('.skills__grid')
                ? Array.from(entry.target.parentElement.children).indexOf(entry.target) * 80
                : 0;
            setTimeout(() => {
                entry.target.classList.add('is-visible');
            }, delay);
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.15 });

animatedEls.forEach(el => observer.observe(el));
