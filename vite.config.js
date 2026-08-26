import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { execFileSync } from 'node:child_process'

const root = path.dirname(fileURLToPath(import.meta.url))
const blogGeneratorScript = path.join(root, 'scripts', 'generate-blog-index.mjs')
const projectGeneratorScript = path.join(root, 'scripts', 'generate-project-index.mjs')

function regenerateBlogIndex() {
  try {
    execFileSync('node', [blogGeneratorScript], { stdio: 'inherit' })
  } catch (err) {
    console.error('[blog-index] regeneration failed:', err.message)
  }
}

function regenerateProjectIndex() {
  try {
    execFileSync('node', [projectGeneratorScript], { stdio: 'inherit' })
  } catch (err) {
    console.error('[project-index] regeneration failed:', err.message)
  }
}

// Watches public/blog/*.html while `npm run dev` is running so dropping a
// new export in there shows up immediately, without restarting the server.
function blogIndexPlugin() {
  return {
    name: 'blog-index',
    configureServer(server) {
      const blogDir = path.join(root, 'public', 'blog')
      server.watcher.add(blogDir)
      server.watcher.on('all', (event, changedPath) => {
        if (!changedPath.endsWith('.html') || !changedPath.includes(blogDir)) return
        if (!['add', 'unlink', 'change'].includes(event)) return
        regenerateBlogIndex()
        server.ws.send({ type: 'full-reload' })
      })
    },
  }
}

// Watches public/projects/*.txt and public/images/projects/** while
// `npm run dev` is running so dropping a new project file or screenshot in
// there shows up immediately, without restarting the server.
function projectIndexPlugin() {
  return {
    name: 'project-index',
    configureServer(server) {
      const projectsDir = path.join(root, 'public', 'projects')
      const imagesDir = path.join(root, 'public', 'images', 'projects')
      server.watcher.add(projectsDir)
      server.watcher.add(imagesDir)
      server.watcher.on('all', (event, changedPath) => {
        if (!['add', 'unlink', 'change'].includes(event)) return
        const inProjects = changedPath.includes(projectsDir) && changedPath.endsWith('.txt')
        const inImages = changedPath.includes(imagesDir)
        if (!inProjects && !inImages) return
        regenerateProjectIndex()
        server.ws.send({ type: 'full-reload' })
      })
    },
  }
}

export default defineConfig({
  plugins: [react(), blogIndexPlugin(), projectIndexPlugin()],
  base: '/',
})
