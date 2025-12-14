
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AIChatWidget from './components/AIChatWidget';

// Pages
import Home from './pages/Home';
import ServicesPage from './pages/Services';
import ServiceDetail from './pages/ServiceDetail';
import ContactPage from './pages/Contact';
import AboutPage from './pages/About';

const AppContent = () => {
  const location = useLocation();

  return (
    <div className="bg-slate-950 min-h-screen text-slate-200 font-sans flex flex-col relative overflow-x-hidden">
      <Navbar />

      {/* Sistema de Rutas Animadas */}
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />
          <Route path="/servicios" element={<ServicesPage />} />
          <Route path="/servicios/:id" element={<ServiceDetail />} />
          <Route path="/contacto" element={<ContactPage />} />
          <Route path="/nosotros" element={<AboutPage />} />
        </Routes>
      </AnimatePresence>

      <Footer />

      {/* EL CHATBOT FLOTANTE ESTÁ AQUÍ */}
      <AIChatWidget />
    </div>
  );
};

const App = () => (
  <Router>
    <AppContent />
  </Router>
);

export default App;