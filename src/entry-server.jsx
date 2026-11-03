import { StrictMode } from 'react'
import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom/server'
import App from './App.jsx'

// Build-time prerender entry (scripts/prerender.mjs). Renders one URL to HTML so
// crawlers that don't run JavaScript — most AI search bots — still get the page's
// headings and copy. The client boots with createRoot and simply re-renders.
export function render(url) {
  return renderToString(
    <StrictMode>
      <StaticRouter location={url}>
        <App />
      </StaticRouter>
    </StrictMode>,
  )
}
