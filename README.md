# soinikghosh9.github.io/personal-website

Personal research site of Soinik Ghosh. Static HTML, CSS and vanilla JS, served by GitHub Pages with no build step.

## Files

- `index.html`: all content. Publications list accepted and published work only.
- `css/style.css`: design tokens at the top (refined teal identity, Geist and Geist Mono).
- `js/main.js`: load choreography, scroll reveals, nav state, the NeurIPS scalp-map story, hero signal-line canvas. No libraries.
- `images/`: WebP portrait (640 and 1100 px), headshot, favicons, `og.jpg` for link previews.
- `documents/Soinik_Ghosh_CV.pdf`: rendered from `../cv-print/cv.html` (see below).

## Updating the CV PDF

`../CV.tex` is the LaTeX source (compile on Overleaf with `profile-photo.jpeg`). `../cv-print/cv.html` mirrors it and can be printed without LaTeX:

```bash
"/c/Program Files (x86)/Microsoft/Edge/Application/msedge.exe" --headless=new --no-pdf-header-footer --print-to-pdf="documents/Soinik_Ghosh_CV.pdf" "file:///C:/Users/user/Downloads/CV/cv-print/cv.html"
```

Keep the two sources in sync when either changes.

## Local preview

```bash
py -m http.server 8765 --directory personal-website-main
```
