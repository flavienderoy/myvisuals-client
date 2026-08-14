import React from 'react';
import { AlertTriangle, RefreshCw, Copy, Check } from 'lucide-react';
import { captureException, isMonitoringEnabled } from '../../monitoring';

/**
 * Génère une référence d'incident courte, lisible à l'oral.
 *
 * C'est la clé de corrélation côté navigateur : l'utilisateur la communique au
 * support, qui retrouve l'événement exact dans Sentry sans avoir à deviner
 * l'horodatage. Elle joue le même rôle que l'en-tête `X-Request-Id` côté API.
 *
 * @see docs/PROCESSUS_ANOMALIES.md
 */
function buildIncidentRef() {
    const stamp = new Date().toISOString().slice(2, 10).replace(/-/g, '');
    const random = Math.random().toString(36).slice(2, 7).toUpperCase();
    return `INC-${stamp}-${random}`;
}

export class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null, incidentRef: null, copied: false };
    }

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        const incidentRef = buildIncidentRef();
        this.setState({ error, errorInfo, incidentRef });

        if (import.meta.env.DEV) {
            console.error('ErrorBoundary caught an error:', error, errorInfo);
        }

        // Remontée à la sonde applicative. Sans DSN configuré, no-op silencieux.
        captureException(error, {
            incidentRef,
            componentStack: errorInfo?.componentStack,
            route: window.location.pathname,
        });
    }

    handleReset = () => {
        this.setState({ hasError: false, error: null, errorInfo: null, incidentRef: null, copied: false });
    };

    handleCopyRef = async () => {
        try {
            await navigator.clipboard.writeText(this.state.incidentRef);
            this.setState({ copied: true });
            setTimeout(() => this.setState({ copied: false }), 2000);
        } catch {
            // Presse-papiers indisponible (contexte non sécurisé, permission
            // refusée) : la référence reste lisible et recopiable à la main.
        }
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

                        {/*
                          Le message doit rester exact : annoncer une notification
                          automatique alors qu'aucune sonde n'est active reviendrait
                          à promettre une prise en charge qui n'aura pas lieu.
                        */}
                        <p className="text-gray-400 text-sm mb-6">
                            Une erreur inattendue s'est produite.{' '}
                            {isMonitoringEnabled()
                                ? "L'incident a été transmis automatiquement à notre équipe technique."
                                : 'Communiquez la référence ci-dessous au support pour que nous puissions intervenir.'}
                        </p>

                        {this.state.incidentRef && (
                            <div className="mb-6">
                                <p className="text-xs text-gray-500 mb-2">Référence de l'incident</p>
                                <button
                                    onClick={this.handleCopyRef}
                                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-black/50 border border-white/10 hover:border-[#D4AF37]/30 rounded-lg transition-colors group"
                                    title="Copier la référence"
                                >
                                    <code className="text-sm font-mono text-[#D4AF37]">
                                        {this.state.incidentRef}
                                    </code>
                                    {this.state.copied ? (
                                        <Check size={14} className="text-green-400" />
                                    ) : (
                                        <Copy size={14} className="text-gray-500 group-hover:text-white" />
                                    )}
                                </button>
                            </div>
                        )}

                        {import.meta.env.DEV && this.state.error && (
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
