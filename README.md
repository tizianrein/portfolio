# tizianrein.de

Portfolio of Tizian Rein: architecture, adaptive reuse, new construction and research.
Live at **[www.tizianrein.de](https://www.tizianrein.de/)**.

A small static website without a framework or build step. It is plain HTML, CSS and JavaScript, set in Times New Roman, and hosted on GitHub Pages.

## The site

- **Start page:** an endless strip of projects. On desktop it scrolls sideways, and the image in the middle is shown largest. On phones it scrolls vertically.
- **Project pages:** the project text, then all images in the same endless strip.
- **Info:** short bio, portrait, CV and contact links.
- **German and English:** a switch in the header. The choice is remembered in the browser.
- **Own address for every project**, for example
  `/projects/022-separate-wohneinheit-detached-apartment/`.
  Navigation inside the site changes the address without reloading, and the browser's back button works.

## Repository structure

```
index.html              the whole site (layout, styles, script)
projekte.js             all content: projects, texts, CV (edit this)
bildmasse.js            image sizes and web versions (generated)
projects/<address>/     one page per project (generated)
404.html                fallback page, also resolves old or unknown project addresses (generated)
sitemap.xml             sitemap including all project pages and images (generated)
images/projects/        original project images
images/web/l, web/s     web-optimised large and small versions (generated)
images/mini/            small thumbnails (generated)
images/about/           portrait
alternativ.html         previous version of the site, kept for reference (not indexed)
CNAME, robots.txt, site.webmanifest, favicon.svg
```

Files marked *generated* are written by the local update script and should not be edited by hand.

## Content: `projekte.js`

Every project is one entry in the list `P`:

```js
{n:"024", y:"2026", c:"umbau",
 t:{de:"Projektname", en:"Project name"},
 d:{de:"Deutscher Text …", en:"English text …"},
 pre:"Tizian-Rein-Projektname-024.",
 imgs:["1.jpg","2.jpg"]},
```

| Field | Meaning |
|---|---|
| `n` | internal number |
| `y` | year; for a range such as `2025–26` the last year is shown |
| `c` | category: `umbau`, `neubau` or `forschung` |
| `t`, `d` | title and text in German and English; texts may contain plain `<a href="…">` links |
| `pre`, `imgs` | file name prefix and image list in `images/projects/`; the order here is the order on the site |
| `video` | optional video file, shown before the images |
| `pfad` | optional, sets the project address by hand |

The project address is built from the number in the image prefix, the German title and, if different, the English title. GIFs are played as a small MP4 with the same name when one exists.

`INFO_HTML` in the same file holds the bio and CV for both languages.

## Updating the site

The update script (`portfolio-aktualisieren.js`, started with `PORTFOLIO-AKTUALISIEREN.bat`) lives only in the local folder and is not part of this repository. After adding images or editing `projekte.js`, run it once. It:

- measures all images and writes `bildmasse.js`
- creates the web versions in `images/web/` and the thumbnails in `images/mini/` (Windows, no extra software needed)
- writes the project pages in `projects/`, `404.html` and `sitemap.xml`
- updates the hidden plain-text version of all projects and the CV in `index.html`, which search engines read
- sets the "last updated" date

Then commit and push. GitHub Pages publishes the site within a minute or two.

## Looking at it locally

Opening `index.html` directly works, but project addresses then fall back to `#p/…`. To try the real addresses, start a small local server in the folder:

```
python -m http.server
```

and open `http://localhost:8000/`.

## Performance

Images are delivered as web versions: a small one (at most 1000 × 700 px) and a large one (at most 2400 × 1400 px). The browser picks the one that fits the screen, and images further along the strip load only when they come close. The originals in `images/projects/` stay untouched.

---

© Tizian Rein. All rights reserved. Texts and images may not be reused without permission.
