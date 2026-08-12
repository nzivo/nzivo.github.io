export const categories = ['All', 'Frontend', 'Backend', 'Fullstack', 'Design']

export const projects = [
  {
    slug: 'commerce-storefront',
    title: 'Commerce Storefront',
    category: 'Frontend',
    tags: ['React', 'Vite', 'Tailwind CSS'],
    summary: 'A fast, accessible storefront UI with cart, filtering, and checkout flow.',
    description:
      'A component-driven storefront built for performance: route-level code splitting, optimistic cart updates, and a filterable catalog grid. Focused on Lighthouse scores and keyboard accessibility throughout.',
    image: null,
    live: '#',
    repo: '#',
    featured: true,
  },
  {
    slug: 'orders-api',
    title: 'Orders API',
    category: 'Backend',
    tags: ['Node.js', 'Express', 'PostgreSQL'],
    summary: 'A REST API handling order lifecycle, inventory sync, and webhooks.',
    description:
      'Service-layer API with JWT auth, idempotent webhook handlers for payment providers, and a queue-backed inventory sync job. Includes integration tests and OpenAPI docs.',
    image: null,
    live: '#',
    repo: '#',
    featured: true,
  },
  {
    slug: 'team-dashboard',
    title: 'Team Dashboard',
    category: 'Fullstack',
    tags: ['React', 'Node.js', 'PostgreSQL', 'WebSockets'],
    summary: 'Real-time analytics dashboard with role-based access and live updates.',
    description:
      'End-to-end app pairing a React dashboard with a Node/Express backend. Live metrics stream over WebSockets, with role-based views for admins vs. members and CSV export.',
    image: null,
    live: '#',
    repo: '#',
    featured: true,
  },
  {
    slug: 'brand-identity-kit',
    title: 'Brand Identity Kit',
    category: 'Design',
    tags: ['Illustrator', 'Photoshop', 'Figma'],
    summary: 'Logo system, color palette, and marketing templates for a startup launch.',
    description:
      'Full brand identity system — primary/secondary logo lockups, a documented color and type scale, and a set of social + pitch-deck templates ready to hand off to marketing.',
    image: null,
    live: '#',
    repo: null,
    featured: false,
  },
  {
    slug: 'auth-service',
    title: 'Auth Service',
    category: 'Backend',
    tags: ['Node.js', 'Redis', 'Docker'],
    summary: 'Standalone authentication microservice with session and token support.',
    description:
      'A drop-in auth microservice supporting email/password and OAuth, with Redis-backed sessions, rate limiting, and Docker Compose for local dev. Built to sit behind an API gateway.',
    image: null,
    live: null,
    repo: '#',
    featured: false,
  },
  {
    slug: 'portfolio-cms',
    title: 'Portfolio CMS',
    category: 'Fullstack',
    tags: ['Vue.js', 'Node.js', 'MongoDB'],
    summary: 'A lightweight headless CMS for managing case studies and blog content.',
    description:
      'Admin panel built in Vue for editing structured content, backed by a small Node API and MongoDB. Includes image uploads, draft/publish states, and a public content API.',
    image: null,
    live: '#',
    repo: '#',
    featured: false,
  },
]
