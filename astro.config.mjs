import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  // TODO: When custom domain is ready, change back to:
  // site: 'https://heartwoodgc.com',
  // and remove the base line
  site: 'https://porchlight.github.io',
  base: '/heartwoodgc',
  output: 'static',
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
});
