document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide Icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    /* ==========================================================================
       MOUSE GLOW BACKGROUND EFFECT
       ========================================================================== */
    const glowBg = document.getElementById('glowBg');
    if (glowBg) {
        document.addEventListener('mousemove', (e) => {
            // Use clientX/Y since the glow background is fixed
            glowBg.style.left = `${e.clientX}px`;
            glowBg.style.top = `${e.clientY}px`;
        });
    }

    /* ==========================================================================
       THEME TOGGLE (DARK / LIGHT)
       ========================================================================== */
    const themeToggleBtn = document.getElementById('themeToggle');
    const body = document.body;

    // Check for saved theme preference
    const savedTheme = localStorage.getItem('portfolio-theme');
    if (savedTheme === 'light') {
        body.classList.add('light-theme');
    }

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            body.classList.toggle('light-theme');
            
            // Save preference
            if (body.classList.contains('light-theme')) {
                localStorage.setItem('portfolio-theme', 'light');
            } else {
                localStorage.setItem('portfolio-theme', 'dark');
            }
        });
    }

    /* ==========================================================================
       TYPING ANIMATION
       ========================================================================== */
    const typingTextElement = document.getElementById('typing-text');
    if (typingTextElement) {
        const words = [
            "Web Developer",
            "Mobile App Developer",
            "System Developer"
        ];
        let wordIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let typingSpeed = 100;

        function type() {
            const currentWord = words[wordIndex];
            
            if (isDeleting) {
                // Remove character
                typingTextElement.textContent = currentWord.substring(0, charIndex - 1);
                charIndex--;
                typingSpeed = 50; // Deleting is faster
            } else {
                // Add character
                typingTextElement.textContent = currentWord.substring(0, charIndex + 1);
                charIndex++;
                typingSpeed = 150; // Normal typing speed
            }

            // Word completed
            if (!isDeleting && charIndex === currentWord.length) {
                // Pause at the end of the word
                typingSpeed = 2000;
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                // Move to next word
                wordIndex = (wordIndex + 1) % words.length;
                typingSpeed = 500; // Pause before starting new word
            }

            setTimeout(type, typingSpeed);
        }

        // Start typing loop
        setTimeout(type, 1000);
    }

    /* ==========================================================================
       SCROLL EFFECTS: STICKY NAV & ACTIVE LINKS
       ========================================================================== */
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
    const sections = document.querySelectorAll('section');

    window.addEventListener('scroll', () => {
        // Sticky Navbar styling
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Highlight Active Link in Navigation
        let currentSectionId = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            // Adjust threshold for better triggering (scroll offset plus about 150px)
            if (window.scrollY >= (sectionTop - 180)) {
                currentSectionId = section.getAttribute('id');
            }
        });

        if (currentSectionId) {
            // Desktop link active
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${currentSectionId}`) {
                    link.classList.add('active');
                }
            });

            // Mobile drawer link active
            mobileNavLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${currentSectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });

    /* ==========================================================================
       MOBILE DRAWER TOGGLE
       ========================================================================== */
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileDrawer = document.getElementById('mobileDrawer');
    const menuIcon = document.getElementById('menuIcon');

    if (mobileMenuBtn && mobileDrawer) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileDrawer.classList.toggle('open');
            
            // Change icon from menu to X
            const isOpen = mobileDrawer.classList.contains('open');
            if (isOpen) {
                menuIcon.setAttribute('data-lucide', 'x');
            } else {
                menuIcon.setAttribute('data-lucide', 'menu');
            }
            // Re-draw icon
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }
        });

        // Close drawer when clicking a link
        const allMobileLinks = document.querySelectorAll('.mobile-drawer a');
        allMobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileDrawer.classList.remove('open');
                menuIcon.setAttribute('data-lucide', 'menu');
                if (typeof lucide !== 'undefined') {
                    lucide.createIcons();
                }
            });
        });
    }

    /* ==========================================================================
       PROJECTS FILTERING
       ========================================================================== */
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from other buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            button.classList.add('active');

            const filterValue = button.getAttribute('data-filter');

            projectCards.forEach(card => {
                const category = card.getAttribute('data-category');
                
                // Reset card displays using grid/flex standard animations
                if (filterValue === 'all' || category === filterValue) {
                    card.style.display = 'flex';
                    // Animation trigger delay
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.95)';
                    // Hide after animation finishes
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });

    /* ==========================================================================
       CONTACT FORM VALIDATION & SUBMISSION
       ========================================================================== */
    const contactForm = document.getElementById('contactForm');
    const formSuccessOverlay = document.getElementById('formSuccess');
    const resetFormBtn = document.getElementById('resetFormBtn');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            let isFormValid = true;

            // List of fields to validate
            const fields = [
                { id: 'name', errorId: 'nameError', check: (val) => val.trim() !== '' },
                { id: 'email', errorId: 'emailError', check: (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim()) },
                { id: 'subject', errorId: 'subjectError', check: (val) => val.trim() !== '' },
                { id: 'message', errorId: 'messageError', check: (val) => val.trim() !== '' }
            ];

            fields.forEach(field => {
                const inputElement = document.getElementById(field.id);
                const errorElement = document.getElementById(field.errorId);
                const isValid = field.check(inputElement.value);

                if (!isValid) {
                    inputElement.parentElement.classList.add('invalid');
                    isFormValid = false;
                } else {
                    inputElement.parentElement.classList.remove('invalid');
                }
                
                // Add live validation feedback on input
                inputElement.addEventListener('input', () => {
                    if (field.check(inputElement.value)) {
                        inputElement.parentElement.classList.remove('invalid');
                    }
                });
            });

            if (isFormValid) {
                // Submit Simulation
                const submitBtn = document.getElementById('submitBtn');
                const sendIcon = document.getElementById('sendIcon');
                
                if (submitBtn) {
                    submitBtn.disabled = true;
                    submitBtn.querySelector('span').textContent = 'Inatuma...';
                    if (sendIcon) sendIcon.setAttribute('data-lucide', 'loader-2');
                    if (typeof lucide !== 'undefined') lucide.createIcons();
                }

                // Simulate server response after 1.5s
                setTimeout(() => {
                    formSuccessOverlay.classList.add('show');
                    
                    // Reset fields
                    contactForm.reset();
                    
                    // Restore submit button
                    if (submitBtn) {
                        submitBtn.disabled = false;
                        submitBtn.querySelector('span').textContent = 'Tuma Ujumbe';
                        if (sendIcon) sendIcon.setAttribute('data-lucide', 'send');
                        if (typeof lucide !== 'undefined') lucide.createIcons();
                    }
                }, 1500);
            }
        });
    }

    if (resetFormBtn && formSuccessOverlay) {
        resetFormBtn.addEventListener('click', () => {
            formSuccessOverlay.classList.remove('show');
        });
    }
});
