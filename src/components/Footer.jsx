import { Link } from 'react-router-dom'
import './Footer.css'

const socials = [
  { label: 'Twitter', href: 'https://twitter.com/johnnnzivo' },
  { label: 'Github', href: 'https://github.com/nzivo' },
  { label: 'CodePen', href: 'https://codepen.io/johnnnzivo' },
  { label: 'Behance', href: 'https://www.behance.net/johnnnzivo' },
]

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <div className="footer-brand">
          <span className="footer-name">John Nzivo</span>
          <p>Designer &amp; developer building frontend, backend, and full-stack products.</p>
        </div>

        <nav className="footer-links">
          <Link to="/projects">Projects</Link>
          <Link to="/pricing">Pricing</Link>
          <Link to="/resume">Resume</Link>
          <Link to="/contact">Contact</Link>
        </nav>

        <div className="footer-socials">
          {socials.map((s) => (
            <a key={s.label} href={s.href} target="_blank" rel="noreferrer">
              {s.label}
            </a>
          ))}
        </div>
      </div>
      <div className="container footer-bottom">
        <p>© {new Date().getFullYear()} John Nzivo. All rights reserved.</p>
      </div>
    </footer>
  )
}
