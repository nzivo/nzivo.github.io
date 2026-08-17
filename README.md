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
- **Blog** posts are the `.html` files in `public/blog/` — each one is a standalone, self-styled
  page (own inline CSS, not touched by the React app). To publish a new post, just copy its
  exported `.html` file into `public/blog/`. `src/data/blog.js` is auto-generated from that folder
  by [scripts/generate-blog-index.mjs](scripts/generate-blog-index.mjs) — **don't hand-edit it,
  it gets overwritten.** It regenerates automatically on `npm run dev` / `npm run build`, and live
  (no restart) while the dev server is already running. Title/category/summary are pulled from
  each file's `<h1>`, `.eyebrow`, and `.sub` — run `npm run blog:index` to regenerate on demand.

## Credits

- Photographers from [Pexels](https://www.pexels.com) — Art Jamie's, Roberto Vivancos
