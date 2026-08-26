import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { categories, projects } from '../data/projects'
import ProjectCard from '../components/ProjectCard.jsx'
import './Projects.css'

const PER_PAGE = 10

function paramsFor(cat, page) {
  const obj = {}
  if (cat !== 'All') obj.category = cat
  if (page !== 1) obj.page = String(page)
  return obj
}

export default function Projects() {
  const [searchParams, setSearchParams] = useSearchParams()
  const categoryParam = searchParams.get('category')
  const active = categories.includes(categoryParam) ? categoryParam : 'All'
  const [tag, setTag] = useState(null)

  const allTags = useMemo(() => {
    const set = new Set()
    projects.forEach((p) => p.tags.forEach((t) => set.add(t)))
    return Array.from(set).sort()
  }, [])

  const filtered = projects.filter((p) => {
    const matchesCategory = active === 'All' || p.category === active
    const matchesTag = !tag || p.tags.includes(tag)
    return matchesCategory && matchesTag
  })

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE))
  const requestedPage = parseInt(searchParams.get('page') || '1', 10) || 1
  const page = Math.min(Math.max(1, requestedPage), totalPages)

  const pageProjects = useMemo(() => {
    const start = (page - 1) * PER_PAGE
    return filtered.slice(start, start + PER_PAGE)
  }, [filtered, page])

  // Clamp out-of-range ?page values (e.g. ?page=99) back into the URL.
  useEffect(() => {
    if (requestedPage !== page) {
      setSearchParams(paramsFor(active, page))
    }
  }, [requestedPage, page, active, setSearchParams])

  function setCategory(cat) {
    setTag(null)
    setSearchParams(paramsFor(cat, 1))
  }

  function selectTag(t) {
    setTag(t === tag ? null : t)
    setSearchParams(paramsFor(active, 1))
  }

  function goToPage(p) {
    setSearchParams(paramsFor(active, p))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="section projects-page">
      <div className="container">
        <div className="section-head">
          <span className="eyebrow">Work</span>
          <h1>Projects</h1>
          <p>Frontend interfaces, backend services, and full-stack products — filter by category or tech.</p>
        </div>

        <div className="projects-filters">
          <div className="filter-group">
            {categories.map((c) => (
              <button
                key={c}
                type="button"
                className={`filter-pill ${active === c ? 'is-active' : ''}`}
                onClick={() => setCategory(c)}
              >
                {c}
              </button>
            ))}
          </div>

          <div className="filter-group tag-filter-group">
            <button
              type="button"
              className={`filter-pill filter-pill-tag ${!tag ? 'is-active' : ''}`}
              onClick={() => selectTag(null)}
            >
              All tech
            </button>
            {allTags.map((t) => (
              <button
                key={t}
                type="button"
                className={`filter-pill filter-pill-tag ${tag === t ? 'is-active' : ''}`}
                onClick={() => selectTag(t)}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <p className="projects-empty">No projects match those filters yet.</p>
        ) : (
          <div className="project-grid">
            {pageProjects.map((p) => (
              <ProjectCard key={p.slug} project={p} />
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <nav className="projects-pagination" aria-label="Projects pagination">
            <button
              type="button"
              className="projects-pagination-arrow"
              disabled={page === 1}
              onClick={() => goToPage(page - 1)}
            >
              ← Prev
            </button>

            <div className="projects-pagination-pages">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  type="button"
                  className={`projects-pagination-page ${p === page ? 'is-active' : ''}`}
                  aria-current={p === page ? 'page' : undefined}
                  onClick={() => goToPage(p)}
                >
                  {p}
                </button>
              ))}
            </div>

            <button
              type="button"
              className="projects-pagination-arrow"
              disabled={page === totalPages}
              onClick={() => goToPage(page + 1)}
            >
              Next →
            </button>
          </nav>
        )}
      </div>
    </div>
  )
}
