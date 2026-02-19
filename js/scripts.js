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

    // --- expandable project cards (modal) ---

    const projectCards = document.querySelectorAll('.project-card');
    const modalOverlay = document.querySelector('.project-modal-overlay');
    const modalTitle = modalOverlay.querySelector('.modal-title');
    const modalDescription = modalOverlay.querySelector('.modal-description');
    const galleryViewport = modalOverlay.querySelector('.gallery-viewport');
    const galleryContainer = modalOverlay.querySelector('.modal-gallery');
    const galleryCounter = modalOverlay.querySelector('.gallery-counter');
    const modalLinks = modalOverlay.querySelector('.modal-links');
    const prevBtn = modalOverlay.querySelector('.gallery-prev');
    const nextBtn = modalOverlay.querySelector('.gallery-next');
    const closeBtn = modalOverlay.querySelector('.modal-close');

    let galleryItems = [];
    let currentSlide = 0;

    // render the current slide into the viewport
    function showSlide(index) {
        // clear previous content
        galleryViewport.innerHTML = '';

        if (galleryItems.length === 0) {
            return;
        }

        // clamp index to valid range
        if (index < 0) {
            index = galleryItems.length - 1;
        }
        if (index >= galleryItems.length) {
            index = 0;
        }
        currentSlide = index;

        const item = galleryItems[currentSlide];

        if (item.type === 'video') {
            const video = document.createElement('video');
            video.src = item.src;
            video.controls = true;
            video.muted = true;
            video.alt = item.alt;
            galleryViewport.appendChild(video);
        }
        else {
            const img = document.createElement('img');
            img.src = item.src;
            img.alt = item.alt;
            galleryViewport.appendChild(img);
        }

        // update counter text
        galleryCounter.textContent = (currentSlide + 1) + ' / ' + galleryItems.length;
    }

    // open the modal with data from a clicked card
    function openModal(card) {
        modalTitle.textContent = card.dataset.title;
        modalDescription.textContent = card.dataset.description;

        // parse gallery data
        galleryItems = JSON.parse(card.dataset.gallery);
        currentSlide = 0;

        // show or hide gallery section
        if (galleryItems.length > 0) {
            galleryContainer.classList.add('has-items');
            showSlide(0);
        }
        else {
            galleryContainer.classList.remove('has-items');
            galleryCounter.textContent = '';
        }

        // build project link if one exists
        modalLinks.innerHTML = '';
        if (card.dataset.link) {
            const anchor = document.createElement('a');
            anchor.href = card.dataset.link;
            anchor.className = 'icon-btn';
            anchor.target = '_blank';
            anchor.rel = 'noopener noreferrer';

            if (card.dataset.linkType === 'logo') {
                const logo = document.createElement('img');
                logo.src = card.dataset.linkSrc;
                logo.alt = 'Project Website';
                logo.className = 'project-logo';
                anchor.appendChild(logo);

                // add "Website" label next to the logo
                const label = document.createElement('span');
                label.className = 'link-label';
                label.textContent = 'Website';
                anchor.appendChild(label);
            }
            else {
                const icon = document.createElement('i');
                icon.className = card.dataset.linkIcon;
                anchor.appendChild(icon);
            }

            // add label text next to the link if provided
            if (card.dataset.linkLabel) {
                const label = document.createElement('span');
                label.className = 'link-label';
                label.textContent = card.dataset.linkLabel;
                anchor.appendChild(label);
            }

            modalLinks.appendChild(anchor);
        }

        // reveal the overlay
        modalOverlay.classList.add('active');
        modalOverlay.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }

    // close the modal and reset state
    function closeModal() {
        modalOverlay.classList.remove('active');
        modalOverlay.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';

        // pause any playing video
        const activeVideo = galleryViewport.querySelector('video');
        if (activeVideo) {
            activeVideo.pause();
        }
    }

    // card click opens the modal
    for (let i = 0; i < projectCards.length; i++) {
        projectCards[i].addEventListener('click', function() {
            openModal(this);
        });
    }

    // gallery arrow navigation
    prevBtn.addEventListener('click', function(clickEvent) {
        clickEvent.stopPropagation();
        showSlide(currentSlide - 1);
    });

    nextBtn.addEventListener('click', function(clickEvent) {
        clickEvent.stopPropagation();
        showSlide(currentSlide + 1);
    });

    // close via button
    closeBtn.addEventListener('click', function(clickEvent) {
        clickEvent.stopPropagation();
        closeModal();
    });

    // close via clicking the backdrop
    modalOverlay.addEventListener('click', function(clickEvent) {
        if (clickEvent.target === modalOverlay) {
            closeModal();
        }
    });

    // close with the escape key
    document.addEventListener('keydown', function(keyEvent) {
        if (keyEvent.key === 'Escape') {
            closeModal();
        }
    });

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