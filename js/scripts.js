/**
 * Initialize smooth scrolling functionality for navigation links
 * when the DOM content is loaded.
 */
document.addEventListener('DOMContentLoaded', function() {
    // Add active tab functionality
    const tabs = document.querySelectorAll('.tab');
    const navBrand = document.querySelector('.nav-brand');
    
    function setActiveTab() {
        const scrollPosition = window.scrollY;
        const navHeight = document.querySelector('nav.toolbar').offsetHeight;
        const sections = document.querySelectorAll('section');

        // Remove active class from all tabs and brand
        tabs.forEach(tab => tab.classList.remove('active'));
        navBrand.classList.remove('active');

        // Check if we're at the top of the page
        if (scrollPosition < sections[0].offsetTop - navHeight) {
            navBrand.classList.add('active');
            return;
        }

        // Check other sections
        sections.forEach((section, index) => {
            const sectionTop = section.offsetTop - navHeight - 10;
            const sectionBottom = sectionTop + section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                tabs[index].classList.add('active');
            }
        });
    }

    // Set active tab on scroll
    window.addEventListener('scroll', setActiveTab);
    // Set active tab on page load
    setActiveTab();
    
    // Select all navigation links including the brand
    const navLinks = document.querySelectorAll('nav a');
    
    // Add click event listener to each navigation link
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const href = this.getAttribute('href');
            
            // If it's the home button (#)
            if (href === '#') {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
                return;
            }
            
            // For other navigation links
            const targetId = href.substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                // Get navbar height to offset scroll position
                const navbarHeight = document.querySelector('nav.toolbar').offsetHeight;
                
                // Get the target's position relative to the viewport
                const targetPosition = targetSection.getBoundingClientRect().top;
                // Get the current scroll position
                const startPosition = window.pageYOffset;
                // Calculate the target scroll position with navbar offset
                const offset = targetPosition + startPosition - navbarHeight;
                
                // Smooth scroll to target
                window.scrollTo({
                    top: offset,
                    behavior: 'smooth'
                });
            }
        });
    });
});