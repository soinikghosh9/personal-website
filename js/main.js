// Update current year in footer
const currentYearSpan = document.getElementById('current-year');
if (currentYearSpan) {
    currentYearSpan.textContent = new Date().getFullYear();
}

// Smooth scrolling for navigation links
document.querySelectorAll('#navbar a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            const navbarHeight = document.getElementById('navbar') ? document.getElementById('navbar').offsetHeight : 70; 
            const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - (navbarHeight + 40);

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Intersection Observer for Reveal Animations (Apple-style entrance)
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('is-visible'); 
            revealObserver.unobserve(entry.target); 
        }
    });
}, {
    threshold: 0.05,
    rootMargin: '0px 0px 50px 0px' // Trigger slightly before it enters
});

document.addEventListener('DOMContentLoaded', () => {
    // Only observe elements that explicitly use the reveal class
    const elements = document.querySelectorAll('.reveal');
    elements.forEach(el => {
        revealObserver.observe(el);
    });
});
// Highlight active navigation link based on scroll position
const sections = document.querySelectorAll('main section[id]');
const navLinks = document.querySelectorAll('#navbar ul li a');

window.addEventListener('scroll', () => {
    let current = "";
    sections.forEach((section) => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= sectionTop - 150) {
            current = section.getAttribute("id");
        }
    });

    navLinks.forEach((a) => {
        a.classList.remove("active");
        if (a.getAttribute("href").includes(current)) {
            a.classList.add("active");
        }
    });
});

console.log("Apple Glossy Minimalism Redesign Active.");

// ── Hamburger / Mobile Nav ────────────────────────────────────
const hamburger = document.getElementById('nav-hamburger');
const drawer    = document.getElementById('nav-drawer');
const overlay   = document.getElementById('nav-overlay');

function openDrawer() {
  hamburger.classList.add('is-open');
  hamburger.setAttribute('aria-expanded', 'true');
  drawer.classList.add('is-open');
  drawer.setAttribute('aria-hidden', 'false');
  overlay.classList.add('is-open');
  document.body.style.overflow = 'hidden';
}

function closeDrawer() {
  hamburger.classList.remove('is-open');
  hamburger.setAttribute('aria-expanded', 'false');
  drawer.classList.remove('is-open');
  drawer.setAttribute('aria-hidden', 'true');
  overlay.classList.remove('is-open');
  document.body.style.overflow = '';
}

if (hamburger) {
  hamburger.addEventListener('click', () => {
    drawer.classList.contains('is-open') ? closeDrawer() : openDrawer();
  });
}

if (overlay) {
  overlay.addEventListener('click', closeDrawer);
}

// Close drawer when any link inside it is clicked
if (drawer) {
  drawer.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeDrawer);
  });
}