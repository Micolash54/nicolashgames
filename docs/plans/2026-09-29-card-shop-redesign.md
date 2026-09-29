# Card shop portfolio redesign plan

**Branch:** `design/card-shop-redesign-plan`  
**Reference:** `E:/WORK/Portfolio/docs/references/card-shop.html`  
**Site:** `E:/WORK/Portfolio/Portfolio Website` (Jekyll 4.4.1, deployed by Vercel)

## Goal and chosen direction

Turn the portfolio into the playful game and card shop shown in the reference. The homepage is the shop: visitors pick a project pack or the Nico figure, move to a checkout counter, and read a receipt containing project details and links. Keep the current Jekyll build and the existing public URLs for projects, About, Tags, and Patch Notes. These pages should share the new visual language and remain usable when the homepage interaction cannot run.

Three possible approaches were considered:

| Approach | Benefit | Cost |
| --- | --- | --- |
| Paste the reference into `index.html` | Fast visual match | Duplicated content, broken image paths, hard to maintain, weak integration with existing pages |
| **Adapt the reference into Jekyll templates and small JS modules** | Close visual match with reusable content and preserved URLs | More initial integration work |
| Rebuild in a new framework | Flexible component model | Unnecessary migration of content, build, and deployment |

Use the Jekyll adaptation. Treat the saved HTML as a design and behavior reference, not production source. It includes Claude frame runtime code and paths such as `img/bb_banner.webp` that do not match this repository.

## What exists today

- `index.html` renders four posts through `_layouts/main.html`, which adds the old sidebar.
- `_layouts/post.html` renders project pages. `_posts/` contains Bits and Boards, Summoners Frontline, Tap Conquest, and Archive.
- `aboutme.html`, `tags.html`, and `patchnotes.html` are separate pages. `/patchnotes/page/` fetches the raw files in `patchnotes/`; the game may use those files too.
- `assets/css/main.css` is served directly; `assets/css/scss/` contains older source styles. The old `package.json` describes a Gulp 3 pipeline, but Vercel runs only `bundle exec jekyll build`.
- Existing optimized project art is under `assets/img/{bb,sf,tc,archive}/`. The reference's `img/ewb.webp`, `img/escapod.webp`, and `img/demomen.webp` do not exist by those names.
- Baseline check on this branch: `bundle exec jekyll build` passes.

## Target experience

1. The first screen has the pink wall, glowing shop sign, short introduction, and shelves. The top shelf holds the three current games; the second holds the Archive mystery pack and Nico figure. Each item has a readable label and an accessible name.
2. Selecting an item reveals the counter. The receipt holds the project's summary, features, tools, imagery, and real external links. Bits and Boards stays visually prominent. The Archive pack opens to reveal three older projects. The Nico figure presents About content and contact links.
3. Visitors can return to the shelf, switch products at the counter, browse screenshots, and load a selected product directly through a hash such as `/#bb`. Browser Back and Forward should reflect the selected item.
4. All existing detail pages use the new typography, color, navigation, and receipt/card motifs. The homepage receipt links to the canonical page. `/about/`, `/tags/`, `/patchnotes/page/`, and each project URL continue to work.
5. On narrow screens the items become a vertical display and the counter becomes one column. Keyboard users can reach every item and control. Reduced motion and no JavaScript still leave a useful portfolio.

## Implementation sequence

### 1. Prepare content and assets

**Files:** `_posts/*.markdown`, `aboutme.html`, new `_data/shop.yml`, `assets/img/`, optional `docs/references/card-shop-notes.md`.

- Add stable shop IDs (`bb`, `sf`, `tc`, `ar`, `nico`), label, genre, feature bullets, tools, external links, and image lists. Use post front matter for the three game packs and Archive; use `_data/shop.yml` for display order, visual tokens, Nico, and the three archive cards. Avoid copying long descriptions into JavaScript.
- Map the reference to local images: `bb/bb_banner.webp` and `bb_shot*.webp`; equivalent `sf/` and `tc/` files; `archive/binders-4-3.webp`, `archive/ewb-splash.webp`, and `archive/demomen-poster.png`. Choose a still or create a poster for Escapod from available local media. Record any missing asset explicitly.
- Retain the existing raw patch note files and public destination URLs. Check the accuracy of outbound Steam, itch.io, Opera GX, GitHub, and X links during implementation.

**Done when:** every shop item has complete content, every referenced local image exists, and there are no placeholder cards or broken image paths.

### 2. Build the visual system and shared shell

**Files:** `_includes/head.html`, `_layouts/default.html`, `_layouts/main.html`, new `_includes/shop-nav.html`, `assets/css/main.css` (and the SCSS source if it remains authoritative).

- Define the reference palette, type scale, spacing, focus states, buttons, shelves, packs, paper receipts, and mobile rules as organized site styles. Use Lilita One, IBM Plex Mono, and VT323 with fallbacks; confirm load behavior.
- Replace the old sidebar with shared navigation and footer. Provide visible routes to Home, About, Projects/Tags, and Patch Notes. Keep per-page title, description, social metadata, canonical URLs, and favicon working.
- Decide one CSS source of truth before editing: either update SCSS and compile to committed `main.css`, or retire the unused Gulp route and maintain `main.css` directly. Verify Vercel needs no Node build step.

**Done when:** all existing pages load the new shared shell, remain readable at 360px and desktop widths, and the Jekyll build still passes.

### 3. Render the shop homepage

**Files:** `index.html`, new `_layouts/shop.html`, new `_includes/shop-product.html`, `_includes/shop-receipt.html`, `assets/css/main.css`.

- Render shelf products, counter, receipt content, photo stacks, and swap controls from Jekyll data. Use normal project links as the fallback; JavaScript enhances them into the shop interaction. Do not encode core copy in `innerHTML` strings.
- Match the reference's hierarchy: store sign, two shelves, featured Bits and Boards pack, register display, receipt paper, related items. Keep the Archive reveal and About figure distinct.
- Make the initial HTML useful without JavaScript: project links lead to their detail pages, About leads to `/about/`, and the shop introduction names the work.

**Done when:** the homepage contains all five items and their content with JavaScript disabled, using real site media.

### 4. Add interaction in layers

**Files:** new `assets/js/shop.js`, optionally `assets/js/shop-audio.js` and `assets/js/shop-figure.js`; `_layouts/shop.html`.

- Implement a small state model (`shelf`, `counter`, `archive-open`) with one selected ID. Bind select, return, swap, photo stack, and archive card actions. Update the hash and handle `hashchange`/Back and Forward.
- Port the reference's pickup, pan, scan, print, and tear motions using CSS/Web Animations API. Guard transitions so rapid clicks cannot strand an item. After a transition, move focus to the counter heading or Back control; on return, restore it to the chosen shelf item.
- Keep sound optional and initially muted. Persist the preference only if the control is used. Add the 3D figure as a progressive enhancement with an SVG/static fallback; load Three.js only when needed and keep the rest of the site functional if it fails.
- Reduced motion should skip travel and printing delays while preserving state and focus changes. Keep visible controls labelled for keyboard and touch; Escape returns to the shelf.

**Done when:** all five items can be opened, swapped, deep linked, and closed repeatedly with mouse, touch, and keyboard; no animation or 3D failure hides content.

### 5. Redesign the remaining pages

**Files:** `_layouts/post.html`, `_posts/*.markdown`, `aboutme.html`, `tags.html`, `patchnotes.html`, `assets/css/main.css`.

- Apply the shop visual system to the canonical project pages with clear headings, media galleries, accessible external links, and a route back to the shelf. Preserve project copy and media, editing only where needed for hierarchy or accessibility.
- Style About as the Nico collectible profile; style Tags as a browsable catalogue. Style Patch Notes as a paper ledger while keeping its fetch/expand behavior and `/patchnotes/page/` route.
- Check archived project videos and mobile embeds in the new layout. Keep the raw `/patchnotes/index.txt` and version Markdown responses byte-for-byte available to the game.

**Done when:** no public page shows the old sidebar/theme and all existing URLs still serve their intended content.

### 6. Verify and ship readiness

**Files:** optional lightweight checks under `scripts/` if manual checking exposes repeatable risks; `README.md` for new content workflow.

- Run `bundle exec jekyll build` from the site directory. Inspect `_site/` for expected routes and asset paths; check the homepage for unresolved Liquid or reference `img/` paths.
- Test desktop, tablet, and 360px mobile layouts. Check overflow, image crops, receipt legibility, landscape, touch targets, and slow asset loading.
- Check keyboard order, visible focus, Escape/Back, screen reader names and announcements, reduced motion, no JavaScript, muted audio, and a blocked Three.js request.
- Test each direct URL and homepage hash, browser Back/Forward, external links, social metadata, and `/patchnotes/page/` loading. Compare key screenshots against the reference and adjust spacing and proportions.
- Update `README.md` with how to edit packs, their image lists, links, and theme styles. Preview the branch on Vercel before any production deployment.

**Done when:** build and route checks pass, critical interactions work across input modes, and the preview has no broken imagery or console errors.

## Order of reviewable changes

1. Content and asset mapping.
2. Shared design system and shell.
3. Static shop and receipt rendering.
4. Shop interactions and optional enhancements.
5. Secondary page redesign.
6. Accessibility, responsive, and deployment verification.

Keep each change buildable and reviewable. Do not deploy to production as part of these steps until the branch preview has been approved.
