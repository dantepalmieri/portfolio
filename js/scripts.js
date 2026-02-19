// run after the dom is ready
document.addEventListener('DOMContentLoaded', function() {
    // active tab tracking
    const tabs = document.querySelectorAll('.tab');
    const navBrand = document.querySelector('.nav-brand');
    
    function setActiveTab() {
        const scrollPosition = window.scrollY;
        const navHeight = document.querySelector('nav.toolbar').offsetHeight;
        const sections = document.querySelectorAll('section');

        // clear all active states
        tabs.forEach(tab => tab.classList.remove('active'));
        navBrand.classList.remove('active');

        // if scrolled above the first section, highlight the brand
        if (scrollPosition < sections[0].offsetTop - navHeight) {
            navBrand.classList.add('active');
            return;
        }

        // highlight the tab matching the current section
        sections.forEach((section, index) => {
            const sectionTop = section.offsetTop - navHeight - 10;
            const sectionBottom = sectionTop + section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                tabs[index].classList.add('active');
            }
        });
    }

    // update active tab on scroll and on initial load
    window.addEventListener('scroll', setActiveTab);
    setActiveTab();

    // theme toggle setup
    const themeToggle = document.querySelector('.theme-toggle');
    const themeIcon = themeToggle.querySelector('i');

    // sync icon with theme applied before page load
    if (document.documentElement.getAttribute('data-theme') === 'light') {
        themeIcon.classList.replace('fa-sun', 'fa-moon');
    }

    themeToggle.addEventListener('click', function() {
        const isLight = document.documentElement.getAttribute('data-theme') === 'light';
        if (isLight) {
            document.documentElement.removeAttribute('data-theme');
            themeIcon.classList.replace('fa-moon', 'fa-sun');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
            themeIcon.classList.replace('fa-sun', 'fa-moon');
            localStorage.setItem('theme', 'light');
        }
    });
    
    // hamburger menu
    const hamburger = document.querySelector('.hamburger');
    const hamburgerIcon = hamburger.querySelector('i');
    const nav = document.querySelector('nav.toolbar');

    function closeMenu() {
        nav.classList.remove('nav-open');
        hamburgerIcon.classList.replace('fa-times', 'fa-bars');
        hamburger.setAttribute('aria-expanded', 'false');
    }

    hamburger.addEventListener('click', function() {
        const isOpen = nav.classList.toggle('nav-open');
        hamburgerIcon.classList.toggle('fa-bars', !isOpen);
        hamburgerIcon.classList.toggle('fa-times', isOpen);
        hamburger.setAttribute('aria-expanded', String(isOpen));
    });

    // close menu when a tab link is clicked
    tabs.forEach(tab => tab.addEventListener('click', closeMenu));

    // close menu when clicking outside the navbar
    document.addEventListener('click', function(e) {
        if (!nav.contains(e.target)) closeMenu();
    });

    // smooth scroll for all nav links
    const navLinks = document.querySelectorAll('nav a');
    
    // handle click on each nav link
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const href = this.getAttribute('href');
            
            // home button scrolls to top
            if (href === '#') {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
                return;
            }
            
            // scroll to the target section
            const targetId = href.substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                const navbarHeight = document.querySelector('nav.toolbar').offsetHeight;
                const targetPosition = targetSection.getBoundingClientRect().top;
                const startPosition = window.pageYOffset;
                const offset = targetPosition + startPosition - navbarHeight;
                
                window.scrollTo({
                    top: offset,
                    behavior: 'smooth'
                });
            }
        });
    });

    // contact form submission via formspree
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const submitBtn = contactForm.querySelector('.submit-btn');
            submitBtn.textContent = 'sending...';
            submitBtn.disabled = true;

            try {
                const response = await fetch(contactForm.action, {
                    method: 'POST',
                    body: new FormData(contactForm),
                    headers: { 'Accept': 'application/json' }
                });
                if (response.ok) {
                    contactForm.innerHTML = '<p class="form-success">message sent! i\'ll get back to you soon.</p>';
                } else {
                    submitBtn.textContent = 'send_message()';
                    submitBtn.disabled = false;
                    alert('something went wrong. please try again.');
                }
            } catch {
                submitBtn.textContent = 'send_message()';
                submitBtn.disabled = false;
                alert('something went wrong. please try again.');
            }
        });
    }
});