import { motion } from 'framer-motion';
import { Home, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import AnimatedPage from '../components/layout/AnimatedPage';

const NotFound = () => {
    return (
        <AnimatedPage title="404 - Página No Encontrada">
            <div className="min-h-screen pt-32 pb-20 flex items-center justify-center relative overflow-hidden">
                {/* Background Effects */}
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/10 via-slate-950 to-slate-950 -z-10"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-3xl -z-10"></div>

                <div className="text-center px-4 max-w-2xl mx-auto">
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="text-8xl md:text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600 mb-4"
                    >
                        404
                    </motion.h1>

                    <motion.h2
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        className="text-2xl md:text-3xl font-bold text-white mb-6"
                    >
                        Página Fuera de Rango
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                        className="text-slate-400 text-lg mb-10 leading-relaxed"
                    >
                        Parece que has llegado a una sección inexistente o en construcción.
                        Nuestros agentes de IA no pudieron localizar este recurso.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.5 }}
                        className="flex flex-col sm:flex-row gap-4 justify-center"
                    >
                        <Link
                            to="/"
                            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20"
                        >
                            <Home size={20} /> Ir al Inicio
                        </Link>
                        <button
                            onClick={() => window.history.back()}
                            className="px-8 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-medium transition-all flex items-center justify-center gap-2 border border-white/5"
                        >
                            <ArrowLeft size={20} /> Volver
                        </button>
                    </motion.div>
                </div>
            </div>
        </AnimatedPage>
    );
};

export default NotFound;
