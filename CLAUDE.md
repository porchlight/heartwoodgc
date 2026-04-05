# Heartwood General Contracting — Website

## Business Context
- **Business**: Heartwood General Contracting — residential general contractor in London, Ontario
- **Owner focus**: Renovations — kitchens, bathrooms, basements, additions, outdoor living, flooring, tile work
- **Phone**: (519) 282-4445
- **Social**: facebook.com/heartwoodgc, instagram.com/heartwoodgc
- **Live site**: heartwoodgc.com (this repo replaces the old Drupal site)

## Stack
- **Framework**: Astro 5 (static output)
- **CSS**: Tailwind CSS v4 via `@tailwindcss/vite` plugin (NOT `@astrojs/tailwind`)
- **Sitemap**: `@astrojs/sitemap`
- **Image optimization**: sharp (dev dependency, used by git hook + manual script)
- **Deployment**: GitHub Pages via `withastro/action`
- **Forms**: Formspree (two forms — quote + careers)

## Commands
```bash
npm run dev          # Local dev server at localhost:4321
npm run build        # Production build to dist/
npm run preview      # Preview production build
npm run optimize-images  # Manually optimize images in src/assets/projects/
```

## Architecture
- Single-page site (`src/pages/index.astro`) with anchor sections: #hero, #services, #projects, #about, #contact
- Separate careers page (`src/pages/join.astro`)
- Shared layout in `src/layouts/BaseLayout.astro` — handles SEO, OG tags, JSON-LD, GA4
- Components in `src/components/` — one per section (Nav, Hero, Services, Projects, About, Contact, Footer)
- Global CSS imported in BaseLayout frontmatter (NOT in a `<style>` tag — must stay unscoped for Tailwind + custom classes to work across components)

## Design System
- **Fonts**: Playfair Display (headings via `font-heading` class), DM Sans (body via `font-body`)
- **Colors** (defined as `@theme` vars in `src/styles/global.css`):
  - `heartwood-cream` (#F5F0E8) — page background
  - `heartwood-charcoal` (#1C1C1A) — primary text, dark sections
  - `heartwood-brown` (#5C3D2E) — primary accent (deep walnut)
  - `heartwood-tan` (#C4956A) — secondary accent (warm oak)
  - `heartwood-stone` (#8C7B6B) — muted/secondary text
- Use Tailwind classes like `bg-heartwood-brown`, `text-heartwood-cream`, etc.

## Key Implementation Details
- **Logo assets**: `public/logo.svg` is the full wordmark (used in Hero inside the cream content box — no white wrapper needed). `public/icon.svg` is the house icon only, extracted from the logo — used in nav, footer, and as the browser favicon. Icon needs `bg-white rounded p-1` on dark backgrounds since the SVG has dark fills.
- **Hero**: Full-bleed background image (`src/assets/projects/img_1661.jpg`) with a light overlay. Content sits in a `bg-heartwood-cream/90 backdrop-blur-sm` box. To change the hero photo, update the import in `Hero.astro`.
- **Nav**: Sticky, shrinks on scroll via JS scroll listener + `.nav-scrolled` CSS class. Mobile hamburger uses JS toggle (not `<details>`).
- **Hero animations**: Custom `@keyframes fadeSlideUp` with staggered delays via `.animation-delay-*` classes
- **Projects gallery**: Displays 6 random images from `src/assets/projects/` in a 2x3 grid. Clicking any image opens a GLightbox lightbox with ALL images in the folder. Images are imported via `import.meta.glob` at build time. Hidden `<a>` tags for non-displayed images ensure they're included in the lightbox gallery. GLightbox JS/CSS is imported in a `<script>` tag in the component.
- **Image pipeline**: `.githooks/pre-commit` runs `scripts/optimize-images.js` on staged images in `src/assets/projects/`. Strips EXIF, resizes to max 1920px, generates WebP at 80% quality.
- **GA4**: Only loads when `import.meta.env.PROD` is true
- **Forms**: Honeypot field (`_gotcha`) for spam protection. hCaptcha placeholder commented out.

## Placeholders to Replace
Search for `TODO: replace` in the codebase. Key ones:
- `G-XXXXXXXXXX` in BaseLayout.astro — GA4 measurement ID
- `FORM_ID_HERE` in Contact.astro — Formspree quote form ID
- `JOIN_FORM_ID_HERE` in join.astro — Formspree careers form ID
- `info@heartwoodgc.com` in Contact.astro — actual email address
- Project photos are now real images loaded from `src/assets/projects/` (no more placeholders)

## Gotchas
- CSS must be imported in BaseLayout's frontmatter (`import '../styles/global.css'`), not inside a `<style>` tag. Astro scopes `<style>` blocks to the component, which breaks Tailwind utilities and custom classes used in child components.
- Tailwind v4 uses `@theme` block in CSS for custom values, not `tailwind.config.js` (there is no config file).
- The `prepare` script in package.json sets git hooks path — requires git init before `npm install`.
- Formspree free tier: 50 submissions/month.
- **GitHub Pages base path**: The site is currently at `porchlight.github.io/heartwoodgc/` so `astro.config.mjs` has `site: 'https://porchlight.github.io'` and `base: '/heartwoodgc'`. When the custom domain (`heartwoodgc.com`) is set up, change `site` to `'https://heartwoodgc.com'` and remove the `base` line entirely.
