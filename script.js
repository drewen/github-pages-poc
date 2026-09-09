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

// Observe all sections and hero (NEAS intro)
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

// Placeholder content for each value
const valueContent = {
    kindness: {
        title: 'Lead with Kindness',
        text: 'We assume everyone is acting in good faith. We respect each other\'s limits. We help first.'
    },
    inclusivity: {
        title: 'Joyfully Embrace Inclusivity',
        text: 'We welcome all fans who choose to join us in our community. We emphatically believe our community is best when every fan feels empowered to join in the celebration.'
    },
    authenticity: {
        title: 'Act Authentically',
        text: 'We own our mistakes. We are honest about our capacity. We bring our genuine passion to the work.'
    },
    bold: {
        title: 'Be Bold',
        text: 'We aren\'t afraid to try new things or fix old problems. We ask "What if?"'
    },
    together: {
        title: 'Succeed Together',
        text: 'No department or division is an island. We share the work, and we share the wins.'
    }
};

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

/* FUTURE FEATURE (disabled): bio pop-up for officers/board members.
   Reuses the value-modal to show a short bio when a card is clicked.
   To re-enable: uncomment below and add data-person="..." back onto
   the .officer-card / .board-member elements in index.html.

const personContent = {
    'andrew-davis': {
        title: 'Andrew Davis - President',
        text: 'Andrew brings years of leadership experience and a passion for anime culture to his role as President. He works tirelessly to ensure NEAS continues to grow and serve the New England anime community.'
    },
    'kristen-leiding': {
        title: 'Kristen Leiding - Vice President',
        text: 'Kristen supports the organization\'s mission with dedication and enthusiasm. Her organizational skills and creative vision help make NEAS events memorable and successful.'
    },
    'suwada-hinds': {
        title: 'Suwada Hinds - Treasurer',
        text: 'Suwada manages NEAS finances with precision and care, ensuring the organization remains financially healthy and can continue supporting the anime community in New England.'
    },
    'eric-boll': {
        title: 'Eric Boll - Clerk',
        text: 'Eric maintains detailed records and documentation for NEAS, ensuring transparency and proper governance. His attention to detail keeps the organization running smoothly.'
    },
    'kate-lyn-gingerich': {
        title: 'Kate-Lyn Gingerich - Board Member',
        text: 'Kate-Lyn brings valuable perspective and expertise to the board. Her commitment to the anime community helps guide NEAS in its mission to promote Japanese culture.'
    },
    'danny-lee': {
        title: 'Danny Lee - Board Member',
        text: 'Danny contributes his knowledge and passion for anime to help shape NEAS initiatives. His insights help the organization stay connected with the community it serves.'
    },
    'ben-warmus': {
        title: 'Ben Warmus - Board Member',
        text: 'Ben\'s experience and enthusiasm for anime culture make him a valuable member of the board. He helps ensure NEAS continues to thrive and grow.'
    },
    'todd-whitney': {
        title: 'Todd Whitney - Board Member',
        text: 'Todd is Cool🎉 He writes Software in his day job and is a lifelong anime fan. His technical expertise and passion for anime make him an invaluable member of the board.'
    },
    'desmond-wooten': {
        title: 'Desmond Wooten - Board Member',
        text: 'Desmond brings fresh perspectives and dedication to the board. His commitment to the anime community helps NEAS continue its mission of promoting Japanese culture.'
    },
    'alyssa-whitney': {
        title: 'Alyssa Whitney - Ombudsman',
        text: 'Alyssa serves as the Ombudsman, providing an independent voice to help resolve concerns and ensure fair treatment for all members of the NEAS community.'
    }
};

// Add click handlers to officers
const officerCards = document.querySelectorAll('.officer-card');
officerCards.forEach(card => {
    card.addEventListener('click', function() {
        const personId = this.getAttribute('data-person');
        const content = personContent[personId];

        if (content) {
            modalTitle.textContent = content.title;
            modalText.textContent = content.text;
            valueModal.classList.add('active');
        }
    });
});

// Add click handlers to board members
const boardMembers = document.querySelectorAll('.board-member');
boardMembers.forEach(member => {
    member.addEventListener('click', function() {
        const personId = this.getAttribute('data-person');
        const content = personContent[personId];

        if (content) {
            modalTitle.textContent = content.title;
            modalText.textContent = content.text;
            valueModal.classList.add('active');
        }
    });
});

*/

