import { useEffect, useRef, useState } from 'react'
import './Resume.css'

const SENSITIVE_PATTERNS = [
  /[\w.+-]+@[\w-]+\.[a-zA-Z]{2,}/, // email
  /\+?\d[\d\-().\s]{7,}\d/, // phone number
]

function isSensitive(str) {
  return SENSITIVE_PATTERNS.some((re) => re.test(str))
}

// The current resume.pdf renders its contact row (phone + email) as outlined
// vector paths rather than real text, so it has no extractable text item or
// link annotation to match against. Measured directly off the rendered page 1
// as fractions of the canvas, independent of render scale. Re-measure this if
// resume.pdf's header layout changes.
const FIXED_REDACTIONS = [{ x0: 0.4, y0: 0.175, x1: 0.85, y1: 0.215 }]

export default function Resume() {
  const canvasRef = useRef(null)
  const [pageCount, setPageCount] = useState(null)
  const [status, setStatus] = useState('loading') // loading | ready | error

  useEffect(() => {
    let cancelled = false
    let renderTask = null

    async function render() {
      try {
        const [pdfjsLib, { default: workerUrl }] = await Promise.all([
          import('pdfjs-dist'),
          import('pdfjs-dist/build/pdf.worker.min.mjs?url'),
        ])
        if (cancelled) return
        pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl

        const pdf = await pdfjsLib.getDocument({ url: '/resume.pdf' }).promise
        if (cancelled) return
        setPageCount(pdf.numPages)

        const page = await pdf.getPage(1)
        if (cancelled) return

        const canvas = canvasRef.current
        if (!canvas) return

        const containerWidth = canvas.parentElement.clientWidth
        const baseViewport = page.getViewport({ scale: 1 })
        const scale = containerWidth / baseViewport.width
        const dpr = window.devicePixelRatio || 1
        const viewport = page.getViewport({ scale: scale * dpr })

        canvas.width = viewport.width
        canvas.height = viewport.height
        canvas.style.width = `${containerWidth}px`
        canvas.style.height = `${viewport.height / dpr}px`

        const ctx = canvas.getContext('2d')
        renderTask = page.render({ canvasContext: ctx, viewport })
        await renderTask.promise
        if (cancelled) return

        const totalScale = scale * dpr
        const textContent = await page.getTextContent()
        const pad = 3 * dpr

        ctx.fillStyle = '#15131a'

        // Generic pass: covers any sensitive text that IS real/extractable.
        for (const item of textContent.items) {
          if (!item.str || !isSensitive(item.str)) continue
          const tx = pdfjsLib.Util.transform(viewport.transform, item.transform)
          const fontHeight = Math.hypot(tx[2], tx[3])
          const boxX = tx[4]
          const boxY = tx[5] - fontHeight
          const boxW = item.width * totalScale
          ctx.fillRect(boxX - pad, boxY - pad, boxW + pad * 2, fontHeight + pad * 2)
        }

        // Fixed pass: covers known regions that aren't real text (see above).
        for (const r of FIXED_REDACTIONS) {
          ctx.fillRect(
            r.x0 * canvas.width,
            r.y0 * canvas.height,
            (r.x1 - r.x0) * canvas.width,
            (r.y1 - r.y0) * canvas.height
          )
        }

        if (!cancelled) setStatus('ready')
      } catch (err) {
        if (!cancelled && err?.name !== 'RenderingCancelledException') setStatus('error')
      }
    }

    render()

    return () => {
      cancelled = true
      renderTask?.cancel()
    }
  }, [])

  return (
    <div className="section resume-page">
      <div className="container">
        <div className="section-head resume-head">
          <div>
            <span className="eyebrow">Resume</span>
            <h1>John Nzivo</h1>
            <p>Designer &amp; developer. Preview the first page below, or download the full PDF.</p>
          </div>
          <a href="/resume.pdf" download className="btn btn-primary">
            Download PDF
          </a>
        </div>

        <div className="resume-preview card">
          {status === 'error' ? (
            <div className="resume-fallback">
              <p>Couldn't load a preview.</p>
              <a href="/resume.pdf" download className="btn btn-primary btn-sm">
                Download the resume
              </a>
            </div>
          ) : (
            <>
              {status === 'loading' && <p className="resume-loading">Loading preview…</p>}
              <canvas ref={canvasRef} className="resume-canvas" />
            </>
          )}
        </div>

        {pageCount > 1 && (
          <div className="resume-more card">
            <p>
              This preview shows page 1 of {pageCount}. Download the full PDF to view the rest.
            </p>
            <a href="/resume.pdf" download className="btn btn-primary btn-sm">
              Download full resume
            </a>
          </div>
        )}
      </div>
    </div>
  )
}
