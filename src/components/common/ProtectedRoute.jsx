/**
 * ============================================================================
 * 🔒 COMPONENTE: ProtectedRoute
 * ============================================================================
 * 
 * PROPÓSITO:
 * Protege rutas que requieren autenticación. Redirige al login si el usuario
 * no está autenticado.
 * 
 * USO:
 * <Route path="/crm" element={<ProtectedRoute><CRMDashboard /></ProtectedRoute>} />
 * 
 * ============================================================================
 * 📁 UBICACIÓN: src/components/common/ProtectedRoute.jsx
 * ============================================================================
 */

import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, isLoading } = useAuth();
    const location = useLocation();

    // Mostrar loader mientras verifica autenticación
    if (isLoading) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-slate-400">Verificando sesión...</p>
                </div>
            </div>
        );
    }

    // Redirigir al login si no está autenticado
    if (!isAuthenticated) {
        // Guardar la ruta intentada para redirigir después del login
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children;
};

export default ProtectedRoute;
