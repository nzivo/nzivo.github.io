import { Link, useParams } from 'react-router-dom'
import { projects } from '../data/projects'
import ProjectSlideshow from '../components/ProjectSlideshow.jsx'
import './ProjectDetail.css'

export default function ProjectDetail() {
  const { slug } = useParams()
  const project = projects.find((p) => p.slug === slug)

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
        <Link to="/projects" className="project-detail-back">
          ← All projects
        </Link>

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
