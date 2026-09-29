# Nicolash Games portfolio website

This repository contains the Jekyll site for [niccolochiodo.com](https://niccolochiodo.com). The homepage is an interactive game and card shop for Nicolash Games projects. The project, About, catalogue, and patch note pages remain directly accessible.

## Run locally

Install Ruby and Bundler, then run from this directory:

```sh
bundle install
bundle exec jekyll serve
```

Open `http://localhost:4000`. The Ruby dependencies are pinned in `Gemfile.lock`. A production build uses `bundle exec jekyll build` and writes to `_site/`.

## Where to edit

| Path | Purpose |
| --- | --- |
| `_posts/` | Canonical project and archive pages; `shop_id` connects each page to a shelf item |
| `_data/shop.yml` | Shelf and receipt content, art paths, links, screenshots, and archive cards |
| `assets/img/` | Project images and videos |
| `assets/css/site.css` | Shared visual system and content pages |
| `assets/css/shop.css` | Shop shelf, counter, and motion styles |
| `assets/js/shop.js` | Shop interactions, photo stacks, receipts, audio, and figure enhancement |
| `_layouts/`, `_includes/` | Shared page templates and the Nico figure illustration |
| `aboutme.html` | About page |
| `patchnotes/` | Version index and Markdown notes consumed by the game and the site |
| `patchnotes.html` | Human-readable patch notes page |
| `_config.yml` | Site metadata, plugins, URLs, and pagination |

The custom domain is set in `_config.yml` as `https://niccolochiodo.com`. The templates use that URL for social sharing metadata. `baseurl` is empty because the site is served from the domain root.

## Edit the shop

Update a product in `_data/shop.yml`. Keep its ID (`bb`, `sf`, `tc`, `ar`, or `nico`) stable because homepage hashes use it. Paths under `art`, `shot`, `photos`, and archive card `img` must point to files in `assets/img/`. Project detail pages live in `_posts/`; keep their `shop_id` values in sync with the shop data. The shop layout, colors, and animation are in `assets/css/shop.css`, while shared page styles are in `assets/css/site.css`. The older `assets/css/main.css`, SCSS files, and Gulp pipeline are retained for history but are not loaded by the current site or Vercel build.

The shop supports direct links such as `/#bb`. With JavaScript unavailable, its visible product links lead to the canonical project and About pages. Sound starts muted; the 3D figure has an SVG fallback. The raw `patchnotes/` files are also consumed by the game, so keep their routes and content format intact.

## Deployment

`vercel.json` configures Vercel to install the Ruby bundle, run `bundle exec jekyll build`, and publish `_site/`. Configure `niccolochiodo.com` in the Vercel project and its DNS settings; this repository does not use GitHub Pages.

The site began from the Flexible-Jekyll theme. Its original GPLv3 license is retained in `LICENSE`; project media may have separate ownership or usage terms.
