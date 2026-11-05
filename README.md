# soinikghosh9.github.io/personal-website

Personal research site of Soinik Ghosh. Static HTML, CSS and vanilla JS, served by GitHub Pages with no build step.

## Files

- `index.html`: all content. Publications list accepted and published work only.
- `css/style.css`: design tokens at the top (refined teal identity, Geist and Geist Mono).
- `js/main.js`: load choreography, scroll reveals, nav state, pinned project gallery, flowing-lines background canvas. No libraries.
- `images/`: WebP portrait (640 and 1100 px), headshot, favicons, `og.jpg` for link previews.
- `CV.tex` and `profile-photo.jpeg`: editable LaTeX source and its portrait image.
- `cv-print/`: print layout and metadata helper used to produce the CV PDF.
- `documents/Soinik_Ghosh_CV.pdf`: rendered from `cv-print/cv.html` (see below).
- `sitemap.xml`, `llms.txt`, `404.html`: search and answer-engine support. Structured data (Person, ProfilePage, publications) is the JSON-LD block in `index.html`; update `dateModified` there and `lastmod` in `sitemap.xml` when content changes.
- `robots.txt` cannot live here: crawlers only read it at the host root, which is the separate `soinikghosh9.github.io` repository (`../user-site/`).

## Updating the CV PDF

`CV.tex` is the editable LaTeX source (compile on Overleaf with `profile-photo.jpeg`). `cv-print/cv.html` mirrors it and can be printed without LaTeX. Keep the two sources in sync. Print the HTML file to `documents/Soinik_Ghosh_CV.pdf` with browser headers and footers disabled.

Then set the PDF's author, subject and keywords:

```bash
py cv-print/set_pdf_meta.py documents/Soinik_Ghosh_CV.pdf
```

## Local preview

```bash
py -m http.server 8765 --directory personal-website-main
```
