import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { projects } from '../data/projects'
import ProjectSlideshow from '../components/ProjectSlideshow.jsx'
import ViewCounter from '../components/ViewCounter.jsx'
import './ProjectDetail.css'

export default function ProjectDetail() {
  const { slug } = useParams()
  const project = projects.find((p) => p.slug === slug)
  const navigate = useNavigate()
  const location = useLocation()

  // location.key is "default" when there's no in-app history to return to
  // (e.g. the page was opened directly or shared) — fall back to the listing
  // page instead of navigating away from the site.
  function goBack() {
    if (location.key !== 'default') {
      navigate(-1)
    } else {
      navigate('/projects')
    }
  }

  if (!project) {
    return (
      <div className="section">
        <div className="container project-detail-notfound">
          <h1>Project not found</h1>
          <p>That project doesn't exist or may have been renamed.</p>
          <Link to="/projects" className="btn btn-primary">
            Back to projects
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="section project-detail">
      <div className="container">
        <div className="project-detail-topbar">
          <button type="button" onClick={goBack} className="project-detail-back">
            ← Back
          </button>
          <ViewCounter path={`/projects/${project.slug}`} />
        </div>

        <div className="project-detail-head">
          <span className="eyebrow">{project.category}</span>
          <h1>{project.title}</h1>
          <p>{project.summary}</p>
          <div className="project-detail-tags">
            {project.tags.map((t) => (
              <span key={t} className="tag">
                {t}
              </span>
            ))}
          </div>
          <div className="project-detail-actions">
            {project.live && (
              <a href={project.live} target="_blank" rel="noreferrer" className="btn btn-primary btn-sm">
                Live demo
              </a>
            )}
            {project.repo && (
              <a href={project.repo} target="_blank" rel="noreferrer" className="btn btn-ghost btn-sm">
                View repo
              </a>
            )}
          </div>
        </div>

        <ProjectSlideshow images={project.images} title={project.title} />

        <div className="project-detail-body">
          <h2>Overview</h2>
          <p>{project.description}</p>

          {project.siteLayout && (
            <>
              <h2>Site layout</h2>
              <pre className="project-detail-sitelayout">{project.siteLayout.trim()}</pre>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
