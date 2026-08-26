export default function BarList({ data, maxRows = 6 }) {
  const rows = [...data].sort((a, b) => b.count - a.count).slice(0, maxRows)
  const max = Math.max(1, ...rows.map((r) => r.count))

  return (
    <ul className="bar-list">
      {rows.map((row) => (
        <li key={row.name} className="bar-list-row">
          <span className="bar-list-name">{row.name}</span>
          <span className="bar-list-track">
            <span className="bar-list-fill" style={{ width: `${(row.count / max) * 100}%` }} />
          </span>
          <span className="bar-list-value">{row.count.toLocaleString()}</span>
        </li>
      ))}
    </ul>
  )
}
