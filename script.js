/* Totalli.AI — light interactions */
(function () {
  'use strict';

  // Year in footer
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Header shadow on scroll
  var header = document.querySelector('.site-header');
  function onScroll() {
    if (window.scrollY > 8) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Mobile menu toggle
  var toggle = document.querySelector('.nav-toggle');
  if (toggle) {
    toggle.addEventListener('click', function () {
      var open = header.classList.toggle('menu-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    // Close menu when a link is tapped
    document.querySelectorAll('.nav-links a, .nav-cta a').forEach(function (a) {
      a.addEventListener('click', function () {
        header.classList.remove('menu-open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Reveal on scroll
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(function (el, i) {
      el.style.transitionDelay = (i % 3) * 0.08 + 's';
      io.observe(el);
    });
  } else {
    revealEls.forEach(function (el) { el.classList.add('in'); });
  }

  // Demo form handler — submits to Web3Forms (https://web3forms.com)
  // Emails go to the inbox tied to the access_key (ratnamchoudhary@gmail.com).
  window.Totalli = {
    submit: function (e) {
      e.preventDefault();
      var form = e.target;
      var note = document.getElementById('formNote');
      var btn = document.getElementById('demoSubmit');
      var name = form.name.value.trim();

      function setNote(msg, ok) {
        if (!note) return;
        note.textContent = msg;
        note.classList.toggle('ok', !!ok);
        note.classList.toggle('err', !ok);
      }

      // Honeypot: if the hidden checkbox is ticked, it's a bot — silently drop.
      if (form.botcheck && form.botcheck.checked) return false;

      btn.disabled = true;
      var original = btn.textContent;
      btn.textContent = 'Sending…';
      setNote('Sending your request…', true);

      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: new FormData(form)
      })
        .then(function (res) { return res.json(); })
        .then(function (json) {
          if (json.success) {
            setNote('Thanks, ' + (name || 'there') + '! We\'ll reach out within one business day.', true);
            form.reset();
          } else {
            setNote('Sorry, something went wrong. Please email hello@totalli.ai instead.', false);
          }
        })
        .catch(function () {
          setNote('Network error. Please email hello@totalli.ai instead.', false);
        })
        .finally(function () {
          btn.disabled = false;
          btn.textContent = original;
        });

      return false;
    }
  };
})();
