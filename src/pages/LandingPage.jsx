import React, { useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Hls from 'hls.js';
import { Play, Folder, Image, Layout, Users, Search, MessageSquare, Circle } from 'lucide-react';
import BrandLogo from '../components/common/BrandLogo';
import Reveal from '../components/landing/Reveal';
import LandingBackground from '../components/landing/LandingBackground';
import FeaturesGrid from '../components/landing/FeaturesGrid';

import CollaborationSection from '../components/landing/CollaborationSection';
import PricingSection from '../components/landing/PricingSection';
import FaqSection from '../components/landing/FaqSection';
import ImmersiveFooter from '../components/landing/ImmersiveFooter';

const LandingPage = () => {
    const videoRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        let hls;
        const video = videoRef.current;

        if (video) {
            video.playbackRate = 0.6; // Ralentit la vidéo
            if (Hls.isSupported()) {
                hls = new Hls();
                hls.loadSource('https://stream.mux.com/LxD1hEEVJrtzCR2TKPjEzBq36E28aZz02v9xLurwDXDA.m3u8');
                hls.attachMedia(video);
                hls.on(Hls.Events.MANIFEST_PARSED, () => {
                    video.play().catch(e => console.log('Autoplay prevented:', e));
                });
            } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
                // Fallback for native HLS (Safari)
                video.src = 'https://stream.mux.com/LxD1hEEVJrtzCR2TKPjEzBq36E28aZz02v9xLurwDXDA.m3u8';
                video.addEventListener('loadedmetadata', () => {
                    video.play().catch(e => console.log('Autoplay prevented:', e));
                });
            }
        }

        return () => {
            if (hls) {
                hls.destroy();
            }
        };
    }, []);

    return (
        <>
            <style>
                {`
          @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
          
          .landing-page {
            font-family: 'Plus Jakarta Sans', sans-serif;
            background-color: #050200;
            color: #FFFFFF;
            min-height: 100vh;
            position: relative;
            overflow: hidden;
            display: flex;
            flex-direction: column;
          }

          .landing-glass {
            background: rgba(255, 255, 255, 0.05);
            backdrop-filter: blur(24px) saturate(1.4);
            -webkit-backdrop-filter: blur(24px) saturate(1.4);
            border: 1px solid rgba(255, 255, 255, 0.12);
          }

          .landing-gradient-text {
            background: linear-gradient(180deg, #FFFFFF 0%, rgba(255, 255, 255, 0.6) 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
          }

          @keyframes slow-pan {
            0% { transform: scale(1); }
            50% { transform: scale(1.1); }
            100% { transform: scale(1); }
          }
          .animate-slow-pan {
            animation: slow-pan 15s ease-in-out infinite;
          }

          @keyframes float-icon {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-3px); }
          }
          .animate-float-icon {
            animation: float-icon 3s ease-in-out infinite;
          }
        `}
            </style>

            <div className="landing-page relative bg-[#050200] text-white">
                <LandingBackground />

                {/* Smart Navigation (Global z-index) */}
                <nav className="fixed top-0 left-0 right-0 z-[100] w-full px-6 py-4 pointer-events-auto">
                    <div className="max-w-7xl mx-auto landing-glass rounded-2xl px-6 py-3 flex items-center justify-between">
                        {/* Left: Logo */}
                        <div className="flex items-center">
                            <BrandLogo className="h-6" />
                        </div>

                        {/* Center: Main links */}
                        <div className="hidden md:flex items-center space-x-8">
                            <a href="#features" onClick={(e) => { e.preventDefault(); document.querySelector('#features').scrollIntoView({ behavior: 'smooth' }); }} className="text-sm font-medium text-white/80 hover:text-white transition-colors">Fonctionnalités</a>

                            <a href="#collaboration" onClick={(e) => { e.preventDefault(); document.querySelector('#collaboration').scrollIntoView({ behavior: 'smooth' }); }} className="text-sm font-medium text-white/80 hover:text-white transition-colors">Espace Client (B2B)</a>
                            <a href="#pricing" onClick={(e) => { e.preventDefault(); document.querySelector('#pricing').scrollIntoView({ behavior: 'smooth' }); }} className="text-sm font-medium text-white/80 hover:text-white transition-colors">Tarifs</a>
                        </div>

                        {/* Right: Auth Section */}
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={() => navigate('/login')}
                                className="px-4 py-2 text-sm font-medium text-white landing-glass rounded-lg hover:bg-white/10 transition-all"
                            >
                                Se connecter
                            </button>
                            <button
                                onClick={() => navigate('/signup')}
                                className="px-4 py-2 text-sm font-medium bg-white text-black rounded-lg hover:bg-white/90 transition-all shadow-[0_0_20px_rgba(255,255,255,0.3)]"
                            >
                                S'inscrire
                            </button>
                        </div>
                    </div>
                </nav>

                {/* HERO SECTION */}
                <section className="relative w-full min-h-screen flex flex-col">
                    {/* Background Video (Restricted to Hero Section) */}
                    <div className="absolute inset-0 z-0 overflow-hidden">
                        {/* Global Overlay */}
                        <div className="absolute inset-0 bg-black/40 z-10 pointer-events-none"></div>
                        {/* Smooth Transition Gradient to Black at the bottom */}
                        <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-[#050200] via-[#050200]/80 to-transparent z-10 pointer-events-none"></div>

                        <video
                            ref={videoRef}
                            className="w-full h-full object-cover"
                            muted
                            loop
                            playsInline
                        />
                    </div>

                    {/* Content Container */}
                    <div className="relative z-10 flex flex-col flex-1">

                        {/* Hero Content */}
                        <main className="flex-1 flex flex-col items-center justify-center pt-24 pb-48 px-6 relative">
                            <div className="max-w-5xl mx-auto flex flex-col items-center text-center">

                                {/* Pill Badge */}
                                <Reveal delay={0}>
                                    <div className="landing-glass rounded-full px-4 py-1.5 mb-8 flex items-center">
                                        <span className="text-xs font-semibold text-white/90 tracking-wide uppercase">Approuvé par plus de 500 agences créatives</span>
                                    </div>
                                </Reveal>

                                {/* Main Headline */}
                                <Reveal delay={200}>
                                    <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 leading-tight landing-gradient-text">
                                        Gérez, validez et livrez<br className="hidden md:block" /> l'excellence créative.
                                    </h1>
                                </Reveal>

                                {/* Sub-headline */}
                                <Reveal delay={400}>
                                    <p className="max-w-2xl text-lg text-white/80 mb-10 leading-relaxed font-medium">
                                        L'espace de travail tout-en-un pour les studios créatifs afin de gérer leurs assets et d'éblouir leurs clients avec un espace de livraison immersif.
                                    </p>
                                </Reveal>

                                {/* Action Buttons */}
                                <Reveal delay={600}>
                                    <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
                                        <button
                                            onClick={() => navigate('/signup')}
                                            className="w-full sm:w-auto px-8 py-4 bg-white text-black text-base font-semibold rounded-xl hover:scale-105 transition-transform duration-300 shadow-[0_0_30px_rgba(255,255,255,0.4)]"
                                        >
                                            Essai Gratuit
                                        </button>


                                    </div>
                                </Reveal>
                            </div>
                        </main>
                    </div>
                </section> {/* Fin de la Hero Section */}

                {/* INTERFÉRENCE : Dashboard Mockup Complet */}
                <section className="relative z-20 w-full flex justify-center perspective-[1000px] -mt-56 pb-24 px-4 md:px-6 pointer-events-auto">
                    <Reveal delay={800} direction="up" className="w-full max-w-5xl">
                        <div className="w-full landing-glass rounded-3xl border-white/20 skew-x-[-1deg] hover:skew-x-0 transition-transform duration-700 ease-out overflow-hidden shadow-[0_-20px_80px_rgba(0,0,0,0.8)] bg-black/60 backdrop-blur-[24px]">

                            {/* Dashboard Mockup Inner Lines to simulate UI */}
                            <div className="w-full h-full p-6 flex flex-col gap-6">
                                {/* Top Search Bar Area */}
                                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                                    <div className="flex items-center space-x-2 bg-white/5 rounded-lg px-4 py-2 w-64 border border-white/10">
                                        <Search className="w-4 h-4 text-white/50" />
                                        <span className="text-sm text-white/50">Find assets...</span>
                                    </div>
                                    <div className="flex space-x-3">
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#D4AF37]/40 to-white/10 border border-[#D4AF37]/20 flex items-center justify-center overflow-hidden">
                                            <Users className="w-4 h-4 text-[#D4AF37]/70" />
                                        </div>
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-white/20 to-white/5 border border-white/10 flex items-center justify-center overflow-hidden">
                                            <div className="w-4 h-4 rounded-full bg-white/30"></div>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-6 h-full">
                                    {/* Sidebar */}
                                    <div className="w-1/4 h-full flex flex-col gap-2">
                                        <div className="flex items-center space-x-3 p-2 rounded-lg bg-white/5 border border-[#D4AF37]/20 shadow-[0_0_10px_rgba(212,175,55,0.05)]">
                                            <Folder className="w-4 h-4 text-[#D4AF37]" />
                                            <span className="text-sm font-medium text-[#D4AF37]">Vue d'ensemble</span>
                                        </div>
                                        <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-white/5 transition-colors group cursor-pointer">
                                            <Image className="w-4 h-4 text-white/50 group-hover:text-white/80 transition-colors" />
                                            <span className="text-sm font-medium text-white/70 group-hover:text-white/90 transition-colors">Bibliothèque</span>
                                        </div>

                                        <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-white/5 transition-colors group cursor-pointer">
                                            <Users className="w-4 h-4 text-white/50 group-hover:text-white/80 transition-colors" />
                                            <span className="text-sm font-medium text-white/70 group-hover:text-white/90 transition-colors">Équipe</span>
                                        </div>

                                        <div onClick={() => navigate('/studio')} className="mt-4 p-3 rounded-xl border border-white/10 bg-white/5 flex items-center justify-center cursor-pointer hover:bg-white/10 transition-colors group">
                                            <span className="text-sm font-bold bg-gradient-to-r from-[#D4AF37] to-white/90 text-transparent bg-clip-text group-hover:to-white transition-all">
                                                + Nouveau Projet
                                            </span>
                                        </div>
                                    </div>

                                    {/* Main Workspace */}
                                    <div className="w-3/4 h-full flex gap-4">
                                        {/* Video Review Card */}
                                        <div className="flex-1 relative rounded-xl border border-white/10 bg-[#1A1A1A]/80 overflow-hidden backdrop-blur-md group cursor-pointer">
                                            {/* Subtle Radial Highlight with Project Yellow */}
                                            <div className="absolute top-0 left-0 w-32 h-32 bg-[#D4AF37]/15 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>

                                            {/* Video Background Mockup with slow pan animation */}
                                            <div className="absolute inset-0 overflow-hidden z-0">
                                                <svg className="w-full h-full text-white/5 animate-slow-pan transform origin-center" viewBox="0 0 100 100" preserveAspectRatio="none">
                                                    <defs>
                                                        <linearGradient id="bg-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                                                            <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.15" />
                                                            <stop offset="100%" stopColor="#050200" stopOpacity="0.9" />
                                                        </linearGradient>
                                                    </defs>
                                                    <rect width="100" height="100" fill="url(#bg-grad)" />
                                                    <path d="M0,100 Q25,50 50,100 T100,100 L100,0 L0,0 Z" fill="rgba(212, 175, 55, 0.05)" />
                                                    <circle cx="70" cy="30" r="15" fill="rgba(255, 255, 255, 0.03)" />
                                                </svg>
                                            </div>

                                            <div className="relative z-10 w-full h-full p-4 flex flex-col justify-between">
                                                <div className="flex justify-between items-start">
                                                    <div className="px-2 py-1 rounded-md bg-black/60 border border-[#D4AF37]/30 backdrop-blur-md flex items-center space-x-2">
                                                        <div className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse shadow-[0_0_8px_#D4AF37]"></div>
                                                        <span className="text-xs text-[#D4AF37] font-medium">Review en cours</span>
                                                    </div>
                                                </div>
                                                <div className="flex-1 flex items-center justify-center">
                                                    <div className="w-12 h-12 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center border border-[#D4AF37]/40 shadow-[0_0_20px_rgba(212,175,55,0.2)] group-hover:scale-110 group-hover:bg-[#D4AF37]/20 transition-all duration-300">
                                                        <Play className="w-5 h-5 text-[#D4AF37] ml-1 fill-[#D4AF37]" />
                                                    </div>
                                                </div>
                                                <div className="flex justify-between items-center bg-black/60 backdrop-blur-md border border-white/10 rounded-lg p-2">
                                                    <span className="text-sm font-medium text-white/90 truncate mr-2">Cinematic_v3_Final.mp4</span>
                                                    <div className="flex items-center space-x-1 px-2 py-1 bg-[#D4AF37]/10 rounded-full border border-[#D4AF37]/20 shrink-0">
                                                        <MessageSquare className="w-3 h-3 text-[#D4AF37]" />
                                                        <span className="text-xs text-[#D4AF37] font-medium">3</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Moodboard Card */}
                                        <div className="w-1/3 relative rounded-xl border border-white/10 bg-[#1A1A1A]/80 overflow-hidden backdrop-blur-md p-3 flex flex-col group cursor-pointer">
                                            {/* Subtle Radial Highlight */}
                                            <div className="absolute top-0 left-0 w-24 h-24 bg-[#D4AF37]/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none transition-opacity duration-300 group-hover:opacity-100 opacity-60"></div>

                                            <div className="flex justify-between items-start mb-3 relative z-10">
                                                <div className="px-2 py-1 rounded-md bg-black/40 border border-white/10 flex items-center space-x-1.5 backdrop-blur-md">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_5px_#34d399]"></div>
                                                    <span className="text-xs text-white/80 font-medium">Approuvé</span>
                                                </div>
                                            </div>

                                            <div className="flex-1 grid grid-cols-2 gap-2 relative z-10 mb-3">
                                                {/* Simulated image 1 with SVG */}
                                                <div className="col-span-2 rounded border border-white/10 overflow-hidden relative bg-[#000000]">
                                                    <svg className="w-full h-full animate-slow-pan origin-bottom" viewBox="0 0 100 50" preserveAspectRatio="none">
                                                        <rect width="100" height="50" fill="#111" />
                                                        <path d="M0,50 L30,20 L50,40 L80,10 L100,30 L100,50 Z" fill="rgba(212, 175, 55, 0.25)" />
                                                        <circle cx="20" cy="15" r="4" fill="rgba(212, 175, 55, 0.4)" className="animate-pulse" />
                                                    </svg>
                                                </div>
                                                {/* Simulated image 2 with SVG */}
                                                <div className="rounded border border-white/10 overflow-hidden relative bg-[#111]">
                                                    <svg className="w-full h-full" viewBox="0 0 50 50" preserveAspectRatio="none">
                                                        <circle cx="25" cy="25" r="15" stroke="rgba(212, 175, 55, 0.6)" strokeWidth="1.5" fill="none" className="animate-slow-pan origin-center" />
                                                        <circle cx="25" cy="25" r="6" fill="rgba(255, 255, 255, 0.1)" />
                                                    </svg>
                                                </div>
                                                {/* Simulated image 3 with SVG */}
                                                <div className="rounded border border-white/10 overflow-hidden relative bg-[#111]">
                                                    <svg className="w-full h-full" viewBox="0 0 50 50" preserveAspectRatio="none">
                                                        <path d="M10,40 Q25,10 40,40 Z" fill="rgba(212, 175, 55, 0.2)" className="animate-float-icon" />
                                                    </svg>
                                                </div>
                                            </div>

                                            <span className="text-sm font-medium text-white/90 relative z-10 truncate">Campagne Automne</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Reveal>
                </section>

                {/* Section 2: Features & Delivery Ecosystem */}
                <div className="relative z-30 bg-transparent">
                    <FeaturesGrid />
                </div>



                {/* Section 4: The Client Portal & B2B Collaboration */}
                <div className="relative z-40 bg-transparent">
                    <CollaborationSection />
                </div>

                {/* Section 5: Pricing */}
                <div className="relative z-50 bg-transparent">
                    <PricingSection />
                </div>

                {/* Section 5: FAQ & Premium Support */}
                <div className="relative z-50 bg-transparent">
                    <FaqSection />
                </div>

                {/* Section 6: Immersive Footer */}
                <div className="relative z-50 bg-transparent">
                    <ImmersiveFooter />
                </div>
            </div>
        </>
    );
};

export default LandingPage;
