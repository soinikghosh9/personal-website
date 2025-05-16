// Smooth scrolling for navigation links
document.querySelectorAll('#navbar a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            const navbarHeight = document.getElementById('navbar') ? document.getElementById('navbar').offsetHeight : 70; 
            const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navbarHeight - 20; // 20px buffer

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Highlight active navigation link based on scroll position
const sections = document.querySelectorAll('main section[id]');
const navLiAnchors = document.querySelectorAll('#navbar ul li a');
const navHeight = document.getElementById('navbar') ? document.getElementById('navbar').offsetHeight : 70; 

window.addEventListener('scroll', () => {
    let currentSectionId = '';
    let minDistance = Infinity; 

    sections.forEach(section => {
        const sectionTopViewport = section.getBoundingClientRect().top;
        const activationPoint = navHeight + 60; 

        if (sectionTopViewport < activationPoint + (section.offsetHeight * 0.5) && sectionTopViewport + section.offsetHeight > activationPoint - (section.offsetHeight * 0.2)) {
            const distanceToActivation = Math.abs(sectionTopViewport - activationPoint);
            if (distanceToActivation < minDistance) {
                minDistance = distanceToActivation;
                currentSectionId = section.getAttribute('id');
            }
        }
    });
    
    if (!currentSectionId && sections.length > 0) {
        if (window.pageYOffset < sections[0].offsetTop - navHeight) {
            currentSectionId = sections[0].getAttribute('id');
        } else {
            for (let i = sections.length - 1; i >= 0; i--) {
                const section = sections[i];
                const sectionTop = section.offsetTop - navHeight - 60; 
                if (window.pageYOffset >= sectionTop - 50) { 
                    currentSectionId = section.getAttribute('id');
                    break;
                }
            }
        }
        if (!currentSectionId && sections.length > 0 && window.pageYOffset > 100) {
            for (const section of sections) {
                if (section.getBoundingClientRect().top > navHeight - 50) { 
                    currentSectionId = section.id;
                    break;
                }
            }
        }
        if (!currentSectionId && sections.length > 0) {
            currentSectionId = sections[0].getAttribute('id');
        }
    }

    navLiAnchors.forEach(a => {
        a.classList.remove('active');
        if (a.getAttribute('href').substring(1) === currentSectionId) {
            a.classList.add('active');
        }
    });

    if (window.pageYOffset < (sections[0] ? sections[0].offsetTop - navHeight - 60 : 200) && currentSectionId !== (sections[0] ? sections[0].id : '')) {
         if (navLiAnchors.length > 0 && sections[0]) {
             navLiAnchors.forEach(a => a.classList.remove('active'));
         }
    }
});

// Update current year in footer
const currentYearSpan = document.getElementById('current-year');
if (currentYearSpan) {
    currentYearSpan.textContent = new Date().getFullYear();
}

console.log("Portfolio JavaScript Loaded. Refined Teal & Copper Elegance theme active.");