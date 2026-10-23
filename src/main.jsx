import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'

const container = document.getElementById('root')
const app = (
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
)

// Prerendered pages arrive with markup to adopt; `vite dev` and the unrendered
// shell (dist/404.html) start empty and render from scratch.
if (container.hasChildNodes()) hydrateRoot(container, app)
else createRoot(container).render(app)
