// Cloudflare Web Analytics (gratuit, sans cookies).
// 1. Tableau de bord Cloudflare > Analytics & Logs > Web Analytics > Add a site
// 2. Copiez le "token" fourni et collez-le ci-dessous. Tant qu'il est vide, rien n'est chargé.
const CF_ANALYTICS_TOKEN = "";
if (CF_ANALYTICS_TOKEN) {
  const s = document.createElement('script');
  s.defer = true;
  s.src = 'https://static.cloudflareinsights.com/beacon.min.js';
  s.setAttribute('data-cf-beacon', JSON.stringify({ token: CF_ANALYTICS_TOKEN }));
  document.head.appendChild(s);
}
