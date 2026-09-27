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

// Formulaire de devis : envoi via Formspree ; en cas d'échec, on propose l'e-mail pré-rempli.
const form = document.querySelector('.contact-form');
if (form) {
  const status = form.querySelector('.form-status');
  const button = form.querySelector('[type=submit]');
  const say = (text, kind) => { status.textContent = text; status.className = 'form-status' + (kind ? ' ' + kind : ''); };
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (form.querySelector('[name=_gotcha]').value) return;
    if (!form.checkValidity()) {
      say('Merci de compléter votre nom, votre téléphone, votre ville et votre besoin.', 'err');
      form.querySelector(':invalid')?.focus();
      return;
    }
    const fields = new FormData(form);
    button.disabled = true;
    say('Envoi…');
    try {
      const res = await fetch(form.action, { method: 'POST', body: fields, headers: { Accept: 'application/json' } });
      if (!res.ok) throw new Error(res.status);
      const done = document.createElement('p');
      done.className = 'thanks';
      done.setAttribute('role', 'status');
      done.textContent = 'Merci, votre demande est bien arrivée. Je vous rappelle rapidement. Pour aller plus vite, envoyez vos photos sur WhatsApp au 07 66 99 70 54.';
      form.replaceWith(done);
    } catch (error) {
      const body = `Bonjour,\n\nJe souhaite demander un devis.\n\nNom : ${fields.get('nom')}\nTéléphone : ${fields.get('telephone')}\nVille : ${fields.get('ville')}\nDemande : ${fields.get('message')}`;
      say('L’envoi n’a pas abouti. Votre messagerie va s’ouvrir avec la demande pré-remplie, ou appelez le 07 66 99 70 54.', 'err');
      window.location.href = `mailto:isotron44@gmail.com?subject=${encodeURIComponent('Demande de devis — K-Rénov')}&body=${encodeURIComponent(body)}`;
    } finally {
      button.disabled = false;
    }
  });
}
