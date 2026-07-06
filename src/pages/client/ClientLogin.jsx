import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight, Image } from 'lucide-react';
import { LuxuryTitle } from '../../components/common/LuxuryTitle';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../hooks/useToast';

const ClientLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { signIn } = useAuth();
    const toast = useToast();

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await signIn({ email, password });
            toast.success("Connexion client réussie");
            navigate('/client/dashboard');
        } catch (error) {
            toast.error(error.message || "Erreur de connexion");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-mv-black flex items-center justify-center p-6">
            <div className="w-full max-w-md">
                {/* Agency Branding */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-mv-gold to-orange-600 mb-4">
                        <Image className="text-black" size={32} />
                    </div>
                    <LuxuryTitle text="Client Portal" size="text-3xl" className="text-white mb-2" />
                    <p className="text-gray-400 text-sm">Access your projects and files</p>
                </div>

                {/* Login Card */}
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
                    <form onSubmit={handleLogin} className="space-y-6">
                        <div>
                            <label className="block text-xs text-gray-400 uppercase tracking-widest mb-2">
                                Email
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-black/20 border border-white/10 rounded-lg py-3 pl-10 pr-4 text-white text-sm focus:outline-none focus:border-mv-gold/50 transition-colors"
                                    placeholder="your.email@company.com"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs text-gray-400 uppercase tracking-widest mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-black/20 border border-white/10 rounded-lg py-3 pl-10 pr-4 text-white text-sm focus:outline-none focus:border-mv-gold/50 transition-colors"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-mv-gold hover:bg-white text-black font-bold py-3 rounded-lg transition-all flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isLoading ? "Connexion..." : "Sign In"}
                            {!isLoading && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
                        </button>
                    </form>
                </div>

                <div className="mt-6 text-center text-sm text-gray-500">
                    Pas encore de compte ? <button onClick={() => navigate('/client/signup')} className="text-white hover:text-mv-gold transition-colors">Créer un compte</button>
                </div>

                {/* Help Text */}
                <p className="text-center text-xs text-gray-500 mt-6">
                    Need help? Contact your agency representative
                </p>
            </div>
        </div>
    );
};

export default ClientLogin;
