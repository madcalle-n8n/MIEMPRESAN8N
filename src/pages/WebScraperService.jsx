/**
 * ============================================================================
 * 🔍 SERVICIO: WebScraperService (Scraping con IA)
 * ============================================================================
 * 
 * PROPÓSITO:
 * Panel de análisis web con IA. Permite a los usuarios ingresar cualquier URL
 * y obtener un resumen estructurado de la información para captación de clientes.
 * 
 * FUNCIONALIDADES:
 * - Input de URL para analizar
 * - Terminal de logs en tiempo real
 * - Feed de resultados con tarjetas
 * - Sistema de créditos integrado
 * - Diferentes formatos de salida (Dashboard, PDF, Link)
 * 
 * INTEGRACIÓN:
 * - Webhook n8n para procesamiento
 * - AuthContext para validación de créditos
 * 
 * ============================================================================
 * 📁 UBICACIÓN: src/pages/WebScraperService.jsx
 * 🔗 RUTA: /crm/scraper
 * ============================================================================
 */

import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Play, Database, FileText, Link as LinkIcon, Activity,
    Globe, Zap, Search, Layout, FileOutput, Terminal,
    ChevronRight, Clock, ArrowRight, AlertCircle, ArrowLeft,
    Coins, CreditCard, Sparkles
} from 'lucide-react';
import AnimatedPage from '../components/layout/AnimatedPage';
import SEO from '../components/SEO';
import { useAuth } from '../context/AuthContext';

// ============================================================================
// 🔗 CONFIGURACIÓN DE WEBHOOK
// ============================================================================
const SCRAPER_WEBHOOK_URL = import.meta.env.VITE_SCRAPER_WEBHOOK_URL;

const WebScraperService = () => {
    const [urlInput, setUrlInput] = useState('');
    const [isScanning, setIsScanning] = useState(false);
    const [results, setResults] = useState([]);
    const [logs, setLogs] = useState([]);
    const [outputFormat, setOutputFormat] = useState('dashboard');
    const scrollRef = useRef(null);

    const { user, updateCredits, accessToken } = useAuth();
    const userCredits = user?.credits || 0;

    // Auto-scroll logs
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [logs]);

    const addLog = (msg) => {
        const timestamp = new Date().toLocaleTimeString('es-ES');
        setLogs(prev => [...prev, `[${timestamp}] ${msg}`]);
    };

    const handleScrape = async () => {
        if (!urlInput || isScanning) return;

        // Verificar créditos
        if (userCredits <= 0) {
            addLog(`❌ Sin créditos disponibles. Compra más para continuar.`);
            return;
        }

        setIsScanning(true);
        addLog(`🚀 Iniciando análisis para: ${urlInput}`);

        const tempId = Date.now();
        const tempResult = {
            id: tempId,
            url: urlInput,
            type: 'Unknown',
            summary: 'Procesando...',
            extractedData: {},
            timeSaved: 'Calculando...',
            status: 'processing',
            timestamp: new Date().toLocaleTimeString('es-ES')
        };

        setResults(prev => [tempResult, ...prev]);

        try {
            addLog(`📡 Conectando con servidor de IA...`);

            let data;

            if (SCRAPER_WEBHOOK_URL) {
                // Conexión real con n8n
                const response = await fetch(SCRAPER_WEBHOOK_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${accessToken}`
                    },
                    body: JSON.stringify({
                        url: urlInput,
                        format: outputFormat,
                        userId: user?.id,
                        userEmail: user?.email,
                        timestamp: new Date().toISOString()
                    })
                });

                if (!response.ok) {
                    throw new Error('Error en la respuesta del servidor');
                }

                data = await response.json();
            } else {
                // MODO DEMO: Simulación sin n8n
                await new Promise(r => setTimeout(r, 2500));

                const isShop = urlInput.includes('shop') || urlInput.includes('tienda') || urlInput.includes('store');
                const isArticle = urlInput.includes('blog') || urlInput.includes('article') || urlInput.includes('news');

                data = {
                    type: isShop ? 'Product' : isArticle ? 'Article' : 'Business',
                    summary: isShop
                        ? 'E-commerce detectado. Se encontraron múltiples productos con precios competitivos. Oportunidad de partnership o comparación de precios.'
                        : isArticle
                            ? 'Artículo informativo. Contenido de alta calidad sobre tendencias del sector. Posible lead de content marketing.'
                            : 'Sitio empresarial B2B. Se detectó propuesta de valor clara, formulario de contacto y testimonios. Alto potencial de prospección.',
                    extractedData: {
                        contacts: Math.floor(Math.random() * 5) + 1,
                        sentiment: 'Positivo (8/10)',
                        keyPoints: [
                            'Propuesta de valor clara',
                            'Formulario de contacto activo',
                            'Presencia en redes sociales'
                        ],
                        price: isShop ? '€49.99 - €299.99' : null
                    },
                    timeSaved: `${Math.floor(Math.random() * 20) + 10} min`
                };
            }

            addLog(`✅ Respuesta recibida de IA.`);
            addLog(`🧠 Estructurando datos...`);

            // Actualizar resultado
            setResults(prev => prev.map(res => {
                if (res.id === tempId) {
                    return {
                        ...res,
                        status: 'completed',
                        type: data.type,
                        summary: data.summary,
                        extractedData: data.extractedData,
                        timeSaved: data.timeSaved
                    };
                }
                return res;
            }));

            // Descontar crédito
            const newCredits = userCredits - 1;
            updateCredits(newCredits);
            addLog(`💰 Crédito consumido. Restantes: ${newCredits}`);
            addLog(`✨ Análisis completado con éxito.`);

        } catch (error) {
            addLog(`❌ Error: ${error.message}`);
            setResults(prev => prev.map(res => {
                if (res.id === tempId) {
                    return { ...res, status: 'error', summary: 'Error al procesar la URL.' };
                }
                return res;
            }));
        } finally {
            setIsScanning(false);
            setUrlInput('');
        }
    };

    const getTypeIcon = (type, status) => {
        if (status === 'processing') return <Activity className="w-5 h-5 animate-spin" />;
        if (status === 'error') return <AlertCircle className="w-5 h-5 text-red-500" />;

        switch (type) {
            case 'Business': return <Layout className="w-5 h-5" />;
            case 'Product': return <FileOutput className="w-5 h-5" />;
            case 'Article': return <FileText className="w-5 h-5" />;
            default: return <Globe className="w-5 h-5" />;
        }
    };

    const getTypeColor = (type) => {
        switch (type) {
            case 'Business': return 'bg-blue-500/20 text-blue-400';
            case 'Product': return 'bg-emerald-500/20 text-emerald-400';
            case 'Article': return 'bg-amber-500/20 text-amber-400';
            default: return 'bg-slate-500/20 text-slate-400';
        }
    };

    return (
        <AnimatedPage>
            <SEO
                title="Web Scraper AI - Análisis Web"
                description="Analiza cualquier URL con inteligencia artificial y obtén información estructurada para captación de clientes."
            />

            <div className="min-h-screen bg-slate-950 text-slate-100 pt-20 pb-10">
                {/* Header */}
                <header className="bg-slate-900/50 border-b border-white/10 backdrop-blur-xl sticky top-20 z-30">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-center h-16">
                            <div className="flex items-center gap-4">
                                <Link
                                    to="/crm"
                                    className="text-slate-400 hover:text-white transition-colors"
                                >
                                    <ArrowLeft className="w-5 h-5" />
                                </Link>
                                <div className="flex items-center">
                                    <div className="w-10 h-10 bg-gradient-to-tr from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mr-3 shadow-lg shadow-purple-500/20">
                                        <Zap className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <h1 className="text-xl font-bold text-white">Universal Web AI</h1>
                                        <p className="text-xs text-slate-400 flex items-center gap-1">
                                            <Sparkles className="w-3 h-3" /> Análisis Inteligente
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Créditos */}
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2 px-4 py-2 bg-slate-900 rounded-full border border-white/10">
                                    <Coins className={`w-4 h-4 ${userCredits > 0 ? 'text-amber-400' : 'text-red-400'}`} />
                                    <span className="text-sm font-mono">
                                        <span className={userCredits > 0 ? 'text-amber-400' : 'text-red-400'}>
                                            {userCredits}
                                        </span>
                                        <span className="text-slate-500"> créditos</span>
                                    </span>
                                </div>
                                <Link
                                    to="/precios"
                                    className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-sm font-medium transition-colors"
                                >
                                    <CreditCard className="w-4 h-4" />
                                    Comprar
                                </Link>
                                <div className="flex items-center gap-2 px-4 py-2 bg-slate-900 rounded-full border border-slate-800">
                                    <div className={`w-2 h-2 rounded-full ${isScanning ? 'bg-purple-500 animate-pulse' : 'bg-emerald-500'}`}></div>
                                    <span className="text-xs font-mono text-slate-300">
                                        {isScanning ? 'PROCESANDO...' : 'LISTO'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* Columna Izquierda: Input y Configuración */}
                    <div className="lg:col-span-4 space-y-6">
                        <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 shadow-2xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-600/10 rounded-full blur-3xl group-hover:bg-purple-600/20 transition-all"></div>

                            <h2 className="text-lg font-semibold mb-6 flex items-center gap-2 relative z-10">
                                <Search className="w-5 h-5 text-purple-400" /> Nueva Búsqueda
                            </h2>

                            <div className="space-y-4 relative z-10">
                                <div>
                                    <label className="block text-xs font-medium text-slate-400 mb-2 uppercase tracking-wider">
                                        URL a Analizar
                                    </label>
                                    <div className="relative">
                                        <Globe className="absolute left-3 top-3.5 w-5 h-5 text-slate-500" />
                                        <input
                                            type="text"
                                            placeholder="https://ejemplo.com"
                                            className="w-full bg-slate-950 border border-slate-700 rounded-xl py-3 pl-10 pr-4 focus:ring-2 focus:ring-purple-500 outline-none transition-all text-sm placeholder:text-slate-600"
                                            value={urlInput}
                                            onChange={(e) => setUrlInput(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && handleScrape()}
                                            disabled={isScanning || userCredits <= 0}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-slate-400 mb-2 uppercase tracking-wider">
                                        Formato de Salida
                                    </label>
                                    <div className="grid grid-cols-3 gap-2">
                                        {[
                                            { id: 'dashboard', icon: Layout, label: 'Dash' },
                                            { id: 'pdf', icon: FileText, label: 'PDF' },
                                            { id: 'link', icon: LinkIcon, label: 'Link' }
                                        ].map((format) => (
                                            <button
                                                key={format.id}
                                                onClick={() => setOutputFormat(format.id)}
                                                className={`p-2 rounded-lg border text-xs flex flex-col items-center gap-1 transition-all ${outputFormat === format.id
                                                        ? 'bg-purple-500/10 border-purple-500 text-purple-300'
                                                        : 'border-slate-800 hover:border-slate-700 text-slate-500'
                                                    }`}
                                            >
                                                <format.icon className="w-4 h-4" />
                                                {format.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {userCredits <= 0 ? (
                                    <Link
                                        to="/precios"
                                        className="w-full py-4 rounded-xl font-bold text-sm uppercase tracking-wide flex items-center justify-center gap-2 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white shadow-lg shadow-amber-900/30 transition-all"
                                    >
                                        <CreditCard className="w-5 h-5" />
                                        Comprar Créditos
                                    </Link>
                                ) : (
                                    <motion.button
                                        onClick={handleScrape}
                                        disabled={isScanning || !urlInput}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className={`w-full py-4 rounded-xl font-bold text-sm uppercase tracking-wide flex items-center justify-center gap-2 transition-all shadow-lg ${isScanning
                                                ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                                                : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-purple-900/30'
                                            }`}
                                    >
                                        {isScanning ? (
                                            <Activity className="animate-spin w-5 h-5" />
                                        ) : (
                                            <Play className="w-5 h-5 fill-current" />
                                        )}
                                        {isScanning ? 'Analizando...' : 'Extraer Información'}
                                    </motion.button>
                                )}
                            </div>
                        </div>

                        {/* Terminal / Logs */}
                        <div className="bg-black rounded-xl p-4 border border-slate-800 shadow-inner font-mono text-xs h-64 flex flex-col opacity-90">
                            <div className="flex items-center justify-between text-slate-500 mb-2 border-b border-slate-800 pb-2">
                                <span className="flex items-center gap-2">
                                    <Terminal className="w-3 h-3" /> System Logs
                                </span>
                                <span className="text-[10px] bg-slate-900 px-2 py-0.5 rounded">v2.1.0</span>
                            </div>
                            <div className="flex-1 overflow-y-auto space-y-1 scrollbar-thin scrollbar-thumb-slate-700" ref={scrollRef}>
                                {logs.length === 0 && (
                                    <span className="text-slate-700 italic">Esperando acción...</span>
                                )}
                                {logs.map((log, i) => (
                                    <div key={i} className="text-purple-300 animate-fade-in font-light">
                                        <span className="text-slate-600 mr-2">{`>>`}</span> {log}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Columna Derecha: Feed de Resultados */}
                    <div className="lg:col-span-8 space-y-4">
                        <div className="flex justify-between items-center mb-2">
                            <h2 className="text-lg font-bold flex items-center gap-2">
                                <Database className="w-5 h-5 text-pink-500" /> Live Feed
                            </h2>
                            <div className="text-xs text-slate-500 bg-slate-900 px-3 py-1 rounded-full border border-slate-800">
                                Total Sesión: <span className="text-purple-400 font-bold">{results.length}</span>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <AnimatePresence>
                                {results.length === 0 ? (
                                    <div className="h-[400px] border-2 border-dashed border-slate-800 rounded-2xl flex flex-col items-center justify-center text-slate-600 gap-4">
                                        <div className="w-16 h-16 bg-slate-900 rounded-full flex items-center justify-center">
                                            <Globe className="w-8 h-8 opacity-50" />
                                        </div>
                                        <div className="text-center">
                                            <p className="font-medium text-lg">Esperando Datos...</p>
                                            <p className="text-sm opacity-60 max-w-xs mt-2 mx-auto">
                                                Ingresa una URL para empezar a recibir inteligencia web.
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    results.map((res) => (
                                        <motion.div
                                            key={res.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className={`bg-slate-900 border ${res.status === 'error' ? 'border-red-900/50' : 'border-slate-800'
                                                } rounded-xl p-5 hover:border-purple-500/50 transition-all group relative overflow-hidden`}
                                        >
                                            {res.status === 'completed' && (
                                                <div className="absolute top-0 right-0 bg-emerald-500/10 text-emerald-400 text-[10px] font-bold px-3 py-1 rounded-bl-xl border-l border-b border-emerald-500/20 flex items-center gap-1">
                                                    <Clock className="w-3 h-3" /> AHORRO: {res.timeSaved}
                                                </div>
                                            )}

                                            <div className="flex justify-between items-start mb-3">
                                                <div className="flex items-center gap-3">
                                                    <div className={`p-2 rounded-lg ${getTypeColor(res.type)}`}>
                                                        {getTypeIcon(res.type, res.status)}
                                                    </div>
                                                    <div>
                                                        <h3 className="font-bold text-slate-200 flex items-center gap-2">
                                                            {res.url}
                                                            {res.status === 'completed' && <ArrowRight className="w-3 h-3 text-slate-600" />}
                                                        </h3>
                                                        <p className="text-xs text-slate-500 flex items-center gap-2">
                                                            {res.timestamp} • Status:
                                                            <span className={
                                                                res.status === 'completed' ? 'text-emerald-400' :
                                                                    res.status === 'error' ? 'text-red-400' : 'text-amber-400'
                                                            }>
                                                                {res.status.toUpperCase()}
                                                            </span>
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="bg-slate-950/50 rounded-lg p-3 mb-3 border border-slate-800/50">
                                                <p className="text-sm text-slate-300 leading-relaxed">
                                                    {res.status === 'processing' ? (
                                                        <span className="animate-pulse text-slate-500">Procesando con IA...</span>
                                                    ) : (
                                                        <>
                                                            <span className="text-purple-400 font-mono text-xs mr-2">AI_INSIGHT:</span>
                                                            {res.summary}
                                                        </>
                                                    )}
                                                </p>
                                            </div>

                                            {res.status === 'completed' && res.extractedData && (
                                                <div className="flex gap-4 text-xs text-slate-400 font-mono items-center border-t border-slate-800/50 pt-3 mt-3">
                                                    <div className="flex items-center gap-1 bg-slate-800/50 px-2 py-1 rounded">
                                                        <span className="text-slate-500">CONTACTS:</span>
                                                        <span className="text-slate-200">{res.extractedData.contacts || 0}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1 bg-slate-800/50 px-2 py-1 rounded">
                                                        <span className="text-slate-500">SENTIMENT:</span>
                                                        <span className="text-emerald-400">{res.extractedData.sentiment}</span>
                                                    </div>
                                                    <div className="flex-grow"></div>
                                                    <button className="text-purple-400 hover:text-purple-300 flex items-center gap-1 transition-colors">
                                                        Ver reporte completo <ChevronRight className="w-3 h-3" />
                                                    </button>
                                                </div>
                                            )}
                                        </motion.div>
                                    ))
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </main>

                {/* Estilos de animación */}
                <style>{`
                    @keyframes fade-in { 
                        from { opacity: 0; transform: translateY(5px); } 
                        to { opacity: 1; transform: translateY(0); } 
                    }
                    .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
                `}</style>
            </div>
        </AnimatedPage>
    );
};

export default WebScraperService;
