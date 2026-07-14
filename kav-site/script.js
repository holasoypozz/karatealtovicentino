// script.js

document.addEventListener('DOMContentLoaded', () => {
  // year in footer
  document.getElementById('year').textContent = new Date().getFullYear();

  // mobile menu toggle
  const mobileBtn = document.getElementById('mobile-menu-toggle');
  const nav = document.getElementById('main-nav');
  const header = document.querySelector('.site-header');

  mobileBtn.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    mobileBtn.setAttribute('aria-expanded', String(isOpen));
    // forza header visibile quando il menu è aperto
    header.classList.remove('hide-header');
  });

  // Smooth scroll for internal links + chiusura menu mobile
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href');
      if (!href || href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      nav.classList.remove('open');
      mobileBtn.setAttribute('aria-expanded', 'false');
    });
  });

  // contatti tramite Formspree
  const form = document.getElementById('contact-form');
  const status = document.getElementById('form-status');

  form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    status.textContent = '';

    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const message = form.message.value.trim();

    if (name.length < 2) return showStatus('Inserisci il tuo nome (minimo 2 caratteri).', true);
    if (!validateEmail(email)) return showStatus('Inserisci una email valida.', true);
    if (message.length < 10) return showStatus('Il messaggio deve contenere almeno 10 caratteri.', true);

    const FORMSPREE_URL = "https://formspree.io/f/xdkpkelr";

    try {
      showStatus('Invio in corso...', false);

      const res = await fetch(FORMSPREE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });

      if (res.ok) {
        showStatus('✅ Messaggio inviato con successo! Ti risponderò presto.', false);
        form.reset();
      } else {
        showStatus('❌ Errore durante l\'invio. Riprova più tardi.', true);
      }
    } catch (error) {
      showStatus('❌ Connessione fallita. Controlla la tua rete.', true);
    }
  });

  function showStatus(text, isError = false) {
    status.textContent = text;
    status.style.color = isError ? 'tomato' : 'green';
  }

  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  // Header hide-on-scroll
  let lastScrollY = window.scrollY;

  window.addEventListener('scroll', () => {
    if (nav.classList.contains('open')) return;

    const currentScrollY = window.scrollY;

    if (currentScrollY > lastScrollY && currentScrollY > 100) {
      header.classList.add('hide-header');
    } else {
      header.classList.remove('hide-header');
    }

    lastScrollY = currentScrollY;
  });

});
