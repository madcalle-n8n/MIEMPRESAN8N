/**
 * ============================================================================
 * 🔔 COMPONENTE: Toast (Sistema de Notificaciones)
 * ============================================================================
 * 
 * PROPÓSITO:
 * Sistema de notificaciones flotantes (toasts) que aparecen en la esquina
 * inferior derecha de la pantalla para feedback al usuario.
 * 
 * USO:
 * 1. Importar el hook: import { useToast } from '../components/ui/Toast';
 * 2. Obtener la función: const { addToast } = useToast();
 * 3. Mostrar notificación: addToast("Mensaje", "success");
 * 
 * TIPOS DE TOAST:
 * - "success" (verde): Operaciones exitosas
 * - "error" (rojo): Errores o fallos
 * - "info" (azul): Información general
 * 
 * ============================================================================
 * 📁 UBICACIÓN: src/components/ui/Toast.jsx
 * 🔗 PROVEEDOR EN: App.jsx (ToastProvider)
 * ============================================================================
 */

import { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, AlertCircle, Info } from 'lucide-react';

const ToastContext = createContext(null);

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const removeToast = useCallback((id) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, []);

    const addToast = useCallback((message, type = 'info', duration = 5000) => {
        const id = Date.now().toString();
        setToasts((prev) => [...prev, { id, message, type }]);

        if (duration) {
            setTimeout(() => {
                removeToast(id);
            }, duration);
        }
    }, [removeToast]);

    return (
        <ToastContext.Provider value={{ addToast, removeToast }}>
            {children}
            <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
                <AnimatePresence>
                    {toasts.map((toast) => (
                        <ToastItem key={toast.id} {...toast} onClose={() => removeToast(toast.id)} />
                    ))}
                </AnimatePresence>
            </div>
        </ToastContext.Provider>
    );
};

const ToastItem = ({ message, type, onClose }) => {
    const styles = {
        success: 'bg-green-500/10 border-green-500/20 text-green-400',
        error: 'bg-red-500/10 border-red-500/20 text-red-400',
        info: 'bg-blue-500/10 border-blue-500/20 text-blue-400',
    };

    const icons = {
        success: <CheckCircle2 size={20} />,
        error: <AlertCircle size={20} />,
        info: <Info size={20} />,
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.9 }}
            layout
            className={`pointer-events-auto min-w-[300px] max-w-md p-4 rounded-xl border backdrop-blur-md shadow-lg flex items-start gap-3 ${styles[type] || styles.info}`}
        >
            <span className="mt-0.5">{icons[type] || icons.info}</span>
            <p className="flex-1 text-sm font-medium">{message}</p>
            <button onClick={onClose} className="opacity-70 hover:opacity-100 transition-opacity">
                <X size={16} />
            </button>
        </motion.div>
    );
};

export default ToastProvider;
