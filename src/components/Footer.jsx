
import { Cpu } from 'lucide-react';

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

export default Footer;
