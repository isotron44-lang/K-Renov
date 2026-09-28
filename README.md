# K-Rénov — site vitrine

Site statique (HTML/CSS/JS) publié avec GitHub Pages : https://isotron44-lang.github.io/K-Renov/

## Style
Design « Paris moderne » : pierre, ardoise et laiton, titres en Fraunces, texte en Inter (Google Fonts), images en arche.
Toute la mise en forme est dans `styles.css`. Images en WebP dans `assets/`, silhouette de Paris dans `assets/skyline.svg`, image de partage `assets/og.jpg`.

## Pages
- `index.html` — accueil : petits travaux, étapes, finitions, réalisations, engagements, tarifs, zone, contact
- `prestations.html` — finitions et projets sur devis
- `realisations.html` — portfolio
- `mentions.html` — mentions légales (**à compléter** : zones entre crochets)
- `404.html` — page d’erreur (fonctionne à la racine d’un domaine comme sous `/K-Renov/`)

## Contact
- Téléphone et WhatsApp : 07 66 99 70 54 (liens `tel:+33766997054` et `wa.me/33766997054`)
- Formulaire : Formspree (`https://formspree.io/f/xwlpwlkz`). En cas d’échec, le site ouvre un e-mail pré-rempli.
  Pour séparer les demandes K-Rénov des autres formulaires, créez un formulaire Formspree dédié et remplacez l’adresse dans `index.html`.

## Avant le lancement
1. Compléter `mentions.html` : nom, SIRET, adresse, assurance, médiateur, contexte des photos.
2. (Facultatif) Remplacer `assets/hero.webp` par une photo réelle au travail.
3. Ajouter les premiers avis clients (emplacement prévu dans `index.html`, section « Mes engagements », commentaire prévu).
4. Si un nom de domaine est acheté, remplacer `https://isotron44-lang.github.io/K-Renov/` dans les balises (toutes les pages) `canonical`, `og:*`, le JSON-LD, `robots.txt` et `sitemap.xml`.
