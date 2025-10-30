document.addEventListener('DOMContentLoaded', () => {

    // --- DOM Element Selections ---
    const contactForm = document.getElementById('contactForm');
    const formStatus = document.getElementById('formStatus');

    const hamburgerBtn = document.querySelector('.hamburger-btn');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-menu a');
    const navCta = document.querySelector('.nav-cta');
    
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const closeBtn = document.querySelector('.close-btn');

    const currentYearSpan = document.getElementById('currentYear');

    // --- 1. Contact Form Functionality ---
    if (contactForm) {
        contactForm.addEventListener('submit', function(event) {
            event.preventDefault(); 
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const message = document.getElementById('message').value.trim();

            if (!name || !email || !message) {
                formStatus.textContent = 'Please fill out all fields.';
                formStatus.style.color = 'red';
                return;
            }

            // Simulate form submission success
            formStatus.textContent = 'Sending...';
            formStatus.style.color = '#8B4513'; // Use accent color while sending
            
            setTimeout(() => {
                formStatus.textContent = 'Thank you! Your message has been sent successfully.';
                formStatus.style.color = 'green';
                contactForm.reset(); 
            }, 1000);
        });
    }

    // --- 2. Hamburger Menu Functionality ---
    const toggleMenu = () => {
        if (!navMenu || !hamburgerBtn) return; // Guard clause
        
        navMenu.classList.toggle('active');
        const icon = hamburgerBtn.querySelector('i');
        
        if (icon) {
            if (navMenu.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        }
    };

    if (hamburgerBtn) {
        hamburgerBtn.addEventListener('click', toggleMenu);
    }
    
    // Close menu when a link is clicked (mobile navigation)
    const allNavItems = [...navLinks, navCta].filter(item => item !== null);

    allNavItems.forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu && navMenu.classList.contains('active')) {
                toggleMenu();
            }
        });
    });

    // --- 3. Smooth Scrolling ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetElement = document.querySelector(this.getAttribute('href'));
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // --- 4. Gallery Lightbox Functionality (NEW) ---
    galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            const img = item.querySelector('.gallery-thumbnail');
            if (lightbox && lightboxImg && lightboxCaption && img) {
                 lightbox.style.display = 'block';
                 // Ensure the 'data-full' attribute is set in the HTML for full-size images
                 lightboxImg.src = img.getAttribute('data-full') || img.src; 
                 lightboxCaption.textContent = img.alt;
            }
        });
    });

    // Close the lightbox when the close button is clicked
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            if (lightbox) lightbox.style.display = 'none';
        });
    }

    // Close the lightbox when clicking anywhere outside the image
    if (lightbox) {
        lightbox.addEventListener('click', (event) => {
            if (event.target === lightbox) {
                lightbox.style.display = 'none';
            }
        });
    }

    // --- 5. Automatically Set Copyright Year (NEW) ---
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }
});