/**
 * ============================================================================
 * 🚀 PUNTO DE ENTRADA: main.jsx
 * ============================================================================
 * 
 * PROPÓSITO:
 * Este es el primer archivo que se ejecuta cuando la aplicación inicia.
 * Monta el componente App en el elemento #root del HTML.
 * 
 * React.StrictMode: Activa verificaciones adicionales en desarrollo
 * para detectar problemas potenciales (no afecta producción).
 * 
 * ============================================================================
 * 📁 UBICACIÓN: src/main.jsx
 * ============================================================================
 */

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Monta la aplicación React en el elemento con id="root" del index.html
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
