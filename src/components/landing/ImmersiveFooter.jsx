import React from 'react';
import { Instagram, Twitter, Linkedin, ArrowRight } from 'lucide-react';
import BrandLogo from '../common/BrandLogo';
import Reveal from './Reveal';

const ImmersiveFooter = () => {
    return (
        <footer className="relative bg-transparent pt-32 pb-12 px-6 overflow-hidden">
            <div className="max-w-7xl mx-auto relative z-10">
                {/* CTA Section */}
                <Reveal delay={0} direction="up">
                    <div className="flex flex-col items-center text-center mb-32">
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-6">
                            Prêt à lancer votre <br className="hidden md:block" />
                            <span className="text-[#D4AF37]">expérience premium ?</span>
                        </h2>
                        <p className="text-white/60 text-lg mb-10 max-w-2xl">
                            Rejoignez les studios les plus ambitieux et transformez la façon dont vous validez et livrez vos créations à vos clients.
                        </p>
                        <button onClick={() => window.location.href = '/signup'} className="px-8 py-4 rounded-xl bg-white hover:bg-[#D4AF37] text-black font-bold text-base transition-colors duration-300 flex items-center justify-center space-x-2 shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(212,175,55,0.4)] group">
                            <span>Créer mon Studio</span>
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </Reveal>

                {/* Footer Links Grid */}
                <Reveal delay={200} direction="up">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-20 border-t border-white/10 pt-20">
                        {/* Company Info */}
                        <div className="col-span-2 md:col-span-1 flex flex-col items-start">
                            <BrandLogo className="h-6 mb-6" />
                            <p className="text-sm text-white/50 leading-relaxed mb-6">
                                L'espace de travail tout-en-un pour les studios créatifs ambitieux. Gérez, validez et livrez l'excellence.
                            </p>
                        </div>

                        {/* Produit */}
                        <div>
                            <h4 className="text-white font-semibold mb-6">Produit</h4>
                            <ul className="space-y-4">
                                <li><a href="#collaboration" className="text-sm text-white/50 hover:text-[#D4AF37] transition-colors">Comparateur Diff</a></li>
                                <li><a href="#collaboration" className="text-sm text-white/50 hover:text-[#D4AF37] transition-colors">Espaces Clients</a></li>
                                <li><a href="#pricing" className="text-sm text-white/50 hover:text-[#D4AF37] transition-colors">Tarifs</a></li>
                            </ul>
                        </div>

                        {/* Ressources */}
                        <div>
                            <h4 className="text-white font-semibold mb-6">Ressources</h4>
                            <ul className="space-y-4">
                                <li><a href="#" className="text-sm text-white/50 hover:text-[#D4AF37] transition-colors">Centre d'Aide</a></li>
                                <li><a href="#" className="text-sm text-white/50 hover:text-[#D4AF37] transition-colors">Documentation API</a></li>
                                <li><a href="#" className="text-sm text-white/50 hover:text-[#D4AF37] transition-colors">Tutoriels Vidéo</a></li>
                                <li><a href="#" className="text-sm text-white/50 hover:text-[#D4AF37] transition-colors">Blog</a></li>
                            </ul>
                        </div>

                        {/* Société */}
                        <div>
                            <h4 className="text-white font-semibold mb-6">Société</h4>
                            <ul className="space-y-4">
                                <li><a href="#" className="text-sm text-white/50 hover:text-[#D4AF37] transition-colors">À propos</a></li>
                                <li><a href="#" className="text-sm text-white/50 hover:text-[#D4AF37] transition-colors">Carrières</a></li>
                                <li><a href="#" className="text-sm text-white/50 hover:text-[#D4AF37] transition-colors">Contact</a></li>
                                <li><a href="#" className="text-sm text-white/50 hover:text-[#D4AF37] transition-colors">Partenaires</a></li>
                            </ul>
                        </div>
                    </div>
                </Reveal>

                {/* Bottom Bar: Copyright & Socials */}
                <Reveal delay={400} direction="up">
                    <div className="flex flex-col md:flex-row items-center justify-between border-t border-white/10 pt-8 mt-8">
                        <div className="flex flex-col sm:flex-row items-center gap-4 text-center md:text-left mb-6 md:mb-0">
                            <span className="text-xs text-white/40">© 2026 MyVisuals Platform. All rights reserved.</span>
                            <div className="hidden sm:block w-1 h-1 bg-white/20 rounded-full"></div>
                            <div className="flex items-center space-x-4">
                                <a href="#" className="text-xs text-white/40 hover:text-white transition-colors">Mentions légales</a>
                                <a href="#" className="text-xs text-white/40 hover:text-white transition-colors">Politique de confidentialité</a>
                                <a href="#" className="text-xs text-white/40 hover:text-white transition-colors">CGV</a>
                            </div>
                        </div>

                        {/* Social Links & System Status */}
                        <div className="flex items-center space-x-6">
                            <div className="flex items-center space-x-4 border-r border-white/10 pr-6">
                                <a href="#" className="text-white/40 hover:text-[#D4AF37] transition-colors">
                                    <Instagram className="w-5 h-5" />
                                </a>
                                <a href="#" className="text-white/40 hover:text-[#D4AF37] transition-colors">
                                    <Twitter className="w-5 h-5" />
                                </a>
                                <a href="#" className="text-white/40 hover:text-[#D4AF37] transition-colors">
                                    <Linkedin className="w-5 h-5" />
                                </a>
                            </div>

                            <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                                <span className="text-[10px] uppercase tracking-wider font-semibold text-white/50">Systèmes Opérationnels</span>
                            </div>
                        </div>
                    </div>
                </Reveal>
            </div>
        </footer>
    );
};

export default ImmersiveFooter;
