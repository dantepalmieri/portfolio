/**
 * Initialize smooth scrolling functionality for navigation links
 * when the DOM content is loaded.
 */
document.addEventListener('DOMContentLoaded', function() {
    // Select all navigation links
    const navLinks = document.querySelectorAll('nav a');
    
    // Add click event listener to each navigation link
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Get the target section ID from the href attribute
            const targetId = this.getAttribute('href').substring(1);
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