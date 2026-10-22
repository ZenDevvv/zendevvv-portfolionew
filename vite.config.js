import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'node:url'

const page = (path) => fileURLToPath(new URL(path, import.meta.url))

// Every project's address (/projects/asb/) shows the one project page, which reads the
// project from the address. netlify.toml does the same in production.
function toProjectPage(req, _res, next) {
  if (/^\/projects\/[\w-]+\/?(\?.*)?$/.test(req.url)) req.url = '/projects/detail/'
  next()
}
const projectPages = {
  name: 'project-pages',
  configureServer: (server) => { server.middlewares.use(toProjectPage) },
  configurePreviewServer: (server) => { server.middlewares.use(toProjectPage) },
}

// https://vitejs.dev/config/
// Three pages: home, all projects (/projects/) and a project (/projects/<slug>/).
export default defineConfig({
  plugins: [react(), projectPages],
  build: {
    rollupOptions: {
      input: {
        main: page('./index.html'),
        projects: page('./projects/index.html'),
        project: page('./projects/detail/index.html'),
      },
    },
  },
})
