
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import AnimatedPage from '../components/AnimatedPage';
import { servicesData } from '../data/services';

const ServicesPage = () => (
    <AnimatedPage title="Servicios">
        <div className="pt-32 pb-20 min-h-screen">
            <div className="max-w-7xl mx-auto px-4">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">Nuestras Soluciones</h1>
                    <p className="text-slate-400 max-w-2xl mx-auto">Stack tecnológico moderno para empresas que quieren liderar.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {servicesData.map((item, index) => (
                        <Link to={`/servicios/${item.id}`} key={item.id} className="block">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className={`h-full p-8 rounded-3xl bg-slate-900/50 border border-white/10 ${item.border || 'hover:border-white/20'} transition-all group hover:bg-slate-900/80 hover:-translate-y-2 cursor-pointer relative overflow-hidden`}
                            >
                                {/* Gradient Hover Effect */}
                                <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 ${item.bg}`} />

                                <div className={`w-14 h-14 ${item.bg} rounded-xl flex items-center justify-center mb-6 ${item.color} group-hover:scale-110 transition-transform relative z-10`}>
                                    <item.icon size={32} />
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-4 relative z-10 flex items-center justify-between">
                                    {item.title}
                                    <span className="text-sm font-normal text-slate-500 group-hover:text-white transition-colors">Ver más →</span>
                                </h3>
                                <p className="text-slate-400 relative z-10">{item.shortDesc}</p>
                            </motion.div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    </AnimatedPage>
);

export default ServicesPage;
