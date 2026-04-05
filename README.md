# Heartwood General Contracting — Website

Single-page contractor website built with [Astro](https://astro.build/) + [Tailwind CSS v4](https://tailwindcss.com/), deployed to GitHub Pages.

## Local Development

```bash
npm install
npm run dev
```

The site runs at `http://localhost:4321`.

To build for production:

```bash
npm run build
npm run preview
```

## Project Photos

Drop photos (`.jpg`, `.jpeg`, or `.png`) into `src/assets/projects/`. The site automatically picks 6 random images to display in the grid on the homepage. Clicking any image opens a lightbox gallery (powered by [GLightbox](https://biati-digital.github.io/glightbox/)) containing all images in the folder.

The Git pre-commit hook will automatically:
- Strip EXIF metadata
- Resize to max 1920px wide
- Generate a `.webp` version at 80% quality

You can also run the optimizer manually:

```bash
npm run optimize-images
```

## Formspree Setup

1. Create a free account at [formspree.io](https://formspree.io)
2. Create two forms: one for quotes, one for job applications
3. Replace the form action URLs:
   - `src/components/Contact.astro` — replace `FORM_ID_HERE` with your quote form ID
   - `src/pages/join.astro` — replace `JOIN_FORM_ID_HERE` with your careers form ID

> Note: Formspree's free tier allows 50 submissions/month.

## hCaptcha Setup

1. Sign up at [hcaptcha.com](https://www.hcaptcha.com/) (free tier is unlimited)
2. Get your site key
3. In `src/components/Contact.astro` and `src/pages/join.astro`, uncomment the hCaptcha div and replace `YOUR_HCAPTCHA_SITE_KEY`
4. Add the hCaptcha script to `src/layouts/BaseLayout.astro`:
   ```html
   <script src="https://js.hcaptcha.com/1/api.js" async defer></script>
   ```

## Google Analytics (GA4)

1. Create a GA4 property at [analytics.google.com](https://analytics.google.com)
2. Copy your Measurement ID (starts with `G-`)
3. In `src/layouts/BaseLayout.astro`, replace `G-XXXXXXXXXX` with your ID

Analytics only loads in production builds.

## Custom Domain on GitHub Pages

The site currently deploys to `porchlight.github.io/heartwoodgc/`. When you're ready to use the custom domain:

1. In your domain registrar, add these DNS records:

   | Type  | Host | Value               |
   |-------|------|---------------------|
   | A     | @    | 185.199.108.153     |
   | A     | @    | 185.199.109.153     |
   | A     | @    | 185.199.110.153     |
   | A     | @    | 185.199.111.153     |
   | CNAME | www  | porchlight.github.io |

2. In the GitHub repo → Settings → Pages, enter `heartwoodgc.com` as the custom domain
3. Enable "Enforce HTTPS"
4. In `astro.config.mjs`, change:
   ```js
   site: 'https://porchlight.github.io',
   base: '/heartwoodgc/',
   ```
   to:
   ```js
   site: 'https://heartwoodgc.com',
   ```
   (remove the `base` line entirely)
5. Push the change — GitHub handles the SSL certificate automatically

## TODO Locations

All client-replaceable values are marked with `<!-- TODO: replace -->` comments:

- `src/layouts/BaseLayout.astro` — GA4 measurement ID (`G-XXXXXXXXXX`)
- `src/components/Contact.astro` — Formspree form ID, email address, hCaptcha site key
- `src/pages/join.astro` — Formspree form ID for careers form

## Project Structure

```
├── .github/workflows/deploy.yml   # GitHub Pages deployment
├── .githooks/pre-commit            # Image optimization hook
├── public/
│   ├── logo.svg                    # Full Heartwood logo (wordmark + icon)
│   ├── icon.svg                    # House icon only (used in nav, footer, favicon)
│   └── CNAME                       # Custom domain
├── scripts/
│   └── optimize-images.js          # Sharp-based image optimizer
├── src/
│   ├── assets/projects/            # Project photos go here
│   ├── components/                 # Astro components
│   ├── layouts/BaseLayout.astro    # Base HTML layout + SEO
│   ├── pages/
│   │   ├── index.astro             # Main single-page site
│   │   └── join.astro              # Careers page
│   └── styles/global.css           # Tailwind + custom styles
├── astro.config.mjs
└── package.json
```
