import { StrictMode } from 'react'
import { flushSync } from 'react-dom'
import { createRoot } from 'react-dom/client'
import Layout from './Layout'
import AllProjects from './component/AllProjects'
import './index.css'

// Drawn before the page finishes loading, so the browser can still jump to a #section in
// the address and restore the scroll position when you come back.
const root = createRoot(document.getElementById('root'))
flushSync(() => root.render(
  <StrictMode>
    <Layout page="projects">
      <AllProjects />
    </Layout>
  </StrictMode>,
))
