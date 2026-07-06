import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        this.setState({
            error,
            errorInfo
        });

        // Log to console in development
        if (process.env.NODE_ENV === 'development') {
            console.error('ErrorBoundary caught an error:', error, errorInfo);
        }

        // In production, you would send this to an error tracking service
        // Example: Sentry.captureException(error, { extra: errorInfo });
    }

    handleReset = () => {
        this.setState({ hasError: false, error: null, errorInfo: null });
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-mv-black flex items-center justify-center p-8">
                    <div className="max-w-md w-full bg-mv-dark border border-white/10 rounded-xl p-8 text-center">
                        <div className="w-16 h-16 bg-red-500/10 border border-red-500/30 rounded-full flex items-center justify-center mx-auto mb-6">
                            <AlertTriangle className="text-red-500" size={32} />
                        </div>

                        <h1 className="text-2xl font-bold tracking-tight text-white mb-2">
                            Oups, quelque chose s'est mal passé
                        </h1>

                        <p className="text-gray-400 text-sm mb-6">
                            Une erreur inattendue s'est produite. Nos équipes ont été notifiées.
                        </p>

                        {process.env.NODE_ENV === 'development' && this.state.error && (
                            <details className="mb-6 text-left">
                                <summary className="text-xs text-gray-500 cursor-pointer hover:text-white mb-2">
                                    Détails de l'erreur (dev only)
                                </summary>
                                <div className="bg-black/50 p-4 rounded border border-white/10 hover:border-[#D4AF37]/30 transition-all duration-300 overflow-auto max-h-48">
                                    <pre className="text-xs text-red-400 font-mono">
                                        {this.state.error.toString()}
                                        {this.state.errorInfo?.componentStack}
                                    </pre>
                                </div>
                            </details>
                        )}

                        <div className="flex gap-3 justify-center">
                            <button
                                onClick={this.handleReset}
                                className="px-6 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-lg transition-colors text-sm"
                            >
                                Réessayer
                            </button>
                            <button
                                onClick={() => window.location.href = '/'}
                                className="px-6 py-2 bg-mv-gold hover:bg-white text-black font-medium rounded-lg transition-colors text-sm flex items-center gap-2"
                            >
                                <RefreshCw size={16} />
                                Retour à l'accueil
                            </button>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
