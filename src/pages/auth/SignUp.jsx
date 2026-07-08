import React, { useState } from 'react';
import { AuthLayout } from '../../layouts/AuthLayout';
import { Mail, Lock, User, ArrowRight, Loader2 } from 'lucide-react';
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
    const { signUp } = useAuth();
    const toast = useToast();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (role === 'studio' && !siret) {
            return toast.error("Le numéro SIRET est requis pour un compte Studio.");
        }
        setIsLoading(true);
        try {
            await signUp({ email, password, options: { data: { name, role, siret: role === 'studio' ? siret : null } } });
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
                            Créer mon Compte <ArrowRight size={18} />
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
