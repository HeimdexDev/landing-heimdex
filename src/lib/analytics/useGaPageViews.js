import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { initGa, trackPageView } from './ga.js'

// Initializes GA4 once, then emits a page_view on every client-side route change.
// Render <GaPageViews /> once inside the Router; it renders nothing.
export default function GaPageViews() {
  const { pathname, search } = useLocation()

  useEffect(() => {
    initGa()
  }, [])

  useEffect(() => {
    trackPageView(pathname + search)
  }, [pathname, search])

  return null
}
