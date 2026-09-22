const toggle = document.querySelector('.mobile-toggle');
const menu = document.querySelector('.menu');

function closeMenu() {
  menu?.classList.remove('open');
  toggle?.setAttribute('aria-expanded', 'false');
}

toggle?.addEventListener('click', () => {
  const open = menu?.classList.toggle('open') ?? false;
  toggle.setAttribute('aria-expanded', String(open));
});
document.querySelectorAll('.menu a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape') closeMenu();
});

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(items => items.forEach(item => {
    if (item.isIntersecting) {
      item.target.classList.add('visible');
      observer.unobserve(item.target);
    }
  }), { threshold: .12 });
  document.querySelectorAll('.reveal').forEach(element => observer.observe(element));
} else {
  document.querySelectorAll('.reveal').forEach(element => element.classList.add('visible'));
}

document.querySelector('.contact-form')?.addEventListener('submit', event => {
  event.preventDefault();
  const fields = new FormData(event.currentTarget);
  const body = `Bonjour,\n\nJe souhaite demander un devis.\n\nNom : ${fields.get('nom')}\nVille : ${fields.get('ville')}\nDemande : ${fields.get('message')}`;
  window.location.href = `mailto:isotron44@gmail.com?subject=${encodeURIComponent('Demande de devis — K-Rénov')}&body=${encodeURIComponent(body)}`;
});
