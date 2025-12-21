/**
 * ============================================================================
 * 📝 PÁGINA: Register
 * ============================================================================
 * 
 * PROPÓSITO:
 * Formulario de registro para nuevos usuarios.
 * Incluye créditos de bienvenida de regalo.
 * 
 * ============================================================================
 * 📁 UBICACIÓN: src/pages/Register.jsx
 * 🔗 RUTA: /register
 * ============================================================================
 */

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, User, UserPlus, Sparkles, AlertCircle, Eye, EyeOff, ArrowLeft, Check, Gift } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import AnimatedPage from '../components/layout/AnimatedPage';
import SEO from '../components/SEO';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [acceptTerms, setAcceptTerms] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formError, setFormError] = useState('');

    const { register, error, clearError } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormError('');
        clearError();

        // Validaciones
        if (!name.trim()) {
            setFormError('El nombre es obligatorio');
            return;
        }
        if (!email.trim()) {
            setFormError('El email es obligatorio');
            return;
        }
        if (!/\S+@\S+\.\S+/.test(email)) {
            setFormError('Ingresa un email válido');
            return;
        }
        if (password.length < 6) {
            setFormError('La contraseña debe tener al menos 6 caracteres');
            return;
        }
        if (password !== confirmPassword) {
            setFormError('Las contraseñas no coinciden');
            return;
        }
        if (!acceptTerms) {
            setFormError('Debes aceptar los términos y condiciones');
            return;
        }

        setIsSubmitting(true);

        const result = await register(name, email, password);

        if (result.success) {
            navigate('/crm', { replace: true });
        } else {
            setFormError(result.error || 'Error al registrarse');
        }

        setIsSubmitting(false);
    };

    // Indicadores de fortaleza de contraseña
    const passwordStrength = {
        length: password.length >= 6,
        hasNumber: /\d/.test(password),
        hasLetter: /[a-zA-Z]/.test(password)
    };

    return (
        <AnimatedPage>
            <SEO
                title="Crear Cuenta"
                description="Regístrate gratis y obtén créditos de bienvenida para probar nuestro servicio de scraping web con IA."
            />

            <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4 py-20">
                {/* Fondo decorativo */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-1/3 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl"></div>
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

                    {/* Card de registro */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl"
                    >
                        {/* Header */}
                        <div className="text-center mb-8">
                            <div className="w-16 h-16 bg-gradient-to-tr from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-500/20">
                                <Sparkles className="w-8 h-8 text-white" />
                            </div>
                            <h1 className="text-2xl font-bold text-white mb-2">Crea tu cuenta</h1>
                            <p className="text-slate-400 text-sm">
                                Empieza gratis con 5 créditos de bienvenida
                            </p>
                        </div>

                        {/* Badge de regalo */}
                        <div className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 rounded-xl p-3 mb-6 flex items-center gap-3">
                            <div className="p-2 bg-emerald-500/20 rounded-lg">
                                <Gift className="w-5 h-5 text-emerald-400" />
                            </div>
                            <div>
                                <p className="text-emerald-400 font-medium text-sm">🎁 5 Créditos Gratis</p>
                                <p className="text-slate-400 text-xs">Al crear tu cuenta</p>
                            </div>
                        </div>

                        {/* Formulario */}
                        <form onSubmit={handleSubmit} className="space-y-4">
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

                            {/* Nombre */}
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">
                                    Nombre completo
                                </label>
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Tu nombre"
                                        className="w-full bg-slate-800/50 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder-slate-500 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                                        disabled={isSubmitting}
                                    />
                                </div>
                            </div>

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
                                        className="w-full bg-slate-800/50 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder-slate-500 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
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
                                        placeholder="Mínimo 6 caracteres"
                                        className="w-full bg-slate-800/50 border border-white/10 rounded-xl py-3 pl-12 pr-12 text-white placeholder-slate-500 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
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

                                {/* Indicadores de fortaleza */}
                                {password && (
                                    <div className="mt-2 flex gap-3 text-xs">
                                        <span className={passwordStrength.length ? 'text-emerald-400' : 'text-slate-500'}>
                                            <Check className="w-3 h-3 inline mr-1" />6+ chars
                                        </span>
                                        <span className={passwordStrength.hasLetter ? 'text-emerald-400' : 'text-slate-500'}>
                                            <Check className="w-3 h-3 inline mr-1" />Letras
                                        </span>
                                        <span className={passwordStrength.hasNumber ? 'text-emerald-400' : 'text-slate-500'}>
                                            <Check className="w-3 h-3 inline mr-1" />Números
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Confirmar Contraseña */}
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">
                                    Confirmar contraseña
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="Repite tu contraseña"
                                        className="w-full bg-slate-800/50 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder-slate-500 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                                        disabled={isSubmitting}
                                    />
                                </div>
                            </div>

                            {/* Términos */}
                            <div className="flex items-start gap-3">
                                <input
                                    type="checkbox"
                                    id="terms"
                                    checked={acceptTerms}
                                    onChange={(e) => setAcceptTerms(e.target.checked)}
                                    className="mt-1 w-4 h-4 rounded border-slate-600 bg-slate-800 text-emerald-500 focus:ring-emerald-500"
                                />
                                <label htmlFor="terms" className="text-sm text-slate-400">
                                    Acepto los{' '}
                                    <Link to="/terminos" className="text-emerald-400 hover:text-emerald-300">
                                        términos de servicio
                                    </Link>{' '}
                                    y la{' '}
                                    <Link to="/privacidad" className="text-emerald-400 hover:text-emerald-300">
                                        política de privacidad
                                    </Link>
                                </label>
                            </div>

                            {/* Botón submit */}
                            <motion.button
                                type="submit"
                                disabled={isSubmitting}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className={`w-full py-4 rounded-xl font-bold text-white flex items-center justify-center gap-2 transition-all ${isSubmitting
                                        ? 'bg-slate-700 cursor-not-allowed'
                                        : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-lg shadow-emerald-500/20'
                                    }`}
                            >
                                {isSubmitting ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        Creando cuenta...
                                    </>
                                ) : (
                                    <>
                                        <UserPlus className="w-5 h-5" />
                                        Crear Cuenta Gratis
                                    </>
                                )}
                            </motion.button>
                        </form>

                        {/* Link a login */}
                        <div className="mt-6 text-center">
                            <p className="text-slate-400 text-sm">
                                ¿Ya tienes cuenta?{' '}
                                <Link
                                    to="/login"
                                    className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors"
                                >
                                    Inicia sesión
                                </Link>
                            </p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </AnimatedPage>
    );
};

export default Register;
