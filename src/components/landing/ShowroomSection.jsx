import React from 'react';
import { Lock, FileImage, CreditCard, CheckCircle, ExternalLink, ArrowRight } from 'lucide-react';
import Reveal from './Reveal';

const ShowroomSection = () => {
    return (
        <section id="showroom" className="relative py-32 px-6 bg-transparent overflow-hidden">
            <div className="max-w-7xl mx-auto relative z-10 flex flex-col lg:flex-row items-center gap-16">

                {/* Left: Copy & Value Proposition */}
                <Reveal delay={0} className="w-full lg:w-1/2 flex flex-col items-start text-left">
                    <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 mb-6">
                        <Lock className="w-3 h-3 text-[#D4AF37]" />
                        <span className="text-xs font-bold text-[#D4AF37] tracking-wider uppercase">Paiement & Livraison</span>
                    </div>

                    <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-6 leading-tight">
                        Un lien magique.<br />
                        <span className="bg-gradient-to-r from-[#D4AF37] to-white text-transparent bg-clip-text">Payé puis débloqué.</span>
                    </h2>

                    <p className="text-lg text-white/70 font-medium leading-relaxed mb-10 max-w-xl">
                        Conçu pour les freelances et créatifs indépendants. Envoyez un simple lien "Showroom" généré automatiquement. Votre client visionne son rendu avec un filigrane (watermark) intelligent.
                        <strong> Il règle la facture sur la page, et le fichier haute-définition est débloqué pour le téléchargement.</strong> Zéro relance, zéro WeTransfer.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full mb-10">
                        <div className="landing-glass p-5 rounded-2xl border border-white/10 group hover:border-[#D4AF37]/30 transition-colors">
                            <CreditCard className="w-8 h-8 text-[#D4AF37] mb-3" />
                            <h4 className="text-white font-semibold mb-2">Check-out intégré</h4>
                            <p className="text-sm text-white/50">Stripe nativement intégré. Vos clients paient directement sur la page de visionnage.</p>
                        </div>
                        <div className="landing-glass p-5 rounded-2xl border border-white/10 group hover:border-[#D4AF37]/30 transition-colors">
                            <FileImage className="w-8 h-8 text-[#D4AF37] mb-3" />
                            <h4 className="text-white font-semibold mb-2">Watermark Auto</h4>
                            <p className="text-sm text-white/50">Protégez votre travail instantanément sans devoir exporter deux fois.</p>
                        </div>
                    </div>
                </Reveal>

                {/* Right: Mockup of the Showroom Delivery Experience */}
                <Reveal delay={200} direction="left" className="w-full lg:w-1/2 relative h-[550px] flex items-center justify-center">
                    {/* Abstract Glow behind the mockup */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-[#D4AF37]/20 rounded-full blur-[80px]"></div>

                    {/* The "Showroom" Mockup Device */}
                    <div className="relative w-full max-w-md landing-glass rounded-3xl border border-white/10 overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] transform rotate-2 hover:rotate-0 transition-all duration-700 hover:scale-105 z-10 group">

                        {/* Browser Header */}
                        <div className="w-full h-12 border-b border-white/10 bg-white/5 flex items-center px-4 space-x-2">
                            <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                            <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                            <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
                            <div className="mx-auto bg-black/50 border border-white/10 rounded-full px-4 py-1 text-[10px] text-white/50 flex items-center space-x-2">
                                <Lock className="w-3 h-3 text-[#D4AF37]" />
                                <span>myvisuals.co/showroom/secure-link</span>
                            </div>
                        </div>

                        {/* Rendered Image with Watermark */}
                        <div className="relative w-full aspect-[4/3] bg-black overflow-hidden flex items-center justify-center group-hover:brightness-110 transition-all">
                            {/* Dummy Image representing client work */}
                            <img src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" alt="Client Delivery" className="absolute inset-0 w-full h-full object-cover opacity-60" />

                            {/* The Watermark Overlay */}
                            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none">
                                <span className="text-white/30 text-3xl font-bold tracking-widest -rotate-12 border-y-2 border-white/20 px-8 py-2 mix-blend-overlay">
                                    PREVIEW ONLY
                                </span>
                            </div>
                        </div>

                        {/* Payment & Unlock Area */}
                        <div className="p-6 bg-gradient-to-b from-[#111111] to-[#0a0a0a] relative">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h3 className="text-lg font-bold text-white mb-1">Campagne Automne</h3>
                                    <p className="text-xs text-white/50">12 fichiers HD originaux (ZIP)</p>
                                </div>
                                <div className="text-right">
                                    <span className="text-2xl font-black text-white">1,500€</span>
                                    <p className="text-[10px] text-white/40 uppercase tracking-widest">Facture #4928</p>
                                </div>
                            </div>

                            <button className="w-full py-4 rounded-xl bg-gradient-to-br from-[#D4AF37] to-[#B8962E] text-black font-bold flex items-center justify-center space-x-2 shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:shadow-[0_0_30px_rgba(212,175,55,0.6)] hover:-translate-y-1 transition-all duration-300">
                                <Lock className="w-4 h-4" />
                                <span>Payer & Débloquer</span>
                            </button>
                        </div>
                    </div>

                    {/* Floating Success Notification (Animated simulating completion) */}
                    <div className="absolute -bottom-6 -right-6 z-20 landing-glass px-6 py-4 rounded-2xl border border-emerald-500/30 flex items-center space-x-4 shadow-2xl translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-300">
                        <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center border border-emerald-500/50">
                            <CheckCircle className="w-5 h-5 text-emerald-400" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-white">Paiement Réussi</p>
                            <p className="text-xs text-emerald-400">Téléchargement en cours...</p>
                        </div>
                    </div>
                </Reveal>

            </div>
        </section>
    );
};

export default ShowroomSection;
