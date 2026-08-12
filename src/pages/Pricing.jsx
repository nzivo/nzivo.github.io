import { Link } from 'react-router-dom'
import { pricingTiers } from '../data/pricing'
import PricingCard from '../components/PricingCard.jsx'
import './Pricing.css'

const faqs = [
  {
    q: 'How does pricing work for custom scopes?',
    a: 'The tiers above are starting points. Once I understand your requirements, I send a fixed quote or a scoped estimate before any work begins — no surprise invoices.',
  },
  {
    q: 'Do you work with fixed timelines?',
    a: 'Yes. Each package includes a delivery estimate, and larger engagements get a milestone schedule so you always know what’s next.',
  },
  {
    q: 'What if I only need design or only need development?',
    a: 'That’s fine — packages can be split into design-only or development-only scopes. Mention it when you reach out.',
  },
]

export default function Pricing() {
  return (
    <div className="section pricing-page">
      <div className="container">
        <div className="section-head pricing-head">
          <span className="eyebrow">Pricing</span>
          <h1>Packages for every stage</h1>
          <p>
            Straightforward pricing for common engagements. Every project starts with a short
            scoping call so the quote fits what you actually need.
          </p>
        </div>

        <div className="pricing-grid">
          {pricingTiers.map((tier) => (
            <PricingCard key={tier.name} tier={tier} />
          ))}
        </div>

        <div className="pricing-faq">
          <h2>Common questions</h2>
          <div className="pricing-faq-list">
            {faqs.map((f) => (
              <div key={f.q} className="pricing-faq-item">
                <h3>{f.q}</h3>
                <p>{f.a}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="pricing-cta">
          <h2>Not sure which package fits?</h2>
          <p>Send a short brief and I'll recommend the right scope.</p>
          <Link to="/contact" className="btn btn-primary">
            Talk about your project
          </Link>
        </div>
      </div>
    </div>
  )
}
