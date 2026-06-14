# portfolio — Website Tizian Rein

Statische Website (HTML/CSS/JS, kein Build nötig) für GitHub Pages.

## Aufbau
- `index.html` — die gesamte Website (eine Seite, durchlaufender Feed)
- `projekte.js` — alle Projektdaten (Titel, Texte, Datenblatt) zweisprachig DE/EN
- `images/projects/` — hier die Projektfotos einfügen (Namen siehe `BILDLISTE.txt`)
- `images/about/tizian-rein-portrait.jpg` — Porträt für die Info-Seite
- `sitemap.xml`, `robots.txt` — für Google-Indexierung inkl. Bild-Sitemap
- `CNAME` — eigene Domain (www.tizianrein.de)

## Bilder einfügen
Die exakt benötigten Dateinamen stehen in `BILDLISTE.txt`.
Lege die Fotos unverändert benannt in `images/projects/` ab.

## Veröffentlichen (GitHub Pages)
1. Neues Repo namens **portfolio** anlegen.
2. Diese Dateien hochladen (inkl. Bilder).
3. Settings → Pages → Branch: `main`, Ordner: `/ (root)` → Save.
4. Eigene Domain: unter Settings → Pages → Custom domain `www.tizianrein.de`
   eintragen (entspricht der CNAME-Datei). DNS beim Domain-Anbieter:
   CNAME `www` → `<dein-github-name>.github.io`.

## Nach dem Go-Live für Google
- In der Google Search Console die Property `www.tizianrein.de` anlegen
  und `sitemap.xml` einreichen.
- Bilder erscheinen über die Bild-Sitemap in `sitemap.xml` in Google Bilder.
