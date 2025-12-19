/**
 * ============================================================================
 * 🧭 COMPONENTE: Navbar (Barra de Navegación)
 * ============================================================================
 * 
 * PROPÓSITO:
 * Menú de navegación principal. Aparece fijo en la parte superior de
 * todas las páginas. Incluye versión móvil con menú hamburguesa.
 * 
 * CARACTERÍSTICAS:
 * - Cambia de transparente a opaco al hacer scroll
 * - Menú responsive (desktop/móvil)
 * - Indicador de página activa
 * - Logo clicable que lleva al inicio
 * 
 * Para agregar nuevas páginas al menú, modifica el array en línea ~34
 * 
 * ============================================================================
 * 📁 UBICACIÓN: src/components/layout/Navbar.jsx
 * 🔗 USADO EN: App.jsx (visible en todas las páginas)
 * ============================================================================
 */

import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Cpu, Menu, X } from 'lucide-react';

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
        <nav className={`fixed w-full z-40 transition-all duration-300 ${isScrolled ? 'bg-slate-950/80 backdrop-blur-md border-b border-white/10 py-4' : 'bg-transparent py-6'
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

                {/* Mapeo explícito de rutas a labels */}
                <div className="hidden md:flex items-center gap-2">
                    {[
                        { path: '/', label: 'Inicio' },
                        { path: '/servicios', label: 'Servicios' },
                        { path: '/nosotros', label: 'Nosotros' }
                    ].map(({ path, label }) => (
                        <Link
                            key={path}
                            to={path}
                            className={`px-4 py-2 rounded-full transition-all text-sm font-medium ${isActive(path)}`}
                        >
                            {label}
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
        </nav >
    );
};

export default Navbar;
