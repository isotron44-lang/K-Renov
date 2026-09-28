// L’IA, simplement — interactions (le contenu des pages est déjà dans le HTML).
(function () {
  'use strict';

  // --- Formulaires : avis (Formspree) et abonnement (Brevo) --------------
  // Sans JavaScript, le formulaire est envoyé normalement au prestataire.
  var errorsOf = function (data) {
    if (!data || !data.errors) return '';
    var list = Array.isArray(data.errors) ? data.errors.map(function (x) { return x.message; })
      : Object.keys(data.errors).map(function (k) { return data.errors[k]; });
    return list.join(' ');
  };
  document.querySelectorAll('form[data-formspree], form[data-brevo]').forEach(function (form) {
    var brevo = form.hasAttribute('data-brevo');
    var url = brevo ? form.action + (form.action.indexOf('?') < 0 ? '?' : '&') + 'isAjax=1' : form.action;
    var status = form.querySelector('.form-status');
    var button = form.querySelector('[type=submit]');
    var label = button ? button.textContent : '';
    var say = function (text, kind) {
      if (!status) return;
      status.textContent = text;
      status.className = 'form-status' + (kind ? ' ' + kind : '');
    };
    var from = form.querySelector('[name=provenance]');
    if (from) from.value = location.pathname;

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var trap = form.querySelector('[name=_gotcha], [name=email_address_check]');
      if (trap && trap.value) return;
      if (form.hasAttribute('data-need-one') && !form.querySelector('input[type=checkbox]:checked') &&
          !Array.prototype.some.call(form.querySelectorAll('textarea'), function (t) { return t.value.trim(); })) {
        say('Cochez au moins un guide ou proposez une idée.', 'err');
        return;
      }
      if (!form.checkValidity()) {
        var bad = form.querySelector(':invalid');
        say(bad && bad.type === 'email' ? 'Vérifiez votre adresse email.' : 'Merci de compléter les champs obligatoires.', 'err');
        if (bad) bad.focus();
        return;
      }
      button.disabled = true;
      button.textContent = 'Envoi…';
      say('');
      fetch(url, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } })
        .then(function (res) {
          return res.json().catch(function () { return {}; }).then(function (data) {
            if (!res.ok || (brevo && data.success !== true)) {
              var e = new Error(errorsOf(data) || 'Erreur ' + res.status);
              e.known = !!errorsOf(data);
              throw e;
            }
          });
        })
        .then(function () {
          var done = document.createElement('p');
          done.className = 'thanks';
          done.setAttribute('role', 'status');
          done.tabIndex = -1;
          done.textContent = form.dataset.thanks || 'Merci, c’est envoyé.';
          form.replaceWith(done);
          done.focus();
        })
        .catch(function (err) {
          say(err.known ? err.message : 'L’envoi n’a pas abouti (' + err.message + '). Vérifiez votre connexion et réessayez.', 'err');
          button.disabled = false;
          button.textContent = label;
        });
    });
  });

  // Page avis : présélectionner le guide venu de ?guide=
  var fbGuide = document.getElementById('fb-guide');
  if (fbGuide) {
    var wanted = new URLSearchParams(location.search).get('guide');
    if (wanted && fbGuide.querySelector('option[value="' + wanted.replace(/[^a-z0-9-]/g, '') + '"]')) {
      fbGuide.value = wanted;
      document.getElementById('fb-page').value = 'Un guide en PDF';
    }
  }

  // --- Filtres de la bibliothèque ----------------------------------------
  var chips = document.querySelectorAll('[data-filter]');
  if (chips.length) {
    var blocks = document.querySelectorAll('[data-level]');
    var apply = function (f, push) {
      chips.forEach(function (c) { c.setAttribute('aria-pressed', String(c.dataset.filter === f)); });
      blocks.forEach(function (b) { b.hidden = f !== 'all' && b.dataset.level !== f; });
      if (push) history.replaceState(null, '', f === 'all' ? location.pathname : '?niveau=' + f);
    };
    var start = new URLSearchParams(location.search).get('niveau');
    var known = Array.prototype.some.call(chips, function (c) { return c.dataset.filter === start; });
    apply(known ? start : 'all', false);
    chips.forEach(function (c) { c.addEventListener('click', function () { apply(c.dataset.filter, true); }); });
  }

  // --- Outil : préparer une consigne -------------------------------------
  var task = document.getElementById('task');
  if (task) {
    var output = document.getElementById('output');
    var copy = document.getElementById('copy');
    var who = document.getElementById('who');
    var format = document.getElementById('format');
    var tone = document.getElementById('tone');
    var build = function () {
      var t = task.value.trim();
      if (!t) {
        output.textContent = 'Décrivez d’abord la tâche que vous souhaitez accomplir.';
        copy.hidden = true;
        task.focus();
        return;
      }
      output.textContent =
        'Aide-moi à accomplir la tâche suivante : ' + t + '\n\n' +
        'Contexte : ' + (who.value.trim() || '[à qui s’adresse le résultat, situation, informations utiles]') + '\n' +
        'Format souhaité : ' + (format.value || '[SMS, courriel, liste, tableau…]') + '\n' +
        'Ton : ' + (tone.value || '[simple, poli, professionnel…]') + '\n' +
        'Contraintes : [longueur, délai, éléments à éviter]\n\n' +
        'Si une information manque, pose-moi une question avant de répondre. ' +
        'N’invente pas de faits et indique ce que je dois vérifier.';
      copy.hidden = false;
      copy.textContent = 'Copier la consigne';
    };
    document.getElementById('make').addEventListener('click', build);
    document.getElementById('example').addEventListener('click', function () {
      task.value = 'un mail pour demander un rendez-vous à mon comptable';
      who.value = 'Je suis artisan, je veux faire le point sur ma TVA avant la fin du mois';
      format.value = 'courriel';
      tone.value = 'poli et professionnel';
      build();
    });
    copy.addEventListener('click', function () {
      var ok = function () { copy.textContent = 'Copié !'; setTimeout(function () { copy.textContent = 'Copier la consigne'; }, 2000); };
      if (navigator.clipboard) {
        navigator.clipboard.writeText(output.textContent).then(ok, function () { selectOutput(); });
      } else selectOutput();
    });
    var selectOutput = function () {
      var r = document.createRange();
      r.selectNodeContents(output);
      var s = getSelection();
      s.removeAllRanges();
      s.addRange(r);
      copy.textContent = 'Texte sélectionné : Ctrl+C pour copier';
    };
  }
})();
