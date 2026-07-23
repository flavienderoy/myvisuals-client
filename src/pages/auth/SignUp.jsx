import React, { useState } from 'react';
import { AuthLayout } from '../../layouts/AuthLayout';
import { Mail, Lock, User, ArrowRight, Loader2, Check, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../hooks/useToast';
import { useNavigate } from 'react-router-dom';

const SignUp = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('client');
    const [siret, setSiret] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { signUp, signIn } = useAuth();
    const toast = useToast();
    const navigate = useNavigate();

    // Password criteria check
    const hasMinLength = password.length >= 8;
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecial = /[@$!%*?&]/.test(password);

    const isPasswordValid = hasMinLength && hasUpper && hasLower && hasNumber && hasSpecial;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (role === 'studio' && !siret) {
            return toast.error("Le numéro SIRET est requis pour un compte Studio.");
        }
        if (!isPasswordValid) {
            return toast.error("Le mot de passe ne respecte pas les critères de sécurité requises.");
        }
        setIsLoading(true);
        try {
            await signUp({ email, password, options: { data: { name, role, siret: role === 'studio' ? siret : null } } });
            // Automatically sign in the user to obtain a valid session before navigating
            await signIn({ email, password });
            
            toast.success("Inscription réussie !");
            navigate(role === 'studio' ? '/studio' : '/client/projects');
        } catch (error) {
            toast.error(error.message || "Erreur lors de l'inscription");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthLayout
            title="Inscription"
            subtitle="Rejoignez l'élite des créateurs."
        >
            <form onSubmit={handleSubmit} className="space-y-5">
                {/* Role Selector */}
                <div className="flex gap-4 mb-6">
                    <button
                        type="button"
                        onClick={() => setRole('client')}
                        className={`flex-1 py-3 rounded-lg border text-sm font-bold tracking-wider uppercase transition-all ${role === 'client' ? 'bg-mv-gold text-black border-mv-gold' : 'bg-black/20 text-gray-400 border-white/10 hover:border-white/30'}`}
                    >
                        Je suis Client
                    </button>
                    <button
                        type="button"
                        onClick={() => setRole('studio')}
                        className={`flex-1 py-3 rounded-lg border text-sm font-bold tracking-wider uppercase transition-all ${role === 'studio' ? 'bg-mv-gold text-black border-mv-gold' : 'bg-black/20 text-gray-400 border-white/10 hover:border-white/30'}`}
                    >
                        Je suis Studio
                    </button>
                </div>

                <div className="space-y-2">
                    <label className="text-xs text-gray-400 uppercase tracking-widest pl-1">Nom Complet</label>
                    <div className="relative group">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-mv-gold transition-colors" size={18} />
                        <input
                            type="text"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Jean Dupont"
                            className="w-full bg-black/20 border border-white/10 rounded-lg py-3 pl-10 pr-4 text-white placeholder-gray-700 focus:outline-none focus:border-mv-gold/50 transition-all font-bold tracking-tight"
                        />
                    </div>
                </div>

                {role === 'studio' && (
                    <div className="space-y-2">
                        <label className="text-xs text-gray-400 uppercase tracking-widest pl-1">Numéro SIRET</label>
                        <div className="relative group">
                            <input
                                type="text"
                                required={role === 'studio'}
                                value={siret}
                                onChange={(e) => setSiret(e.target.value)}
                                placeholder="123 456 789 00012"
                                className="w-full bg-black/20 border border-white/10 rounded-lg py-3 px-4 text-white placeholder-gray-700 focus:outline-none focus:border-mv-gold/50 transition-all font-bold tracking-tight"
                            />
                        </div>
                    </div>
                )}

                <div className="space-y-2">
                    <label className="text-xs text-gray-400 uppercase tracking-widest pl-1">Email</label>
                    <div className="relative group">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-mv-gold transition-colors" size={18} />
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="name@example.com"
                            className="w-full bg-black/20 border border-white/10 rounded-lg py-3 pl-10 pr-4 text-white placeholder-gray-700 focus:outline-none focus:border-mv-gold/50 transition-all font-bold tracking-tight"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-xs text-gray-400 uppercase tracking-widest pl-1">Mot de passe</label>
                    <div className="relative group">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-mv-gold transition-colors" size={18} />
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full bg-black/20 border border-white/10 rounded-lg py-3 pl-10 pr-4 text-white placeholder-gray-700 focus:outline-none focus:border-mv-gold/50 transition-all font-bold tracking-tight"
                        />
                    </div>

                    {/* Password Strength Live Checklist */}
                    {password.length > 0 && (
                        <div className="p-3 bg-black/40 border border-white/10 rounded-lg text-xs space-y-1 mt-2">
                            <p className="text-gray-400 font-medium mb-1">Exigences du mot de passe :</p>
                            <div className="grid grid-cols-2 gap-1 text-[11px]">
                                <div className={`flex items-center gap-1.5 ${hasMinLength ? 'text-green-400' : 'text-gray-500'}`}>
                                    {hasMinLength ? <Check size={13} /> : <X size={13} />} 8 caractères min.
                                </div>
                                <div className={`flex items-center gap-1.5 ${hasUpper ? 'text-green-400' : 'text-gray-500'}`}>
                                    {hasUpper ? <Check size={13} /> : <X size={13} />} 1 Majuscule
                                </div>
                                <div className={`flex items-center gap-1.5 ${hasLower ? 'text-green-400' : 'text-gray-500'}`}>
                                    {hasLower ? <Check size={13} /> : <X size={13} />} 1 Minuscule
                                </div>
                                <div className={`flex items-center gap-1.5 ${hasNumber ? 'text-green-400' : 'text-gray-500'}`}>
                                    {hasNumber ? <Check size={13} /> : <X size={13} />} 1 Chiffre
                                </div>
                                <div className={`flex items-center gap-1.5 col-span-2 ${hasSpecial ? 'text-green-400' : 'text-gray-500'}`}>
                                    {hasSpecial ? <Check size={13} /> : <X size={13} />} 1 Caractère spécial (@$!%*?&)
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="pt-2 text-[10px] text-gray-500 leading-relaxed">
                    En créant un compte, vous acceptez nos <a href="#" className="underline hover:text-white">Conditions de Service</a> et notre <a href="#" className="underline hover:text-white">Politique de Confidentialité</a>.
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-mv-gold text-black font-bold uppercase tracking-widest py-3 rounded-lg hover:bg-white transition-all flex items-center justify-center gap-2 mt-4 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {isLoading ? (
                        <Loader2 className="animate-spin" size={20} />
                    ) : (
                        <>
                            Créer mon Compte ({role === 'studio' ? 'Studio' : 'Client'}) <ArrowRight size={18} />
                        </>
                    )}
                </button>
            </form>

            <div className="mt-6 text-center text-sm text-gray-500">
                Déjà membre ? <a href="/login" className="text-white hover:text-mv-gold transition-colors">Se connecter</a>
            </div>
        </AuthLayout>
    );
};

export default SignUp;
