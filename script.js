// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 80; // Account for fixed navbar
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Navbar scroll effect
let lastScroll = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll <= 0) {
        navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.15)';
    }

    lastScroll = currentScroll;
});

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all sections and hero
document.querySelectorAll('.section, .hero').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(20px)';
    section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(section);
});


// Value cards modal
const valueCards = document.querySelectorAll('.value-card');
const valueModal = document.getElementById('value-modal');
const modalTitle = document.getElementById('modal-title');
const modalText = document.getElementById('modal-text');
const modalClose = document.querySelector('.value-modal-close');

// Add click handlers to value cards
valueCards.forEach(card => {
    card.addEventListener('click', function() {
        const valueType = this.getAttribute('data-value');
        const content = valueContent[valueType];

        if (content) {
            modalTitle.textContent = content.title;
            modalText.textContent = content.text;
            valueModal.classList.add('active');
        }
    });
});

// Close modal when clicking the X
if (modalClose) {
    modalClose.addEventListener('click', function() {
        valueModal.classList.remove('active');
    });
}

// Close modal when clicking outside
valueModal.addEventListener('click', function(e) {
    if (e.target === valueModal) {
        valueModal.classList.remove('active');
    }
});

// Close modal with Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && valueModal.classList.contains('active')) {
        valueModal.classList.remove('active');
    }
});
