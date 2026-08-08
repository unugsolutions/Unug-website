// Entry point of the application: mounts the root React component.
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Mount <App /> into the #root element; StrictMode enables extra dev-time checks.
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
