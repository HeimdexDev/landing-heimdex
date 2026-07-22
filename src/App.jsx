import { Fragment, useEffect } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import FloatingActions from './components/FloatingActions.jsx'
import Home from './pages/Home.jsx'
import Solution from './pages/Solution.jsx'
import Contact from './pages/Contact.jsx'
import Policy from './pages/Policy.jsx'
import NotFound from './pages/NotFound.jsx'
import SeoLinks from './i18n/SeoLinks.jsx'
import LanguageSuggestion from './i18n/LanguageSuggestion.jsx'
import {
  LanguageProvider,
  langFromPath,
  localizePath,
  stripLangPrefix,
} from './i18n/LanguageContext.jsx'
import GaPageViews from './lib/analytics/useGaPageViews.js'

function ScrollToTop() {
  const { pathname } = useLocation()
  // 'instant' overrides the global `scroll-behavior: smooth`. A smooth scroll here
  // animates for hundreds of ms while the new page's reveal observers are already
  // measuring, which left sections stuck at opacity-0 until a manual refresh.
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [pathname])
  return null
}

// Any unknown URL (old /ko/* links, /pricing, /company still in Google) maps to
// the closest current page — staying in the language the visitor is browsing.
function NotFoundRedirect() {
  const { pathname } = useLocation()
  const lang = langFromPath(pathname)
  // Strip the /en prefix, then any leftover legacy /ko so old links still land.
  const path = stripLangPrefix(pathname).replace(/^\/ko(?=\/|$)/, '') || '/'
  const go = (to) => <Navigate to={localizePath(to, lang)} replace />
  if (path.startsWith('/contact')) return go('/contact')
  if (path.startsWith('/product')) return go('/product')
  if (path.startsWith('/policy')) return go('/policy')
  return <NotFound />
}

// True for any path that renders the full-screen 404 page (unknown route).
function isNotFoundPath(pathname) {
  const p = stripLangPrefix(pathname).replace(/^\/ko(?=\/|$)/, '') || '/'
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
        <GaPageViews />
        <SeoLinks />
        <NavbarArea />
        <main className="flex-1">
          <Routes>
            {/* Korean at the root, English under /en — same components, the
                language comes from the URL (see LanguageContext). */}
            {['', '/en'].map((p) => (
              <Fragment key={p || 'ko'}>
                <Route path={p || '/'} element={<Home />} />
                <Route path={`${p}/product`} element={<Solution />} />
                <Route path={`${p}/contact`} element={<Contact />} />
                <Route path={`${p}/policy`} element={<Policy />} />
                {/* Placeholder so the blog nav link doesn't 404 (also opens externally) */}
                <Route path={`${p}/blog`} element={<Home />} />
              </Fragment>
            ))}
            {/* Catch-all: redirect old/unknown URLs to the closest current page */}
            <Route path="*" element={<NotFoundRedirect />} />
          </Routes>
        </main>
        <FloatingActions />
        <LanguageSuggestion />
        <FooterArea />
      </div>
    </LanguageProvider>
  )
}
