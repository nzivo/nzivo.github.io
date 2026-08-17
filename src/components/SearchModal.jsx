import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useNavigate } from 'react-router-dom'
import { searchSite } from '../data/searchIndex'
import './SearchModal.css'

const popular = ['Projects', 'Pricing', 'React', 'Resume', 'Contact']

export default function SearchModal({ open, onClose }) {
  const [query, setQuery] = useState('')
  const inputRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (!open) return

    setQuery('')
    const focusTimer = setTimeout(() => inputRef.current?.focus(), 60)

    const onKeyDown = (e) => {
      if (e.key === 'Escape') onClose()
    }

    document.addEventListener('keydown', onKeyDown)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      clearTimeout(focusTimer)
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = prevOverflow
    }
  }, [open, onClose])

  if (!open) return null

  const results = searchSite(query)

  const goTo = (item) => {
    onClose()
    if (item.external) {
      window.location.href = item.to
    } else {
      navigate(item.to)
    }
  }

  return createPortal(
    <div className="search-modal" role="dialog" aria-modal="true" aria-label="Site search">
      <button type="button" className="search-modal-close" aria-label="Close search" onClick={onClose}>
        ✕
      </button>

      <div className="search-modal-inner">
        <div className="search-modal-input-row">
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
            <circle cx="10" cy="10" r="6.5" stroke="currentColor" strokeWidth="1.6" />
            <path d="M15 15 19.5 19.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search projects, pricing, pages..."
            aria-label="Search"
          />
        </div>

        {query.trim() === '' ? (
          <div>
            <span className="search-modal-label">Popular</span>
            <div className="search-modal-pills">
              {popular.map((p) => (
                <button key={p} type="button" onClick={() => setQuery(p)}>
                  {p}
                </button>
              ))}
            </div>
          </div>
        ) : results.length === 0 ? (
          <p className="search-modal-empty">No results for "{query}".</p>
        ) : (
          <div className="search-modal-results">
            {results.map((r) => (
              <button key={`${r.type}-${r.title}`} type="button" className="search-modal-result" onClick={() => goTo(r)}>
                <span className="search-modal-result-tag">{r.type}</span>
                <span className="search-modal-result-body">
                  <strong>{r.title}</strong>
                  <span>{r.text}</span>
                </span>
              </button>
            ))}
          </div>
        )}

        <div className="search-modal-hint">
          <span>
            <kbd>Esc</kbd> to close
          </span>
        </div>
      </div>
    </div>,
    document.body
  )
}
