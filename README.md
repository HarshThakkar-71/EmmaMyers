# Emma Myers — Official Website

A premium, single-purpose website for American actress **Emma Myers** (*Wednesday*, *A Good Girl's Guide to Murder*, *A Minecraft Movie*, *Family Switch*).

![Pages](https://img.shields.io/badge/pages-4-d3b078) ![Static](https://img.shields.io/badge/type-static%20HTML%2FCSS%2FJS-a08cff) ![Size](https://img.shields.io/badge/weight-%7E4%20MB-6f6a60)

## Pages

| Page | File | Highlights |
|---|---|---|
| Home | `index.html` | Full-screen cinematic photo hero with Ken Burns zoom & parallax, titles marquee, animated stats, gallery preview |
| Her Life | `life.html` | Biography, photo collage, sticky quick-facts card, animated career timeline (2010 → today) |
| Projects | `projects.html` | *Wednesday* spotlight, filterable filmography with 3D tilt cards |
| Gallery | `gallery.html` | 42 photos, category filters, full keyboard-navigable lightbox (←/→/Esc) |

## Tech

- **Pure HTML / CSS / JavaScript** — no frameworks, no build step, no dependencies
- Google Fonts: *Playfair Display* + *Manrope*
- Features: scroll-reveal animations, parallax, 3D tilt cards, film-grain overlay, cursor glow, mobile menu, `prefers-reduced-motion` support, fully responsive

## Run locally

No install needed — either:

- double-click `index.html`, or
- serve the folder (nicer URLs, no quirks):

```bash
python -m http.server 5823
# → http://127.0.0.1:5823
```

## Deploy (GitHub Pages)

1. Push this repository to GitHub
2. **Settings → Pages → Source:** *Deploy from a branch* → `main` / `/ (root)`
3. The site goes live at `https://<username>.github.io/<repo-name>/`

## Credits

Photos: Getty Images (editorial) & Wikimedia Commons. All imagery belongs to its respective owners; this site is a fan showcase and is not affiliated with Emma Myers, her team, or any studio.
