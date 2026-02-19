// run after the dom is ready
document.addEventListener('DOMContentLoaded', function() {

    // grab all the elements we'll need throughout the script
    const tabs = document.querySelectorAll('.tab');
    const navBrand = document.querySelector('.nav-brand');
    const nav = document.querySelector('nav.toolbar');
    const hamburger = document.querySelector('.hamburger');
    const hamburgerIcon = hamburger.querySelector('i');
    const themeToggle = document.querySelector('.theme-toggle');
    const themeIcon = themeToggle.querySelector('i');
    const navLinks = document.querySelectorAll('nav a');
    const contactForm = document.querySelector('.contact-form');

    // --- active tab highlighting ---

    function setActiveTab() {
        const scrollPosition = window.scrollY;
        const navHeight = nav.offsetHeight;
        const sections = document.querySelectorAll('section');

        // clear all active states before re-evaluating
        for (let i = 0; i < tabs.length; i++) {
            tabs[i].classList.remove('active');
        }
        navBrand.classList.remove('active');

        // if we haven't scrolled past the first section yet, highlight the brand
        if (scrollPosition < sections[0].offsetTop - navHeight) {
            navBrand.classList.add('active');
            return;
        }

        // highlight the tab whose section is currently in view
        for (let i = 0; i < sections.length; i++) {
            const sectionTop = sections[i].offsetTop - navHeight - 10;
            const sectionBottom = sectionTop + sections[i].offsetHeight;

            if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                tabs[i].classList.add('active');
            }
        }
    }

    // update active tab on scroll and once on initial load
    window.addEventListener('scroll', setActiveTab);
    setActiveTab();

    // --- theme toggle ---

    // sync the icon with whatever theme was set before the page loaded
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

    // --- hamburger menu ---

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

    // close the menu whenever a tab link is clicked
    for (let i = 0; i < tabs.length; i++) {
        tabs[i].addEventListener('click', closeMenu);
    }

    // close the menu when clicking anywhere outside the navbar
    document.addEventListener('click', function(clickEvent) {
        if (!nav.contains(clickEvent.target)) {
            closeMenu();
        }
    });

    // --- smooth scrolling ---

    for (let i = 0; i < navLinks.length; i++) {
        navLinks[i].addEventListener('click', function(clickEvent) {
            clickEvent.preventDefault();

            const href = this.getAttribute('href');

            // the brand link always scrolls back to the very top
            if (href === '#') {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
                return;
            }

            // scroll to the section matching the link's href
            const targetId = href.substring(1);
            const targetSection = document.getElementById(targetId);

            if (targetSection) {
                const navbarHeight = nav.offsetHeight;
                const targetPosition = targetSection.getBoundingClientRect().top;
                const startPosition = window.pageYOffset;
                const offset = targetPosition + startPosition - navbarHeight;

                window.scrollTo({
                    top: offset,
                    behavior: 'smooth'
                });
            }
        });
    }

    // --- contact form submission via formspree ---

    if (contactForm) {
        contactForm.addEventListener('submit', async function(submitEvent) {
            submitEvent.preventDefault();

            const submitBtn = contactForm.querySelector('.submit-btn');
            submitBtn.textContent = 'sending...';
            submitBtn.disabled = true;

            // build form data outside the fetch call to keep things readable
            const formData = new FormData(contactForm);

            try {
                const response = await fetch(contactForm.action, {
                    method: 'POST',
                    body: formData,
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