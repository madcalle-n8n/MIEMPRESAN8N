import { useState } from 'react';
import { motion } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { Send } from 'lucide-react';
import AnimatedPage from '../components/layout/AnimatedPage';
import { useToast } from '../components/ui/Toast';

// URL para el formulario de contacto (Desde variables de entorno)
const CONTACT_WEBHOOK_URL = import.meta.env.VITE_CONTACT_WEBHOOK_URL;

const ContactPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { addToast } = useToast();

    const initialMessage = location.state?.message || '';
    const [formData, setFormData] = useState({ name: '', email: '', message: initialMessage, _gotcha: '' });
    const [status, setStatus] = useState('idle');

    const handleSubmit = async (e) => {
        e.preventDefault();

        // 🛡️ Honeypot Protection
        if (formData._gotcha) {
            // Si el campo oculto tiene valor, es un bot. Simulamos éxito.
            setStatus('success');
            setTimeout(() => {
                navigate('/');
                addToast("Mensaje enviado con éxito", "success");
            }, 1000);
            return;
        }

        // 🛡️ Validación Estricta (Server-side simulation)
        if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
            addToast("Por favor, completa todos los campos obligatorios.", "error");
            return;
        }

        // Validación básica de formato de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email.trim())) {
            addToast("Por favor, ingresa un correo electrónico válido.", "error");
            return;
        }

        setStatus('sending');

        try {
            if (!CONTACT_WEBHOOK_URL) throw new Error("Falta Webhook URL");

            await fetch(CONTACT_WEBHOOK_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: formData.name.trim(),
                    email: formData.email.trim(),
                    message: formData.message.trim(),
                    source: 'Contact Page Web'
                })
            });

            setStatus('success');
            setFormData({ name: '', email: '', message: '', _gotcha: '' });
            addToast("¡Tu mensaje ha sido enviado correctamente!", "success");

            // Redirigir al inicio después de 2 segundos
            setTimeout(() => {
                navigate('/');
            }, 2000);
        } catch (error) {
            console.error(error);
            setStatus('idle');
            addToast("Error al conectar. Verifica tu internet o intenta más tarde.", "error");
        }
    };

    return (
        <AnimatedPage title="Contacto">
            <div className="pt-32 pb-20 min-h-screen flex items-center justify-center relative">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-slate-950 to-slate-950 -z-10"></div>

                <div className="max-w-xl w-full mx-auto px-4">
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="bg-slate-900/80 p-8 md:p-12 rounded-3xl border border-white/10 shadow-2xl backdrop-blur-xl"
                    >
                        <h1 className="text-3xl font-bold text-white mb-2 text-center">Inicia tu Proyecto</h1>
                        <p className="text-slate-400 text-center mb-8">Cuéntanos qué necesitas automatizar.</p>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* 🍯 Honeypot Hidden Field */}
                            <div className="hidden" aria-hidden="true">
                                <input
                                    type="text"
                                    name="_gotcha"
                                    tabIndex="-1"
                                    autoComplete="off"
                                    value={formData._gotcha}
                                    onChange={e => setFormData({ ...formData, _gotcha: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="text-sm text-slate-300 ml-1">Nombre</label>
                                <input
                                    type="text" required
                                    value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full mt-1 bg-slate-800 border border-white/10 rounded-xl p-4 text-white focus:border-blue-500 outline-none transition-colors"
                                    placeholder="Ej. Carlos Rodríguez"
                                />
                            </div>
                            <div>
                                <label className="text-sm text-slate-300 ml-1">Email Corporativo</label>
                                <input
                                    type="email" required
                                    value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full mt-1 bg-slate-800 border border-white/10 rounded-xl p-4 text-white focus:border-blue-500 outline-none transition-colors"
                                    placeholder="carlos@empresa.com"
                                />
                            </div>
                            <div>
                                <label className="text-sm text-slate-300 ml-1">Detalles</label>
                                <textarea
                                    rows="4" required
                                    value={formData.message} onChange={e => setFormData({ ...formData, message: e.target.value })}
                                    className="w-full mt-1 bg-slate-800 border border-white/10 rounded-xl p-4 text-white focus:border-blue-500 outline-none transition-colors resize-none"
                                    placeholder="Necesito conectar mi base de datos con..."
                                ></textarea>
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                disabled={status !== 'idle'}
                                className={`w-full py-4 rounded-xl font-bold text-white transition-all shadow-lg 
                  ${status === 'success' ? 'bg-green-600' : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-blue-500/25'}
                `}
                            >
                                {status === 'success' ? (
                                    '¡Mensaje Enviado!'
                                ) : status === 'sending' ? (
                                    'Enviando...'
                                ) : (
                                    <span className="flex items-center justify-center gap-2">Enviar Solicitud <Send size={18} /></span>
                                )}
                            </motion.button>
                        </form>
                    </motion.div>
                </div>
            </div>
        </AnimatedPage>
    );
};

export default ContactPage;
