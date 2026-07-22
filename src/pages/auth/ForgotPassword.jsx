import React, { useState } from 'react';
import { AuthLayout } from '../../layouts/AuthLayout';
import { Mail, ArrowRight, Loader2, CheckCircle2, ArrowLeft } from 'lucide-react';
import { useToast } from '../../hooks/useToast';
import { Link } from 'react-router-dom';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const toast = useToast();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/forgot-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Une erreur est survenue lors de la demande");
            }

            setIsSubmitted(true);
            toast.success("Demande envoyée avec succès");
        } catch (error) {
            toast.error(error.message || "Erreur lors de la demande de réinitialisation");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthLayout
            title="Mot de passe oublié"
            subtitle="Saisissez votre email pour recevoir un lien de réinitialisation."
        >
            {isSubmitted ? (
                <div className="text-center py-6 space-y-6">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-mv-gold/10 text-mv-gold border border-mv-gold/20 mb-2 animate-bounce">
                        <CheckCircle2 size={32} />
                    </div>
                    <div className="space-y-2">
                        <h3 className="text-xl font-bold text-white">Vérifiez vos emails</h3>
                        <p className="text-sm text-gray-400 max-w-sm mx-auto">
                            Un e-mail contenant les instructions de réinitialisation a été envoyé à <span className="text-mv-gold font-mono">{email}</span>.
                        </p>
                    </div>

                    <div className="pt-4">
                        <Link
                            to="/login"
                            className="inline-flex items-center justify-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
                        >
                            <ArrowLeft size={16} /> Retour à la connexion
                        </Link>
                    </div>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-xs text-gray-400 uppercase tracking-widest pl-1">Adresse Email</label>
                        <div className="relative group">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-mv-gold transition-colors" size={18} />
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="name@example.com"
                                className="w-full bg-black/20 border border-white/10 rounded-lg py-3 pl-10 pr-4 text-white placeholder-gray-700 focus:outline-none focus:border-mv-gold/50 transition-all font-bold tracking-tight text-white"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-mv-gold text-black font-bold uppercase tracking-widest py-3 rounded-lg hover:bg-white transition-all flex items-center justify-center gap-2 mt-8 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            <Loader2 className="animate-spin" size={20} />
                        ) : (
                            <>
                                Envoyer le lien <ArrowRight size={18} />
                            </>
                        )}
                    </button>

                    <div className="mt-6 text-center text-sm">
                        <Link to="/login" className="text-gray-400 hover:text-white transition-colors flex items-center justify-center gap-2">
                            <ArrowLeft size={16} /> Retour à la connexion
                        </Link>
                    </div>
                </form>
            )}
        </AuthLayout>
    );
};

export default ForgotPassword;
