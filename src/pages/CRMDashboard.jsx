/**
 * ============================================================================
 * 📊 PÁGINA: CRMDashboard (Panel de Gestión de Clientes)
 * ============================================================================
 * 
 * PROPÓSITO:
 * Dashboard interactivo de demostración para gestión de clientes (CRM).
 * Permite registrar clientes, ver métricas, historial de ventas y
 * enviar comunicaciones automatizadas vía WhatsApp y Email.
 * 
 * ============================================================================
 * ⚙️ CONFIGURACIÓN DE WEBHOOKS
 * ============================================================================
 * 
 * Este componente usa DOS webhooks para automatización de comunicaciones:
 * 
 * 📱 WEBHOOK DE WHATSAPP:
 * Variable de entorno: VITE_WHATSAPP_WEBHOOK_URL
 * Datos que envía:
 * - cliente: Nombre del cliente
 * - telefono: Número de WhatsApp
 * - mensaje: Texto del mensaje
 * - timestamp: Fecha/hora del envío
 * 
 * Sugerencia n8n: Conectar con API de WhatsApp Business, Twilio o Evolution API
 * 
 * ✉️ WEBHOOK DE EMAIL:
 * Variable de entorno: VITE_EMAIL_WEBHOOK_URL
 * Datos que envía:
 * - cliente: Nombre del cliente
 * - email: Dirección de email
 * - asunto: Asunto del correo
 * - timestamp: Fecha/hora del envío
 * 
 * Sugerencia n8n: Conectar con SendGrid, Mailgun, Gmail o SMTP
 * 
 * ============================================================================
 * 🎮 FUNCIONALIDADES DEL DASHBOARD
 * ============================================================================
 * 
 * Pestañas disponibles:
 * - Dashboard: Métricas generales y últimos clientes
 * - Clientes: Lista completa con búsqueda y filtros
 * - Ventas: Historial de transacciones
 * - Recordatorios: Tareas y seguimientos pendientes
 * 
 * Acciones por cliente:
 * - Enviar Email (conecta con webhook)
 * - Enviar WhatsApp (conecta con webhook)
 * - Editar información
 * - Eliminar cliente
 * 
 * ============================================================================
 * 📁 UBICACIÓN: src/pages/CRMDashboard.jsx
 * 🔗 RUTA: /crm
 * ============================================================================
 */

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Users, Plus, Search, Filter, Mail, Phone, Building2,
    Calendar, DollarSign, TrendingUp, Bell, MessageCircle,
    Download, Edit, Trash2, X, ArrowLeft, Sparkles
} from 'lucide-react';
import AnimatedPage from '../components/layout/AnimatedPage';
import SEO from '../components/SEO';

// ============================================================================
// 🔗 WEBHOOKS DE COMUNICACIÓN - Configura estas URLs en el archivo .env
// ============================================================================
// Estos webhooks permiten enviar mensajes automatizados desde el CRM.
// Si no están configurados, el sistema mostrará un mensaje de demo.
// ============================================================================

// 📱 Webhook de WhatsApp - Para enviar mensajes a clientes
// En n8n: Conectar con Evolution API, Twilio, o WhatsApp Business API
const WHATSAPP_WEBHOOK_URL = import.meta.env.VITE_WHATSAPP_WEBHOOK_URL;

// ✉️ Webhook de Email - Para enviar correos a clientes
// En n8n: Conectar con nodo de Email (Gmail, SMTP, SendGrid, etc.)
const EMAIL_WEBHOOK_URL = import.meta.env.VITE_EMAIL_WEBHOOK_URL;

const CRMDashboard = () => {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [clientes, setClientes] = useState([
        {
            id: 1,
            nombre: 'Juan Pérez',
            email: 'juan@empresa.com',
            telefono: '+34 600 123 456',
            whatsapp: '+34 600 123 456',
            empresa: 'Tech Solutions SL',
            cargo: 'Director',
            estado: 'activo',
            prioridad: 'alta',
            notas: 'Cliente VIP - Proyecto de automatización'
        },
        {
            id: 2,
            nombre: 'María García',
            email: 'maria@startup.com',
            telefono: '+34 611 234 567',
            whatsapp: '+34 611 234 567',
            empresa: 'StartupX',
            cargo: 'CEO',
            estado: 'prospecto',
            prioridad: 'media',
            notas: 'Interesada en CRM'
        },
        {
            id: 3,
            nombre: 'Carlos López',
            email: 'carlos@corp.es',
            telefono: '+34 622 345 678',
            whatsapp: '+34 622 345 678',
            empresa: 'Corporation ES',
            cargo: 'Gerente de Ventas',
            estado: 'activo',
            prioridad: 'baja',
            notas: 'Contacto mensual programado'
        }
    ]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [selectedCliente, setSelectedCliente] = useState(null);

    const metricas = {
        totalClientes: clientes.length,
        ventasMes: 45000,
        prospectos: clientes.filter(c => c.estado === 'prospecto').length,
        tareasPendientes: 5
    };

    const enviarWhatsApp = async (cliente) => {
        if (WHATSAPP_WEBHOOK_URL) {
            try {
                await fetch(WHATSAPP_WEBHOOK_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        cliente: cliente.nombre,
                        telefono: cliente.whatsapp,
                        mensaje: `Hola ${cliente.nombre}, te contactamos desde N8NIADUSTRIA...`,
                        timestamp: new Date().toLocaleString('es-ES', { timeZone: 'Europe/Madrid' })
                    })
                });
                alert(`✅ WhatsApp enviado a ${cliente.nombre}`);
            } catch (error) {
                alert(`❌ Error al enviar WhatsApp: ${error.message}`);
            }
        } else {
            alert(`📱 Demo: Enviando WhatsApp a ${cliente.nombre} (${cliente.whatsapp})\n\nConfigura VITE_WHATSAPP_WEBHOOK_URL en .env para conectar con n8n`);
        }
    };

    const enviarEmail = async (cliente) => {
        if (EMAIL_WEBHOOK_URL) {
            try {
                await fetch(EMAIL_WEBHOOK_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        cliente: cliente.nombre,
                        email: cliente.email,
                        asunto: `Hola ${cliente.nombre} - N8NIADUSTRIA`,
                        timestamp: new Date().toLocaleString('es-ES', { timeZone: 'Europe/Madrid' })
                    })
                });
                alert(`✅ Email enviado a ${cliente.nombre}`);
            } catch (error) {
                alert(`❌ Error al enviar Email: ${error.message}`);
            }
        } else {
            alert(`📧 Demo: Enviando Email a ${cliente.nombre} (${cliente.email})\n\nConfigura VITE_EMAIL_WEBHOOK_URL en .env para conectar con n8n`);
        }
    };

    const guardarCliente = (clienteData) => {
        if (selectedCliente) {
            setClientes(clientes.map(c => c.id === selectedCliente.id ? { ...clienteData, id: c.id } : c));
        } else {
            setClientes([...clientes, { ...clienteData, id: Date.now() }]);
        }
        setShowModal(false);
        setSelectedCliente(null);
    };

    const eliminarCliente = (id) => {
        if (window.confirm('¿Estás seguro de eliminar este cliente?')) {
            setClientes(clientes.filter(c => c.id !== id));
        }
    };

    const clientesFiltrados = clientes.filter(cliente =>
        cliente.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cliente.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cliente.empresa?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const tabs = [
        { id: 'dashboard', label: 'Dashboard', icon: TrendingUp },
        { id: 'clientes', label: 'Clientes', icon: Users },
        { id: 'ventas', label: 'Ventas', icon: DollarSign },
        { id: 'recordatorios', label: 'Recordatorios', icon: Bell }
    ];

    return (
        <AnimatedPage>
            <SEO
                title="CRM Dashboard"
                description="Panel de gestión de clientes con métricas, historial de ventas y recordatorios automáticos."
            />

            <div className="min-h-screen bg-slate-950 pt-20">
                {/* Header */}
                <header className="bg-slate-900/50 border-b border-white/10 backdrop-blur-xl sticky top-20 z-30">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-center h-16">
                            <div className="flex items-center gap-4">
                                <Link
                                    to="/servicios/crm-simple"
                                    className="text-slate-400 hover:text-white transition-colors"
                                >
                                    <ArrowLeft className="w-5 h-5" />
                                </Link>
                                <div className="flex items-center">
                                    <div className="w-10 h-10 bg-gradient-to-tr from-orange-500 to-amber-500 rounded-xl flex items-center justify-center mr-3 shadow-lg shadow-orange-500/20">
                                        <Users className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <h1 className="text-xl font-bold text-white">CRM Dashboard</h1>
                                        <p className="text-xs text-slate-400 flex items-center gap-1">
                                            <Sparkles className="w-3 h-3" /> Demo Interactiva
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => {
                                    setSelectedCliente(null);
                                    setShowModal(true);
                                }}
                                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-orange-500/20 transition-all"
                            >
                                <Plus className="w-5 h-5 mr-2" />
                                Nuevo Cliente
                            </motion.button>
                        </div>
                    </div>
                </header>

                {/* Navigation Tabs */}
                <div className="bg-slate-900/30 border-b border-white/5">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex space-x-1 overflow-x-auto py-2">
                            {tabs.map((tab) => {
                                const Icon = tab.icon;
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`flex items-center gap-2 py-3 px-4 rounded-lg font-medium text-sm whitespace-nowrap transition-all ${activeTab === tab.id
                                            ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                                            : 'text-slate-400 hover:text-white hover:bg-white/5'
                                            }`}
                                    >
                                        <Icon className="w-4 h-4" />
                                        {tab.label}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <AnimatePresence mode="wait">
                        {activeTab === 'dashboard' && (
                            <motion.div
                                key="dashboard"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                            >
                                {/* Métricas */}
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                                    <MetricCard
                                        title="Total Clientes"
                                        value={metricas.totalClientes}
                                        icon={<Users className="w-6 h-6" />}
                                        color="blue"
                                    />
                                    <MetricCard
                                        title="Ventas del Mes"
                                        value={`€${metricas.ventasMes.toLocaleString()}`}
                                        icon={<DollarSign className="w-6 h-6" />}
                                        color="green"
                                    />
                                    <MetricCard
                                        title="Prospectos"
                                        value={metricas.prospectos}
                                        icon={<TrendingUp className="w-6 h-6" />}
                                        color="yellow"
                                    />
                                    <MetricCard
                                        title="Tareas Pendientes"
                                        value={metricas.tareasPendientes}
                                        icon={<Bell className="w-6 h-6" />}
                                        color="red"
                                    />
                                </div>

                                {/* Últimos Clientes */}
                                <div className="bg-slate-900/50 rounded-2xl border border-white/10 overflow-hidden">
                                    <div className="px-6 py-4 border-b border-white/10">
                                        <h2 className="text-lg font-semibold text-white">Últimos Clientes</h2>
                                    </div>
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full">
                                            <thead className="bg-slate-800/50">
                                                <tr>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Cliente</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Empresa</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Estado</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Acciones</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-white/5">
                                                {clientes.map((cliente) => (
                                                    <tr key={cliente.id} className="hover:bg-white/5 transition-colors">
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="text-sm font-medium text-white">{cliente.nombre}</div>
                                                            <div className="text-sm text-slate-400">{cliente.email}</div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                                                            {cliente.empresa || '-'}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${cliente.estado === 'activo' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                                                                cliente.estado === 'prospecto' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                                                                    'bg-slate-500/20 text-slate-400 border border-slate-500/30'
                                                                }`}>
                                                                {cliente.estado}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="flex space-x-2">
                                                                <button
                                                                    onClick={() => enviarEmail(cliente)}
                                                                    className="p-2 text-blue-400 hover:bg-blue-500/20 rounded-lg transition-colors"
                                                                    title="Enviar Email"
                                                                >
                                                                    <Mail className="w-4 h-4" />
                                                                </button>
                                                                <button
                                                                    onClick={() => enviarWhatsApp(cliente)}
                                                                    className="p-2 text-green-400 hover:bg-green-500/20 rounded-lg transition-colors"
                                                                    title="Enviar WhatsApp"
                                                                >
                                                                    <MessageCircle className="w-4 h-4" />
                                                                </button>
                                                                <button
                                                                    onClick={() => {
                                                                        setSelectedCliente(cliente);
                                                                        setShowModal(true);
                                                                    }}
                                                                    className="p-2 text-slate-400 hover:bg-white/10 rounded-lg transition-colors"
                                                                    title="Editar"
                                                                >
                                                                    <Edit className="w-4 h-4" />
                                                                </button>
                                                                <button
                                                                    onClick={() => eliminarCliente(cliente.id)}
                                                                    className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
                                                                    title="Eliminar"
                                                                >
                                                                    <Trash2 className="w-4 h-4" />
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'clientes' && (
                            <motion.div
                                key="clientes"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                            >
                                {/* Búsqueda y Filtros */}
                                <div className="mb-6 flex flex-col sm:flex-row gap-4">
                                    <div className="flex-1 relative">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                                        <input
                                            type="text"
                                            placeholder="Buscar clientes..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="w-full pl-10 pr-4 py-3 bg-slate-900/50 border border-white/10 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                                        />
                                    </div>
                                    <button className="inline-flex items-center px-4 py-3 bg-slate-800 border border-white/10 rounded-xl text-slate-300 hover:bg-slate-700 transition-colors">
                                        <Filter className="w-5 h-5 mr-2" />
                                        Filtros
                                    </button>
                                    <button className="inline-flex items-center px-4 py-3 bg-green-600 text-white rounded-xl hover:bg-green-500 transition-colors">
                                        <Download className="w-5 h-5 mr-2" />
                                        Exportar
                                    </button>
                                </div>

                                {/* Lista de Clientes */}
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {clientesFiltrados.map((cliente) => (
                                        <motion.div
                                            key={cliente.id}
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className="bg-slate-900/50 rounded-2xl border border-white/10 p-6 hover:border-orange-500/30 transition-all group"
                                        >
                                            <div className="flex justify-between items-start mb-4">
                                                <div>
                                                    <h3 className="text-lg font-semibold text-white">{cliente.nombre}</h3>
                                                    <p className="text-sm text-slate-400">{cliente.empresa}</p>
                                                </div>
                                                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${cliente.prioridad === 'alta' ? 'bg-red-500/20 text-red-400' :
                                                    cliente.prioridad === 'media' ? 'bg-yellow-500/20 text-yellow-400' :
                                                        'bg-green-500/20 text-green-400'
                                                    }`}>
                                                    {cliente.prioridad}
                                                </span>
                                            </div>

                                            <div className="space-y-2 mb-4">
                                                <div className="flex items-center text-sm text-slate-300">
                                                    <Mail className="w-4 h-4 mr-2 text-slate-500" />
                                                    {cliente.email}
                                                </div>
                                                <div className="flex items-center text-sm text-slate-300">
                                                    <Phone className="w-4 h-4 mr-2 text-slate-500" />
                                                    {cliente.telefono || 'No disponible'}
                                                </div>
                                                {cliente.cargo && (
                                                    <div className="flex items-center text-sm text-slate-300">
                                                        <Building2 className="w-4 h-4 mr-2 text-slate-500" />
                                                        {cliente.cargo}
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex space-x-2 pt-4 border-t border-white/10">
                                                <button
                                                    onClick={() => enviarEmail(cliente)}
                                                    className="flex-1 py-2 px-3 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 text-sm font-medium transition-colors"
                                                >
                                                    Email
                                                </button>
                                                <button
                                                    onClick={() => enviarWhatsApp(cliente)}
                                                    className="flex-1 py-2 px-3 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 text-sm font-medium transition-colors"
                                                >
                                                    WhatsApp
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setSelectedCliente(cliente);
                                                        setShowModal(true);
                                                    }}
                                                    className="p-2 bg-slate-800 text-slate-400 rounded-lg hover:bg-slate-700 transition-colors"
                                                >
                                                    <Edit className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'ventas' && (
                            <motion.div
                                key="ventas"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="bg-slate-900/50 rounded-2xl border border-white/10 p-6"
                            >
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-xl font-semibold text-white">Historial de Ventas</h2>
                                    <button className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-500 transition-colors">
                                        <Download className="w-5 h-5 mr-2" />
                                        Exportar a Excel
                                    </button>
                                </div>
                                <div className="space-y-4">
                                    {[
                                        { cliente: 'Juan Pérez', monto: 15000, fecha: '2024-12-01', concepto: 'Servicio Premium Automatización' },
                                        { cliente: 'Carlos López', monto: 8500, fecha: '2024-12-05', concepto: 'Consultoría n8n' },
                                        { cliente: 'Juan Pérez', monto: 21500, fecha: '2024-12-10', concepto: 'Proyecto CRM Custom' }
                                    ].map((venta, index) => (
                                        <div key={index} className="flex items-center justify-between p-4 bg-slate-800/50 border border-white/5 rounded-xl hover:border-white/10 transition-all">
                                            <div>
                                                <p className="font-semibold text-white">{venta.cliente}</p>
                                                <p className="text-sm text-slate-400">{venta.concepto}</p>
                                                <p className="text-xs text-slate-500 mt-1">{venta.fecha}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-xl font-bold text-green-400">€{venta.monto.toLocaleString()}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-6 pt-6 border-t border-white/10 flex justify-between items-center">
                                    <span className="text-slate-400">Total del Mes</span>
                                    <span className="text-2xl font-bold text-green-400">€45,000</span>
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'recordatorios' && (
                            <motion.div
                                key="recordatorios"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="bg-slate-900/50 rounded-2xl border border-white/10 p-6"
                            >
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-xl font-semibold text-white">Recordatorios Pendientes</h2>
                                    <button className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl hover:shadow-lg hover:shadow-orange-500/20 transition-all">
                                        <Plus className="w-5 h-5 mr-2" />
                                        Nuevo Recordatorio
                                    </button>
                                </div>
                                <div className="space-y-4">
                                    {[
                                        { cliente: 'Juan Pérez', tipo: 'Seguimiento', fecha: '2024-12-20', descripcion: 'Revisar avance del proyecto de automatización', urgente: true },
                                        { cliente: 'María García', tipo: 'Renovación', fecha: '2024-12-25', descripcion: 'Renovación de contrato anual - Propuesta lista', urgente: false },
                                        { cliente: 'Carlos López', tipo: 'Cumpleaños', fecha: '2024-12-30', descripcion: 'Enviar felicitación y oferta especial', urgente: false }
                                    ].map((recordatorio, index) => (
                                        <div key={index} className={`flex items-start p-4 rounded-xl border transition-all ${recordatorio.urgente
                                            ? 'bg-red-500/10 border-red-500/30 hover:border-red-500/50'
                                            : 'bg-slate-800/50 border-white/5 hover:border-white/10'
                                            }`}>
                                            <div className={`flex-shrink-0 p-3 rounded-xl mr-4 ${recordatorio.urgente ? 'bg-red-500/20' : 'bg-orange-500/20'
                                                }`}>
                                                <Calendar className={`w-6 h-6 ${recordatorio.urgente ? 'text-red-400' : 'text-orange-400'}`} />
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between">
                                                    <h3 className="font-semibold text-white">{recordatorio.cliente}</h3>
                                                    <span className="text-xs font-medium text-slate-400">{recordatorio.fecha}</span>
                                                </div>
                                                <p className={`text-sm font-medium mt-1 ${recordatorio.urgente ? 'text-red-400' : 'text-orange-400'}`}>
                                                    {recordatorio.tipo}
                                                </p>
                                                <p className="text-sm text-slate-400 mt-1">{recordatorio.descripcion}</p>
                                            </div>
                                            <button className="ml-4 p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
                                                <Bell className="w-5 h-5" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </main>

                {/* Modal de Cliente */}
                <AnimatePresence>
                    {showModal && (
                        <ClienteModal
                            cliente={selectedCliente}
                            onClose={() => {
                                setShowModal(false);
                                setSelectedCliente(null);
                            }}
                            onSave={guardarCliente}
                        />
                    )}
                </AnimatePresence>
            </div>
        </AnimatedPage>
    );
};

// Componente de Métrica
const MetricCard = ({ title, value, icon, color }) => {
    const colors = {
        blue: 'from-blue-500 to-blue-600 text-blue-400',
        green: 'from-green-500 to-green-600 text-green-400',
        yellow: 'from-yellow-500 to-amber-500 text-yellow-400',
        red: 'from-red-500 to-rose-600 text-red-400'
    };

    return (
        <motion.div
            whileHover={{ y: -4 }}
            className="bg-slate-900/50 rounded-2xl border border-white/10 p-6 hover:border-white/20 transition-all"
        >
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-slate-400 mb-1">{title}</p>
                    <p className="text-3xl font-bold text-white">{value}</p>
                </div>
                <div className={`p-3 rounded-xl bg-gradient-to-br ${colors[color]} bg-opacity-20`}>
                    {icon}
                </div>
            </div>
        </motion.div>
    );
};

// Modal de Cliente
const ClienteModal = ({ cliente, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        nombre: cliente?.nombre || '',
        email: cliente?.email || '',
        telefono: cliente?.telefono || '',
        whatsapp: cliente?.whatsapp || '',
        empresa: cliente?.empresa || '',
        cargo: cliente?.cargo || '',
        notas: cliente?.notas || '',
        estado: cliente?.estado || 'prospecto',
        prioridad: cliente?.prioridad || 'media'
    });

    const handleSave = () => {
        if (!formData.nombre) {
            alert('El nombre es obligatorio');
            return;
        }
        onSave(formData);
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-slate-900 border border-white/10 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-6 border-b border-white/10 flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-white">
                        {cliente ? 'Editar Cliente' : 'Nuevo Cliente'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1">
                                Nombre *
                            </label>
                            <input
                                type="text"
                                value={formData.nombre}
                                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                                className="w-full px-4 py-3 bg-slate-800 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                                placeholder="Nombre completo"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1">
                                Email
                            </label>
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="w-full px-4 py-3 bg-slate-800 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                                placeholder="email@empresa.com"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1">
                                Teléfono
                            </label>
                            <input
                                type="tel"
                                value={formData.telefono}
                                onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                                className="w-full px-4 py-3 bg-slate-800 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                                placeholder="+34 600 000 000"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1">
                                WhatsApp
                            </label>
                            <input
                                type="tel"
                                value={formData.whatsapp}
                                onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                                className="w-full px-4 py-3 bg-slate-800 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                                placeholder="+34 600 000 000"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1">
                                Empresa
                            </label>
                            <input
                                type="text"
                                value={formData.empresa}
                                onChange={(e) => setFormData({ ...formData, empresa: e.target.value })}
                                className="w-full px-4 py-3 bg-slate-800 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                                placeholder="Nombre de la empresa"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1">
                                Cargo
                            </label>
                            <input
                                type="text"
                                value={formData.cargo}
                                onChange={(e) => setFormData({ ...formData, cargo: e.target.value })}
                                className="w-full px-4 py-3 bg-slate-800 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                                placeholder="Director, CEO, etc."
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1">
                                Estado
                            </label>
                            <select
                                value={formData.estado}
                                onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
                                className="w-full px-4 py-3 bg-slate-800 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                            >
                                <option value="prospecto">Prospecto</option>
                                <option value="activo">Activo</option>
                                <option value="inactivo">Inactivo</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1">
                                Prioridad
                            </label>
                            <select
                                value={formData.prioridad}
                                onChange={(e) => setFormData({ ...formData, prioridad: e.target.value })}
                                className="w-full px-4 py-3 bg-slate-800 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                            >
                                <option value="baja">Baja</option>
                                <option value="media">Media</option>
                                <option value="alta">Alta</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">
                            Notas
                        </label>
                        <textarea
                            value={formData.notas}
                            onChange={(e) => setFormData({ ...formData, notas: e.target.value })}
                            rows={3}
                            className="w-full px-4 py-3 bg-slate-800 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all resize-none"
                            placeholder="Notas adicionales sobre el cliente..."
                        />
                    </div>

                    <div className="flex justify-end space-x-3 pt-4">
                        <button
                            onClick={onClose}
                            className="px-6 py-3 bg-slate-800 border border-white/10 rounded-xl text-slate-300 hover:bg-slate-700 transition-colors"
                        >
                            Cancelar
                        </button>
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleSave}
                            className="px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-orange-500/20 transition-all"
                        >
                            Guardar Cliente
                        </motion.button>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default CRMDashboard;
