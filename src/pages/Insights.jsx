import { useEffect, useState } from 'react'
import StatTile from '../components/StatTile.jsx'
import TrendChart from '../components/charts/TrendChart.jsx'
import DonutChart from '../components/charts/DonutChart.jsx'
import BarList from '../components/charts/BarList.jsx'
import './Insights.css'

function formatWhen(iso) {
  if (!iso) return ''
  return new Date(iso).toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  })
}

export default function Insights() {
  const [snapshot, setSnapshot] = useState(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    fetch('/analytics-snapshot.json')
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then(setSnapshot)
      .catch(() => setError(true))
  }, [])

  if (error) {
    return (
      <div className="insights-page">
        <div className="insights-empty">No analytics snapshot found yet.</div>
      </div>
    )
  }

  if (!snapshot) {
    return (
      <div className="insights-page">
        <div className="insights-empty">Loading…</div>
      </div>
    )
  }

  const avgPerDay = snapshot.rangeDays ? Math.round(snapshot.totalVisits / snapshot.rangeDays) : 0
  const topPage = snapshot.topPages?.[0]
  const topReferrer = [...(snapshot.topReferrers || [])].sort((a, b) => b.count - a.count)[0]

  return (
    <div className="insights-page">
      <div className="insights-shell">
        <header className="insights-header">
          <div>
            <span className="insights-eyebrow">Insights</span>
            <h1>Site analytics</h1>
          </div>
          <span className="insights-updated">Updated {formatWhen(snapshot.generatedAt)}</span>
        </header>

        {snapshot.sample && (
          <div className="insights-sample-banner">
            Showing sample data — GOATCOUNTER_API_TOKEN isn't set for this build, so nothing live has been fetched yet.
          </div>
        )}

        <div className="insights-stat-row">
          <StatTile label={`Total visits (${snapshot.rangeDays}d)`} value={snapshot.totalVisits.toLocaleString()} />
          <StatTile label="Avg. visits / day" value={avgPerDay.toLocaleString()} />
          <StatTile
            label="Top page"
            value={topPage ? topPage.count.toLocaleString() : '—'}
            sub={topPage?.title || topPage?.path}
          />
          <StatTile
            label="Top referrer"
            value={topReferrer ? topReferrer.count.toLocaleString() : '—'}
            sub={topReferrer?.name}
          />
        </div>

        <section className="insights-card insights-trend-card">
          <h2>Visits over time</h2>
          <TrendChart data={snapshot.daily || []} />
        </section>

        <div className="insights-grid">
          <section className="insights-card">
            <h2>Top referrers</h2>
            <DonutChart data={snapshot.topReferrers || []} />
          </section>

          <section className="insights-card">
            <h2>Top locations</h2>
            <BarList data={snapshot.topLocations || []} />
          </section>

          <section className="insights-card">
            <h2>Top browsers</h2>
            <BarList data={snapshot.topBrowsers || []} />
          </section>
        </div>

        <section className="insights-card">
          <h2>Top pages</h2>
          <table className="insights-table">
            <thead>
              <tr>
                <th>Page</th>
                <th>Views</th>
              </tr>
            </thead>
            <tbody>
              {(snapshot.topPages || []).map((p) => (
                <tr key={p.path}>
                  <td>
                    <span className="insights-table-title">{p.title || p.path}</span>
                    <span className="insights-table-path">{p.path}</span>
                  </td>
                  <td className="insights-table-count">{p.count.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>
    </div>
  )
}
