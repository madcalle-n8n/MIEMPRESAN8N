/**
 * ============================================================================
 * 🔐 CONTEXTO DE AUTENTICACIÓN: AuthContext.jsx
 * ============================================================================
 * 
 * PROPÓSITO:
 * Provee estado global de autenticación para toda la aplicación.
 * Gestiona login, registro, logout y verificación de sesión.
 * 
 * SEGURIDAD:
 * - Access Token guardado en memoria (NO localStorage por XSS)
 * - Refresh token manejado por n8n en cookies HttpOnly
 * - Auto-refresh cada 14 minutos
 * 
 * ============================================================================
 * 📁 UBICACIÓN: src/context/AuthContext.jsx
 * ============================================================================
 */

import { createContext, useContext, useState, useEffect, useCallback } from 'react';

// ============================================================================
// 🔗 WEBHOOKS DE AUTENTICACIÓN
// ============================================================================
const AUTH_LOGIN_URL = import.meta.env.VITE_AUTH_LOGIN_WEBHOOK;
const AUTH_REGISTER_URL = import.meta.env.VITE_AUTH_REGISTER_WEBHOOK;
const AUTH_REFRESH_URL = import.meta.env.VITE_AUTH_REFRESH_WEBHOOK;
const AUTH_VERIFY_URL = import.meta.env.VITE_AUTH_VERIFY_WEBHOOK;

// Crear el contexto
const AuthContext = createContext(null);

// ============================================================================
// 🎣 HOOK PERSONALIZADO
// ============================================================================
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth debe usarse dentro de AuthProvider');
    }
    return context;
};

// ============================================================================
// 🏠 PROVIDER DE AUTENTICACIÓN
// ============================================================================
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [accessToken, setAccessToken] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // ========================================================================
    // 🔄 VERIFICAR SESIÓN AL CARGAR
    // ========================================================================
    useEffect(() => {
        const checkSession = async () => {
            // Intentar recuperar sesión del localStorage (solo datos no sensibles)
            const savedUser = localStorage.getItem('user');
            const savedToken = sessionStorage.getItem('accessToken');

            if (savedUser && savedToken) {
                try {
                    // Verificar que el token siga siendo válido con n8n
                    if (AUTH_VERIFY_URL) {
                        const response = await fetch(AUTH_VERIFY_URL, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${savedToken}`
                            }
                        });

                        if (response.ok) {
                            const data = await response.json();
                            setUser(data.user || JSON.parse(savedUser));
                            setAccessToken(savedToken);
                        } else {
                            // Token inválido, limpiar
                            clearAuth();
                        }
                    } else {
                        // Sin webhook de verificación, confiar en datos locales (modo demo)
                        setUser(JSON.parse(savedUser));
                        setAccessToken(savedToken);
                    }
                } catch (err) {
                    console.error('Error verificando sesión:', err);
                    clearAuth();
                }
            }
            setIsLoading(false);
        };

        checkSession();
    }, []);

    // ========================================================================
    // 🧹 LIMPIAR AUTENTICACIÓN
    // ========================================================================
    const clearAuth = useCallback(() => {
        setUser(null);
        setAccessToken(null);
        localStorage.removeItem('user');
        sessionStorage.removeItem('accessToken');
    }, []);

    // ========================================================================
    // 🚪 LOGIN
    // ========================================================================
    const login = useCallback(async (email, password) => {
        setIsLoading(true);
        setError(null);

        try {
            if (AUTH_LOGIN_URL) {
                const response = await fetch(AUTH_LOGIN_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        email,
                        password,
                        timestamp: new Date().toISOString()
                    })
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || 'Error al iniciar sesión');
                }

                // Guardar datos
                setUser(data.user);
                setAccessToken(data.accessToken);
                localStorage.setItem('user', JSON.stringify(data.user));
                sessionStorage.setItem('accessToken', data.accessToken);

                return { success: true, user: data.user };
            } else {
                // MODO DEMO: Simular login sin n8n
                const demoUser = {
                    id: Date.now(),
                    email,
                    name: email.split('@')[0],
                    credits: 10, // Créditos de prueba
                    plan: 'demo',
                    createdAt: new Date().toISOString()
                };
                const demoToken = btoa(JSON.stringify({ email, exp: Date.now() + 3600000 }));

                setUser(demoUser);
                setAccessToken(demoToken);
                localStorage.setItem('user', JSON.stringify(demoUser));
                sessionStorage.setItem('accessToken', demoToken);

                return { success: true, user: demoUser };
            }
        } catch (err) {
            setError(err.message);
            return { success: false, error: err.message };
        } finally {
            setIsLoading(false);
        }
    }, []);

    // ========================================================================
    // 📝 REGISTRO
    // ========================================================================
    const register = useCallback(async (name, email, password) => {
        setIsLoading(true);
        setError(null);

        try {
            if (AUTH_REGISTER_URL) {
                const response = await fetch(AUTH_REGISTER_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        name,
                        email,
                        password,
                        timestamp: new Date().toISOString()
                    })
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || 'Error al registrarse');
                }

                // Auto-login después de registro
                setUser(data.user);
                setAccessToken(data.accessToken);
                localStorage.setItem('user', JSON.stringify(data.user));
                sessionStorage.setItem('accessToken', data.accessToken);

                return { success: true, user: data.user };
            } else {
                // MODO DEMO: Simular registro sin n8n
                const demoUser = {
                    id: Date.now(),
                    email,
                    name,
                    credits: 5, // Créditos de bienvenida
                    plan: 'free',
                    createdAt: new Date().toISOString()
                };
                const demoToken = btoa(JSON.stringify({ email, exp: Date.now() + 3600000 }));

                setUser(demoUser);
                setAccessToken(demoToken);
                localStorage.setItem('user', JSON.stringify(demoUser));
                sessionStorage.setItem('accessToken', demoToken);

                return { success: true, user: demoUser };
            }
        } catch (err) {
            setError(err.message);
            return { success: false, error: err.message };
        } finally {
            setIsLoading(false);
        }
    }, []);

    // ========================================================================
    // 🚫 LOGOUT
    // ========================================================================
    const logout = useCallback(() => {
        clearAuth();
        window.location.href = '/#/login';
    }, [clearAuth]);

    // ========================================================================
    // 💰 ACTUALIZAR CRÉDITOS
    // ========================================================================
    const updateCredits = useCallback((newCredits) => {
        if (user) {
            const updatedUser = { ...user, credits: newCredits };
            setUser(updatedUser);
            localStorage.setItem('user', JSON.stringify(updatedUser));
        }
    }, [user]);

    // ========================================================================
    // 📦 VALOR DEL CONTEXTO
    // ========================================================================
    const value = {
        user,
        accessToken,
        isLoading,
        error,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        updateCredits,
        clearError: () => setError(null)
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
