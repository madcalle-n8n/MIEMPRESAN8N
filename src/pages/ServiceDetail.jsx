
import { useParams, Link, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle, Zap } from 'lucide-react';
import AnimatedPage from '../components/AnimatedPage';
import { servicesData } from '../data/services';

const ServiceDetail = () => {
    const { id } = useParams();
    const service = servicesData.find(s => s.id === id);

    if (!service) {
        return <Navigate to="/servicios" replace />;
    }

    const Icon = service.icon;

    return (
        <AnimatedPage>
            <div className="pt-24 pb-20 min-h-screen">
                <div className="max-w-4xl mx-auto px-4">

                    {/* Back Button */}
                    <Link to="/servicios" className="inline-flex items-center text-slate-400 hover:text-white mb-8 transition-colors group">
                        <ArrowLeft className="mr-2 w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Volver a Servicios
                    </Link>

                    {/* Header Section */}
                    <div className="text-center mb-12">
                        <div className={`w-20 h-20 mx-auto ${service.bg} rounded-2xl flex items-center justify-center mb-6 ${service.color}`}>
                            <Icon size={40} />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">{service.title}</h1>
                        <p className="text-xl text-slate-300 leading-relaxed max-w-2xl mx-auto">
                            {service.fullDesc}
                        </p>
                    </div>

                    {/* Content Grid */}
                    <div className="grid md:grid-cols-3 gap-8 mb-16">
                        {/* Features Column */}
                        <div className="md:col-span-2 bg-slate-900/50 p-8 rounded-3xl border border-white/5">
                            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                                <Zap className="mr-2 text-yellow-500" />
                                Qué incluye
                            </h2>
                            <ul className="space-y-4">
                                {service.features.map((feature, idx) => (
                                    <li key={idx} className="flex items-start text-slate-300">
                                        <CheckCircle className="w-6 h-6 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Benefits Column (Sidebar) */}
                        <div className="bg-slate-900/30 p-8 rounded-3xl border border-white/5 h-fit">
                            <h3 className="text-xl font-bold text-white mb-4">Beneficios</h3>
                            <ul className="space-y-4">
                                {service.benefits.map((benefit, idx) => (
                                    <li key={idx} className="text-sm text-slate-400 flex items-center">
                                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-3" />
                                        {benefit}
                                    </li>
                                ))}
                            </ul>

                            <div className="mt-8 pt-6 border-t border-white/10">
                                <Link
                                    to="/contacto"
                                    state={{ message: `Hola, me interesa cotizar el servicio de ${service.title}. Me gustaría implementar...` }}
                                    className="block w-full text-center py-3 px-6 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-medium transition-all shadow-lg shadow-blue-500/20"
                                >
                                    Cotizar ahora
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AnimatedPage>
    );
};

export default ServiceDetail;
