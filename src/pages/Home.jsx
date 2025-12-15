
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import AnimatedPage from '../components/layout/AnimatedPage';
import SEO from '../components/SEO';
import TrustSection from '../components/TrustSection';
import CaseStudies from '../components/CaseStudies';

const Home = () => (
    <AnimatedPage>
        <SEO
            title="Inicio"
            description="Agencia experta en Automatización n8n, Agentes IA y Desarrollo Web Full Stack. Escala tu negocio hoy."
        />
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
                        transition={{ delay: 0.5, duration: 0.8 }}
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

            <TrustSection />
            <CaseStudies />
        </div>
    </AnimatedPage>
);

export default Home;
