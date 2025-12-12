
import { motion } from 'framer-motion';
import { Globe, Workflow, Bot, Layout } from 'lucide-react';
import AnimatedPage from '../components/AnimatedPage';

const ServicesPage = () => (
    <AnimatedPage title="Servicios">
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

export default ServicesPage;
