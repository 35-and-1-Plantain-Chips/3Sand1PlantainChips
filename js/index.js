document.addEventListener('DOMContentLoaded', () => {

    // --- DOM Element Selections ---
    const contactForm = document.getElementById('contactForm');
    const formStatus = document.getElementById('formStatus');

    const hamburgerBtn = document.querySelector('.hamburger-btn');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-menu a');
    const navCta = document.querySelector('.nav-cta');
    
    // Lightbox elements (kept for selection but functionality is disabled)
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const closeBtn = document.querySelector('.close-btn');

    const currentYearSpan = document.getElementById('currentYear');
    
    // Search elements (NEW)
    const siteSearchInput = document.getElementById('siteSearch');
    
    // --- Helper Functions for Search ---

    // Function to remove all existing highlights
    function removeHighlights() {
        document.querySelectorAll('.highlight').forEach(span => {
            const parent = span.parentNode;
            // Replace the span with its inner text content
            parent.replaceChild(document.createTextNode(span.textContent), span);
            // Clean up text nodes after replacement
            parent.normalize();
        });
    }

    // Function to handle the search logic
    window.filterContent = function() {
        let searchTerm = siteSearchInput ? siteSearchInput.value.trim() : '';

        // Clear any previous highlights first
        removeHighlights();

        if (!searchTerm) {
            return;
        }

        // 3. Find all text on the page (limiting to main content for performance)
        let mainContent = document.querySelector('main');
        if (!mainContent) return;

        // 4. Create a regular expression for the search term (case-insensitive and global)
        // Escapes special characters for regex safety
        const safeSearchTerm = searchTerm.replace(/([.?*+^$[\]\\(){}|-])/g, "\\$1");
        const searchRegex = new RegExp('(' + safeSearchTerm + ')', 'gi');

        // 5. Walk through the elements to find and replace text nodes
        const walker = document.createTreeWalker(mainContent, NodeFilter.SHOW_TEXT, null, false);
        let node;
        let firstHighlight = null;

        while (node = walker.nextNode()) {
            // Skip script and style tags
            if (node.parentElement.tagName !== 'SCRIPT' && node.parentElement.tagName !== 'STYLE') {
                const originalText = node.nodeValue;
                
                // Check if the search term is present
                if (searchRegex.test(originalText)) {
                    // Create a replacement span with a class for styling
                    const newHtml = originalText.replace(searchRegex, '<span class="highlight">$1</span>');
                    
                    // Create a temporary element to hold the new HTML structure
                    const tempDiv = document.createElement('div');
                    tempDiv.innerHTML = newHtml;
                    
                    // Keep track of the first highlight for scrolling
                    if (!firstHighlight) {
                        firstHighlight = tempDiv.querySelector('.highlight') || null;
                    }

                    // Replace the original text node with the new elements
                    node.parentNode.replaceChild(tempDiv, node);
                    
                    // Unpack the children of the temp div back into the DOM
                    while (tempDiv.firstChild) {
                        tempDiv.parentNode.insertBefore(tempDiv.firstChild, tempDiv);
                    }
                    tempDiv.remove();
                }
            }
        }
        
        // Scroll to the first highlight found
        if (firstHighlight) {
            firstHighlight.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }
    
    // Add event listener for the search button (if you included the button) and 'Enter' key
    if (siteSearchInput) {
        siteSearchInput.addEventListener('keydown', function(event) {
            if (event.key === 'Enter') {
                event.preventDefault(); // Prevent form submission if input is in a form
                window.filterContent();
            }
        });
    }
    

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
            formStatus.style.color = '#8B4513';
            
            setTimeout(() => {
                formStatus.textContent = 'Thank you! Your message has been sent successfully.';
                formStatus.style.color = 'green';
                contactForm.reset(); 
            }, 1000);
        });
    }

    // --- 2. Hamburger Menu Functionality ---
    const toggleMenu = () => {
        if (!navMenu || !hamburgerBtn) return;
        
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

    // --- 4. Gallery Lightbox Functionality (DISABLED) ---
    // This section has been commented out to fulfill the user request to disable the lightbox pop-up.
    /*
    galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            const img = item.querySelector('.gallery-thumbnail');
            if (lightbox && lightboxImg && lightboxCaption && img) {
                 lightbox.style.display = 'block';
                 lightboxImg.src = img.getAttribute('data-full') || img.src; 
                 lightboxCaption.textContent = img.alt;
            }
        });
    });

    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            if (lightbox) lightbox.style.display = 'none';
        });
    }

    if (lightbox) {
        lightbox.addEventListener('click', (event) => {
            if (event.target === lightbox) {
                lightbox.style.display = 'none';
            }
        });
    }
    */

    // --- 5. Automatically Set Copyright Year ---
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }
});