// Scans public/blog/*.html and regenerates src/data/blog.js.
// Run automatically before `dev`/`build` (see package.json), and live while
// `npm run dev` is running (see the blogIndex plugin in vite.config.js).
// Do not hand-edit src/data/blog.js — it gets overwritten.

import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)))
const blogDir = path.join(root, 'public', 'blog')
const outFile = path.join(root, 'src', 'data', 'blog.js')

const siteConfig = JSON.parse(readFileSync(path.join(root, 'site.config.json'), 'utf8'))
const GOATCOUNTER_CODE = siteConfig.goatcounterCode
const goatcounterConfigured = Boolean(GOATCOUNTER_CODE) && GOATCOUNTER_CODE !== 'YOUR_GOATCOUNTER_CODE'

function decodeEntities(str) {
  return str
    .replace(/&middot;/g, '·')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ')
}

function stripTags(str) {
  return str.replace(/<[^>]+>/g, '')
}

function clean(str) {
  return decodeEntities(stripTags(str)).replace(/\s+/g, ' ').trim()
}

function titleCaseFromSlug(slug) {
  return slug
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}

// These posts are standalone static HTML files rendered outside the React
// app, so a "back" button can't reuse app routing — it's injected directly
// into the file as a fixed-position link, styled inline so it looks right
// regardless of each post's own theme. Idempotent: skips files that already
// have it, so re-running doesn't touch mtime (which drives post ordering).
const BACK_LINK_MARKER = '<!-- injected:back-to-blog -->'

function ensureBackLink(filePath, html) {
  if (html.includes(BACK_LINK_MARKER)) return html

  const bodyMatch = html.match(/<body[^>]*>/)
  if (!bodyMatch) return html

  const backLink = `${BACK_LINK_MARKER}
<a href="/blog" style="position:fixed;top:16px;left:16px;z-index:2147483647;display:inline-flex;align-items:center;gap:6px;padding:8px 14px;border-radius:999px;background:rgba(18,16,22,0.88);color:#fff;font:600 13px/1 -apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;text-decoration:none;box-shadow:0 2px 10px rgba(0,0,0,.3);">← Back to blog</a>
`

  const insertAt = bodyMatch.index + bodyMatch[0].length
  const updated = html.slice(0, insertAt) + '\n' + backLink + html.slice(insertAt)
  writeFileSync(filePath, updated)
  return updated
}

// Tracks a pageview and shows a "N views" badge on each post, both via
// GoatCounter (see src/lib/goatcounter.js for the React-side equivalent used
// on project pages). No-ops entirely — nothing is injected — until a real
// code is set in site.config.json, so re-running after that fills it in.
const GOATCOUNTER_MARKER = '<!-- injected:goatcounter -->'

function ensureGoatCounter(filePath, html) {
  if (!goatcounterConfigured || html.includes(GOATCOUNTER_MARKER)) return html

  const bodyMatch = html.match(/<body[^>]*>/)
  if (!bodyMatch) return html

  const base = `https://${GOATCOUNTER_CODE}.goatcounter.com`
  const block = `${GOATCOUNTER_MARKER}
<script data-goatcounter="${base}/count" async src="//gc.zgo.at/count.js"></script>
<span id="gc-view-count" style="position:fixed;top:16px;left:150px;z-index:2147483647;display:none;align-items:center;padding:8px 14px;border-radius:999px;background:rgba(18,16,22,0.88);color:#fff;font:600 13px/1 -apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;box-shadow:0 2px 10px rgba(0,0,0,.3);"></span>
<script>
(function () {
  var path = location.pathname.split('/').map(encodeURIComponent).join('/')
  fetch('${base}/counter/' + path + '.json')
    .then(function (r) { return r.ok ? r.json() : null })
    .then(function (d) {
      if (!d || !d.count) return
      var el = document.getElementById('gc-view-count')
      el.textContent = d.count + ' views'
      el.style.display = 'inline-flex'
    })
    .catch(function () {})
})()
</script>
`

  const insertAt = bodyMatch.index + bodyMatch[0].length
  const updated = html.slice(0, insertAt) + '\n' + block + html.slice(insertAt)
  writeFileSync(filePath, updated)
  return updated
}

function extractPost(file) {
  const filePath = path.join(blogDir, file)
  let html = readFileSync(filePath, 'utf8')
  html = ensureBackLink(filePath, html)
  html = ensureGoatCounter(filePath, html)
  const slug = file.replace(/\.html$/, '')

  const title =
    clean((html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/) || [])[1] || '') ||
    clean((html.match(/<title>([\s\S]*?)<\/title>/) || [])[1] || '') ||
    titleCaseFromSlug(slug)

  const category = clean((html.match(/class="eyebrow"[^>]*>([\s\S]*?)<\/p>/) || [])[1] || '')

  const summary =
    clean((html.match(/class="sub"[^>]*>([\s\S]*?)<\/p>/) || [])[1] || '') ||
    clean((html.match(/<p[^>]*>([\s\S]*?)<\/p>/) || [])[1] || '')

  const mtime = statSync(filePath).mtimeMs

  return { slug, file: `/blog/${file}`, title, category, summary, mtime }
}

function run() {
  let files = []
  try {
    files = readdirSync(blogDir).filter((f) => f.toLowerCase().endsWith('.html'))
  } catch {
    // public/blog doesn't exist yet — write an empty index instead of failing the build.
  }

  const posts = files
    .map(extractPost)
    .sort((a, b) => b.mtime - a.mtime)
    .map(({ mtime, ...post }) => post)

  const body = posts
    .map(
      (p) =>
        `  {\n    slug: ${JSON.stringify(p.slug)},\n    file: ${JSON.stringify(p.file)},\n    title: ${JSON.stringify(p.title)},\n    category: ${JSON.stringify(p.category)},\n    summary: ${JSON.stringify(p.summary)},\n  },`
    )
    .join('\n')

  const contents = `// AUTO-GENERATED by scripts/generate-blog-index.mjs — do not hand-edit.
// Source of truth: the .html files in public/blog/. Copy a new export there
// and this file regenerates on the next \`npm run dev\` / \`npm run build\`
// (or instantly while the dev server is already running).

export const blogPosts = [
${body}
]
`

  writeFileSync(outFile, contents)
  console.log(`[blog-index] wrote ${posts.length} post(s) to src/data/blog.js`)
}

run()
