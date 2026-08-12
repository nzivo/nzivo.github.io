import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { categories, projects } from '../data/projects'
import ProjectCard from '../components/ProjectCard.jsx'
import './Projects.css'

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

  function setCategory(cat) {
    setTag(null)
    if (cat === 'All') {
      setSearchParams({})
    } else {
      setSearchParams({ category: cat })
    }
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
              onClick={() => setTag(null)}
            >
              All tech
            </button>
            {allTags.map((t) => (
              <button
                key={t}
                type="button"
                className={`filter-pill filter-pill-tag ${tag === t ? 'is-active' : ''}`}
                onClick={() => setTag(t === tag ? null : t)}
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
            {filtered.map((p) => (
              <ProjectCard key={p.slug} project={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
