import { Link } from 'react-router-dom'
import { projects } from '../data/projects'
import { pricingTiers } from '../data/pricing'
import { blogPosts } from '../data/blog'
import ProjectCard from '../components/ProjectCard.jsx'
import PricingCard from '../components/PricingCard.jsx'
import BlogCard from '../components/BlogCard.jsx'
import Particles from '../components/Particles.jsx'
import './Home.css'

const skills = [
  { name: 'React', level: 85 },
  { name: 'Vue.js', level: 80 },
  { name: 'Node.js', level: 80 },
  { name: 'Illustrator', level: 90 },
  { name: 'Photoshop', level: 90 },
  { name: 'After Effects', level: 80 },
]

const heroIcons = [
  { icon: 'html5', label: 'HTML5' },
  { icon: 'css3', label: 'CSS3' },
  { icon: 'javascript', label: 'JavaScript' },
  { icon: 'react', label: 'React' },
  { icon: 'vuejs', label: 'Vue.js' },
  { icon: 'python', label: 'Python' },
  { icon: 'java', label: 'Java' },
  { icon: 'sql', label: 'SQL' },
  { icon: 'postgresql', label: 'PostgreSQL' },
  { icon: 'docker', label: 'Docker' },
  { icon: 'kubernetes', label: 'Kubernetes' },
  { icon: 'photoshop', label: 'Photoshop' },
  { icon: 'illustrator', label: 'Illustrator' },
  { icon: 'xd', label: 'XD' },
]

const currentYear = new Date().getFullYear()
const experienceYears = currentYear - 2016

const latestProjects = projects.slice(0, 3)
const recentPosts = blogPosts.slice(0, 3)

export default function Home() {
  return (
    <>
      <section className="hero">
        <Particles />
        <div className="container hero-inner">
          <div className="hero-copy">
            <span className="eyebrow">Designer &amp; Developer</span>
            <h1>
              I build interfaces and the backends that power them.
            </h1>
            <p className="hero-lede">
              John Nzivo — frontend, backend, and full-stack work, plus the design that ties it
              together. Available for project-based work and ongoing engagements.
            </p>
            <div className="hero-actions">
              <Link to="/projects" className="btn btn-primary">
                View projects
              </Link>
              <Link to="/contact" className="btn btn-ghost">
                Get in touch
              </Link>
            </div>
          </div>

          <div className="hero-portrait">
            <div className="hero-portrait-frame">
              <img src="/images/profile.jpg" alt="Portrait of John Nzivo" />
            </div>
            <div className="hero-portrait-meta">
              <p className="hero-name">John Nzivo</p>
              <p className="hero-title">Consultant</p>
              <p className="hero-experience">
                <strong>{experienceYears}+ yrs</strong> experience in
              </p>
              <div className="hero-icons">
                {heroIcons.map((item) => (
                  <span
                    key={item.icon}
                    className="hero-icon"
                    role="img"
                    aria-label={item.label}
                    title={item.label}
                    style={{
                      WebkitMaskImage: `url(/icons/${item.icon}.svg)`,
                      maskImage: `url(/icons/${item.icon}.svg)`,
                    }}
                  />
                ))}
              </div>
              <p className="hero-copyright">© {currentYear} John Nzivo</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section skills-section">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Toolkit</span>
            <h2>Design and development, under one roof</h2>
          </div>
          <div className="skills-grid">
            {skills.map((s) => (
              <div key={s.name} className="skill-item">
                <div className="skill-item-head">
                  <span>{s.name}</span>
                  <span>{s.level}%</span>
                </div>
                <div className="skill-bar">
                  <div className="skill-bar-fill" style={{ width: `${s.level}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section featured-section">
        <div className="container">
          <div className="section-head featured-head">
            <div>
              <span className="eyebrow">Selected work</span>
              <h2>Frontend, backend, and full-stack projects</h2>
            </div>
            <Link to="/projects" className="btn btn-ghost btn-sm">
              All projects
            </Link>
          </div>
          <div className="project-grid">
            {latestProjects.map((p) => (
              <ProjectCard key={p.slug} project={p} />
            ))}
          </div>
        </div>
      </section>

      <section className="section blog-teaser">
        <div className="container">
          <div className="section-head featured-head">
            <div>
              <span className="eyebrow">Writing</span>
              <h2>Case studies and field research</h2>
            </div>
            <Link to="/blog" className="btn btn-ghost btn-sm">
              All posts
            </Link>
          </div>
          <div className="blog-grid">
            {recentPosts.map((post) => (
              <BlogCard key={post.slug} post={post} />
            ))}
          </div>
        </div>
      </section>

      <section className="section pricing-teaser">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Pricing</span>
            <h2>Packages for every stage</h2>
          </div>
          <div className="pricing-grid">
            {pricingTiers.map((tier) => (
              <PricingCard key={tier.name} tier={tier} />
            ))}
          </div>
        </div>
      </section>

      <section className="section final-cta">
        <div className="container final-cta-inner">
          <h2>Have a project in mind?</h2>
          <p>Tell me what you're building — I'll get back to you within a day or two.</p>
          <Link to="/contact" className="btn btn-primary">
            Start a conversation
          </Link>
        </div>
      </section>
    </>
  )
}
