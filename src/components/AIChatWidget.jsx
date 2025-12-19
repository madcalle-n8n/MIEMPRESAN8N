/**
 * ============================================================================
 * 🤖 COMPONENTE: AIChatWidget (Chat con IA "Nova")
 * ============================================================================
 * 
 * PROPÓSITO:
 * Widget de chat flotante que permite a los visitantes interactuar con un
 * agente de IA conectado a n8n. El bot "Nova" responde consultas sobre
 * automatización y servicios de la empresa.
 * 
 * ============================================================================
 * ⚙️ CONFIGURACIÓN DEL WEBHOOK
 * ============================================================================
 * 
 * Variable de entorno: VITE_CHAT_WEBHOOK_URL
 * Archivo de configuración: .env (ver .env.example para guía)
 * 
 * El webhook en n8n debe:
 * 1. Recibir un POST con los datos del mensaje
 * 2. Procesar con un nodo de IA (OpenAI, Claude, etc.)
 * 3. Devolver JSON con formato: { "output": "respuesta del bot" }
 * 
 * Datos que se envían al webhook:
 * - message: Texto del usuario
 * - sessionId: ID de sesión para memoria del chat
 * - timestamp: Fecha/hora del mensaje
 * 
 * ============================================================================
 * 📁 UBICACIÓN: src/components/AIChatWidget.jsx
 * 🔗 USADO EN: App.jsx (aparece en todas las páginas)
 * ============================================================================
 */

import { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Bot, MessageSquare, Send, Sparkles, X } from 'lucide-react';

// ============================================================================
// 🔗 WEBHOOK DE CHAT - Configura esta URL en el archivo .env
// ============================================================================
// Para conectar con n8n:
// 1. Crea un workflow en n8n con un nodo Webhook (POST)
// 2. Conecta con un nodo de IA (OpenAI, Claude, etc.)
// 3. Usa un nodo "Respond to Webhook" para devolver la respuesta
// 4. Copia la URL del webhook aquí o en .env como VITE_CHAT_WEBHOOK_URL
// ============================================================================
const CHAT_WEBHOOK_URL = import.meta.env.VITE_CHAT_WEBHOOK_URL;

const AIChatWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { id: 1, text: "¡Hola! Soy Nova, la IA de N8NIADUSTRIA. ¿En qué puedo ayudarte a automatizar hoy?", sender: 'bot' }
    ]);
    const [inputValue, setInputValue] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    const toggleChat = () => setIsOpen(!isOpen);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen, isTyping]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!inputValue.trim()) return;

        // 1. Mostrar mensaje del usuario inmediatamente
        const userMsg = { id: Date.now(), text: inputValue, sender: 'user' };
        setMessages(prev => [...prev, userMsg]);
        setInputValue("");
        setIsTyping(true);

        try {
            // Validación: Si no hay URL configurada, usar simulación para no romper la demo
            if (!CHAT_WEBHOOK_URL || CHAT_WEBHOOK_URL.includes('PEGAR_AQUI')) {
                console.warn("Modo Demo: Configura CHAT_WEBHOOK_URL en el código para conectar con n8n real.");
                setTimeout(() => {
                    setMessages(prev => [...prev, {
                        id: Date.now() + 1,
                        text: "¡Estoy listo para conectarme! Crea un webhook en n8n y pega la URL en el código para que yo pueda responderte de verdad.",
                        sender: 'bot'
                    }]);
                    setIsTyping(false);
                }, 1500);
                return;
            }


            // 2. Conectar con n8n (El Agente Real)
            console.log("Enviando mensaje a n8n:", CHAT_WEBHOOK_URL, userMsg);

            const response = await fetch(CHAT_WEBHOOK_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: userMsg.text,
                    sessionId: 'session-' + Math.random().toString(36).substr(2, 9), // ID simple para memoria
                    timestamp: new Date().toLocaleString('es-ES', { timeZone: 'Europe/Madrid' }),
                    localTime: new Date().toLocaleTimeString('es-ES', { timeZone: 'Europe/Madrid' }),
                    localDate: new Date().toLocaleDateString('es-ES', { timeZone: 'Europe/Madrid' }),
                    fullTime: new Date().toString()
                })
            });

            console.log("Respuesta status:", response.status);

            if (!response.ok) {
                const errorText = await response.text();
                console.error("Error respuesta servidor:", errorText);
                throw new Error(`Error del servidor: ${response.status}`);
            }

            const textData = await response.text();
            console.log("Raw response:", textData);

            let data;
            try {
                data = JSON.parse(textData);
            } catch (e) {
                console.warn("La respuesta no es JSON, usando texto plano:", e);
                // Si falla el parseo, asumimos que el texto es la respuesta directa
                data = { text: textData };
            }

            console.log("Datos procesados:", data);

            // Manejar si n8n devuelve un array (común en n8n) o un objeto
            const responseObj = Array.isArray(data) ? data[0] : data;

            // n8n debe devolver algo como { "output": "Texto respuesta" } o { "text": "Texto respuesta" }
            // Si no, usamos el objeto entero si es string (caso fallback anterior)
            const botResponseText = responseObj?.output || responseObj?.text || responseObj?.message || (typeof responseObj === 'string' ? responseObj : "Lo siento, recibí una respuesta incomprensible.");

            setMessages(prev => [...prev, { id: Date.now() + 1, text: botResponseText, sender: 'bot' }]);

        } catch (error) {
            console.error("Error chat:", error);
            setMessages(prev => [...prev, {
                id: Date.now() + 1,
                text: "Tuve un problema conectando con mi cerebro en la nube. Intenta de nuevo.",
                sender: 'bot'
            }]);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.9 }}
                        className="mb-4 w-80 md:w-96 bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[500px]"
                    >
                        {/* Header del Chat */}
                        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                                    <Bot size={18} className="text-white" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-white text-sm">Nova AI Agent</h3>
                                    <div className="flex items-center gap-1">
                                        <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                                        <span className="text-xs text-blue-100">En línea (n8n Connected)</span>
                                    </div>
                                </div>
                            </div>
                            <button onClick={toggleChat} className="text-white/80 hover:text-white transition-colors" aria-label="Cerrar chat">
                                <X size={20} />
                            </button>
                        </div>

                        {/* Área de Mensajes */}
                        <div className="flex-1 p-4 overflow-y-auto space-y-4 scrollbar-thin scrollbar-thumb-slate-700">
                            {messages.map((msg) => (
                                <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${msg.sender === 'user'
                                        ? 'bg-blue-600 text-white rounded-br-none'
                                        : 'bg-slate-800 text-slate-200 border border-white/5 rounded-bl-none'
                                        }`}>
                                        {msg.text}
                                    </div>
                                </div>
                            ))}
                            {isTyping && (
                                <div className="flex justify-start">
                                    <div className="bg-slate-800 p-3 rounded-2xl rounded-bl-none border border-white/5 flex gap-1 items-center">
                                        <span className="text-xs text-slate-400 mr-2">Nova está escribiendo</span>
                                        <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></span>
                                        <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-75"></span>
                                        <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-150"></span>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <form onSubmit={handleSendMessage} className="p-4 bg-slate-900 border-t border-white/10">
                            <div className="relative">
                                <input
                                    type="text"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    placeholder="Pregúntame sobre automatización..."
                                    className="w-full bg-slate-800 text-white rounded-xl pl-4 pr-10 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 border border-white/5"
                                    aria-label="Escribe tu mensaje para el asistente"
                                />
                                <button
                                    type="submit"
                                    disabled={isTyping}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 text-blue-400 hover:text-blue-300 transition-colors disabled:opacity-50"
                                    aria-label="Enviar mensaje"
                                >
                                    <Send size={18} />
                                </button>
                            </div>
                            <div className="text-center mt-2">
                                <span className="text-[10px] text-slate-500 flex items-center justify-center gap-1">
                                    <Sparkles size={10} /> Powered by N8NIADUSTRIA LLM
                                </span>
                            </div>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.button
                onClick={toggleChat}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="w-14 h-14 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center shadow-lg shadow-purple-500/30 text-white relative group"
                aria-label={isOpen ? 'Cerrar asistente Nova' : 'Abrir asistente Nova'}
            >
                {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
                {!isOpen && (
                    <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 rounded-full border-2 border-slate-900"></span>
                )}
            </motion.button>
        </div>
    );
};

export default AIChatWidget;
