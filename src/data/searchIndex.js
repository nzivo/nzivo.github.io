import { projects } from './projects'
import { pricingTiers } from './pricing'

const pages = [
  { type: 'Page', title: 'Home', text: 'Intro, skills, and featured work.', to: '/' },
  { type: 'Page', title: 'Projects', text: 'Frontend, backend, and fullstack project showcase.', to: '/projects' },
  { type: 'Page', title: 'Pricing', text: 'Service packages and rates.', to: '/pricing' },
  { type: 'Page', title: 'Resume', text: 'Download or view my resume.', to: '/resume' },
  { type: 'Page', title: 'Contact', text: 'Get in touch about a project.', to: '/contact' },
]

const skills = [
  { type: 'Skill', title: 'React', text: 'Frontend development', to: '/projects?category=Frontend' },
  { type: 'Skill', title: 'Vue.js', text: 'Frontend development', to: '/projects?category=Frontend' },
  { type: 'Skill', title: 'Node.js', text: 'Backend development', to: '/projects?category=Backend' },
  { type: 'Skill', title: 'Illustrator', text: 'Graphic design', to: '/projects?category=Design' },
  { type: 'Skill', title: 'Photoshop', text: 'Graphic design', to: '/projects?category=Design' },
]

const projectEntries = projects.map((p) => ({
  type: 'Project',
  title: p.title,
  text: p.summary,
  to: `/projects/${p.slug}`,
}))

const pricingEntries = pricingTiers.map((t) => ({
  type: 'Pricing',
  title: `${t.name} package`,
  text: t.tagline,
  to: '/pricing',
}))

export const searchIndex = [...pages, ...skills, ...projectEntries, ...pricingEntries]

export function searchSite(query, limit = 8) {
  const q = query.trim().toLowerCase()
  if (!q) return []

  return searchIndex
    .filter((item) => item.title.toLowerCase().includes(q) || item.text.toLowerCase().includes(q))
    .slice(0, limit)
}
