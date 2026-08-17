import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import SearchModal from "./SearchModal.jsx";
import "./Header.css";

const navLinks = [
  { label: "Home", to: "/", end: true },
  { label: "Projects", to: "/projects" },
  { label: "Pricing", to: "/pricing" },
  { label: "Blog", to: "/blog" },
  { label: "Resume", to: "/resume" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [overHero, setOverHero] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // On the home page's mobile hero, stay hidden until the visitor scrolls
  // past the icons/copyright band at the bottom of the full-bleed photo.
  useEffect(() => {
    if (location.pathname !== "/") {
      setOverHero(false);
      return;
    }

    const target = document.querySelector(".hero-portrait-meta");
    if (!target) {
      setOverHero(false);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => setOverHero(entry.isIntersecting),
      { threshold: 0 }
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, [location.pathname]);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const onKeyDown = (e) => {
      if (
        (e.key === "k" || e.key === "/") &&
        (e.metaKey || e.ctrlKey || e.key === "/")
      ) {
        if (e.key === "/" && document.activeElement.tagName === "INPUT") return;
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <header
      className={`site-header ${scrolled ? "is-scrolled" : ""} ${mobileOpen ? "menu-open" : ""} ${overHero ? "is-over-hero" : ""}`}
    >
      <div className="container header-inner">
        <Link className="logo" to="/">
          <svg className="logo-mark" viewBox="0 0 32 32" aria-hidden="true">
            <polygon
              points="31,16 23.5,28.99 8.5,28.99 1,16 8.5,3.01 23.5,3.01"
              fill="var(--accent)"
              transform="rotate(90 16 16)"
            />
            <text x="16" y="16" textAnchor="middle" dy="0.35em" className="logo-mark-text">
              JN
            </text>
          </svg>
          John Nzivo
        </Link>

        <nav className="main-nav">
          <ul>
            {navLinks.map((link) => (
              <li key={link.label}>
                <NavLink to={link.to} end={link.end}>
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="header-actions">
          <button
            type="button"
            className="header-search-btn"
            aria-label="Search"
            onClick={() => setSearchOpen(true)}
          >
            <svg width="17" height="17" viewBox="0 0 17 17" fill="none">
              <circle
                cx="7.5"
                cy="7.5"
                r="5.5"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <path
                d="M11.8 11.8 15 15"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
          <Link to="/contact" className="btn btn-primary btn-sm">
            Let's talk
          </Link>
        </div>

        <div className="mobile-actions">
          <button
            type="button"
            className="header-search-btn"
            aria-label="Search"
            onClick={() => setSearchOpen(true)}
          >
            <svg width="17" height="17" viewBox="0 0 17 17" fill="none">
              <circle
                cx="7.5"
                cy="7.5"
                r="5.5"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <path
                d="M11.8 11.8 15 15"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
          <button
            type="button"
            className="mobile-toggle"
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((o) => !o)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>

      <div className="mobile-nav">
        <ul>
          {navLinks.map((link) => (
            <li key={link.label}>
              <NavLink to={link.to} end={link.end}>
                {link.label}
              </NavLink>
            </li>
          ))}
          <li>
            <NavLink to="/contact">Contact</NavLink>
          </li>
        </ul>
      </div>

      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </header>
  );
}
