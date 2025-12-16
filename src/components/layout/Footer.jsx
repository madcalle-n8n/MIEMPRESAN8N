
import { Cpu } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => (
    <footer className="bg-slate-950 border-t border-white/5 py-12 mt-auto relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
                <Cpu className="text-blue-500 w-6 h-6" />
                <span className="text-xl font-bold text-white">N8NIADUSTRIA</span>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
                <nav className="flex gap-6 text-sm">
                    <Link to="/privacidad" className="text-slate-400 hover:text-white transition-colors">Politica de Privacidad</Link>
                    <Link to="/terminos" className="text-slate-400 hover:text-white transition-colors">Términos de Servicio</Link>
                </nav>
                <div className="text-slate-500 text-sm">© 2025 N8NIADUSTRIA Solutions.</div>
            </div>
        </div>
    </footer>
);

export default Footer;
