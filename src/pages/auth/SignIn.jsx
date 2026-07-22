import React, { useState } from 'react';
import { AuthLayout } from '../../layouts/AuthLayout';
import { Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../hooks/useToast';
import { useNavigate, Link } from 'react-router-dom';

const SignIn = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { signIn } = useAuth();
    const toast = useToast();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const data = await signIn({ email, password });
            const userRole = data?.user?.user_metadata?.role || 'client';
            
            toast.success("Connexion réussie");
            if (userRole === 'studio') {
                navigate('/studio');
            } else {
                navigate('/client/projects');
            }
        } catch (error) {
            toast.error(error.message || "Erreur lors de la connexion");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthLayout
            title="Connexion"
            subtitle="Accédez à votre espace studio."
        >
            <form onSubmit={handleSubmit} className="space-y-6">
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
                            className="w-full bg-black/20 border border-white/10 rounded-lg py-3 pl-10 pr-4 text-white placeholder-gray-700 focus:outline-none focus:border-mv-gold/50 transition-all font-bold tracking-tight text-white"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <div className="flex justify-between items-center pl-1">
                        <label className="text-xs text-gray-400 uppercase tracking-widest">Mot de passe</label>
                        <Link to="/forgot-password" className="text-xs text-mv-gold hover:text-white transition-colors">Oublié ?</Link>
                    </div>
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

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-mv-gold text-black font-bold uppercase tracking-widest py-3 rounded-lg hover:bg-white transition-all flex items-center justify-center gap-2 mt-8 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {isLoading ? (
                        <Loader2 className="animate-spin" size={20} />
                    ) : (
                        <>
                            Se Connecter <ArrowRight size={18} />
                        </>
                    )}
                </button>
            </form>

            <div className="mt-6 text-center text-sm text-gray-500">
                Pas encore de compte ? <a href="/signup" className="text-white hover:text-mv-gold transition-colors">Créer un compte</a>
            </div>
        </AuthLayout>
    );
};

export default SignIn;
