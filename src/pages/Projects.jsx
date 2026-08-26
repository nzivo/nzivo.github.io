import { useEffect, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { categories, projects } from '../data/projects'
import ProjectCard from '../components/ProjectCard.jsx'
import './Projects.css'

const PER_PAGE = 9

function paramsFor(cat, page, tag) {
  const obj = {}
  if (cat !== 'All') obj.category = cat
  if (tag) obj.tag = tag
  if (page !== 1) obj.page = String(page)
  return obj
}

export default function Projects() {
  const [searchParams, setSearchParams] = useSearchParams()
  const categoryParam = searchParams.get('category')
  const active = categories.includes(categoryParam) ? categoryParam : 'All'
  const tag = searchParams.get('tag')

  const categoryFiltered = useMemo(
    () => projects.filter((p) => active === 'All' || p.category === active),
    [active]
  )

  const allTags = useMemo(() => {
    const counts = new Map()
    categoryFiltered.forEach((p) => {
      p.tags.forEach((t) => counts.set(t, (counts.get(t) || 0) + 1))
    })
    return Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
      .map(([t, count]) => ({ tag: t, count }))
  }, [categoryFiltered])

  const filtered = categoryFiltered.filter((p) => !tag || p.tags.includes(tag))

  const pageTitle = tag ? `${tag} ${filtered.length === 1 ? 'project' : 'projects'}` : 'Projects'

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
      setSearchParams(paramsFor(active, page, tag))
    }
  }, [requestedPage, page, active, tag, setSearchParams])

  function setCategory(cat) {
    setSearchParams(paramsFor(cat, 1, null))
  }

  function selectTag(t) {
    setSearchParams(paramsFor(active, 1, t === tag ? null : t))
  }

  function goToPage(p) {
    setSearchParams(paramsFor(active, p, tag))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="section projects-page">
      <div className="container">
        <div className="section-head">
          <span className="eyebrow">Work</span>
          <h1>{pageTitle}</h1>
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
              All tech <span className="filter-pill-count">{categoryFiltered.length}</span>
            </button>
            {allTags.map(({ tag: t, count }) => (
              <button
                key={t}
                type="button"
                className={`filter-pill filter-pill-tag ${tag === t ? 'is-active' : ''}`}
                onClick={() => selectTag(t)}
              >
                {t} <span className="filter-pill-count">{count}</span>
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
