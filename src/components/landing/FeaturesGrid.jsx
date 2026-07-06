import React from 'react';
import { Play, MessageSquare, CheckCircle, Layers, FileVideo, FileImage } from 'lucide-react';
import Reveal from './Reveal';

const FeaturesGrid = () => {
    return (
        <section id="features" className="relative py-32 px-6 bg-transparent overflow-hidden">
            <div className="max-w-7xl mx-auto relative z-10">
                {/* Title */}
                <Reveal delay={0}>
                    <div className="text-center mb-20">
                        <h2 className="text-4xl md:text-5xl lg:text-7xl font-bold tracking-tight text-white leading-tight">
                            Sublimez vos créations,<br className="hidden md:block" />
                            <span className="bg-gradient-to-r from-white to-[#D4AF37] text-transparent bg-clip-text"> captivez vos clients.</span>
                        </h2>
                    </div>
                </Reveal>

                {/* Bento Grid layout */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[340px]">

                    {/* Cell 1: Showroom Immersif (col-span-2) */}
                    <Reveal delay={200} className="md:col-span-2 rounded-3xl bg-[#1A1A1A]/80 backdrop-blur-2xl border border-white/10 hover:border-[#D4AF37]/30 transition-all duration-500 overflow-hidden relative group flex flex-col p-6 cursor-pointer">
                        <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                        <div className="flex justify-between items-center mb-6 relative z-10">
                            <h3 className="text-2xl font-semibold text-white">Livraison Showroom & Paiement</h3>
                            <div className="flex items-center space-x-2 bg-red-500/20 px-3 py-1 rounded-full border border-red-500/30">
                                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.8)]"></div>
                                <span className="text-xs font-bold text-red-400 tracking-widest uppercase">Live</span>
                            </div>
                        </div>

                        {/* Video Interface Mockup */}
                        <div className="flex-1 rounded-2xl border border-white/10 bg-black overflow-hidden relative group/video">
                            <div className="absolute top-0 left-0 w-48 h-48 bg-[#D4AF37]/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none transition-opacity duration-300"></div>

                            <div className="absolute inset-0 z-0">
                                <svg className="w-full h-full text-white/5 opacity-50 transition-transform duration-1000 group-hover/video:scale-105 origin-center" viewBox="0 0 100 100" preserveAspectRatio="none">
                                    <defs>
                                        <linearGradient id="video-bg" x1="0%" y1="0%" x2="100%" y2="100%">
                                            <stop offset="0%" stopColor="#1a1a1a" stopOpacity="1" />
                                            <stop offset="100%" stopColor="#000000" stopOpacity="1" />
                                        </linearGradient>
                                    </defs>
                                    <rect width="100" height="100" fill="url(#video-bg)" />
                                    <circle cx="50" cy="50" r="30" fill="rgba(212, 175, 55, 0.05)" className="animate-pulse" />
                                    <path d="M0,100 Q40,60 100,100 Z" fill="rgba(255, 255, 255, 0.02)" />
                                </svg>
                            </div>

                            <div className="absolute top-4 left-4 z-10">
                                <div className="px-3 py-1.5 bg-black/60 backdrop-blur-md rounded-lg border border-white/10 text-xs font-medium text-white/80">
                                    Projet : Campagne Automne - Studio Luxe
                                </div>
                            </div>

                            <div className="absolute inset-0 flex items-center justify-center z-10">
                                <div className="w-16 h-16 rounded-full bg-black/50 backdrop-blur-lg flex items-center justify-center border border-[#D4AF37]/40 shadow-[0_0_30px_rgba(212,175,55,0.2)] group-hover/video:bg-[#D4AF37]/20 group-hover/video:scale-110 transition-all duration-300">
                                    <Play className="w-6 h-6 text-[#D4AF37] ml-1 fill-[#D4AF37]" />
                                </div>
                            </div>
                        </div>
                    </Reveal>

                    {/* Cell 2: Feedback Direct (col-span-1) */}
                    <Reveal delay={400} className="rounded-3xl bg-[#1A1A1A]/80 backdrop-blur-2xl border border-white/10 hover:border-[#D4AF37]/30 transition-all duration-500 overflow-hidden relative group p-6 flex flex-col">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37]/10 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>

                        <div className="flex items-center space-x-3 mb-6 relative z-10">
                            <MessageSquare className="w-6 h-6 text-[#D4AF37]" />
                            <h3 className="text-xl font-semibold text-white">Espace Agence (B2B)</h3>
                        </div>

                        <div className="flex-1 rounded-2xl border border-white/10 bg-black overflow-hidden relative flex flex-col items-center justify-center p-4 group-hover:border-[#D4AF37]/20 transition-colors">
                            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-[#D4AF37]/10"></div>

                            <div className="relative z-10 bg-[#1A1A1A]/90 backdrop-blur-xl border border-white/10 p-4 rounded-xl shadow-2xl max-w-[90%] w-full transform transition-transform group-hover:-translate-y-1">
                                <div className="flex justify-between items-center mb-3">
                                    <div className="bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-md text-[10px] font-bold text-amber-500 uppercase flex items-center space-x-1.5">
                                        <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse shadow-[0_0_5px_rgba(245,158,11,0.8)]"></div>
                                        <span className="tracking-wide">En attente</span>
                                    </div>
                                </div>
                                <p className="text-sm text-white/90 leading-relaxed font-medium">
                                    "Pouvez-vous saturer un peu plus le doré ici ?"
                                </p>
                                <div className="absolute -bottom-2 right-6 w-4 h-4 bg-[#1A1A1A]/90 border-b border-r border-white/10 transform rotate-45"></div>
                            </div>
                        </div>
                    </Reveal>

                    {/* Cell 3: Gestion d'Assets (col-span-1) */}
                    <Reveal delay={200} className="rounded-3xl bg-[#1A1A1A]/80 backdrop-blur-2xl border border-white/10 hover:border-[#D4AF37]/30 transition-all duration-500 overflow-hidden relative group p-6 flex flex-col">
                        <div className="absolute bottom-0 left-0 w-40 h-40 bg-[#D4AF37]/10 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2 pointer-events-none"></div>

                        <div className="flex items-center space-x-3 mb-6 relative z-10">
                            <Layers className="w-6 h-6 text-[#D4AF37]" />
                            <h3 className="text-xl font-semibold text-white">Gestion d'Assets</h3>
                        </div>

                        <div className="flex-1 flex flex-col space-y-3 relative z-10 justify-center">
                            <div className="flex items-center justify-between p-3.5 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-[#D4AF37]/20 transition-colors group/file cursor-pointer">
                                <div className="flex items-center space-x-4">
                                    <div className="p-2.5 rounded-lg bg-blue-500/10 text-blue-400 group-hover/file:bg-blue-500/20 transition-colors">
                                        <FileVideo className="w-5 h-5" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-medium text-white group-hover/file:text-[#D4AF37] transition-colors">Master_V1.MP4</span>
                                        <span className="text-xs text-white/40">2.4 GB</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-between p-3.5 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-[#D4AF37]/20 transition-colors group/file cursor-pointer">
                                <div className="flex items-center space-x-4">
                                    <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-400 group-hover/file:bg-emerald-500/20 transition-colors">
                                        <FileImage className="w-5 h-5" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-medium text-white group-hover/file:text-[#D4AF37] transition-colors">Shoot_001.RAW</span>
                                        <span className="text-xs text-white/40">45 MB</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-between p-3.5 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-[#D4AF37]/20 transition-colors group/file cursor-pointer">
                                <div className="flex items-center space-x-4">
                                    <div className="p-2.5 rounded-lg bg-orange-500/10 text-orange-400 group-hover/file:bg-orange-500/20 transition-colors">
                                        <FileImage className="w-5 h-5" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-medium text-white group-hover/file:text-[#D4AF37] transition-colors">Logo_Alpha.PNG</span>
                                        <span className="text-xs text-white/40">1.2 MB</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Reveal>

                    {/* Cell 4: Validation Instantanée (col-span-2) */}
                    <Reveal delay={400} className="md:col-span-2 rounded-3xl bg-[#1A1A1A]/80 backdrop-blur-2xl border border-white/10 hover:border-[#D4AF37]/30 transition-all duration-500 overflow-hidden relative group flex flex-col justify-center items-center text-center p-8">
                        {/* Hover Halos */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-to-r from-transparent via-[#D4AF37]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>

                        <div className="relative z-10 mb-8 max-w-lg">
                            <h3 className="text-3xl font-bold text-white mb-3">Deux voies pour valider.</h3>
                            <p className="text-white/60 text-lg">Un clic suffit. Encaissez via le Showroom, ou collaborez via l'Espace Agence.</p>
                        </div>

                        <div className="relative z-10 w-full max-w-md">
                            {/* The light explosion behind the button on hover */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[250%] bg-[#D4AF37]/20 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

                            <button className="relative w-full py-5 rounded-2xl bg-white hover:bg-[#D4AF37] text-black font-bold text-xl tracking-wide transition-colors duration-300 flex items-center justify-center space-x-3 shadow-[0_0_20px_rgba(255,255,255,0.2)] group-hover:shadow-[0_0_40px_rgba(212,175,55,0.6)] transform transition-transform group-hover:-translate-y-1">
                                <span>APPROUVER LE VISUEL</span>
                                <CheckCircle className="w-6 h-6" />
                            </button>
                        </div>
                    </Reveal>

                </div>
            </div>
        </section>
    );
};

export default FeaturesGrid;
