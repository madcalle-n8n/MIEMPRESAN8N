/**
 * ============================================================================
 * 🏠 ARCHIVO PRINCIPAL: App.jsx
 * ============================================================================
 * 
 * PROPÓSITO:
 * Este es el componente raíz de la aplicación. Define la estructura general,
 * el sistema de rutas (navegación), y ensambla todos los proveedores y
 * componentes globales.
 * 
 * ============================================================================
 * 📁 ESTRUCTURA DE LA APLICACIÓN
 * ============================================================================
 * 
 * App (Raíz)
 * ├── ErrorBoundary (Captura errores de React)
 * ├── HelmetProvider (SEO y meta tags)
 * ├── ToastProvider (Notificaciones)
 * ├── AuthProvider (Autenticación global)
 * └── Router (Navegación)
 *     └── AppContent
 *         ├── SecurityHead (Headers de seguridad)
 *         ├── Navbar (Menú de navegación)
 *         ├── Routes (Páginas según URL)
 *         ├── Footer (Pie de página)
 *         └── AIChatWidget (Chat flotante Nova)
 * 
 * ============================================================================
 * 🔗 RUTAS DISPONIBLES
 * ============================================================================
 * 
 * PÚBLICAS:
 * /              → Home (Página principal)
 * /servicios     → Lista de servicios
 * /servicios/:id → Detalle de un servicio específico
 * /contacto      → Formulario de contacto
 * /nosotros      → Página "Sobre nosotros"
 * /privacidad    → Política de privacidad
 * /terminos      → Términos de servicio
 * /login         → Iniciar sesión
 * /register      → Crear cuenta
 * /precios       → Planes y precios
 * 
 * PROTEGIDAS (requieren login):
 * /crm           → Dashboard CRM
 * /crm/scraper   → Servicio de Web Scraping
 * 
 * *              → Página 404 (no encontrado)
 * 
 * ============================================================================
 * 📁 UBICACIÓN: src/App.jsx
 * ============================================================================
 */

import { useEffect, Suspense, lazy } from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { HelmetProvider } from 'react-helmet-async';

// ============================================================================
// 🧩 COMPONENTES DE LAYOUT (Siempre visibles en todas las páginas)
// ============================================================================
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import AIChatWidget from './components/AIChatWidget';

// ============================================================================
// 🛡️ PROVEEDORES Y COMPONENTES COMUNES
// ============================================================================
import ErrorBoundary from './components/common/ErrorBoundary';
import SecurityHead from './components/common/SecurityHead';
import ProtectedRoute from './components/common/ProtectedRoute';
import { ToastProvider } from './components/ui/Toast';
import { AuthProvider } from './context/AuthContext';

// ============================================================================
// 📄 PÁGINAS PÚBLICAS (Carga diferida para mejor rendimiento)
// ============================================================================
const Home = lazy(() => import('./pages/Home'));
const ServicesPage = lazy(() => import('./pages/Services'));
const ServiceDetail = lazy(() => import('./pages/ServiceDetail'));
const ContactPage = lazy(() => import('./pages/Contact'));
const AboutPage = lazy(() => import('./pages/About'));
const PrivacyPolicy = lazy(() => import('./pages/Privacy'));
const TermsOfService = lazy(() => import('./pages/Terms'));
const NotFound = lazy(() => import('./pages/NotFound'));

// ============================================================================
// 🔐 PÁGINAS DE AUTENTICACIÓN
// ============================================================================
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const PricingPage = lazy(() => import('./pages/PricingPage'));

// ============================================================================
// 🔒 PÁGINAS PROTEGIDAS (requieren autenticación)
// ============================================================================
const CRMDashboard = lazy(() => import('./pages/CRMDashboard'));
const WebScraperService = lazy(() => import('./pages/WebScraperService'));

// Loading Fallback
const PageLoader = () => (
  <div className="h-screen w-full flex items-center justify-center bg-slate-950">
    <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
  </div>
);

const AppContent = () => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // Determinar si mostrar Navbar/Footer (ocultar en login/register)
  const hideLayout = ['/login', '/register'].includes(location.pathname);

  return (
    <div className="bg-slate-950 min-h-screen text-slate-200 font-sans flex flex-col relative overflow-x-hidden">
      <SecurityHead />
      {!hideLayout && <Navbar />}

      <AnimatePresence mode="wait">
        <Suspense fallback={<PageLoader />}>
          <Routes location={location} key={location.pathname}>
            {/* Rutas Públicas */}
            <Route path="/" element={<Home />} />
            <Route path="/servicios" element={<ServicesPage />} />
            <Route path="/servicios/:id" element={<ServiceDetail />} />
            <Route path="/contacto" element={<ContactPage />} />
            <Route path="/nosotros" element={<AboutPage />} />
            <Route path="/precios" element={<PricingPage />} />

            {/* Rutas de Autenticación */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Rutas Legales */}
            <Route path="/privacidad" element={<PrivacyPolicy />} />
            <Route path="/terminos" element={<TermsOfService />} />

            {/* Rutas Protegidas (requieren login) */}
            <Route path="/crm" element={
              <ProtectedRoute>
                <CRMDashboard />
              </ProtectedRoute>
            } />
            <Route path="/crm/scraper" element={
              <ProtectedRoute>
                <WebScraperService />
              </ProtectedRoute>
            } />

            {/* 404 Fallback */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </AnimatePresence>

      {!hideLayout && <Footer />}
      {!hideLayout && <AIChatWidget />}
    </div>
  );
};

const App = () => (
  <ErrorBoundary>
    <HelmetProvider>
      <ToastProvider>
        <AuthProvider>
          <Router>
            <AppContent />
          </Router>
        </AuthProvider>
      </ToastProvider>
    </HelmetProvider>
  </ErrorBoundary>
);

export default App;