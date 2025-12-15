
import { motion } from 'framer-motion';
import { Users, Target, ShieldCheck, Zap } from 'lucide-react';
import AnimatedPage from '../components/layout/AnimatedPage';

const AboutPage = () => (
    <AnimatedPage title="Nosotros">
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

export default AboutPage;
