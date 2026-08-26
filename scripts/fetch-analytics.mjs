// Fetches an analytics snapshot from the GoatCounter API and writes it to
// public/analytics-snapshot.json — a plain static file with only aggregate
// numbers, safe to ship. The API token that authenticates the fetch lives
// ONLY in the GITHUB_TOKEN-style repo secret GOATCOUNTER_API_TOKEN, read
// here as a Node env var; it is never bundled into client-side code and
// never written to this output file.
//
// Runs in CI (see .github/workflows/deploy.yml) on a schedule and on every
// deploy — never commit the output; it's gitignored. Without the secret
// (e.g. a local build), writes clearly-labeled sample data instead, so the
// analytics page has something to render and a missing secret is obvious
// rather than silently blank.

import { mkdirSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { readFileSync } from 'node:fs'

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)))
const outFile = path.join(root, 'public', 'analytics-snapshot.json')

const siteConfig = JSON.parse(readFileSync(path.join(root, 'site.config.json'), 'utf8'))
const CODE = siteConfig.goatcounterCode
const TOKEN = process.env.GOATCOUNTER_API_TOKEN
const RANGE_DAYS = 30

const configured = Boolean(CODE) && CODE !== 'YOUR_GOATCOUNTER_CODE' && Boolean(TOKEN)

async function apiGet(pathname, params = {}) {
  const url = new URL(`https://${CODE}.goatcounter.com/api/v0${pathname}`)
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v)

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${TOKEN}`, 'Content-Type': 'application/json' },
  })
  if (!res.ok) {
    throw new Error(`GoatCounter API ${pathname} -> ${res.status} ${await res.text()}`)
  }
  return res.json()
}

function sampleSnapshot() {
  const daily = Array.from({ length: RANGE_DAYS }, (_, i) => {
    const d = new Date()
    d.setUTCDate(d.getUTCDate() - (RANGE_DAYS - 1 - i))
    return { day: d.toISOString().slice(0, 10), count: 20 + Math.round(Math.random() * 40) }
  })
  return {
    sample: true,
    generatedAt: new Date().toISOString(),
    rangeDays: RANGE_DAYS,
    totalVisits: daily.reduce((sum, d) => sum + d.count, 0),
    daily,
    topPages: [
      { path: '/projects/senti-salary-advance-admin-portal', title: 'Senti Salary Advance Admin Portal', count: 214 },
      { path: '/', title: 'Home', count: 188 },
      { path: '/projects', title: 'Projects', count: 152 },
      { path: '/blog/cola-wars.html', title: 'Cola Wars', count: 97 },
      { path: '/contact', title: 'Contact', count: 61 },
    ],
    topReferrers: [
      { name: 'Direct', count: 340 },
      { name: 'google.com', count: 210 },
      { name: 'linkedin.com', count: 140 },
      { name: 'twitter.com', count: 90 },
      { name: 'github.com', count: 60 },
    ],
    topLocations: [
      { name: 'Kenya', count: 420 },
      { name: 'United States', count: 260 },
      { name: 'United Kingdom', count: 110 },
      { name: 'Germany', count: 70 },
      { name: 'India', count: 55 },
    ],
    topBrowsers: [
      { name: 'Chrome', count: 560 },
      { name: 'Safari', count: 240 },
      { name: 'Firefox', count: 95 },
      { name: 'Edge', count: 60 },
    ],
  }
}

async function realSnapshot() {
  const end = new Date()
  const start = new Date(end.getTime() - RANGE_DAYS * 24 * 60 * 60 * 1000)
  const range = { start: start.toISOString(), end: end.toISOString() }

  const [total, hits, referrers, locations, browsers] = await Promise.all([
    apiGet('/stats/total', { ...range }),
    apiGet('/stats/hits', { ...range, limit: 10 }),
    apiGet('/stats/toprefs', { ...range, limit: 6 }),
    apiGet('/stats/locations', { ...range, limit: 6 }),
    apiGet('/stats/browsers', { ...range, limit: 6 }),
  ])

  return {
    sample: false,
    generatedAt: new Date().toISOString(),
    rangeDays: RANGE_DAYS,
    totalVisits: total.total,
    daily: (total.stats || []).map((s) => ({ day: s.day, count: s.daily })),
    topPages: (hits.hits || []).map((h) => ({ path: h.path, title: h.title, count: h.count })),
    topReferrers: (referrers.stats || []).map((s) => ({ name: s.name || '(unknown)', count: s.count })),
    topLocations: (locations.stats || []).map((s) => ({ name: s.name || '(unknown)', count: s.count })),
    topBrowsers: (browsers.stats || []).map((s) => ({ name: s.name || '(unknown)', count: s.count })),
  }
}

async function run() {
  mkdirSync(path.dirname(outFile), { recursive: true })

  if (!configured) {
    writeFileSync(outFile, JSON.stringify(sampleSnapshot(), null, 2))
    console.log('[analytics] GOATCOUNTER_API_TOKEN not set — wrote sample data to public/analytics-snapshot.json')
    return
  }

  try {
    const snapshot = await realSnapshot()
    writeFileSync(outFile, JSON.stringify(snapshot, null, 2))
    console.log(`[analytics] wrote live snapshot (${snapshot.totalVisits} visits / ${RANGE_DAYS}d) to public/analytics-snapshot.json`)
  } catch (err) {
    console.error('[analytics] fetch failed, falling back to sample data:', err.message)
    writeFileSync(outFile, JSON.stringify(sampleSnapshot(), null, 2))
  }
}

run()
