import React, { useState, useEffect } from 'react';
// IMPORTANTE: Cambiamos BrowserRouter por HashRouter para máxima compatibilidad
// Si te da error aquí, recuerda ejecutar: npm install react-router-dom
import { HashRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { 
  Bot, Cpu, Code2, Workflow, ArrowRight, Menu, X, 
  Zap, MessageSquare, BarChart3, Globe, CheckCircle2, Send, Layout
} from 'lucide-react';

// --- COMPONENTE NAVBAR (BARRA DE NAVEGACIÓN) ---
const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation(); // Hook para saber en qué URL estamos

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Función para resaltar el enlace activo
  const isActive = (path) => location.pathname === path ? 'text-white font-bold' : 'text-slate-300';

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${
      isScrolled ? 'bg-slate-900/90 backdrop-blur-md border-b border-white/10 py-4' : 'bg-transparent py-6'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        {/* Logo que lleva al Inicio */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 bg-gradient-to-tr from-blue-500 to-purple-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
            <Cpu className="text-white w-6 h-6" />
          </div>
          <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
          N8NIADUSTRIA
          </span>
        </Link>

        {/* Menú de Escritorio (Usamos Link en vez de <a> para no recargar) */}
        <div className="hidden md:flex items-center gap-8">
          <Link to="/" className={`${isActive('/')} hover:text-white transition-colors text-sm font-medium`}>Inicio</Link>
          <Link to="/servicios" className={`${isActive('/servicios')} hover:text-white transition-colors text-sm font-medium`}>Servicios</Link>
          <Link to="/nosotros" className={`${isActive('/nosotros')} hover:text-white transition-colors text-sm font-medium`}>Nosotros</Link>
          <Link 
            to="/contacto"
            className="px-6 py-2.5 bg-white text-slate-900 rounded-full font-bold hover:bg-blue-50 transition-all transform hover:-translate-y-1 shadow-lg shadow-blue-500/20"
          >
            Cotizar Proyecto
          </Link>
        </div>

        {/* Botón Menú Móvil */}
        <button className="md:hidden text-white" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Menú Desplegable Móvil */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-slate-900 border-b border-white/10 p-4 flex flex-col gap-4">
          <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="text-slate-300 py-2">Inicio</Link>
          <Link to="/servicios" onClick={() => setIsMobileMenuOpen(false)} className="text-slate-300 py-2">Servicios</Link>
          <Link to="/nosotros" onClick={() => setIsMobileMenuOpen(false)} className="text-slate-300 py-2">Nosotros</Link>
          <Link to="/contacto" onClick={() => setIsMobileMenuOpen(false)} className="text-slate-300 py-2">Contacto</Link>
        </div>
      )}
    </nav>
  );
};

// --- COMPONENTE FOOTER (PIE DE PÁGINA) ---
const Footer = () => (
  <footer className="bg-slate-950 border-t border-white/5 py-12 mt-auto">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
      <div className="flex items-center gap-2">
        <Cpu className="text-blue-500 w-6 h-6" />
        <span className="text-xl font-bold text-white">N8NIADUSTRIA</span>
      </div>
      <div className="text-slate-500 text-sm">© 2025 N8NIADUSTRIA Solutions. Powered by React & n8n.</div>
    </div>
  </footer>
);

// --- PÁGINA 1: INICIO (HOME) ---
const Home = () => (
  <div className="pt-20">
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Fondos decorativos */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-blue-600/20 rounded-full blur-[120px] -z-10" />
      
      <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-sm">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
          <span className="text-slate-300 text-sm font-medium">Innovación Empresarial 2025</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-8 leading-tight">
          Transformamos Empresas con <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
            Inteligencia Artificial
          </span>
        </h1>

        <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          Desarrollo web avanzado, automatizaciones con n8n y agentes de IA diseñados para escalar operaciones.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-10">
          <Link to="/servicios" className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full text-white font-bold hover:shadow-lg transition-all flex items-center gap-2">
            Ver Servicios <ArrowRight size={20} />
          </Link>
          <Link to="/contacto" className="px-8 py-4 bg-white/5 border border-white/10 rounded-full text-white hover:bg-white/10 transition-all">
            Hablemos
          </Link>
        </div>
      </div>
    </section>
  </div>
);

// --- PÁGINA 2: SERVICIOS ---
const ServicesPage = () => (
  <div className="pt-32 pb-20 min-h-screen">
    <div className="max-w-7xl mx-auto px-4">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">Nuestras Soluciones</h1>
        <p className="text-slate-400 max-w-2xl mx-auto">Stack tecnológico moderno para empresas que quieren liderar.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Tarjeta 1 */}
        <div className="p-8 rounded-3xl bg-slate-900/50 border border-white/10 hover:border-blue-500/50 transition-all group">
          <div className="w-14 h-14 bg-blue-500/20 rounded-xl flex items-center justify-center mb-6 text-blue-400 group-hover:scale-110 transition-transform">
            <Globe size={32} />
          </div>
          <h3 className="text-2xl font-bold text-white mb-4">Desarrollo Web Full Stack</h3>
          <p className="text-slate-400 mb-6">Arquitecturas robustas con React y Python. Dashboards interactivos y manejo de datos complejos (JSON).</p>
          <ul className="space-y-2">
            <li className="flex gap-2 text-slate-300"><CheckCircle2 size={16} className="text-blue-500"/> Single Page Applications (SPA)</li>
            <li className="flex gap-2 text-slate-300"><CheckCircle2 size={16} className="text-blue-500"/> Integración de APIs REST</li>
          </ul>
        </div>

        {/* Tarjeta 2 */}
        <div className="p-8 rounded-3xl bg-slate-900/50 border border-white/10 hover:border-pink-500/50 transition-all group">
          <div className="w-14 h-14 bg-pink-500/20 rounded-xl flex items-center justify-center mb-6 text-pink-400 group-hover:scale-110 transition-transform">
            <Workflow size={32} />
          </div>
          <h3 className="text-2xl font-bold text-white mb-4">Automatización n8n</h3>
          <p className="text-slate-400 mb-6">Orquestamos flujos de trabajo. Conectamos tu CRM, Email y ERP eliminando tareas repetitivas.</p>
          <ul className="space-y-2">
            <li className="flex gap-2 text-slate-300"><CheckCircle2 size={16} className="text-pink-500"/> Webhooks personalizados</li>
            <li className="flex gap-2 text-slate-300"><CheckCircle2 size={16} className="text-pink-500"/> Procesamiento de Leads 24/7</li>
          </ul>
        </div>

        {/* Tarjeta 3 */}
        <div className="p-8 rounded-3xl bg-slate-900/50 border border-white/10 hover:border-purple-500/50 transition-all group">
          <div className="w-14 h-14 bg-purple-500/20 rounded-xl flex items-center justify-center mb-6 text-purple-400 group-hover:scale-110 transition-transform">
            <Bot size={32} />
          </div>
          <h3 className="text-2xl font-bold text-white mb-4">Agentes IA</h3>
          <p className="text-slate-400 mb-6">Chatbots y asistentes inteligentes entrenados con tus datos para atención al cliente o análisis interno.</p>
        </div>

        {/* Tarjeta 4 */}
        <div className="p-8 rounded-3xl bg-slate-900/50 border border-white/10 hover:border-green-500/50 transition-all group">
          <div className="w-14 h-14 bg-green-500/20 rounded-xl flex items-center justify-center mb-6 text-green-400 group-hover:scale-110 transition-transform">
            <Layout size={32} />
          </div>
          <h3 className="text-2xl font-bold text-white mb-4">Consultoría AWS</h3>
          <p className="text-slate-400 mb-6">Despliegue seguro y escalable de tu infraestructura en la nube. Configuración de VPS y Dominios.</p>
        </div>
      </div>
    </div>
  </div>
);

// --- PÁGINA 3: CONTACTO ---
const ContactPage = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('idle');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    
    // Usamos las variables de entorno de Vite.
    // En `npm run dev`, usará VITE_WEBHOOK_URL.
    // En `npm run build`, priorizará VITE_WEBHOOK_URL_PROD si existe.
    const WEBHOOK_URL = import.meta.env.VITE_WEBHOOK_URL_PROD || import.meta.env.VITE_WEBHOOK_URL;

    try {
      if (!WEBHOOK_URL) {
        throw new Error("La URL del webhook no está configurada.");
      }

      await fetch(WEBHOOK_URL, { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, source: 'Contact Page Web' }) 
      });
      
      setStatus('success');
      setFormData({ name: '', email: '', message: '' });

    } catch (error) {
      console.error("Error en el envío del formulario:", error);
      setStatus('idle');
      // Considera mostrar un mensaje de error más amigable en la UI
      alert("Hubo un error al enviar el mensaje. Inténtalo de nuevo más tarde.");
    }
  };

  return (
    <div className="pt-32 pb-20 min-h-screen flex items-center justify-center relative">
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-slate-950 to-slate-950 -z-10"></div>
      
      <div className="max-w-xl w-full mx-auto px-4">
        <div className="bg-slate-900/80 p-8 md:p-12 rounded-3xl border border-white/10 shadow-2xl backdrop-blur-xl">
          <h1 className="text-3xl font-bold text-white mb-2 text-center">Inicia tu Proyecto</h1>
          <p className="text-slate-400 text-center mb-8">Cuéntanos qué necesitas automatizar. Te respondemos rápido.</p>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-sm text-slate-300 ml-1">Nombre</label>
              <input 
                type="text" required
                value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                className="w-full mt-1 bg-slate-800 border border-white/10 rounded-xl p-4 text-white focus:border-blue-500 outline-none transition-colors"
                placeholder="Ej. Carlos Rodríguez"
              />
            </div>
            
            <div>
              <label className="text-sm text-slate-300 ml-1">Email Corporativo</label>
              <input 
                type="email" required
                value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})}
                className="w-full mt-1 bg-slate-800 border border-white/10 rounded-xl p-4 text-white focus:border-blue-500 outline-none transition-colors"
                placeholder="carlos@empresa.com"
              />
            </div>
            
            <div>
              <label className="text-sm text-slate-300 ml-1">Detalles del Proyecto</label>
              <textarea 
                rows="4" required
                value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})}
                className="w-full mt-1 bg-slate-800 border border-white/10 rounded-xl p-4 text-white focus:border-blue-500 outline-none transition-colors resize-none"
                placeholder="Necesito conectar mi base de datos con..."
              ></textarea>
            </div>

            <button 
              disabled={status !== 'idle'} 
              className={`w-full py-4 rounded-xl font-bold text-white transition-all transform hover:-translate-y-1 shadow-lg 
                ${status === 'success' ? 'bg-green-600' : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-blue-500/25'}
              `}
            >
              {status === 'success' ? (
                <span className="flex items-center justify-center gap-2"><CheckCircle2/> ¡Mensaje Enviado!</span>
              ) : status === 'sending' ? (
                'Enviando...'
              ) : (
                <span className="flex items-center justify-center gap-2">Enviar Solicitud <Send size={18}/></span>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

// --- APP PRINCIPAL (SISTEMA DE RUTAS) ---
const App = () => {
  return (
    <Router>
      <div className="bg-slate-950 min-h-screen text-slate-200 font-sans flex flex-col">
        {/* La Navbar se muestra en todas las páginas */}
        <Navbar />
        
        {/* Routes decide qué componente mostrar según la URL */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/servicios" element={<ServicesPage />} />
          <Route path="/contacto" element={<ContactPage />} />
          <Route path="/nosotros" element={<div className="pt-40 text-center text-slate-400">Próximamente: Nuestra Historia</div>} />
        </Routes>

        {/* El Footer se muestra en todas las páginas */}
        <Footer />
      </div>
    </Router>
  );
};

export default App;