import siteConfig from '../../site.config.json'

// GoatCounter site code isn't sensitive — it's meant to be embedded directly
// in client-side code/HTML, same as any analytics tracking ID. Set the real
// value in site.config.json (free account at https://www.goatcounter.com).
const CODE = siteConfig.goatcounterCode
export const goatcounterConfigured = Boolean(CODE) && CODE !== 'YOUR_GOATCOUNTER_CODE'
const BASE = goatcounterConfigured ? `https://${CODE}.goatcounter.com` : null

let scriptPromise = null

function loadScript() {
  if (!goatcounterConfigured) return Promise.resolve(false)
  if (scriptPromise) return scriptPromise

  scriptPromise = new Promise((resolve) => {
    window.goatcounter = { no_onload: true, allow_local: true }
    const script = document.createElement('script')
    script.async = true
    script.src = '//gc.zgo.at/count.js'
    // count.js reads its endpoint from data-goatcounter on the script tag
    // that loaded it — required here since we're creating it via JS rather
    // than a static <script data-goatcounter="..."> embed.
    script.dataset.goatcounter = `${BASE}/count`
    script.onload = () => resolve(true)
    script.onerror = () => resolve(false)
    document.head.appendChild(script)
  })

  return scriptPromise
}

// Records one pageview for an SPA route change (blog posts are separate
// static HTML files and track themselves — see generate-blog-index.mjs).
export async function trackPageview(path, title) {
  if (!goatcounterConfigured) return
  const loaded = await loadScript()
  if (loaded) window.goatcounter?.count?.({ path, title })
}

// Reads the public view count for a path from GoatCounter's counter
// endpoint. Returns null (never throws) if unconfigured or unreachable, so
// callers can just hide the counter on failure.
export async function getViewCount(path) {
  if (!goatcounterConfigured) return null
  try {
    // GoatCounter's counter endpoint is /counter/<path-with-leading-slash>.json
    // (yes, double slash after "counter") — encode each segment, not the
    // slashes themselves.
    const encodedPath = path.split('/').map(encodeURIComponent).join('/')
    const res = await fetch(`${BASE}/counter/${encodedPath}.json`)
    if (!res.ok) return null
    const data = await res.json()
    return data.count ?? null
  } catch {
    return null
  }
}
