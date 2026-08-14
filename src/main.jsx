import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ErrorBoundary } from './components/common/ErrorBoundary.jsx'
import { initMonitoring } from './monitoring.js'

// Initialisé avant le rendu : une erreur survenant pendant le montage initial
// doit déjà pouvoir être capturée par la sonde.
initMonitoring()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)
