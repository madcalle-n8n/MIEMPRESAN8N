/**
 * ============================================================================
 * 🚪 PÁGINA: Login
 * ============================================================================
 * 
 * PROPÓSITO:
 * Formulario de inicio de sesión para acceder a áreas protegidas como
 * el CRM y el servicio de Scraping.
 * 
 * FUNCIONALIDADES:
 * - Formulario de email y contraseña
 * - Validaciones frontend
 * - Integración con AuthContext
 * - Link a registro
 * - Manejo de errores
 * 
 * ============================================================================
 * 📁 UBICACIÓN: src/pages/Login.jsx
 * 🔗 RUTA: /login
 * ============================================================================
 */

import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, LogIn, Sparkles, AlertCircle, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import AnimatedPage from '../components/layout/AnimatedPage';
import SEO from '../components/SEO';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formError, setFormError] = useState('');

    const { login, error, clearError } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    // Ruta a la que redirigir después del login
    const from = location.state?.from?.pathname || '/crm';

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormError('');
        clearError();

        // Validaciones
        if (!email.trim()) {
            setFormError('El email es obligatorio');
            return;
        }
        if (!password) {
            setFormError('La contraseña es obligatoria');
            return;
        }
        if (!/\S+@\S+\.\S+/.test(email)) {
            setFormError('Ingresa un email válido');
            return;
        }

        setIsSubmitting(true);

        const result = await login(email, password);

        if (result.success) {
            navigate(from, { replace: true });
        } else {
            setFormError(result.error || 'Error al iniciar sesión');
        }

        setIsSubmitting(false);
    };

    return (
        <AnimatedPage>
            <SEO
                title="Iniciar Sesión"
                description="Accede a tu cuenta para gestionar tus servicios de automatización y scraping web."
            />

            <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4 py-20">
                {/* Fondo decorativo */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl"></div>
                </div>

                <div className="w-full max-w-md relative z-10">
                    {/* Link volver */}
                    <Link
                        to="/"
                        className="inline-flex items-center text-slate-400 hover:text-white mb-8 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Volver al inicio
                    </Link>

                    {/* Card de login */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl"
                    >
                        {/* Header */}
                        <div className="text-center mb-8">
                            <div className="w-16 h-16 bg-gradient-to-tr from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-purple-500/20">
                                <Sparkles className="w-8 h-8 text-white" />
                            </div>
                            <h1 className="text-2xl font-bold text-white mb-2">Bienvenido de vuelta</h1>
                            <p className="text-slate-400 text-sm">
                                Inicia sesión para acceder a tu panel
                            </p>
                        </div>

                        {/* Formulario */}
                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* Error */}
                            {(formError || error) && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-start gap-3"
                                >
                                    <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                                    <p className="text-red-400 text-sm">{formError || error}</p>
                                </motion.div>
                            )}

                            {/* Email */}
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">
                                    Email
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="tu@email.com"
                                        className="w-full bg-slate-800/50 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        disabled={isSubmitting}
                                    />
                                </div>
                            </div>

                            {/* Contraseña */}
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">
                                    Contraseña
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        className="w-full bg-slate-800/50 border border-white/10 rounded-xl py-3 pl-12 pr-12 text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        disabled={isSubmitting}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>

                            {/* Botón submit */}
                            <motion.button
                                type="submit"
                                disabled={isSubmitting}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className={`w-full py-4 rounded-xl font-bold text-white flex items-center justify-center gap-2 transition-all ${isSubmitting
                                        ? 'bg-slate-700 cursor-not-allowed'
                                        : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 shadow-lg shadow-purple-500/20'
                                    }`}
                            >
                                {isSubmitting ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        Iniciando sesión...
                                    </>
                                ) : (
                                    <>
                                        <LogIn className="w-5 h-5" />
                                        Iniciar Sesión
                                    </>
                                )}
                            </motion.button>
                        </form>

                        {/* Link a registro */}
                        <div className="mt-6 text-center">
                            <p className="text-slate-400 text-sm">
                                ¿No tienes cuenta?{' '}
                                <Link
                                    to="/register"
                                    className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
                                >
                                    Regístrate gratis
                                </Link>
                            </p>
                        </div>

                        {/* Aviso modo demo */}
                        <div className="mt-6 pt-6 border-t border-white/10">
                            <p className="text-slate-500 text-xs text-center">
                                💡 <strong>Modo Demo:</strong> Puedes usar cualquier email y contraseña para probar
                            </p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </AnimatedPage>
    );
};

export default Login;
