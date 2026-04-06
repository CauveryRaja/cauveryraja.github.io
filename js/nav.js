// Nav: add .scrolled class on scroll
const nav = document.getElementById('site-nav');

window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }
});

// ── Active nav link on scroll ─────────────────────────────────────────────────

const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            navLinks.forEach(link => {
                link.classList.toggle(
                    'is-active',
                    link.getAttribute('href') === `#${entry.target.id}`
                );
            });
        }
    });
}, { threshold: 0.4 });

sections.forEach(s => sectionObserver.observe(s));

// ── Scroll-in animations via IntersectionObserver
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

// ── Stat counters ─────────────────────────────────────────────────────────────

function animateCounter(numEl, target, suffix, duration) {
    const start = performance.now();
    const tick = (now) => {
        const t = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - t, 4); // easeOutQuart
        numEl.textContent = Math.floor(eased * target).toLocaleString();
        if (t < 1) {
            requestAnimationFrame(tick);
        } else {
            numEl.textContent = target.toLocaleString() + suffix;
        }
    };
    requestAnimationFrame(tick);
}

// ── Experience helpers ────────────────────────────────────────────────────────

const CAREER_START = '2018-06-01';

function daysSince(dateStr) {
    return Math.floor((Date.now() - new Date(dateStr)) / 86400000);
}

function yearsSince(dateStr) {
    return (Date.now() - new Date(dateStr)) / (1000 * 60 * 60 * 24 * 365.25);
}

// Returns a prose string: "almost 8 years", "over 7 years", "7+ years"
function formatYearsProse(dateStr) {
    const years = yearsSince(dateStr);
    const floor = Math.floor(years);
    const fraction = years - floor;
    if (fraction >= 0.75) return `Almost ${floor + 1} years`;
    if (fraction >= 0.4)  return `Over ${floor} years`;
    return `${floor}+ years`;
}

// Populate dynamic stat targets
const daysItem = document.querySelector('[data-dynamic="days"]');
if (daysItem) daysItem.dataset.target = daysSince(CAREER_START);

const yearsItem = document.querySelector('[data-dynamic="years"]');
if (yearsItem) yearsItem.dataset.target = Math.floor(yearsSince(CAREER_START));

// Populate bio years prose
const bioYearsEl = document.getElementById('bio-years');
if (bioYearsEl) bioYearsEl.textContent = formatYearsProse(CAREER_START);

const statItems = document.querySelectorAll('.stat-item');

const statObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            const el = entry.target;
            const numEl = el.querySelector('.stat-item__number');
            const target = parseInt(el.dataset.target, 10);
            const suffix = el.dataset.suffix || '';
            const idx = Array.from(statItems).indexOf(el);
            setTimeout(() => {
                el.classList.add('is-visible');
                animateCounter(numEl, target, suffix, 2000);
            }, idx * 150);
            statObserver.unobserve(el);
        }
    });
}, { threshold: 0.3 });

statItems.forEach(el => statObserver.observe(el));
