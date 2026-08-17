import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { execFileSync } from 'node:child_process'

const root = path.dirname(fileURLToPath(import.meta.url))
const generatorScript = path.join(root, 'scripts', 'generate-blog-index.mjs')

function regenerateBlogIndex() {
  try {
    execFileSync('node', [generatorScript], { stdio: 'inherit' })
  } catch (err) {
    console.error('[blog-index] regeneration failed:', err.message)
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

export default defineConfig({
  plugins: [react(), blogIndexPlugin()],
  base: '/',
})
