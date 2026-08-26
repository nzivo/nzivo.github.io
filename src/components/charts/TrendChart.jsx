import { useMemo, useRef, useState } from 'react'

const WIDTH = 640
const HEIGHT = 220
const PAD = { top: 16, right: 12, bottom: 24, left: 12 }

function formatDay(iso) {
  const d = new Date(iso + 'T00:00:00Z')
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', timeZone: 'UTC' })
}

export default function TrendChart({ data, label = 'Visits' }) {
  const [hoverIndex, setHoverIndex] = useState(null)
  const svgRef = useRef(null)

  const { linePath, areaPath, points, maxY, yTicks } = useMemo(() => {
    const innerW = WIDTH - PAD.left - PAD.right
    const innerH = HEIGHT - PAD.top - PAD.bottom
    const max = Math.max(1, ...data.map((d) => d.count))
    const niceMax = Math.ceil(max / 10) * 10 || 10

    const pts = data.map((d, i) => {
      const x = PAD.left + (data.length === 1 ? innerW / 2 : (i / (data.length - 1)) * innerW)
      const y = PAD.top + innerH - (d.count / niceMax) * innerH
      return { x, y, ...d }
    })

    const line = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ')
    const area =
      pts.length > 0
        ? `${line} L ${pts[pts.length - 1].x.toFixed(1)} ${PAD.top + innerH} L ${pts[0].x.toFixed(1)} ${PAD.top + innerH} Z`
        : ''

    const ticks = [0, 0.5, 1].map((t) => ({
      y: PAD.top + innerH - t * innerH,
      value: Math.round(niceMax * t),
    }))

    return { linePath: line, areaPath: area, points: pts, maxY: niceMax, yTicks: ticks }
  }, [data])

  function handleMove(e) {
    if (!svgRef.current || points.length === 0) return
    const rect = svgRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * WIDTH
    let nearest = 0
    let best = Infinity
    points.forEach((p, i) => {
      const d = Math.abs(p.x - x)
      if (d < best) {
        best = d
        nearest = i
      }
    })
    setHoverIndex(nearest)
  }

  const hovered = hoverIndex !== null ? points[hoverIndex] : null

  return (
    <div className="trend-chart">
      <svg
        ref={svgRef}
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="trend-chart-svg"
        onPointerMove={handleMove}
        onPointerLeave={() => setHoverIndex(null)}
        role="img"
        aria-label={`${label} over time`}
      >
        {yTicks.map((t) => (
          <g key={t.value}>
            <line x1={PAD.left} x2={WIDTH - PAD.right} y1={t.y} y2={t.y} className="trend-chart-grid" />
            <text x={PAD.left} y={t.y - 4} className="trend-chart-tick">
              {t.value.toLocaleString()}
            </text>
          </g>
        ))}

        <path d={areaPath} className="trend-chart-area" />
        <path d={linePath} className="trend-chart-line" />

        {hovered && (
          <>
            <line
              x1={hovered.x}
              x2={hovered.x}
              y1={PAD.top}
              y2={HEIGHT - PAD.bottom}
              className="trend-chart-crosshair"
            />
            <circle cx={hovered.x} cy={hovered.y} r="5" className="trend-chart-dot" />
          </>
        )}

        {points.length > 0 && (
          <>
            <text x={points[0].x} y={HEIGHT - 6} className="trend-chart-tick" textAnchor="start">
              {formatDay(points[0].day)}
            </text>
            <text x={points[points.length - 1].x} y={HEIGHT - 6} className="trend-chart-tick" textAnchor="end">
              {formatDay(points[points.length - 1].day)}
            </text>
          </>
        )}
      </svg>

      {hovered && (
        <div
          className="trend-chart-tooltip"
          style={{ left: `${(hovered.x / WIDTH) * 100}%`, top: `${(hovered.y / HEIGHT) * 100}%` }}
        >
          <strong>{hovered.count.toLocaleString()}</strong>
          <span>{formatDay(hovered.day)}</span>
        </div>
      )}
    </div>
  )
}
