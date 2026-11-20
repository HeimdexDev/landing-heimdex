import { Fragment, useEffect } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import FloatingActions from './components/FloatingActions.jsx'
import Home from './pages/Home.jsx'
import Industry from './pages/Industry.jsx'
import Cases from './pages/Cases.jsx'
import { CompanyAbout, CompanyBrand, CompanyCareers, CompanyNews } from './pages/Company.jsx'
import ComingSoon, { COMING_SOON_PATHS } from './pages/ComingSoon.jsx'
import Solution from './pages/Solution.jsx'
import Contact from './pages/Contact.jsx'
import DataLanding from './pages/data/DataLanding.jsx'
import DataDetail from './pages/data/DataDetail.jsx'
import { DataRequest, DataSubmitted } from './pages/data/DataRequest.jsx'
import Policy from './pages/Policy.jsx'
import NotFound from './pages/NotFound.jsx'
import SeoLinks from './i18n/SeoLinks.jsx'
import RouteMeta from './seo/RouteMeta.jsx'
import { isNotFoundPath, redirectFamily } from './seo/notFound.js'
import LanguageSuggestion from './i18n/LanguageSuggestion.jsx'
import {
  LanguageProvider,
  langFromPath,
  localizePath,
} from './i18n/LanguageContext.jsx'
import GaPageViews from './lib/analytics/useGaPageViews.js'
import { SHOW_COMPANY_LINKS } from './data/flags.js'

function ScrollToTop() {
  const { pathname, hash } = useLocation()
  // 'instant' overrides the global `scroll-behavior: smooth`. A smooth scroll here
  // animates for hundreds of ms while the new page's reveal observers are already
  // measuring, which left sections stuck at opacity-0 until a manual refresh.
  // A #hash (e.g. the industry breadcrumb's /#industries) lands on that section,
  // offset by the fixed 80px header.
  useEffect(() => {
    const target = hash && document.getElementById(hash.slice(1))
    const top = target ? target.getBoundingClientRect().top + window.scrollY - 80 : 0
    window.scrollTo({ top, left: 0, behavior: 'instant' })
  }, [pathname, hash])
  return null
}

// Client-side landing for URLs the host already answered 404 (see vercel.json and
// scripts/check-soft-404.mjs): /product*, /contact* and /policy* (also behind a legacy
// /ko prefix) map to that page in the visitor's language; everything else, including
// /ko, /ko/cases and /ko/data, shows NotFound. The 404 status is unchanged, so crawlers see no redirect, only people do.
function NotFoundRedirect() {
  const { pathname } = useLocation()
  const lang = langFromPath(pathname)
  const family = redirectFamily(pathname)
  return family ? <Navigate to={localizePath(family, lang)} replace /> : <NotFound />
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
      <div className="flex min-h-screen flex-col overflow-x-clip bg-warm">
        <ScrollToTop />
        <GaPageViews />
        <SeoLinks />
        <RouteMeta />
        <NavbarArea />
        <main className="flex-1">
          <Routes>
            {/* Korean at the root, English under /en — same components, the
                language comes from the URL (see LanguageContext). */}
            {['', '/en'].map((p) => (
              <Fragment key={p || 'ko'}>
                <Route path={p || '/'} element={<Home />} />
                <Route path={`${p}/product`} element={<Solution />} />
                <Route path={`${p}/product/business/industry/:slug`} element={<Industry />} />
                <Route path={`${p}/cases`} element={<Cases />} />
                {/* heimlog's landing lives on the product page's vlog tab for now */}
                <Route path={`${p}/heimlog`} element={<Navigate to={localizePath('/product?tab=vlog', p ? 'en' : 'ko')} replace />} />
                {COMING_SOON_PATHS.map((cs) => (
                  <Route key={cs} path={`${p}${cs}`} element={<ComingSoon />} />
                ))}
                {/* 회사 pages — off while SHOW_COMPANY_LINKS is false (data/flags.js); the
                    URLs then fall through to the 404 below. */}
                {SHOW_COMPANY_LINKS && (
                  <>
                    <Route path={`${p}/company`} element={<Navigate to={localizePath('/company/about', p ? 'en' : 'ko')} replace />} />
                    <Route path={`${p}/company/about`} element={<CompanyAbout />} />
                    <Route path={`${p}/company/news`} element={<CompanyNews />} />
                    <Route path={`${p}/company/brand`} element={<CompanyBrand />} />
                    <Route path={`${p}/company/careers`} element={<CompanyCareers />} />
                  </>
                )}
                {/* 데이터 마켓플레이스 */}
                <Route path={`${p}/data`} element={<DataLanding />} />
                <Route path={`${p}/data/:slug`} element={<DataDetail />} />
                <Route path={`${p}/request`} element={<DataRequest />} />
                <Route path={`${p}/request/done`} element={<DataSubmitted />} />
                <Route path={`${p}/contact`} element={<Contact />} />
                <Route path={`${p}/policy`} element={<Policy />} />
                {/* Placeholder so the blog nav link doesn't 404 (also opens externally) */}
                <Route path={`${p}/blog`} element={<Home />} />
              </Fragment>
            ))}
            {/* Catch-all, client only: the host has already answered 404 for these URLs */}
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
