/**
 * ============================================================================
 * 💳 PÁGINA: PricingPage (Planes y Precios)
 * ============================================================================
 * 
 * PROPÓSITO:
 * Muestra los planes de suscripción y packs de créditos disponibles.
 * Integración con Stripe para procesamiento de pagos.
 * 
 * OPCIONES DE PAGO:
 * - Suscripciones mensuales (Básico, Pro, Enterprise)
 * - Packs únicos de créditos (10, 50, 200)
 * 
 * ============================================================================
 * 📁 UBICACIÓN: src/pages/PricingPage.jsx
 * 🔗 RUTA: /precios
 * ============================================================================
 */

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    Check, Zap, Crown, Building2, Sparkles,
    CreditCard, ArrowRight, Star, Shield,
    Infinity as InfinityIcon, Package
} from 'lucide-react';
import AnimatedPage from '../components/layout/AnimatedPage';
import SEO from '../components/SEO';
import { useAuth } from '../context/AuthContext';

// Configuración de Stripe (modo test)
const STRIPE_CHECKOUT_URL = import.meta.env.VITE_STRIPE_CHECKOUT_WEBHOOK;

const PricingPage = () => {
    const [billingType, setBillingType] = useState('subscription'); // 'subscription' | 'credits'
    const [isProcessing, setIsProcessing] = useState(false);
    const { isAuthenticated, user } = useAuth();

    // Planes de suscripción
    const subscriptionPlans = [
        {
            id: 'basic',
            name: 'Básico',
            price: 9.99,
            credits: 50,
            period: 'mes',
            description: 'Perfecto para empezar',
            icon: Zap,
            color: 'blue',
            features: [
                '50 análisis/mes',
                'Resultados en Dashboard',
                'Soporte por email',
                'Historial 30 días'
            ],
            popular: false
        },
        {
            id: 'pro',
            name: 'Pro',
            price: 29.99,
            credits: 200,
            period: 'mes',
            description: 'Para profesionales',
            icon: Crown,
            color: 'purple',
            features: [
                '200 análisis/mes',
                'Exportar a PDF',
                'API Access',
                'Soporte prioritario',
                'Historial ilimitado'
            ],
            popular: true
        },
        {
            id: 'enterprise',
            name: 'Enterprise',
            price: 99.99,
            credits: -1, // Ilimitado
            period: 'mes',
            description: 'Para grandes equipos',
            icon: Building2,
            color: 'amber',
            // URL directa de Stripe Checkout (modo test)
            stripeUrl: 'https://buy.stripe.com/test_7sYeVc3N586IgB0e471ZS01',
            features: [
                'Análisis ilimitados',
                'Todas las funciones Pro',
                'Webhooks personalizados',
                'Soporte dedicado 24/7',
                'SLA garantizado',
                'Onboarding personalizado'
            ],
            popular: false
        }
    ];

    // Packs de créditos únicos
    const creditPacks = [
        {
            id: 'pack_10',
            name: 'Pack Starter',
            credits: 10,
            price: 4.99,
            pricePerCredit: 0.50,
            icon: Package,
            color: 'emerald',
            badge: null
        },
        {
            id: 'pack_50',
            name: 'Pack Business',
            credits: 50,
            price: 19.99,
            pricePerCredit: 0.40,
            icon: Package,
            color: 'blue',
            badge: '20% OFF'
        },
        {
            id: 'pack_200',
            name: 'Pack Pro',
            credits: 200,
            price: 59.99,
            pricePerCredit: 0.30,
            icon: Package,
            color: 'purple',
            badge: '40% OFF'
        }
    ];

    const handlePurchase = async (planId, type, stripeUrl = null) => {
        // Si hay una URL directa de Stripe, redirigir inmediatamente
        if (stripeUrl) {
            window.location.href = stripeUrl;
            return;
        }

        if (!isAuthenticated) {
            window.location.href = '/#/login';
            return;
        }

        setIsProcessing(true);

        try {
            if (STRIPE_CHECKOUT_URL) {
                // Enviar a n8n para crear sesión de Stripe
                const response = await fetch(STRIPE_CHECKOUT_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        planId,
                        type, // 'subscription' o 'credits'
                        userEmail: user?.email,
                        userId: user?.id,
                        timestamp: new Date().toISOString()
                    })
                });

                const data = await response.json();

                if (data.checkoutUrl) {
                    // Redirigir a Stripe Checkout
                    window.location.href = data.checkoutUrl;
                } else {
                    alert('Error al procesar el pago. Intenta de nuevo.');
                }
            } else {
                // Modo demo
                alert(`🎉 Demo: Comprando ${planId}\n\nConfigura VITE_STRIPE_CHECKOUT_WEBHOOK para activar pagos reales.`);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error al conectar con el servidor de pagos.');
        } finally {
            setIsProcessing(false);
        }
    };

    const colorClasses = {
        blue: {
            bg: 'bg-blue-500/10',
            border: 'border-blue-500/30',
            text: 'text-blue-400',
            button: 'from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600',
            shadow: 'shadow-blue-500/20'
        },
        purple: {
            bg: 'bg-purple-500/10',
            border: 'border-purple-500/30',
            text: 'text-purple-400',
            button: 'from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600',
            shadow: 'shadow-purple-500/20'
        },
        amber: {
            bg: 'bg-amber-500/10',
            border: 'border-amber-500/30',
            text: 'text-amber-400',
            button: 'from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600',
            shadow: 'shadow-amber-500/20'
        },
        emerald: {
            bg: 'bg-emerald-500/10',
            border: 'border-emerald-500/30',
            text: 'text-emerald-400',
            button: 'from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600',
            shadow: 'shadow-emerald-500/20'
        }
    };

    return (
        <AnimatedPage>
            <SEO
                title="Precios - Planes y Créditos"
                description="Elige el plan perfecto para tu negocio. Suscripciones mensuales o packs de créditos únicos."
            />

            <div className="min-h-screen bg-slate-950 pt-24 pb-20">
                {/* Header */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/30 rounded-full px-4 py-2 mb-6"
                        >
                            <Sparkles className="w-4 h-4 text-purple-400" />
                            <span className="text-purple-400 text-sm font-medium">Precios transparentes</span>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-4xl md:text-5xl font-bold text-white mb-4"
                        >
                            Elige tu plan
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-lg text-slate-400 max-w-2xl mx-auto"
                        >
                            Comienza con suscripción mensual o compra créditos cuando los necesites
                        </motion.p>
                    </div>

                    {/* Toggle Suscripción / Créditos */}
                    <div className="flex justify-center mb-12">
                        <div className="bg-slate-900/50 border border-white/10 rounded-xl p-1 inline-flex">
                            <button
                                onClick={() => setBillingType('subscription')}
                                className={`px-6 py-3 rounded-lg font-medium text-sm transition-all ${billingType === 'subscription'
                                    ? 'bg-purple-600 text-white shadow-lg'
                                    : 'text-slate-400 hover:text-white'
                                    }`}
                            >
                                📅 Suscripción Mensual
                            </button>
                            <button
                                onClick={() => setBillingType('credits')}
                                className={`px-6 py-3 rounded-lg font-medium text-sm transition-all ${billingType === 'credits'
                                    ? 'bg-purple-600 text-white shadow-lg'
                                    : 'text-slate-400 hover:text-white'
                                    }`}
                            >
                                💰 Packs de Créditos
                            </button>
                        </div>
                    </div>

                    {/* Planes de Suscripción */}
                    {billingType === 'subscription' && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto items-stretch"
                        >
                            {subscriptionPlans.map((plan, index) => {
                                const colors = colorClasses[plan.color];
                                const Icon = plan.icon;

                                return (
                                    <motion.div
                                        key={plan.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        className={`relative bg-slate-900/50 border rounded-2xl p-6 flex flex-col ${plan.popular
                                            ? 'border-purple-500/50 ring-2 ring-purple-500/20'
                                            : 'border-white/10'
                                            }`}
                                    >
                                        {plan.popular && (
                                            <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                                                <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-bold px-4 py-1 rounded-full flex items-center gap-1">
                                                    <Star className="w-3 h-3" /> MÁS POPULAR
                                                </div>
                                            </div>
                                        )}

                                        <div className={`w-12 h-12 ${colors.bg} ${colors.border} border rounded-xl flex items-center justify-center mb-4`}>
                                            <Icon className={`w-6 h-6 ${colors.text}`} />
                                        </div>

                                        <h3 className="text-xl font-bold text-white mb-1">{plan.name}</h3>
                                        <p className="text-slate-400 text-sm mb-4">{plan.description}</p>

                                        <div className="mb-6">
                                            <span className="text-4xl font-bold text-white">€{plan.price}</span>
                                            <span className="text-slate-400">/{plan.period}</span>
                                        </div>

                                        <div className="flex items-center gap-2 mb-6 text-sm">
                                            {plan.credits === -1 ? (
                                                <span className={`${colors.text} font-medium flex items-center gap-1`}>
                                                    <InfinityIcon className="w-4 h-4" /> Análisis ilimitados
                                                </span>
                                            ) : (
                                                <span className={`${colors.text} font-medium`}>
                                                    {plan.credits} análisis/mes
                                                </span>
                                            )}
                                        </div>

                                        {/* flex-grow para empujar el botón hacia abajo */}
                                        <ul className="space-y-3 mb-6 flex-grow">
                                            {plan.features.map((feature, i) => (
                                                <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                                                    <Check className={`w-4 h-4 ${colors.text} flex-shrink-0 mt-0.5`} />
                                                    {feature}
                                                </li>
                                            ))}
                                        </ul>

                                        {/* Botón siempre al fondo */}
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => handlePurchase(plan.id, 'subscription', plan.stripeUrl)}
                                            disabled={isProcessing}
                                            className={`w-full py-3 rounded-xl font-bold text-white bg-gradient-to-r ${colors.button} shadow-lg ${colors.shadow} flex items-center justify-center gap-2 transition-all mt-auto`}
                                        >
                                            {isProcessing ? (
                                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            ) : (
                                                <>
                                                    Empezar ahora
                                                    <ArrowRight className="w-4 h-4" />
                                                </>
                                            )}
                                        </motion.button>
                                    </motion.div>
                                );
                            })}
                        </motion.div>
                    )}

                    {/* Packs de Créditos */}
                    {billingType === 'credits' && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto"
                        >
                            {creditPacks.map((pack, index) => {
                                const colors = colorClasses[pack.color];
                                const Icon = pack.icon;

                                return (
                                    <motion.div
                                        key={pack.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        className="relative bg-slate-900/50 border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all"
                                    >
                                        {pack.badge && (
                                            <div className="absolute -top-3 right-4">
                                                <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                                                    {pack.badge}
                                                </div>
                                            </div>
                                        )}

                                        <div className={`w-12 h-12 ${colors.bg} ${colors.border} border rounded-xl flex items-center justify-center mb-4`}>
                                            <Icon className={`w-6 h-6 ${colors.text}`} />
                                        </div>

                                        <h3 className="text-xl font-bold text-white mb-1">{pack.name}</h3>
                                        <p className={`${colors.text} text-sm font-medium mb-4`}>
                                            {pack.credits} créditos
                                        </p>

                                        <div className="mb-4">
                                            <span className="text-4xl font-bold text-white">€{pack.price}</span>
                                            <span className="text-slate-400 text-sm ml-2">pago único</span>
                                        </div>

                                        <p className="text-slate-400 text-sm mb-6">
                                            €{pack.pricePerCredit.toFixed(2)} por análisis
                                        </p>

                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => handlePurchase(pack.id, 'credits')}
                                            disabled={isProcessing}
                                            className={`w-full py-3 rounded-xl font-bold text-white bg-gradient-to-r ${colors.button} shadow-lg ${colors.shadow} flex items-center justify-center gap-2 transition-all`}
                                        >
                                            {isProcessing ? (
                                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            ) : (
                                                <>
                                                    <CreditCard className="w-4 h-4" />
                                                    Comprar
                                                </>
                                            )}
                                        </motion.button>
                                    </motion.div>
                                );
                            })}
                        </motion.div>
                    )}

                    {/* Garantías */}
                    <div className="mt-16 text-center">
                        <div className="inline-flex items-center gap-6 text-slate-400 text-sm">
                            <span className="flex items-center gap-2">
                                <Shield className="w-4 h-4" />
                                Pago seguro con Stripe
                            </span>
                            <span className="flex items-center gap-2">
                                <Check className="w-4 h-4" />
                                Cancela cuando quieras
                            </span>
                            <span className="flex items-center gap-2">
                                <Sparkles className="w-4 h-4" />
                                Soporte incluido
                            </span>
                        </div>
                    </div>

                    {/* CTA */}
                    <div className="mt-12 text-center">
                        <p className="text-slate-500 text-sm mb-4">¿Tienes preguntas sobre los planes?</p>
                        <Link
                            to="/contacto"
                            className="text-purple-400 hover:text-purple-300 font-medium transition-colors"
                        >
                            Contáctanos →
                        </Link>
                    </div>
                </div>
            </div>
        </AnimatedPage>
    );
};

export default PricingPage;
