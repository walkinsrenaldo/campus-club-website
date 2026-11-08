// shared interactions for all three pages.
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-year]').forEach(el => el.textContent = new Date().getFullYear());

  // Accessible mobile navigation.
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      menuToggle.setAttribute('aria-expanded', String(isOpen));
      menuToggle.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
    });
    navLinks.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
    }));
  }

  // Sprint 2: filter the event cards by category.
  const filterButtons = document.querySelectorAll('.filter-btn');
  const eventCards = document.querySelectorAll('.event-card');
  filterButtons.forEach(button => button.addEventListener('click', () => {
    filterButtons.forEach(item => item.classList.remove('active'));
    button.classList.add('active');
    const category = button.dataset.filter;
    eventCards.forEach(card => {
      card.classList.toggle('hidden', category !== 'all' && card.dataset.category !== category);
    });
  }));

  // Sprint 2: selecting Register pre-fills the registration form.
  const eventSelect = document.querySelector('#reg-event');
  document.querySelectorAll('.register-btn').forEach(button => button.addEventListener('click', () => {
    if (eventSelect) {
      eventSelect.value = button.dataset.event;
      document.querySelector('#registration').scrollIntoView({ behavior: 'smooth' });
      eventSelect.focus({ preventScroll: true });
    }
  }));

  // Demo registration: save locally in this browser, not to a remote server.
  const registrationForm = document.querySelector('#registration-form');
  if (registrationForm) {
    registrationForm.addEventListener('submit', event => {
      event.preventDefault();
      const status = document.querySelector('#registration-message');
      if (!registrationForm.reportValidity()) {
        showMessage(status, 'Please complete all fields with valid information.', false);
        return;
      }
      const formData = new FormData(registrationForm);
      const registration = {
        event: formData.get('event'), name: formData.get('name').trim(),
        email: formData.get('email').trim(), registeredAt: new Date().toISOString()
      };
      try {
        const saved = JSON.parse(localStorage.getItem('campusConnectRegistrations') || '[]');
        saved.push(registration);
        localStorage.setItem('campusConnectRegistrations', JSON.stringify(saved));
        showMessage(status, `You're registered for ${registration.event}, ${registration.name}! Your registration has been saved in this browser.`, true);
        registrationForm.reset();
      } catch (error) {
        showMessage(status, 'Your browser could not save this registration. Please check local storage settings.', false);
      }
    });
  }

  // Sprint 2: validate the contact form and display an automatic on-screen reply.
  const contactForm = document.querySelector('#contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', event => {
      event.preventDefault();
      const status = document.querySelector('#contact-message-status');
      if (!contactForm.reportValidity()) {
        showMessage(status, 'Please check the form and complete all required fields.', false);
        return;
      }
      const name = document.querySelector('#contact-name').value.trim();
      const subject = document.querySelector('#contact-subject').value;
      showMessage(status, `Thanks, ${name}! Your message about “${subject}” has been received in this demo. This is your automatic confirmation; no email was sent.`, true);
      contactForm.reset();
    });
  }
});

function showMessage(element, message, success) {
  if (!element) return;
  element.textContent = message;
  element.className = `form-message ${success ? 'success' : 'error'}`;
}
