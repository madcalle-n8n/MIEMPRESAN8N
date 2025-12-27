/**
 * ============================================================================
 * 📱 SERVICIO: TelegramCRM (Gestión de Leads desde Telegram)
 * ============================================================================
 * 
 * PROPÓSITO:
 * Panel de visualización de leads capturados via Telegram. Muestra los mensajes
 * procesados por el AI Agent de n8n con datos estructurados de clientes.
 * 
 * FUNCIONALIDADES:
 * - Feed de leads procesados en tiempo real (polling cada 10s)
 * - Terminal de logs de conexión
 * - Tarjetas con datos extraídos por IA (nombre, email, teléfono, etc.)
 * - Clasificación de leads (HOT, WARM, COLD)
 * 
 * INTEGRACIÓN:
 * - Webhook n8n GET que lee de Google Sheets
 * - Datos provienen del flujo "chatbot ventas"
 * 
 * ============================================================================
 * 📁 UBICACIÓN: src/pages/TelegramCRM.jsx
 * 🔗 RUTA: /crm/telegram
 * ============================================================================
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    MessageCircle, ArrowLeft, Terminal, RefreshCw, User,
    Mail, Phone, MapPin, Calendar, FileText, Activity,
    Sparkles, Wifi, WifiOff, Flame, ThermometerSun, Snowflake,
    Trash2, Clock
} from 'lucide-react';
import AnimatedPage from '../components/layout/AnimatedPage';
import SEO from '../components/SEO';

// ============================================================================
// 🔗 CONFIGURACIÓN DE WEBHOOKS
// ============================================================================
// Este webhook debe devolver los leads procesados desde Google Sheets
// Formato esperado: { leads: [...] } o array directo de leads
const TELEGRAM_MESSAGES_WEBHOOK = import.meta.env.VITE_TELEGRAM_MESSAGES_WEBHOOK;

const TelegramCRM = () => {
    const [leads, setLeads] = useState(() => {
        // Cargar leads guardados de sessionStorage al iniciar
        try {
            const saved = sessionStorage.getItem('telegramLeads');
            return saved ? JSON.parse(saved) : [];
        } catch {
            return [];
        }
    });
    const [logs, setLogs] = useState([]);
    const [isConnected, setIsConnected] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedLead, setSelectedLead] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [autoRefresh, setAutoRefresh] = useState(true);
    const scrollRef = useRef(null);
    const intervalRef = useRef(null);

    // Guardar leads en sessionStorage cuando cambien
    useEffect(() => {
        if (leads.length > 0) {
            try {
                sessionStorage.setItem('telegramLeads', JSON.stringify(leads));
            } catch (e) {
                console.warn('No se pudo guardar en sessionStorage:', e);
            }
        }
    }, [leads]);

    // Auto-scroll logs
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [logs]);

    const addLog = useCallback((msg) => {
        const timestamp = new Date().toLocaleTimeString('es-ES');
        setLogs(prev => [...prev.slice(-50), `[${timestamp}] ${msg}`]); // Mantener últimos 50 logs
    }, []);

    const fetchLeads = useCallback(async (manual = false) => {
        if (!TELEGRAM_MESSAGES_WEBHOOK) {
            if (manual) {
                addLog(`⚠️ Webhook no configurado. Usando modo demo.`);
                // Modo demo: agregar lead de ejemplo
                const demoLead = {
                    id: Date.now(),
                    nombre_completo: 'Carlos Javier Méndez',
                    email: 'carlos.mendez@email.com',
                    direccion: 'Calle Mayor 15, 3º Izquierda, Madrid',
                    numero_de_telefono: '+34 600 123 456',
                    fecha_de_registro: '27/12/2024',
                    estado_del_proceso: 'Listo para pago',
                    notas_adicionales: 'Factura a nombre de empresa',
                    clasificacion: 'HOT',
                    timestamp: new Date().toISOString()
                };
                setLeads(prev => [demoLead, ...prev.filter(l => l.id !== demoLead.id)]);
                addLog(`✅ Lead de demo cargado.`);
            }
            return;
        }

        setIsLoading(true);
        if (manual) addLog(`🔄 Actualizando leads manualmente...`);

        try {
            const response = await fetch(TELEGRAM_MESSAGES_WEBHOOK, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }

            const data = await response.json();
            console.log('📥 Respuesta de n8n:', data);

            // Normalizar respuesta (puede ser array o { leads: [...] })
            const newLeads = Array.isArray(data) ? data : (data.leads || data.data || []);

            if (newLeads.length > 0) {
                // Agregar IDs únicos si no existen
                const processedLeads = newLeads.map((lead, index) => ({
                    ...lead,
                    id: lead.id || lead.row_number || Date.now() + index,
                    timestamp: lead.timestamp || lead.fecha_de_registro || new Date().toISOString()
                }));

                setLeads(processedLeads);
                setIsConnected(true);
                if (manual) addLog(`✅ ${processedLeads.length} leads cargados.`);
            } else {
                if (manual) addLog(`ℹ️ No hay leads nuevos.`);
            }

        } catch (error) {
            console.error('Error fetching leads:', error);
            addLog(`❌ Error: ${error.message}`);
            setIsConnected(false);
        } finally {
            setIsLoading(false);
        }
    }, [addLog]);

    // Polling automático
    useEffect(() => {
        if (autoRefresh && TELEGRAM_MESSAGES_WEBHOOK) {
            addLog(`🔌 Conectando con servidor de n8n...`);
            fetchLeads();

            intervalRef.current = setInterval(() => {
                fetchLeads();
            }, 10000); // Cada 10 segundos

            return () => {
                if (intervalRef.current) {
                    clearInterval(intervalRef.current);
                }
            };
        } else if (!TELEGRAM_MESSAGES_WEBHOOK) {
            addLog(`⚠️ VITE_TELEGRAM_MESSAGES_WEBHOOK no configurado.`);
            addLog(`📋 Modo demo activado. Usa el botón Actualizar.`);
        }
    }, [autoRefresh, fetchLeads, addLog]);

    const getClasificacionIcon = (clasificacion) => {
        switch (clasificacion?.toUpperCase()) {
            case 'HOT': return <Flame className="w-4 h-4" />;
            case 'WARM': return <ThermometerSun className="w-4 h-4" />;
            case 'COLD': return <Snowflake className="w-4 h-4" />;
            default: return <Activity className="w-4 h-4" />;
        }
    };

    const getClasificacionColor = (clasificacion) => {
        switch (clasificacion?.toUpperCase()) {
            case 'HOT': return 'bg-red-500/20 text-red-400 border-red-500/30';
            case 'WARM': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
            case 'COLD': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
            default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
        }
    };

    const clearLeads = () => {
        if (window.confirm('¿Limpiar todo el historial de leads?')) {
            setLeads([]);
            sessionStorage.removeItem('telegramLeads');
            addLog('🗑️ Historial limpiado');
        }
    };

    return (
        <AnimatedPage>
            <SEO
                title="Telegram CRM - Gestión de Leads"
                description="Panel de gestión de leads capturados via Telegram con procesamiento de IA."
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
                                    <div className="w-10 h-10 bg-gradient-to-tr from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mr-3 shadow-lg shadow-blue-500/20">
                                        <MessageCircle className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <h1 className="text-xl font-bold text-white">Telegram CRM</h1>
                                        <p className="text-xs text-slate-400 flex items-center gap-1">
                                            <Sparkles className="w-3 h-3" /> Leads con IA
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Status y Controles */}
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => setAutoRefresh(!autoRefresh)}
                                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${autoRefresh
                                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                            : 'bg-slate-800 text-slate-400 border border-slate-700'
                                        }`}
                                >
                                    {autoRefresh ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
                                    Auto: {autoRefresh ? 'ON' : 'OFF'}
                                </button>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => fetchLeads(true)}
                                    disabled={isLoading}
                                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-medium transition-colors disabled:opacity-50"
                                >
                                    <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                                    Actualizar
                                </motion.button>
                                <div className="flex items-center gap-2 px-4 py-2 bg-slate-900 rounded-full border border-slate-800">
                                    <div className={`w-2 h-2 rounded-full ${isLoading ? 'bg-amber-500 animate-pulse' :
                                            isConnected ? 'bg-emerald-500' : 'bg-slate-500'
                                        }`}></div>
                                    <span className="text-xs font-mono text-slate-300">
                                        {isLoading ? 'CARGANDO...' : isConnected ? 'CONECTADO' : 'DEMO'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* Columna Izquierda: Info y Logs */}
                    <div className="lg:col-span-4 space-y-6">
                        {/* Info Box */}
                        <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 shadow-2xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 rounded-full blur-3xl"></div>

                            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 relative z-10">
                                <MessageCircle className="w-5 h-5 text-blue-400" /> Bot de Ventas
                            </h2>

                            <div className="space-y-3 relative z-10">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-slate-400">Estado</span>
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${isConnected ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-400'
                                        }`}>
                                        {isConnected ? 'Activo' : 'Demo'}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-slate-400">Leads totales</span>
                                    <span className="text-white font-bold">{leads.length}</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-slate-400">Leads HOT</span>
                                    <span className="text-red-400 font-bold">
                                        {leads.filter(l => l.clasificacion?.toUpperCase() === 'HOT').length}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-slate-400">Auto-refresh</span>
                                    <span className="text-slate-300">{autoRefresh ? '10s' : 'Desactivado'}</span>
                                </div>
                            </div>
                        </div>

                        {/* Terminal / Logs */}
                        <div className="bg-black rounded-xl p-4 border border-slate-800 shadow-inner font-mono text-xs h-64 flex flex-col opacity-90">
                            <div className="flex items-center justify-between text-slate-500 mb-2 border-b border-slate-800 pb-2">
                                <span className="flex items-center gap-2">
                                    <Terminal className="w-3 h-3" /> Connection Logs
                                </span>
                                <span className="text-[10px] bg-slate-900 px-2 py-0.5 rounded">v1.0.0</span>
                            </div>
                            <div className="flex-1 overflow-y-auto space-y-1 scrollbar-thin scrollbar-thumb-slate-700" ref={scrollRef}>
                                {logs.length === 0 && (
                                    <span className="text-slate-700 italic">Esperando conexión...</span>
                                )}
                                {logs.map((log, i) => (
                                    <div key={i} className="text-blue-300 animate-fade-in font-light">
                                        <span className="text-slate-600 mr-2">{`>>`}</span> {log}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Columna Derecha: Feed de Leads */}
                    <div className="lg:col-span-8 space-y-4">
                        <div className="flex justify-between items-center mb-2">
                            <h2 className="text-lg font-bold flex items-center gap-2">
                                <User className="w-5 h-5 text-cyan-500" /> Leads Capturados
                            </h2>
                            <div className="flex items-center gap-3">
                                {leads.length > 0 && (
                                    <button
                                        onClick={clearLeads}
                                        className="flex items-center gap-1 text-xs text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 px-3 py-1.5 rounded-lg border border-red-500/30 transition-all"
                                    >
                                        <Trash2 className="w-3 h-3" />
                                        Limpiar
                                    </button>
                                )}
                                <div className="text-xs text-slate-500 bg-slate-900 px-3 py-1 rounded-full border border-slate-800">
                                    Total: <span className="text-blue-400 font-bold">{leads.length}</span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <AnimatePresence>
                                {leads.length === 0 ? (
                                    <div className="h-[400px] border-2 border-dashed border-slate-800 rounded-2xl flex flex-col items-center justify-center text-slate-600 gap-4">
                                        <div className="w-16 h-16 bg-slate-900 rounded-full flex items-center justify-center">
                                            <MessageCircle className="w-8 h-8 opacity-50" />
                                        </div>
                                        <div className="text-center">
                                            <p className="font-medium text-lg">Esperando Leads...</p>
                                            <p className="text-sm opacity-60 max-w-xs mt-2 mx-auto">
                                                Los leads procesados por tu bot de Telegram aparecerán aquí.
                                            </p>
                                            <button
                                                onClick={() => fetchLeads(true)}
                                                className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm transition-colors"
                                            >
                                                Cargar Demo
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    leads.map((lead) => (
                                        <motion.div
                                            key={lead.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-blue-500/50 transition-all group relative overflow-hidden"
                                        >
                                            {/* Badge de clasificación */}
                                            <div className={`absolute top-0 right-0 ${getClasificacionColor(lead.clasificacion)} text-[10px] font-bold px-3 py-1 rounded-bl-xl border-l border-b flex items-center gap-1`}>
                                                {getClasificacionIcon(lead.clasificacion)}
                                                {lead.clasificacion || 'N/A'}
                                            </div>

                                            <div className="flex justify-between items-start mb-3 pr-20">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-12 h-12 bg-gradient-to-tr from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                                                        {(lead.nombre_completo || 'U')[0].toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <h3 className="font-bold text-slate-200">
                                                            {lead.nombre_completo || 'Sin nombre'}
                                                        </h3>
                                                        <p className="text-xs text-slate-500 flex items-center gap-1">
                                                            <Clock className="w-3 h-3" />
                                                            {lead.fecha_de_registro || 'Sin fecha'}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Datos extraídos */}
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
                                                {lead.email && lead.email !== 'No proporcionado' && (
                                                    <div className="flex items-center gap-2 text-sm text-slate-300 bg-slate-800/50 px-3 py-2 rounded-lg">
                                                        <Mail className="w-4 h-4 text-blue-400" />
                                                        <span className="truncate">{lead.email}</span>
                                                    </div>
                                                )}
                                                {lead.numero_de_telefono && lead.numero_de_telefono !== 'No proporcionado' && (
                                                    <div className="flex items-center gap-2 text-sm text-slate-300 bg-slate-800/50 px-3 py-2 rounded-lg">
                                                        <Phone className="w-4 h-4 text-emerald-400" />
                                                        <span>{lead.numero_de_telefono}</span>
                                                    </div>
                                                )}
                                                {lead.direccion && lead.direccion !== 'No proporcionado' && (
                                                    <div className="flex items-center gap-2 text-sm text-slate-300 bg-slate-800/50 px-3 py-2 rounded-lg col-span-full">
                                                        <MapPin className="w-4 h-4 text-amber-400 flex-shrink-0" />
                                                        <span className="truncate">{lead.direccion}</span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Estado del proceso */}
                                            {lead.estado_del_proceso && lead.estado_del_proceso !== 'No proporcionado' && (
                                                <div className="bg-slate-950/50 rounded-lg p-3 mb-3 border border-slate-800/50">
                                                    <p className="text-sm text-slate-300">
                                                        <span className="text-blue-400 font-mono text-xs mr-2">ESTADO:</span>
                                                        {lead.estado_del_proceso}
                                                    </p>
                                                </div>
                                            )}

                                            {/* Notas adicionales */}
                                            {lead.notas_adicionales && lead.notas_adicionales !== 'No proporcionado' && (
                                                <div className="bg-slate-950/50 rounded-lg p-3 border border-slate-800/50">
                                                    <p className="text-sm text-slate-400">
                                                        <span className="text-cyan-400 font-mono text-xs mr-2">NOTAS:</span>
                                                        {lead.notas_adicionales}
                                                    </p>
                                                </div>
                                            )}

                                            {/* Botón ver más */}
                                            <div className="flex justify-end mt-3 pt-3 border-t border-slate-800/50">
                                                <button
                                                    onClick={() => {
                                                        setSelectedLead(lead);
                                                        setShowModal(true);
                                                    }}
                                                    className="text-blue-400 hover:text-blue-300 flex items-center gap-1 text-xs transition-colors"
                                                >
                                                    <FileText className="w-3 h-3" />
                                                    Ver detalles completos
                                                </button>
                                            </div>
                                        </motion.div>
                                    ))
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </main>

                {/* Modal de Lead Completo */}
                <AnimatePresence>
                    {showModal && selectedLead && (
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
                                className="bg-slate-900 border border-white/10 rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                        <User className="w-5 h-5 text-blue-400" />
                                        Detalles del Lead
                                    </h3>
                                    <button
                                        onClick={() => setShowModal(false)}
                                        className="text-slate-400 hover:text-white text-2xl"
                                    >
                                        ×
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    <div className="bg-slate-800/50 rounded-xl p-4">
                                        <p className="text-xs text-slate-500 uppercase mb-1">Nombre Completo</p>
                                        <p className="text-white font-bold text-lg">{selectedLead.nombre_completo || 'No proporcionado'}</p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-slate-800/50 rounded-xl p-4">
                                            <p className="text-xs text-slate-500 uppercase mb-1">Email</p>
                                            <p className="text-blue-400">{selectedLead.email || 'No proporcionado'}</p>
                                        </div>
                                        <div className="bg-slate-800/50 rounded-xl p-4">
                                            <p className="text-xs text-slate-500 uppercase mb-1">Teléfono</p>
                                            <p className="text-emerald-400">{selectedLead.numero_de_telefono || 'No proporcionado'}</p>
                                        </div>
                                    </div>

                                    <div className="bg-slate-800/50 rounded-xl p-4">
                                        <p className="text-xs text-slate-500 uppercase mb-1">Dirección</p>
                                        <p className="text-slate-300">{selectedLead.direccion || 'No proporcionado'}</p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-slate-800/50 rounded-xl p-4">
                                            <p className="text-xs text-slate-500 uppercase mb-1">Fecha de Registro</p>
                                            <p className="text-amber-400">{selectedLead.fecha_de_registro || 'No proporcionado'}</p>
                                        </div>
                                        <div className="bg-slate-800/50 rounded-xl p-4">
                                            <p className="text-xs text-slate-500 uppercase mb-1">Clasificación</p>
                                            <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-sm ${getClasificacionColor(selectedLead.clasificacion)}`}>
                                                {getClasificacionIcon(selectedLead.clasificacion)}
                                                {selectedLead.clasificacion || 'Sin clasificar'}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-slate-800/50 rounded-xl p-4">
                                        <p className="text-xs text-slate-500 uppercase mb-1">Estado del Proceso</p>
                                        <p className="text-cyan-400">{selectedLead.estado_del_proceso || 'No proporcionado'}</p>
                                    </div>

                                    <div className="bg-slate-800/50 rounded-xl p-4">
                                        <p className="text-xs text-slate-500 uppercase mb-1">Notas Adicionales</p>
                                        <p className="text-slate-300">{selectedLead.notas_adicionales || 'Sin notas'}</p>
                                    </div>

                                    <div className="bg-slate-950 rounded-xl p-4 border border-slate-700">
                                        <p className="text-xs text-slate-500 uppercase mb-2">🔍 Datos RAW (Debug)</p>
                                        <pre className="text-xs text-amber-400 font-mono overflow-x-auto whitespace-pre-wrap max-h-40 overflow-y-auto">
                                            {JSON.stringify(selectedLead, null, 2)}
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

export default TelegramCRM;
