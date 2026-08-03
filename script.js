const header = document.querySelector('.site-header');
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');
const links = [...document.querySelectorAll('.nav-links a[href^="#"]')];
const sections = [...document.querySelectorAll('main section[id]')];
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function updateHeader() {
  header?.classList.toggle('scrolled', window.scrollY > 20);
}

function closeMenu() {
  navLinks?.classList.remove('open');
  navToggle?.setAttribute('aria-expanded', 'false');
}

navToggle?.addEventListener('click', () => {
  const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
  navToggle.setAttribute('aria-expanded', String(!isOpen));
  navLinks?.classList.toggle('open', !isOpen);
});

links.forEach((link) => link.addEventListener('click', closeMenu));

document.addEventListener('click', (event) => {
  if (!navLinks?.contains(event.target) && !navToggle?.contains(event.target)) closeMenu();
});

function updateActiveLink() {
  const position = window.scrollY + 140;
  let activeId = '';
  sections.forEach((section) => {
    if (position >= section.offsetTop) activeId = section.id;
  });
  links.forEach((link) => link.classList.toggle('active', link.hash === `#${activeId}`));
}

window.addEventListener('scroll', () => {
  updateHeader();
  updateActiveLink();
}, { passive: true });

const revealElements = document.querySelectorAll('.reveal');
if (reducedMotion || !('IntersectionObserver' in window)) {
  revealElements.forEach((element) => element.classList.add('visible'));
} else {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px' });
  revealElements.forEach((element) => observer.observe(element));
}

const year = document.querySelector('#year');
if (year) year.textContent = new Date().getFullYear();

updateHeader();
updateActiveLink();
