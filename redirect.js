// Anciennes adresses guide.html?livre=… et lecture.html?livre=… → /guides/…
(function () {
  var slug = (new URLSearchParams(location.search).get('livre') || '').replace(/[^a-z0-9-]/g, '');
  var reader = /lecture/.test(location.pathname);
  location.replace(slug ? '/guides/' + slug + (reader ? '#extrait' : '') : '/bibliotheque');
})();
