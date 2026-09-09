/* New England Anime Society — progressive enhancement only.
   Everything here is an upgrade on top of a page that already works:
   smooth scrolling and anchor offsets are handled in CSS, and the reveal
   styling is scoped to html.js so nothing is hidden when this file
   fails to load. */

(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hasIO = 'IntersectionObserver' in window;

  /* ------------------------------------------------------------------
     Navbar elevation.
     A one-pixel sentinel above the navbar tells us when the page has
     scrolled, so we never run code on the scroll event itself.
     ------------------------------------------------------------------ */
  var navbar = document.querySelector('.navbar');
  var sentinel = document.getElementById('nav-sentinel');

  if (navbar && sentinel && hasIO) {
    new IntersectionObserver(function (entries) {
      navbar.classList.toggle('is-stuck', !entries[0].isIntersecting);
    }).observe(sentinel);
  }

  /* ------------------------------------------------------------------
     Scroll reveal.
     Three rules keep this from ever hiding content:
       1. anything already on screen is revealed on the spot, so the
          first paint is never animated;
       2. a blanket timer reveals everything regardless, in case the
          observer is throttled or never fires;
       3. reduced-motion users skip the effect entirely.
     ------------------------------------------------------------------ */
  var revealables = document.querySelectorAll('.reveal');

  function reveal(el) {
    el.classList.add('is-visible');
  }

  if (!revealables.length) {
    /* nothing to do */
  } else if (reduceMotion || !hasIO) {
    Array.prototype.forEach.call(revealables, reveal);
  } else {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            reveal(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    );

    Array.prototype.forEach.call(revealables, function (el) {
      if (el.getBoundingClientRect().top < window.innerHeight) {
        reveal(el);
      } else {
        observer.observe(el);
      }
    });

    window.setTimeout(function () {
      Array.prototype.forEach.call(revealables, reveal);
    }, 3000);
  }

  /* ------------------------------------------------------------------
     Values dialog.
     <dialog> brings the focus trap, Escape handling, inert background
     and focus restoration with it, so this only supplies the content.
     ------------------------------------------------------------------ */
  var dialog = document.getElementById('value-modal');
  var modalTitle = document.getElementById('modal-title');
  var modalText = document.getElementById('modal-text');
  var closeButton = dialog && dialog.querySelector('.value-modal-close');
  var canShowModal = dialog && typeof dialog.showModal === 'function';

  var valueContent = {
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

  function closeDialog() {
    if (!dialog) return;
    if (canShowModal) {
      dialog.close();
    } else {
      dialog.removeAttribute('open');
    }
  }

  if (dialog && modalTitle && modalText) {
    Array.prototype.forEach.call(document.querySelectorAll('.value-card'), function (card) {
      card.addEventListener('click', function () {
        var content = valueContent[card.getAttribute('data-value')];
        if (!content) return;

        modalTitle.textContent = content.title;
        modalText.textContent = content.text;

        if (canShowModal) {
          dialog.showModal();
        } else {
          dialog.setAttribute('open', '');
        }
      });
    });

    if (closeButton) {
      closeButton.addEventListener('click', closeDialog);
    }

    /* Clicking the backdrop closes. The dialog's own padding is part of the
       element, so compare against its box rather than the event target. */
    dialog.addEventListener('click', function (event) {
      var box = dialog.getBoundingClientRect();
      var inside =
        event.clientX >= box.left &&
        event.clientX <= box.right &&
        event.clientY >= box.top &&
        event.clientY <= box.bottom;

      if (!inside) closeDialog();
    });
  }
})();

/* FUTURE FEATURE (disabled): bio pop-up for officers/board members.
   Reuses the value dialog to show a short bio when a card is clicked.
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

// Add click handlers to officers and board members
document.querySelectorAll('.officer-card, .board-member').forEach(card => {
    card.addEventListener('click', function() {
        const content = personContent[this.getAttribute('data-person')];
        if (content) {
            document.getElementById('modal-title').textContent = content.title;
            document.getElementById('modal-text').textContent = content.text;
            document.getElementById('value-modal').showModal();
        }
    });
});

*/
