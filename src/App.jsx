import React, { useState, useEffect, useRef } from 'react';
// IMPORTANTE: Asegúrate de tener instalado: npm install framer-motion lucide-react react-router-dom
import { HashRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { 
  Bot, Cpu, Code2, Workflow, ArrowRight, Menu, X, 
  Zap, MessageSquare, BarChart3, Globe, CheckCircle2, Send, Layout, Users, Target, ShieldCheck, Sparkles, XCircle
} from 'lucide-react';

// --- CONFIGURACIÓN GLOBAL ---
// URL para el formulario de contacto (Ya funcionando)
const CONTACT_WEBHOOK_URL = 'https://miempresan8n.serveftp.com/webhook/webhook';

// URL para el CHATBOT (¡NUEVO!)
// Tienes que crear este webhook en n8n y pegarlo aquí.
// El flujo en n8n debe devolver un JSON: { "output": "Respuesta del agente..." }
const CHAT_WEBHOOK_URL = 'https://miempresan8n.serveftp.com/webhook/webhook'; 

// --- ANIMACIONES ---
const pageVariants = {
  initial: { opacity: 0, y: 20, scale: 0.98 },
  in: { opacity: 1, y: 0, scale: 1 },
  out: { opacity: 0, y: -20, scale: 1.02 }
};

const pageTransition = {
  type: "tween",
  ease: "anticipate",
  duration: 0.5
};

// --- COMPONENTE CHATBOT IA (CONECTADO A N8N) ---
const AIChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, text: "¡Hola! Soy Nova, la IA de N8NIADUSTRIA. ¿En qué puedo ayudarte a automatizar hoy?", sender: 'bot' }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const toggleChat = () => setIsOpen(!isOpen);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen, isTyping]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    // 1. Mostrar mensaje del usuario inmediatamente
    const userMsg = { id: Date.now(), text: inputValue, sender: 'user' };
    setMessages(prev => [...prev, userMsg]);
    setInputValue("");
    setIsTyping(true);

    try {
      // Validación: Si no hay URL configurada, usar simulación para no romper la demo
      if (!CHAT_WEBHOOK_URL || CHAT_WEBHOOK_URL.includes('PEGAR_AQUI')) {
        console.warn("Modo Demo: Configura CHAT_WEBHOOK_URL en el código para conectar con n8n real.");
        setTimeout(() => {
          setMessages(prev => [...prev, { 
            id: Date.now() + 1, 
            text: "¡Estoy listo para conectarme! Crea un webhook en n8n y pega la URL en el código (variable CHAT_WEBHOOK_URL) para que yo pueda responderte de verdad.", 
            sender: 'bot' 
          }]);
          setIsTyping(false);
        }, 1500);
        return;
      }

      // 2. Conectar con n8n (El Agente Real)
      const response = await fetch(CHAT_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: userMsg.text,
          sessionId: 'session-' + Math.random().toString(36).substr(2, 9), // ID simple para memoria
          timestamp: new Date().toISOString()
        })
      });

      if (!response.ok) throw new Error('Error en la respuesta del servidor');

      const data = await response.json();
      
      // n8n debe devolver algo como { "output": "Texto respuesta" } o { "text": "Texto respuesta" }
      const botResponseText = data.output || data.text || data.message || "Lo siento, recibí una respuesta vacía del servidor.";

      setMessages(prev => [...prev, { id: Date.now() + 1, text: botResponseText, sender: 'bot' }]);

    } catch (error) {
      console.error("Error chat:", error);
      setMessages(prev => [...prev, { 
        id: Date.now() + 1, 
        text: "Tuve un problema conectando con mi cerebro en la nube. Intenta de nuevo.", 
        sender: 'bot' 
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="mb-4 w-80 md:w-96 bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[500px]"
          >
            {/* Header del Chat */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <Bot size={18} className="text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm">Nova AI Agent</h3>
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                    <span className="text-xs text-blue-100">En línea (n8n Connected)</span>
                  </div>
                </div>
              </div>
              <button onClick={toggleChat} className="text-white/80 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Área de Mensajes */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4 scrollbar-thin scrollbar-thumb-slate-700">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                    msg.sender === 'user' 
                      ? 'bg-blue-600 text-white rounded-br-none' 
                      : 'bg-slate-800 text-slate-200 border border-white/5 rounded-bl-none'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-slate-800 p-3 rounded-2xl rounded-bl-none border border-white/5 flex gap-1 items-center">
                    <span className="text-xs text-slate-400 mr-2">Nova está escribiendo</span>
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></span>
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-75"></span>
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-150"></span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={handleSendMessage} className="p-4 bg-slate-900 border-t border-white/10">
              <div className="relative">
                <input 
                  type="text" 
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Pregúntame sobre automatización..." 
                  className="w-full bg-slate-800 text-white rounded-xl pl-4 pr-10 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 border border-white/5"
                />
                <button 
                  type="submit"
                  disabled={isTyping}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-blue-400 hover:text-blue-300 transition-colors disabled:opacity-50"
                >
                  <Send size={18} />
                </button>
              </div>
              <div className="text-center mt-2">
                <span className="text-[10px] text-slate-500 flex items-center justify-center gap-1">
                  <Sparkles size={10} /> Powered by N8NIADUSTRIA LLM
                </span>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button 
        onClick={toggleChat}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="w-14 h-14 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center shadow-lg shadow-purple-500/30 text-white relative group"
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
        {!isOpen && (
          <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 rounded-full border-2 border-slate-900"></span>
        )}
      </motion.button>
    </div>
  );
};

// --- COMPONENTE NAVBAR ---
const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path) => location.pathname === path ? 'text-white font-bold bg-white/10' : 'text-slate-300 hover:text-white';

  return (
    <nav className={`fixed w-full z-40 transition-all duration-300 ${
      isScrolled ? 'bg-slate-950/80 backdrop-blur-md border-b border-white/10 py-4' : 'bg-transparent py-6'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 bg-gradient-to-tr from-blue-500 to-purple-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-blue-500/20">
            <Cpu className="text-white w-6 h-6" />
          </div>
          <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
            N8NIADUSTRIA
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-2">
          {['/', '/servicios', '/nosotros'].map((path) => (
            <Link 
              key={path}
              to={path} 
              className={`px-4 py-2 rounded-full transition-all text-sm font-medium ${isActive(path)}`}
            >
              {path === '/' ? 'Inicio' : path.replace('/', '').charAt(0).toUpperCase() + path.slice(2)}
            </Link>
          ))}
          <Link 
            to="/contacto"
            className="ml-4 px-6 py-2.5 bg-white text-slate-950 rounded-full font-bold hover:bg-blue-50 transition-all transform hover:-translate-y-1 shadow-lg shadow-blue-500/20"
          >
            Cotizar Proyecto
          </Link>
        </div>

        <button className="md:hidden text-white" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden absolute top-full left-0 w-full bg-slate-950 border-b border-white/10 overflow-hidden"
          >
            <div className="p-4 flex flex-col gap-4">
              <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="text-slate-300 py-2 hover:text-white">Inicio</Link>
              <Link to="/servicios" onClick={() => setIsMobileMenuOpen(false)} className="text-slate-300 py-2 hover:text-white">Servicios</Link>
              <Link to="/nosotros" onClick={() => setIsMobileMenuOpen(false)} className="text-slate-300 py-2 hover:text-white">Nosotros</Link>
              <Link to="/contacto" onClick={() => setIsMobileMenuOpen(false)} className="text-slate-300 py-2 hover:text-white">Contacto</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

// --- COMPONENTE FOOTER ---
const Footer = () => (
  <footer className="bg-slate-950 border-t border-white/5 py-12 mt-auto relative z-10">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
      <div className="flex items-center gap-2">
        <Cpu className="text-blue-500 w-6 h-6" />
        <span className="text-xl font-bold text-white">N8NIADUSTRIA</span>
      </div>
      <div className="text-slate-500 text-sm">© 2025 N8NIADUSTRIA Solutions. Powered by React & n8n.</div>
    </div>
  </footer>
);

// --- PÁGINAS ANIMADAS ---
const AnimatedPage = ({ children }) => (
  <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition}>
    {children}
  </motion.div>
);

// --- PÁGINA 1: INICIO ---
const Home = () => (
  <AnimatedPage>
    <div className="pt-20">
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        <motion.div 
          animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.3, 0.2] }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-blue-600/20 rounded-full blur-[120px] -z-10" 
        />
        
        <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-sm"
          >
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
            <span className="text-slate-300 text-sm font-medium">Innovación Empresarial 2025</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-5xl md:text-8xl font-bold text-white mb-8 leading-tight tracking-tight"
          >
            Transformamos <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
              El Futuro
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Desarrollo web avanzado, automatizaciones con n8n y agentes de IA diseñados para escalar operaciones.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-10"
          >
            <Link to="/servicios" className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full text-white font-bold hover:shadow-lg hover:shadow-blue-500/20 transition-all flex items-center gap-2 transform hover:scale-105">
              Ver Servicios <ArrowRight size={20} />
            </Link>
            <Link to="/contacto" className="px-8 py-4 bg-white/5 border border-white/10 rounded-full text-white hover:bg-white/10 transition-all backdrop-blur-sm">
              Hablemos
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  </AnimatedPage>
);

// --- PÁGINA 2: SERVICIOS ---
const ServicesPage = () => (
  <AnimatedPage>
    <div className="pt-32 pb-20 min-h-screen">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">Nuestras Soluciones</h1>
          <p className="text-slate-400 max-w-2xl mx-auto">Stack tecnológico moderno para empresas que quieren liderar.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            { icon: Globe, color: "text-blue-400", bg: "bg-blue-500/20", border: "hover:border-blue-500/50", title: "Web Full Stack", desc: "React, Python & Dashboards interactivos." },
            { icon: Workflow, color: "text-pink-400", bg: "bg-pink-500/20", border: "hover:border-pink-500/50", title: "Automatización n8n", desc: "Flujos de trabajo que eliminan tareas repetitivas." },
            { icon: Bot, color: "text-purple-400", bg: "bg-purple-500/20", border: "hover:border-purple-500/50", title: "Agentes IA", desc: "Chatbots entrenados con tus datos empresariales." },
            { icon: Layout, color: "text-green-400", bg: "bg-green-500/20", border: "hover:border-green-500/50", title: "Infraestructura AWS", desc: "VPS, Dominios y escalabilidad segura." }
          ].map((item, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`p-8 rounded-3xl bg-slate-900/50 border border-white/10 ${item.border} transition-all group hover:bg-slate-900/80`}
            >
              <div className={`w-14 h-14 ${item.bg} rounded-xl flex items-center justify-center mb-6 ${item.color} group-hover:scale-110 transition-transform`}>
                <item.icon size={32} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">{item.title}</h3>
              <p className="text-slate-400 mb-6">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  </AnimatedPage>
);

// --- PÁGINA 3: NOSOTROS ---
const AboutPage = () => (
  <AnimatedPage>
    <div className="pt-32 pb-20 min-h-screen">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 mb-6">
            <Users size={16} className="text-blue-400" />
            <span className="text-blue-300 text-sm font-medium">Sobre el Equipo</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">Ingeniería Digital</h1>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg">
            Nacimos para cerrar la brecha entre la complejidad tecnológica y el crecimiento empresarial.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-24">
          {[
            { number: "50+", label: "Proyectos" },
            { number: "99%", label: "Uptime" },
            { number: "24/7", label: "Soporte" },
            { number: "10x", label: "ROI" }
          ].map((stat, i) => (
            <motion.div 
              key={i} 
              whileHover={{ y: -5 }}
              className="p-6 rounded-2xl bg-slate-900 border border-white/5 text-center hover:border-blue-500/30 transition-colors"
            >
              <div className="text-3xl font-bold text-white mb-1">{stat.number}</div>
              <div className="text-sm text-slate-500">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20">
          <div className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 p-8 rounded-3xl border border-white/10">
            <Target className="w-12 h-12 text-blue-400 mb-6" />
            <h3 className="text-2xl font-bold text-white mb-4">Nuestra Misión</h3>
            <p className="text-slate-400 leading-relaxed">
              Democratizar el acceso a la Inteligencia Artificial y la automatización avanzada para empresas ambiciosas.
            </p>
          </div>
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center shrink-0"><ShieldCheck className="text-green-400" /></div>
              <div>
                <h4 className="text-white font-bold text-lg">Transparencia Total</h4>
                <p className="text-slate-400 text-sm">Código limpio y propiedad intelectual 100% tuya.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center shrink-0"><Zap className="text-purple-400" /></div>
              <div>
                <h4 className="text-white font-bold text-lg">Velocidad de Ejecución</h4>
                <p className="text-slate-400 text-sm">Entregamos en semanas usando n8n y React, no en meses.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </AnimatedPage>
);

// --- PÁGINA 4: CONTACTO ---
const ContactPage = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('idle');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    
    try {
      if (!CONTACT_WEBHOOK_URL) throw new Error("Falta Webhook URL");
      
      await fetch(CONTACT_WEBHOOK_URL, { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, source: 'Contact Page Web' }) 
      });
      
      setStatus('success');
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      console.error(error);
      setStatus('idle');
      alert("Error al conectar. Verifica tu configuración.");
    }
  };

  return (
    <AnimatedPage>
      <div className="pt-32 pb-20 min-h-screen flex items-center justify-center relative">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-slate-950 to-slate-950 -z-10"></div>
        
        <div className="max-w-xl w-full mx-auto px-4">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-slate-900/80 p-8 md:p-12 rounded-3xl border border-white/10 shadow-2xl backdrop-blur-xl"
          >
            <h1 className="text-3xl font-bold text-white mb-2 text-center">Inicia tu Proyecto</h1>
            <p className="text-slate-400 text-center mb-8">Cuéntanos qué necesitas automatizar.</p>
            
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
                <label className="text-sm text-slate-300 ml-1">Detalles</label>
                <textarea 
                  rows="4" required
                  value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})}
                  className="w-full mt-1 bg-slate-800 border border-white/10 rounded-xl p-4 text-white focus:border-blue-500 outline-none transition-colors resize-none"
                  placeholder="Necesito conectar mi base de datos con..."
                ></textarea>
              </div>

              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={status !== 'idle'} 
                className={`w-full py-4 rounded-xl font-bold text-white transition-all shadow-lg 
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
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>
    </AnimatedPage>
  );
};

// --- APP PRINCIPAL (CON CHATBOT) ---
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