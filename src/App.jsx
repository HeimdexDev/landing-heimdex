import { useEffect } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import FloatingActions from './components/FloatingActions.jsx'
import Home from './pages/Home.jsx'
import Solution from './pages/Solution.jsx'
import Contact from './pages/Contact.jsx'
import Policy from './pages/Policy.jsx'
import NotFound from './pages/NotFound.jsx'
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
  // Legacy deep links (old locale-prefixed / sub-paths) → nearest real page;
  // anything else that truly doesn't exist → the 404 page
  if (path.startsWith('/contact')) return <Navigate to="/contact" replace />
  if (path.startsWith('/product')) return <Navigate to="/product" replace />
  if (path.startsWith('/policy')) return <Navigate to="/policy" replace />
  return <NotFound />
}

// True for any path that renders the full-screen 404 page (unknown route).
function isNotFoundPath(pathname) {
  const p = pathname.replace(/^\/(ko|en)(?=\/|$)/, '') || '/'
  return (
    p !== '/' &&
    p !== '/blog' &&
    !p.startsWith('/product') &&
    !p.startsWith('/contact') &&
    !p.startsWith('/policy')
  )
}

// Header and footer are hidden on the 404 page so the space fills the viewport.
function NavbarArea() {
  const { pathname } = useLocation()
  return isNotFoundPath(pathname) ? null : <Navbar />
}
function FooterArea() {
  const { pathname } = useLocation()
  return isNotFoundPath(pathname) ? null : <Footer />
}

export default function App() {
  return (
    <LanguageProvider>
      <div className="flex min-h-screen flex-col overflow-x-clip bg-grayscale-10">
        <ScrollToTop />
        <NavbarArea />
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
        <FooterArea />
      </div>
    </LanguageProvider>
  )
}
