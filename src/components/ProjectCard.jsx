import { Link } from 'react-router-dom'
import './ProjectCard.css'

export default function ProjectCard({ project }) {
  return (
    <article className="project-card card">
      <div className="project-card-media" aria-hidden="true">
        <span className="project-card-initial">{project.title.charAt(0)}</span>
      </div>
      <div className="project-card-body">
        <span className="project-card-category">{project.category}</span>
        <h3>
          <Link to={`/projects/${project.slug}`}>{project.title}</Link>
        </h3>
        <p>{project.summary}</p>
        <div className="project-card-tags">
          {project.tags.map((t) => (
            <span key={t} className="tag">
              {t}
            </span>
          ))}
        </div>
        <div className="project-card-links">
          <Link to={`/projects/${project.slug}`} className="project-card-detail-link">
            View details →
          </Link>
        </div>
      </div>
    </article>
  )
}
