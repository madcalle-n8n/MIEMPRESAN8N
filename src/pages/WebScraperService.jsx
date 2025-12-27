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
    Coins, CreditCard, Sparkles, Trash2, Download
} from 'lucide-react';
import AnimatedPage from '../components/layout/AnimatedPage';
import SEO from '../components/SEO';
import { useAuth } from '../context/AuthContext';

// ============================================================================
// 🔗 CONFIGURACIÓN DE WEBHOOKS
// ============================================================================
const SCRAPER_WEBHOOK_URL = import.meta.env.VITE_SCRAPER_WEBHOOK_URL;
const PDF_WEBHOOK_URL = import.meta.env.VITE_PDF_WEBHOOK_URL;


const WebScraperService = () => {
    const [urlInput, setUrlInput] = useState('');
    const [isScanning, setIsScanning] = useState(false);
    const [results, setResults] = useState(() => {
        // Cargar resultados guardados de sessionStorage al iniciar
        try {
            const saved = sessionStorage.getItem('scraperResults');
            return saved ? JSON.parse(saved) : [];
        } catch {
            return [];
        }
    });
    const [logs, setLogs] = useState([]);
    const [selectedResult, setSelectedResult] = useState(null); // Para modal de reporte
    const [showModal, setShowModal] = useState(false);
    const scrollRef = useRef(null);

    const { user, updateCredits } = useAuth();
    const userCredits = user?.credits || 0;

    // Guardar resultados en sessionStorage cuando cambien
    useEffect(() => {
        if (results.length > 0) {
            try {
                sessionStorage.setItem('scraperResults', JSON.stringify(results));
            } catch (e) {
                console.warn('No se pudo guardar en sessionStorage:', e);
            }
        }
    }, [results]);

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

            // Debug: mostrar la URL del webhook
            console.log('🔗 Webhook URL:', SCRAPER_WEBHOOK_URL);
            addLog(`🔗 Webhook configurado: ${SCRAPER_WEBHOOK_URL ? 'Sí' : 'No (modo demo)'}`);

            let data;

            if (SCRAPER_WEBHOOK_URL) {
                // Log de datos a enviar
                const requestBody = {
                    url: urlInput,
                    userId: user?.id,
                    userEmail: user?.email,
                    timestamp: new Date().toISOString()
                };
                console.log('📤 Enviando datos:', requestBody);
                addLog(`📤 Enviando: ${urlInput}`);

                // Conexión real con n8n
                const response = await fetch(SCRAPER_WEBHOOK_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(requestBody)
                });

                console.log('📥 Response status:', response.status);
                addLog(`📥 Respuesta: HTTP ${response.status}`);

                if (!response.ok) {
                    const errorText = await response.text();
                    console.error('❌ Error response:', errorText);
                    throw new Error(`Error HTTP ${response.status}: ${errorText}`);
                }

                const rawData = await response.json();
                console.log('✅ Respuesta RAW de n8n:', rawData);
                addLog(`📦 Datos recibidos, procesando formato...`);

                // Normalizar la respuesta de n8n (puede venir en diferentes formatos)
                // n8n a veces devuelve { message: "..." } o { output: "..." } o datos directos
                if (rawData.type && rawData.summary) {
                    // Formato esperado directamente
                    data = rawData;
                } else if (rawData.output) {
                    // n8n devuelve en campo output
                    data = typeof rawData.output === 'string'
                        ? { type: 'Business', summary: rawData.output, extractedData: {}, timeSaved: 'N/A' }
                        : rawData.output;
                } else if (rawData.message) {
                    // n8n devuelve mensaje simple
                    data = { type: 'Info', summary: rawData.message, extractedData: {}, timeSaved: 'N/A' };
                } else if (rawData.summary || rawData.resumen || rawData.result || rawData.data) {
                    // Otros formatos comunes
                    data = {
                        type: rawData.type || rawData.tipo || 'Business',
                        summary: rawData.summary || rawData.resumen || rawData.result || JSON.stringify(rawData.data),
                        extractedData: rawData.extractedData || rawData.datos || {},
                        timeSaved: rawData.timeSaved || 'Calculado'
                    };
                } else {
                    // Si es un objeto, intentar mostrar todo como resumen
                    console.log('⚠️ Formato no reconocido, usando respuesta completa');
                    data = {
                        type: 'Respuesta n8n',
                        summary: JSON.stringify(rawData, null, 2),
                        extractedData: rawData,
                        timeSaved: 'N/A'
                    };
                }

                console.log('✅ Data normalizada:', data);
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

            // Calcular tiempo de ahorro estimado basado en la longitud del contenido
            const calculateTimeSaved = (summary) => {
                if (!summary) return '~2 min';
                const length = summary.length;
                if (length > 1000) return '~8-10 min';
                if (length > 500) return '~5-7 min';
                if (length > 200) return '~3-5 min';
                return '~2-3 min';
            };

            // Actualizar resultado con datos y respuesta raw
            setResults(prev => prev.map(res => {
                if (res.id === tempId) {
                    const estimatedTime = data.timeSaved || calculateTimeSaved(data.summary);
                    return {
                        ...res,
                        status: 'completed',
                        type: data.type || 'Info',
                        summary: data.summary || 'Sin resumen disponible',
                        extractedData: data.extractedData || {},
                        timeSaved: estimatedTime,
                        rawResponse: data // Guardar respuesta completa para el modal
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
                            <div className="flex items-center gap-3">
                                {results.length > 0 && (
                                    <button
                                        onClick={() => {
                                            if (window.confirm('¿Limpiar todo el historial de resultados?')) {
                                                setResults([]);
                                                sessionStorage.removeItem('scraperResults');
                                                addLog('🗑️ Historial limpiado');
                                            }
                                        }}
                                        className="flex items-center gap-1 text-xs text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 px-3 py-1.5 rounded-lg border border-red-500/30 transition-all"
                                    >
                                        <Trash2 className="w-3 h-3" />
                                        Limpiar
                                    </button>
                                )}
                                <div className="text-xs text-slate-500 bg-slate-900 px-3 py-1 rounded-full border border-slate-800">
                                    Total Sesión: <span className="text-purple-400 font-bold">{results.length}</span>
                                </div>
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
                                                    <button
                                                        onClick={async () => {
                                                            if (!PDF_WEBHOOK_URL) {
                                                                alert('📄 Configura VITE_PDF_WEBHOOK_URL en tu .env para habilitar la descarga de PDF');
                                                                return;
                                                            }

                                                            addLog(`📄 Generando PDF para ${res.url}...`);

                                                            try {
                                                                const response = await fetch(PDF_WEBHOOK_URL, {
                                                                    method: 'POST',
                                                                    headers: { 'Content-Type': 'application/json' },
                                                                    body: JSON.stringify({
                                                                        url: res.url,
                                                                        type: res.type,
                                                                        summary: res.summary,
                                                                        extractedData: res.extractedData,
                                                                        timeSaved: res.timeSaved,
                                                                        generatedAt: new Date().toISOString()
                                                                    })
                                                                });

                                                                const responseText = await response.text();
                                                                console.log('📄 Respuesta RAW de n8n:', responseText);

                                                                // Intentar parsear como JSON, si falla tratar como texto/URL
                                                                let data;
                                                                try {
                                                                    data = JSON.parse(responseText);
                                                                } catch {
                                                                    data = responseText.trim();
                                                                }

                                                                // Si la respuesta es una URL directa (string)
                                                                if (typeof data === 'string' && data.startsWith('http')) {
                                                                    window.open(data, '_blank');
                                                                    addLog(`✅ PDF abierto: ${data.substring(0, 50)}...`);
                                                                    return;
                                                                }

                                                                // Soportar múltiples formatos de respuesta JSON
                                                                const pdfData = data.pdf || data.base64 || data.file || data.data;
                                                                const downloadUrl = data.downloadUrl || data.url || data.link || data.pdfUrl;
                                                                const filename = data.filename || data.name || `reporte_${Date.now()}.pdf`;

                                                                if (pdfData) {
                                                                    // Descargar desde base64
                                                                    const link = document.createElement('a');
                                                                    link.href = `data:application/pdf;base64,${pdfData}`;
                                                                    link.download = filename;
                                                                    link.click();
                                                                    addLog(`✅ PDF descargado: ${filename}`);
                                                                } else if (downloadUrl) {
                                                                    // Abrir URL de descarga
                                                                    window.open(downloadUrl, '_blank');
                                                                    addLog(`✅ PDF abierto en nueva pestaña`);
                                                                } else {
                                                                    // Mostrar qué recibimos
                                                                    console.log('Respuesta completa:', data);
                                                                    addLog(`⚠️ Respuesta recibida. Revisa consola.`);
                                                                    alert(`n8n respondió pero no se detectó un PDF.\n\nRevisa la consola (F12).`);
                                                                }
                                                            } catch (error) {
                                                                console.error('Error PDF:', error);
                                                                addLog(`❌ Error al generar PDF: ${error.message}`);
                                                                alert('Error al generar el PDF. Revisa la consola.');
                                                            }
                                                        }}
                                                        className="text-emerald-400 hover:text-emerald-300 flex items-center gap-1 transition-colors"
                                                    >
                                                        <Download className="w-3 h-3" /> PDF
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setSelectedResult(res);
                                                            setShowModal(true);
                                                        }}
                                                        className="text-purple-400 hover:text-purple-300 flex items-center gap-1 transition-colors"
                                                    >
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

                {/* Modal de Reporte Completo */}
                <AnimatePresence>
                    {showModal && selectedResult && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                            onClick={() => setShowModal(false)}
                        >
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.9, opacity: 0 }}
                                className="bg-slate-900 border border-white/10 rounded-2xl p-6 max-w-3xl w-full max-h-[80vh] overflow-y-auto"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-xl font-bold text-white">📊 Reporte Completo</h3>
                                    <button
                                        onClick={() => setShowModal(false)}
                                        className="text-slate-400 hover:text-white text-2xl"
                                    >
                                        ×
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    <div className="bg-slate-800/50 rounded-xl p-4">
                                        <p className="text-xs text-slate-500 uppercase mb-1">URL Analizada</p>
                                        <p className="text-white font-mono text-sm">{selectedResult.url}</p>
                                    </div>

                                    <div className="bg-slate-800/50 rounded-xl p-4">
                                        <p className="text-xs text-slate-500 uppercase mb-1">Tipo Detectado</p>
                                        <p className="text-purple-400 font-bold">{selectedResult.type}</p>
                                    </div>

                                    <div className="bg-slate-800/50 rounded-xl p-4">
                                        <p className="text-xs text-slate-500 uppercase mb-1">Resumen IA</p>
                                        <p className="text-slate-300">{selectedResult.summary}</p>
                                    </div>

                                    <div className="bg-slate-800/50 rounded-xl p-4">
                                        <p className="text-xs text-slate-500 uppercase mb-2">Datos Extraídos</p>
                                        <pre className="text-xs text-emerald-400 font-mono overflow-x-auto whitespace-pre-wrap">
                                            {JSON.stringify(selectedResult.extractedData, null, 2)}
                                        </pre>
                                    </div>

                                    <div className="bg-slate-950 rounded-xl p-4 border border-slate-700">
                                        <p className="text-xs text-slate-500 uppercase mb-2">🔍 Respuesta RAW del Webhook (Debug)</p>
                                        <pre className="text-xs text-amber-400 font-mono overflow-x-auto whitespace-pre-wrap max-h-64 overflow-y-auto">
                                            {JSON.stringify(selectedResult.rawResponse, null, 2)}
                                        </pre>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

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
