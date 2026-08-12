import { Link } from 'react-router-dom'
import './PricingCard.css'

export default function PricingCard({ tier }) {
  return (
    <div className={`pricing-card card ${tier.highlight ? 'is-highlight' : ''}`}>
      {tier.highlight && <span className="pricing-card-badge">Most popular</span>}
      <h3>{tier.name}</h3>
      <p className="pricing-card-tagline">{tier.tagline}</p>
      <div className="pricing-card-price">
        <span className="pricing-card-amount">{tier.price}</span>
        <span className="pricing-card-cadence">{tier.cadence}</span>
      </div>
      <ul className="pricing-card-features">
        {tier.features.map((f) => (
          <li key={f}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M3 8.5 6.2 11.5 13 4.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {f}
          </li>
        ))}
      </ul>
      <Link to="/contact" className={`btn btn-sm ${tier.highlight ? 'btn-primary' : 'btn-ghost'} pricing-card-cta`}>
        Get started
      </Link>
    </div>
  )
}
