import React, { useState, useEffect } from 'react';
import { AuthLayout } from '../../layouts/AuthLayout';
import { Lock, ArrowRight, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { useToast } from '../../hooks/useToast';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../../supabaseClient';

const ResetPassword = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [accessToken, setAccessToken] = useState(null);
    const toast = useToast();
    const navigate = useNavigate();

    useEffect(() => {
        // Extract recovery token from URL hash if present
        const hash = window.location.hash;
        if (hash && hash.includes('access_token=')) {
            const params = new URLSearchParams(hash.replace('#', '?'));
            const token = params.get('access_token');
            if (token) {
                setAccessToken(token);
            }
        }

        // Also check if Supabase has an active session from the reset link
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session?.access_token) {
                setAccessToken(session.access_token);
            }
        });
    }, []);

    // Password criteria validation rules
    const hasMinLength = password.length >= 8;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecial = /[@$!%*?&]/.test(password);
    const isPasswordValid = hasMinLength && hasUppercase && hasLowercase && hasNumber && hasSpecial;
    const isMatching = password && password === confirmPassword;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isPasswordValid) {
            toast.error("Le mot de passe ne respecte pas les critères de sécurité.");
            return;
        }

        if (!isMatching) {
            toast.error("Les mots de passe ne correspondent pas.");
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/reset-password`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    ...(accessToken ? { 'Authorization': `Bearer ${accessToken}` } : {})
                },
                body: JSON.stringify({ 
                    password,
                    accessToken 
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || data.details || "Erreur lors de la réinitialisation");
            }

            setIsSuccess(true);
            toast.success("Mot de passe modifié avec succès !");
            setTimeout(() => {
                navigate('/login');
            }, 3000);
        } catch (error) {
            toast.error(error.message || "Erreur lors de la réinitialisation du mot de passe");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthLayout
            title="Nouveau mot de passe"
            subtitle="Définissez votre nouveau mot de passe sécurisé."
        >
            {isSuccess ? (
                <div className="text-center py-6 space-y-6">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/10 text-green-400 border border-green-500/20 mb-2">
                        <CheckCircle2 size={32} />
                    </div>
                    <div className="space-y-2">
                        <h3 className="text-xl font-bold text-white">Mot de passe réinitialisé</h3>
                        <p className="text-sm text-gray-400">
                            Votre mot de passe a été mis à jour avec succès. Vous allez être redirigé vers la page de connexion...
                        </p>
                    </div>
                    <Link
                        to="/login"
                        className="w-full bg-mv-gold text-black font-bold uppercase tracking-widest py-3 rounded-lg hover:bg-white transition-all flex items-center justify-center gap-2 mt-4"
                    >
                        Se connecter maintenant <ArrowRight size={18} />
                    </Link>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-2">
                        <label className="text-xs text-gray-400 uppercase tracking-widest pl-1">Nouveau mot de passe</label>
                        <div className="relative group">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-mv-gold transition-colors" size={18} />
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full bg-black/20 border border-white/10 rounded-lg py-3 pl-10 pr-4 text-white placeholder-gray-700 focus:outline-none focus:border-mv-gold/50 transition-all font-bold tracking-tight text-white"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs text-gray-400 uppercase tracking-widest pl-1">Confirmer le mot de passe</label>
                        <div className="relative group">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-mv-gold transition-colors" size={18} />
                            <input
                                type="password"
                                required
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full bg-black/20 border border-white/10 rounded-lg py-3 pl-10 pr-4 text-white placeholder-gray-700 focus:outline-none focus:border-mv-gold/50 transition-all font-bold tracking-tight text-white"
                            />
                        </div>
                    </div>

                    {/* Criteria checklist */}
                    <div className="p-3 bg-black/30 border border-white/5 rounded-lg text-xs space-y-1.5 text-gray-400">
                        <div className="font-semibold text-gray-300 mb-1">Exigences de sécurité :</div>
                        <div className={`flex items-center gap-2 ${hasMinLength ? 'text-green-400' : 'text-gray-500'}`}>
                            <CheckCircle2 size={13} className={hasMinLength ? 'text-green-400' : 'opacity-30'} /> 8 caractères minimum
                        </div>
                        <div className={`flex items-center gap-2 ${hasUppercase && hasLowercase ? 'text-green-400' : 'text-gray-500'}`}>
                            <CheckCircle2 size={13} className={hasUppercase && hasLowercase ? 'text-green-400' : 'opacity-30'} /> Majuscule et minuscule
                        </div>
                        <div className={`flex items-center gap-2 ${hasNumber ? 'text-green-400' : 'text-gray-500'}`}>
                            <CheckCircle2 size={13} className={hasNumber ? 'text-green-400' : 'opacity-30'} /> Au moins un chiffre
                        </div>
                        <div className={`flex items-center gap-2 ${hasSpecial ? 'text-green-400' : 'text-gray-500'}`}>
                            <CheckCircle2 size={13} className={hasSpecial ? 'text-green-400' : 'opacity-30'} /> Caractère spécial (@$!%*?&)
                        </div>
                        {confirmPassword && (
                            <div className={`flex items-center gap-2 pt-1 border-t border-white/5 ${isMatching ? 'text-green-400' : 'text-red-400'}`}>
                                {isMatching ? <CheckCircle2 size={13} /> : <AlertCircle size={13} />}
                                {isMatching ? 'Les mots de passe correspondent' : 'Les mots de passe ne correspondent pas'}
                            </div>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading || !isPasswordValid || !isMatching}
                        className="w-full bg-mv-gold text-black font-bold uppercase tracking-widest py-3 rounded-lg hover:bg-white transition-all flex items-center justify-center gap-2 mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            <Loader2 className="animate-spin" size={20} />
                        ) : (
                            <>
                                Enregistrer le mot de passe <ArrowRight size={18} />
                            </>
                        )}
                    </button>
                </form>
            )}
        </AuthLayout>
    );
};

export default ResetPassword;
