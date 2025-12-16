
import { motion } from 'framer-motion';
import { ArrowUpRight, BarChart3, Clock, Zap } from 'lucide-react';

const cases = [
    {
        title: "Automatización de Ventas B2B",
        client: "Sector Logístico",
        metric: "+45%",
        metricLabel: "Conversión de Leads",
        desc: "Implementación de agentes IA para calificación automática y agendamiento en CRM.",
        icon: Zap,
        color: "text-yellow-400",
        bg: "bg-yellow-400/10"
    },
    {
        title: "Dashboard Financiero en Tiempo Real",
        client: "FinTech Startup",
        metric: "-20h",
        metricLabel: "Ahorro Semanal",
        desc: "Centralización de reportes manuales en un dashboard interactivo conectado a n8n.",
        icon: BarChart3,
        color: "text-blue-400",
        bg: "bg-blue-400/10"
    },
    {
        title: "Soporte Técnico Autónomo",
        client: "SaaS Enterprise",
        metric: "24/7",
        metricLabel: "Disponibilidad",
        desc: "Chatbot entrenado con documentación técnica que resuelve el 80% de tickets L1.",
        icon: Clock,
        color: "text-purple-400",
        bg: "bg-purple-400/10"
    }
];

const CaseStudies = () => {
    return (
        <section className="py-24 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[100px] -z-10" />

            <div className="max-w-7xl mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-16 md:flex justify-between items-end"
                >
                    <div>
                        <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
                            Resultados <span className="text-blue-500">Reales</span>
                        </h2>
                        <p className="text-slate-400 max-w-xl text-lg">
                            No vendemos humo. Vendemos eficiencia medible y escalabilidad comprobada.
                        </p>
                    </div>
                </motion.div>

                <div className="grid md:grid-cols-3 gap-8">
                    {cases.map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.2 }}
                            className="group relative p-8 rounded-3xl bg-slate-900 border border-white/10 hover:border-blue-500/30 transition-all hover:-translate-y-2 flex flex-col h-full"
                        >
                            <div className={`w-12 h-12 ${item.bg} rounded-xl flex items-center justify-center mb-6 mr-auto`}>
                                <item.icon className={item.color} size={24} />
                            </div>

                            <div className="mb-6 flex-1">
                                <div className="text-sm text-slate-500 mb-2 font-medium">{item.client}</div>
                                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors">
                                    {item.title}
                                </h3>
                                <p className="text-slate-400 text-sm leading-relaxed">
                                    {item.desc}
                                </p>
                            </div>

                            <div className="pt-6 border-t border-white/5 flex justify-between items-end">
                                <div>
                                    <div className="text-3xl font-bold text-white mb-1">{item.metric}</div>
                                    <div className="text-xs text-slate-500 font-medium uppercase tracking-wider">{item.metricLabel}</div>
                                </div>
                                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-blue-500 group-hover:text-white transition-all">
                                    <ArrowUpRight size={20} />
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default CaseStudies;
