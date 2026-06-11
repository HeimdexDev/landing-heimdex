import { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import FloatingActions from './components/FloatingActions.jsx'
import Home from './pages/Home.jsx'
import Solution from './pages/Solution.jsx'
import Contact from './pages/Contact.jsx'
import Policy from './pages/Policy.jsx'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => window.scrollTo(0, 0), [pathname])
  return null
}

export default function App() {
  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden bg-grayscale-10">
      <ScrollToTop />
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/product" element={<Solution />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/policy" element={<Policy />} />
          {/* Placeholder so the blog nav link doesn't 404 (also opens externally) */}
          <Route path="/blog" element={<Home />} />
        </Routes>
      </main>
      <FloatingActions />
      <Footer />
    </div>
  )
}
