import { useEffect } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import FloatingActions from './components/FloatingActions.jsx'
import Home from './pages/Home.jsx'
import Solution from './pages/Solution.jsx'
import Contact from './pages/Contact.jsx'
import Policy from './pages/Policy.jsx'
import { LanguageProvider } from './i18n/LanguageContext.jsx'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => window.scrollTo(0, 0), [pathname])
  return null
}

// Any unknown URL (e.g. old /ko/* , /en/* , /pricing, /company links still in
// Google) maps to the closest current page instead of rendering blank.
function NotFoundRedirect() {
  const { pathname } = useLocation()
  const path = pathname.replace(/^\/(ko|en)(?=\/|$)/, '') || '/'
  let dest = '/'
  if (path.startsWith('/contact')) dest = '/contact'
  else if (path.startsWith('/product')) dest = '/product'
  else if (path.startsWith('/policy')) dest = '/policy'
  return <Navigate to={dest} replace />
}

export default function App() {
  return (
    <LanguageProvider>
      <div className="flex min-h-screen flex-col overflow-x-clip bg-grayscale-10">
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
            {/* Catch-all: redirect old/unknown URLs to the closest current page */}
            <Route path="*" element={<NotFoundRedirect />} />
          </Routes>
        </main>
        <FloatingActions />
        <Footer />
      </div>
    </LanguageProvider>
  )
}
