import React from 'react';
import { Check } from 'lucide-react';
import Reveal from './Reveal';

const PricingSection = () => {
    return (
        <section
            id="pricing"
            className="relative py-32 px-6 bg-transparent overflow-hidden group/section"
        >
            <div className="max-w-7xl mx-auto relative z-10 flex flex-col items-center">

                {/* Section Header */}
                <Reveal delay={0}>
                    <div className="text-center mb-20 max-w-3xl">
                        <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-6">
                            Une offre à la hauteur de<br className="hidden sm:block" />
                            <span className="bg-gradient-to-r from-white to-[#D4AF37] text-transparent bg-clip-text"> votre talent.</span>
                        </h2>
                        <p className="text-lg text-white/70 font-medium leading-relaxed max-w-2xl mx-auto">
                            Choisissez le moteur qui propulsera vos livraisons visuelles vers de nouveaux standards.
                        </p>
                    </div>
                </Reveal>

                {/* Triptyque Premium Layout */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl">

                    {/* Carte 1 : Indie Artist */}
                    <Reveal delay={200} direction="up" className="flex flex-col landing-glass rounded-3xl border border-white/10 p-8 transition-all duration-500 hover:-translate-y-2 hover:border-white/20 hover:shadow-[0_20px_40px_rgba(0,0,0,0.5)] bg-[#1A1A1A]/40 backdrop-blur-xl relative group">
                        {/* Overflow constraint items */}
                        <div className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none -translate-y-px">
                            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                        </div>

                        <div className="mb-8">
                            <h3 className="text-2xl font-semibold text-white mb-2">Indie Artist</h3>
                            <p className="text-sm text-white/50">Le point d'entrée pour les indépendants exigeants.</p>
                        </div>

                        <div className="mb-8">
                            <span className="text-5xl font-bold text-white">49€</span>
                            <span className="text-lg text-white/50">/mois</span>
                        </div>

                        <ul className="flex flex-col space-y-4 mb-10 flex-1">
                            {['1 Studio Workspace', '5 Showrooms actifs', 'Stockage Pro (500 Go)', 'Qualité Vidéo HD (1080p)', 'Support Email'].map((feature, idx) => (
                                <li key={idx} className="flex items-center space-x-3 text-sm text-white/80">
                                    <Check className="w-5 h-5 text-[#D4AF37] shrink-0" />
                                    <span>{feature}</span>
                                </li>
                            ))}
                        </ul>

                        <button onClick={() => window.location.href = '/signup'} className="w-full py-4 rounded-xl landing-glass border border-white/10 text-white font-semibold hover:bg-white/10 transition-colors duration-300">
                            Commencer
                        </button>
                    </Reveal>

                    {/* Carte 2 : Creative Studio (ACCENTUÉE) */}
                    <Reveal delay={400} direction="scale" className="flex flex-col landing-glass rounded-3xl border border-[#D4AF37]/40 p-8 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(212,175,55,0.15)] bg-[#1A1A1A]/80 backdrop-blur-2xl relative group transform md:scale-105 z-10 shadow-[0_0_30px_rgba(0,0,0,0.8)]">
                        {/* Overflow constraint items */}
                        <div className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none -translate-y-px">
                            {/* Internal Halo */}
                            <div className="absolute inset-0 bg-[#D4AF37]/10 blur-2xl pointer-events-none group-hover:bg-[#D4AF37]/15 transition-colors duration-500"></div>
                            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent opacity-50"></div>
                        </div>

                        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 py-1 bg-[#D4AF37] rounded-full text-[10px] font-bold text-black tracking-widest uppercase shadow-[0_0_15px_#D4AF37]">
                            Recommandé
                        </div>

                        <div className="mb-8 relative z-10 mt-2">
                            <h3 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                                Creative Studio
                            </h3>
                            <p className="text-sm text-[#D4AF37]/80">La puissance totale pour livrer vos clients.</p>
                        </div>

                        <div className="mb-8 relative z-10">
                            <span className="text-5xl font-bold text-white">129€</span>
                            <span className="text-lg text-white/50">/mois</span>
                        </div>

                        <ul className="flex flex-col space-y-4 mb-10 flex-1 relative z-10">
                            {['Showrooms illimités', 'Comparateur "Diff Visuals"', 'Validation & Annotations Vidéo', 'Branding Studio Personnalisé (Marque Blanche)', 'Qualité Vidéo 4K', 'Stockage Étendu (2 To)'].map((feature, idx) => (
                                <li key={idx} className="flex items-start space-x-3 text-sm text-white/90">
                                    <Check className="w-5 h-5 text-[#D4AF37] shrink-0 mt-0.5" strokeWidth={3} />
                                    <span className="font-medium">{feature}</span>
                                </li>
                            ))}
                        </ul>

                        <button onClick={() => window.location.href = '/signup'} className="w-full py-4 rounded-xl bg-gradient-to-b from-[#D4AF37] to-[#B8962E] text-black font-bold text-base hover:brightness-110 transition-all duration-300 shadow-[0_0_20px_rgba(212,175,55,0.4)] relative z-10 hover:shadow-[0_0_30px_rgba(212,175,55,0.6)]">
                            Devenir Membre
                        </button>
                    </Reveal>

                    {/* Carte 3 : Enterprise / Agency */}
                    <Reveal delay={600} direction="up" className="flex flex-col landing-glass rounded-3xl border border-white/20 p-8 transition-all duration-500 hover:-translate-y-2 hover:border-white/30 hover:shadow-[0_20px_40px_rgba(0,0,0,0.5)] bg-[#1A1A1A]/30 backdrop-blur-xl relative group">
                        {/* Overflow constraint items */}
                        <div className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none -translate-y-px">
                            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                        </div>

                        <div className="mb-8">
                            <h3 className="text-2xl font-semibold text-white mb-2">Enterprise</h3>
                            <p className="text-sm text-white/50">Le luxe absolu pour les grandes agences.</p>
                        </div>

                        <div className="mb-8">
                            <span className="text-4xl font-bold text-white tracking-tight">Sur mesure</span>
                        </div>

                        <ul className="flex flex-col space-y-4 mb-10 flex-1">
                            {['Multi-studios / Multi-équipes', 'API d\'intégration', 'SSO & Sécurité Avancée', 'Stockage Illimité', 'Account Manager Dédié', 'Support 24/7 Prioritaire'].map((feature, idx) => (
                                <li key={idx} className="flex items-center space-x-3 text-sm text-white/70">
                                    <Check className="w-5 h-5 text-[#D4AF37] shrink-0 opacity-80" />
                                    <span>{feature}</span>
                                </li>
                            ))}
                        </ul>

                        <button onClick={() => window.location.href = 'mailto:contact@myvisuals.co'} className="w-full py-4 rounded-xl landing-glass border border-white/20 text-white font-semibold hover:bg-white/10 transition-colors duration-300">
                            Contacter les ventes
                        </button>
                    </Reveal>

                </div>
            </div>
        </section>
    );
};

export default PricingSection;
