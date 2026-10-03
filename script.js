// Theme persistence removed — mode decides the palette now.
// Mode toggle (tech / poetic), persisted
const modeToggle = document.getElementById('modeToggle');
const savedMode = sessionStorage.getItem('mode');
if (savedMode) document.documentElement.setAttribute('data-mode', savedMode);
else document.documentElement.setAttribute('data-mode', 'tech');
modeToggle.addEventListener('click', () => {
  const current = document.documentElement.getAttribute('data-mode');
  const next = current === 'poetic' ? 'tech' : 'poetic';
  document.documentElement.setAttribute('data-mode', next);
  sessionStorage.setItem('mode', next);
  applyModeView(next);
});
const techView = document.getElementById('techView');
const poeticView = document.getElementById('poeticView');
function applyModeView(mode) {
  const poetic = mode === 'poetic';
  techView.hidden = poetic;
  poeticView.hidden = !poetic;
  updateNavHrefs(mode);
}
const navAnchors = document.querySelectorAll('.nav-links a');
function updateNavHrefs(mode) {
  const map = mode === 'poetic'
    ? { about: ['#poetic-verses', 'Verses'], projects: ['#poetic-stanzas', 'Stanzas'], contact: ['#poetic-letters', 'Letters'] }
    : { about: ['#about', 'About'], projects: ['#projects', 'Projects'], contact: ['#contact', 'Contact'] };
  navAnchors.forEach(a => {
    const key = a.dataset.nav;
    if (key && map[key]) {
      a.setAttribute('href', map[key][0]);
      a.textContent = map[key][1];
    }
  });
}
applyModeView(sessionStorage.getItem('mode') || 'tech');

// Mobile menu
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');
menuToggle.addEventListener('click', () => navLinks.classList.toggle('open'));
navLinks.querySelectorAll('a').forEach(a =>
  a.addEventListener('click', () => navLinks.classList.remove('open'))
);

// Project modal
const modal = document.getElementById('modal');
const modalTitle = document.getElementById('modalTitle');
const modalDetails = document.getElementById('modalDetails');
document.querySelectorAll('.link-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    modalTitle.textContent = btn.dataset.project;
    modalDetails.textContent = btn.dataset.details;
    modal.classList.remove('hidden');
  });
});
document.getElementById('modalClose').addEventListener('click', () =>
  modal.classList.add('hidden')
);
modal.addEventListener('click', e => {
  if (e.target === modal) modal.classList.add('hidden');
});

// Scroll-reveal animations
const revealEls = document.querySelectorAll('.section, .card');
revealEls.forEach(el => el.classList.add('reveal'));
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      const el = entry.target;
      setTimeout(() => { el.style.transitionDelay = ''; }, 700);
      observer.unobserve(el);
    }
  });
}, { threshold: 0.1 });
revealEls.forEach(el => observer.observe(el));

// Typed text effect
const roles = ['cybersecurity professional.', 'web developer.', 'problem solver.', 'lifelong learner.'];
const typedEl = document.getElementById('typed');
let roleIdx = 0, charIdx = 0, deleting = false;
function type() {
  const current = roles[roleIdx];
  typedEl.textContent = current.slice(0, charIdx);
  if (!deleting) {
    charIdx++;
    if (charIdx > current.length) {
      deleting = true;
      setTimeout(type, 1600);
      return;
    }
  } else {
    charIdx--;
    if (charIdx === 0) {
      deleting = false;
      roleIdx = (roleIdx + 1) % roles.length;
    }
  }
  setTimeout(type, deleting ? 40 : 80);
}
type();

// Staggered card reveal delays
document.querySelectorAll('.card').forEach((card, i) => {
  card.style.transitionDelay = (i % 3) * 0.08 + 's';
});

// Scroll progress bar, back-to-top, active nav
const progressBar = document.getElementById('progressBar');
const toTop = document.getElementById('toTop');
const sections = document.querySelectorAll('main section');
window.addEventListener('scroll', () => {
  const scrollTop = window.scrollY;
  const max = document.documentElement.scrollHeight - window.innerHeight;
  progressBar.style.width = (scrollTop / max * 100) + '%';
  toTop.classList.toggle('show', scrollTop > 400);

  let currentId = '';
  sections.forEach(s => {
    if (s.offsetParent !== null && scrollTop >= s.offsetTop - 120) currentId = s.id;
  });
  navAnchors.forEach(a =>
    a.classList.toggle('active', a.getAttribute('href') === '#' + currentId)
  );
});
toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// Character counter
const messageInput = document.getElementById('message');
const charCount = document.getElementById('charCount');
messageInput.addEventListener('input', () => {
  charCount.textContent = messageInput.value.length + ' / 500';
});

// Contact form validation
const form = document.getElementById('contactForm');
form.addEventListener('submit', e => {
  e.preventDefault();
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const message = document.getElementById('message').value.trim();
  const error = document.getElementById('formError');
  const success = document.getElementById('formSuccess');

  error.textContent = '';
  success.textContent = '';

  if (!name || !email || !message) {
    error.textContent = 'Please fill in all fields.';
    return;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    error.textContent = 'Please enter a valid email address.';
    return;
  }
  success.textContent = 'Thanks, ' + name + '! Your message has been sent.';
  form.reset();
});
