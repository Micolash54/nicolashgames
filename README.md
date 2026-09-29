# Nicolash Games portfolio website

This repository contains the Jekyll site for [niccolochiodo.com](https://niccolochiodo.com). It presents Nicolash Games projects, an about page, and patch notes for Bits and Boards.

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
| `_posts/` | Project and archive pages |
| `assets/img/` | Project images and videos |
| `assets/css/` | Site styles; `main.css` is served by the site |
| `_layouts/`, `_includes/` | Shared page templates |
| `aboutme.html` | About page |
| `patchnotes/` | Version index and Markdown notes consumed by the game and the site |
| `patchnotes.html` | Human-readable patch notes page |
| `_config.yml` | Site metadata, plugins, URLs, and pagination |

The custom domain is set in `_config.yml` as `https://niccolochiodo.com`. The templates use that URL for social sharing metadata. `baseurl` is empty because the site is served from the domain root.

## Deployment

`vercel.json` configures Vercel to install the Ruby bundle, run `bundle exec jekyll build`, and publish `_site/`. Configure `niccolochiodo.com` in the Vercel project and its DNS settings; this repository does not use GitHub Pages.

The site began from the Flexible-Jekyll theme. Its original GPLv3 license is retained in `LICENSE`; project media may have separate ownership or usage terms.
