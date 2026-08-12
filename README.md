# John Nzivo — Portfolio

React + Vite portfolio site with a categorized/tagged project showcase, pricing packages,
a contact form, and an inline resume viewer.

## Develop

```bash
npm install
npm run dev
```

## Build

```bash
npm run build   # outputs to dist/
npm run preview # serve the production build locally
```

## Deploy

Pushing to `master` runs [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml), which
builds the site and publishes it to GitHub Pages. **One-time setup:** in this repo's
Settings → Pages, set **Source** to **GitHub Actions**.

## Configuration

- **Contact form** ([src/pages/Contact.jsx](src/pages/Contact.jsx)) posts to Formspree. Replace
  `FORMSPREE_ENDPOINT` with your real form ID from [formspree.io](https://formspree.io).
- **Projects** ([src/data/projects.js](src/data/projects.js)) and **pricing**
  ([src/data/pricing.js](src/data/pricing.js)) are placeholder content — edit those files with
  real project details and rates.
- **Resume** lives at `public/resume.pdf`; replace the file to update the Resume page and download link.

## Credits

- Photographers from [Pexels](https://www.pexels.com) — Art Jamie's, Roberto Vivancos
