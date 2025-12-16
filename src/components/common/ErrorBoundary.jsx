import React from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error("Uncaught error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
                    <div className="bg-slate-900 border border-red-500/20 rounded-2xl p-8 max-w-md w-full text-center shadow-2xl">
                        <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                            <AlertTriangle className="text-red-500" size={32} />
                        </div>

                        <h1 className="text-2xl font-bold text-white mb-2">Algo salió mal</h1>
                        <p className="text-slate-400 mb-8 text-sm">
                            Ha ocurrido un error inesperado en la aplicación. Nuestro equipo ha sido notificado.
                        </p>

                        <button
                            onClick={() => window.location.reload()}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-slate-950 rounded-xl font-bold hover:bg-slate-200 transition-colors"
                        >
                            <RotateCcw size={18} />
                            Recargar Página
                        </button>

                        {process.env.NODE_ENV === 'development' && (
                            <div className="mt-8 text-left bg-black/50 p-4 rounded-lg overflow-auto max-h-40">
                                <p className="text-red-400 text-xs font-mono whitespace-pre-wrap">
                                    {this.state.error?.toString()}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
