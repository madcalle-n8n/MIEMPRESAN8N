import React, { useState, useEffect } from 'react';
import { 
  Bot, 
  Cpu, 
  Code2, 
  Workflow, 
  ArrowRight, 
  Menu, 
  X, 
  Zap, 
  MessageSquare, 
  BarChart3, 
  Globe, 
  CheckCircle2,
  Send
} from 'lucide-react';

const App = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('automatizacion');

  // Detectar scroll para cambiar la navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMobileMenuOpen(false);
    }
  };

  // Componente de Navegación
  const Navbar = () => (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${
      isScrolled ? 'bg-slate-900/80 backdrop-blur-md border-b border-white/10 py-4' : 'bg-transparent py-6'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <div className="flex items-center gap-2 group cursor-pointer" onClick={() => scrollToSection('inicio')}>
          <div className="w-10 h-10 bg-gradient-to-tr from-blue-500 to-purple-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
            <Cpu className="text-white w-6 h-6" />
          </div>
          <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
            N8NIADUSTRIA
          </span>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          {['Servicios', 'Cómo Funciona', 'Stack Tecnológico', 'Contacto'].map((item) => (
            <button
              key={item}
              onClick={() => scrollToSection(item.toLowerCase().replace(' ', '-').replace('ó', 'o'))}
              className="text-slate-300 hover:text-white transition-colors text-sm font-medium tracking-wide"
            >
              {item}
            </button>
          ))}
          <button 
            onClick={() => scrollToSection('contacto')}
            className="px-6 py-2.5 bg-white text-slate-900 rounded-full font-bold hover:bg-blue-50 transition-all transform hover:-translate-y-1 shadow-lg shadow-blue-500/20"
          >
            Cotizar Proyecto
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-white"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-slate-900 border-b border-white/10 p-4 flex flex-col gap-4 animate-in slide-in-from-top-5">
          {['Servicios', 'Cómo Funciona', 'Stack Tecnológico', 'Contacto'].map((item) => (
            <button
              key={item}
              onClick={() => scrollToSection(item.toLowerCase().replace(' ', '-').replace('ó', 'o'))}
              className="text-left text-slate-300 hover:text-white py-2"
            >
              {item}
            </button>
          ))}
        </div>
      )}
    </nav>
  );

  // Componente Hero
  const Hero = () => (
    <section id="inicio" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-blue-600/20 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-0 right-0 w-[800px] h-[600px] bg-purple-600/10 rounded-full blur-[100px] -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-sm animate-fade-in-up">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
          <span className="text-slate-300 text-sm font-medium">Innovación Empresarial 2025</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight mb-8 leading-tight">
          Transformamos Empresas con <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
            Inteligencia Artificial
          </span>
        </h1>
        
        <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          Desarrollo web avanzado, automatizaciones con n8n y agentes de IA diseñados para escalar operaciones de medianas y grandes empresas.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button 
            onClick={() => scrollToSection('servicios')}
            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full text-white font-bold hover:shadow-lg hover:shadow-blue-500/25 transition-all transform hover:-translate-y-1 flex items-center gap-2 w-full sm:w-auto justify-center"
          >
            Explorar Soluciones <ArrowRight className="w-5 h-5" />
          </button>
          <button 
            onClick={() => scrollToSection('como-funciona')}
            className="px-8 py-4 bg-white/5 border border-white/10 rounded-full text-white font-semibold hover:bg-white/10 transition-all backdrop-blur-sm w-full sm:w-auto"
          >
            Ver Demo
          </button>
        </div>

        {/* Floating Cards (Decorative) */}
        <div className="hidden lg:block absolute top-1/2 -translate-y-1/2 -right-16 animate-float-slow">
          <div className="p-4 rounded-2xl bg-slate-800/50 backdrop-blur-md border border-white/10 shadow-xl max-w-xs">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center text-green-400"><Zap size={16} /></div>
              <span className="text-white font-medium">Ahorro Mensual</span>
            </div>
            <div className="text-3xl font-bold text-white mb-1">+120 hrs</div>
            <div className="text-xs text-slate-400">En tareas administrativas automatizadas</div>
          </div>
        </div>
      </div>
    </section>
  );

  // Componente Servicios (Bento Grid Style)
  const Services = () => (
    <section id="servicios" className="py-24 bg-slate-950 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Soluciones Integrales</h2>
          <p className="text-slate-400 max-w-2xl mx-auto">Tecnología de punta aplicada a resultados de negocio reales.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Large Card - Web Dev */}
          <div className="md:col-span-2 p-8 rounded-3xl bg-slate-900/50 border border-white/5 hover:border-blue-500/30 transition-all group overflow-hidden relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px] -z-10 group-hover:bg-blue-500/20 transition-all" />
            <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mb-6 text-blue-400">
              <Globe />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">Desarrollo Web & Python</h3>
            <p className="text-slate-400 mb-6 max-w-lg">
              Creamos arquitecturas robustas utilizando Python para el backend y interfaces modernas. 
              Manejo de datos complejos con JSON y bases de datos escalables.
            </p>
            <ul className="grid grid-cols-2 gap-2">
              {['React / Next.js', 'Python Backend', 'APIs RESTful', 'Dashboards'].map(tag => (
                <li key={tag} className="flex items-center gap-2 text-sm text-slate-300">
                  <CheckCircle2 size={16} className="text-blue-500" /> {tag}
                </li>
              ))}
            </ul>
          </div>

          {/* Tall Card - n8n */}
          <div className="md:row-span-2 p-8 rounded-3xl bg-slate-900/50 border border-white/5 hover:border-pink-500/30 transition-all group overflow-hidden relative">
             <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-pink-500/10 to-transparent -z-10" />
            <div className="w-12 h-12 bg-pink-500/20 rounded-xl flex items-center justify-center mb-6 text-pink-400">
              <Workflow />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">Automatización n8n</h3>
            <p className="text-slate-400 mb-6">
              Orquestamos flujos de trabajo complejos. Conectamos tu CRM, Email, y ERP sin fricción.
            </p>
            <div className="space-y-4 mt-8">
              <div className="p-4 rounded-xl bg-slate-800/50 border border-white/5 text-sm text-slate-300">
                <div className="flex justify-between mb-2 text-xs text-slate-500">
                  <span>Trigger: Webhook</span>
                  <span>Status: Active</span>
                </div>
                <div className="flex gap-2 items-center">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  Nuevo Lead Recibido
                </div>
                <div className="w-0.5 h-4 bg-slate-700 ml-1 my-1"></div>
                <div className="flex gap-2 items-center">
                  <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                  Procesar en CRM
                </div>
              </div>
            </div>
          </div>

          {/* Medium Card - AI Agents */}
          <div className="p-8 rounded-3xl bg-slate-900/50 border border-white/5 hover:border-purple-500/30 transition-all group overflow-hidden">
            <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mb-6 text-purple-400">
              <Bot />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">Agentes IA & Chatbots</h3>
            <p className="text-slate-400 text-sm">
              Asistentes inteligentes 24/7 entrenados con los datos de tu empresa. Soporte, ventas y análisis interno.
            </p>
          </div>

          {/* Medium Card - Business Solutions */}
          <div className="p-8 rounded-3xl bg-slate-900/50 border border-white/5 hover:border-green-500/30 transition-all group overflow-hidden">
            <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center mb-6 text-green-400">
              <BarChart3 />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">Escalabilidad Empresarial</h3>
            <p className="text-slate-400 text-sm">
              Infraestructura lista para escalar. Despliegue en AWS y optimización de recursos.
            </p>
          </div>
        </div>
      </div>
    </section>
  );

  // Componente Tech Stack & Workflow
  const WorkflowSection = () => (
    <section id="stack-tecnologico" className="py-24 bg-slate-900 overflow-hidden">
       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <div className="lg:w-1/2">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
              El Motor de tu <br />
              <span className="text-blue-400">Crecimiento Digital</span>
            </h2>
            <p className="text-slate-400 text-lg mb-8">
              No solo hacemos webs bonitas. Construimos ecosistemas digitales conectados. Desde el código en Python hasta la interfaz en React, todo fluye a través de automatizaciones inteligentes.
            </p>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-yellow-500/20 flex items-center justify-center text-yellow-400 mt-1">
                  <Code2 size={20} />
                </div>
                <div>
                  <h4 className="text-white font-bold text-lg">Python & JSON Core</h4>
                  <p className="text-slate-400 text-sm">Procesamiento de datos robusto y estructurado para lógicas complejas.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-pink-500/20 flex items-center justify-center text-pink-400 mt-1">
                  <Workflow size={20} />
                </div>
                <div>
                  <h4 className="text-white font-bold text-lg">Orquestación n8n</h4>
                  <p className="text-slate-400 text-sm">Webhooks y APIs conectadas para eliminar el trabajo manual.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-400 mt-1">
                  <MessageSquare size={20} />
                </div>
                <div>
                  <h4 className="text-white font-bold text-lg">Chatbots Interactivos</h4>
                  <p className="text-slate-400 text-sm">Atención inmediata capaz de cerrar ventas y agendar citas.</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="lg:w-1/2 relative">
             {/* Abstract Visual Representation of Code/Flow */}
             <div className="relative z-10 bg-slate-800 rounded-2xl p-6 border border-white/10 shadow-2xl">
                <div className="flex items-center gap-2 mb-4 border-b border-white/10 pb-4">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <div className="ml-4 text-xs text-slate-500 font-mono">workflow_engine.py</div>
                </div>
                <div className="font-mono text-sm space-y-2">
                  <div className="text-purple-400">def <span className="text-blue-400">process_client_request</span>(data):</div>
                  <div className="pl-4 text-slate-300">ai_analysis = agent.analyze(data.intent)</div>
                  <div className="pl-4 text-slate-300">if <span className="text-orange-400">ai_analysis.score</span> {'>'} 0.8:</div>
                  <div className="pl-8 text-green-400"># Trigger n8n webhook</div>
                  <div className="pl-8 text-slate-300">webhook.send({'{'}</div>
                  <div className="pl-12 text-slate-400">"client": data.id,</div>
                  <div className="pl-12 text-slate-400">"action": "optimize_workflow"</div>
                  <div className="pl-8 text-slate-300">{'}'})</div>
                  <div className="pl-4 text-slate-300">return <span className="text-yellow-400">"Optimization Started"</span></div>
                </div>
                
                {/* Floating Badge */}
                <div className="absolute -bottom-6 -right-6 bg-blue-600 text-white px-6 py-3 rounded-xl shadow-lg flex items-center gap-2 animate-bounce">
                  <CheckCircle2 size={18} />
                  <span className="font-bold">Sistema Optimizado</span>
                </div>
             </div>
             
             {/* Decorative Elements behind code */}
             <div className="absolute top-10 -left-10 w-full h-full bg-gradient-to-tr from-blue-600/20 to-purple-600/20 rounded-2xl -z-10 blur-xl"></div>
          </div>
        </div>
      </div>
    </section>
  );

  // Formulario Contacto
  const Contact = () => {
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const [status, setStatus] = useState('idle');

    const handleSubmit = async (e) => {
      e.preventDefault();
      setStatus('sending');
      
      try {
        // --- AQUÍ CONECTAMOS CON n8n ---
        // Pega aquí la URL de tu Webhook de producción
        const WEBHOOK_URL = 'https://n8nprueba.serveftp.com/webhook-test/bc84c12f-2b71-4ef9-a50e-79c41cedbe45';
        
        // Si no has pegado la URL, esto es solo una simulación
        if (WEBHOOK_URL === 'PEGAR_AQUI_TU_WEBHOOK_URL_DE_N8N') {
          console.log("Modo Simulación: No se ha configurado la URL del Webhook aún.");
          await new Promise(resolve => setTimeout(resolve, 1500)); // Espera falsa
        } else {
          // Envío real a n8n
          await fetch(WEBHOOK_URL, { 
            method: 'POST', 
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              ...formData,
              fecha: new Date().toISOString(),
              origen: 'web-empresarial'
            }) 
          });
        }

        setStatus('success');
        setFormData({ name: '', email: '', message: '' });
        
      } catch (error) {
        console.error("Error enviando a n8n:", error);
        setStatus('idle'); // Volver a estado normal si falla para reintentar
        alert("Hubo un error al conectar con el servidor. Revisa la consola.");
      }
    };

    return (
      <section id="contacto" className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-slate-950 -z-20"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-slate-950 to-slate-950 -z-10"></div>
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-slate-900/80 backdrop-blur-xl rounded-3xl p-8 md:p-12 border border-white/10 shadow-2xl">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Empecemos tu Transformación</h2>
              <p className="text-slate-400">Déjanos tus datos. Nuestros agentes (y humanos) te contactarán pronto.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Nombre Completo</label>
                  <input 
                    type="text" 
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-slate-800/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                    placeholder="Juan Pérez"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Email Corporativo</label>
                  <input 
                    type="email" 
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full bg-slate-800/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                    placeholder="juan@empresa.com"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">¿Qué desafío quieres automatizar?</label>
                <textarea 
                  rows="4"
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  className="w-full bg-slate-800/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all resize-none"
                  placeholder="Necesito automatizar la captura de leads y conectarlos con mi CRM..."
                ></textarea>
              </div>

              <button 
                type="submit"
                disabled={status === 'sending' || status === 'success'}
                className={`w-full py-4 rounded-xl font-bold text-white transition-all transform flex items-center justify-center gap-2
                  ${status === 'success' ? 'bg-green-500 hover:bg-green-600' : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-lg hover:scale-[1.02]'}
                `}
              >
                {status === 'idle' && <>Enviar Solicitud <Send size={18} /></>}
                {status === 'sending' && 'Procesando...'}
                {status === 'success' && <>¡Enviado con Éxito! <CheckCircle2 size={18} /></>}
              </button>
            </form>
          </div>
        </div>
      </section>
    );
  };

  const Footer = () => (
    <footer className="bg-slate-950 border-t border-white/5 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-2">
          <Cpu className="text-blue-500 w-6 h-6" />
          <span className="text-xl font-bold text-white">N8NIADUSTRIA</span>
        </div>
        <div className="text-slate-500 text-sm">
          © 2025 N8NIADUSTRIA Solutions. Powered by Python, React & n8n.
        </div>
        <div className="flex gap-4">
          {/* Social Icons Placeholders */}
          <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:bg-white/10 cursor-pointer transition-colors">GH</div>
          <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:bg-white/10 cursor-pointer transition-colors">LI</div>
        </div>
      </div>
    </footer>
  );

  return (
    <div className="bg-slate-950 min-h-screen text-slate-200 selection:bg-blue-500/30 font-sans">
      <Navbar />
      <Hero />
      <Services />
      <WorkflowSection />
      <Contact />
      <Footer />
    </div>
  );
};

export default App;