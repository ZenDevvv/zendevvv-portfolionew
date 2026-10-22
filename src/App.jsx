import Layout from './Layout'
import Hero from './component/Hero'
import Industries from './component/Industries'
import About from './component/About'
import Skills from './component/Skills'
import Experience from './component/Experience'
import Projects from './component/Projects'
import Contact from './component/Contact'
import Footer from './component/Footer'

export default function App() {
  return (
    <Layout page="home">
      <Hero />
      <Industries />
      <Experience />
      <Projects />
      <About />
      <Skills />
      <Contact />
      <Footer />
    </Layout>
  )
}
