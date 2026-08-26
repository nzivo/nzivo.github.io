const SIZE = 180
const R = 70
const STROKE = 26
const CIRC = 2 * Math.PI * R
const GAP = CIRC * 0.014

const DEFAULT_COLORS = [
  'var(--series-1)',
  'var(--series-2)',
  'var(--series-3)',
  'var(--series-4)',
  'var(--series-5)',
]
const OTHER_COLOR = 'var(--muted)'

export default function DonutChart({ data, maxSlices = 5 }) {
  const sorted = [...data].sort((a, b) => b.count - a.count)
  const head = sorted.slice(0, maxSlices)
  const restTotal = sorted.slice(maxSlices).reduce((sum, d) => sum + d.count, 0)
  const slices = restTotal > 0 ? [...head, { name: 'Other', count: restTotal }] : head

  const total = slices.reduce((sum, d) => sum + d.count, 0) || 1

  let cumulative = 0
  const arcs = slices.map((slice, i) => {
    const fraction = slice.count / total
    const length = Math.max(fraction * CIRC - GAP, 0)
    const offset = -cumulative
    cumulative += fraction * CIRC
    const color = i < head.length ? DEFAULT_COLORS[i] : OTHER_COLOR
    return { ...slice, length, offset, color, pct: Math.round(fraction * 100) }
  })

  return (
    <div className="donut-chart">
      <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="donut-chart-svg" role="img" aria-label="Top referrers">
        <circle cx={SIZE / 2} cy={SIZE / 2} r={R} className="donut-chart-track" strokeWidth={STROKE} />
        {arcs.map((arc) => (
          <circle
            key={arc.name}
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={R}
            fill="none"
            stroke={arc.color}
            strokeWidth={STROKE}
            strokeDasharray={`${arc.length} ${CIRC - arc.length}`}
            strokeDashoffset={arc.offset}
            transform={`rotate(-90 ${SIZE / 2} ${SIZE / 2})`}
            strokeLinecap="butt"
          />
        ))}
        <text x={SIZE / 2} y={SIZE / 2 - 4} textAnchor="middle" className="donut-chart-total-value">
          {total.toLocaleString()}
        </text>
        <text x={SIZE / 2} y={SIZE / 2 + 16} textAnchor="middle" className="donut-chart-total-label">
          visits
        </text>
      </svg>

      <ul className="donut-chart-legend">
        {arcs.map((arc) => (
          <li key={arc.name}>
            <span className="donut-chart-swatch" style={{ background: arc.color }} />
            <span className="donut-chart-legend-name">{arc.name}</span>
            <span className="donut-chart-legend-value">{arc.pct}%</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
