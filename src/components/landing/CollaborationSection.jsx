import React, { useState } from 'react';
import { ChevronsLeftRight, Check, MessageSquare, Send, X } from 'lucide-react';
import Reveal from './Reveal';

const CollaborationSection = () => {
    // State to simulate the slider position (drags between 0 and 100)
    // We use a simple state to give a tiny bit of interactivity, simulating the diff
    const [sliderPos, setSliderPos] = useState(50);

    const handleMouseMove = (e) => {
        const bounds = e.currentTarget.getBoundingClientRect();
        const x = Math.max(0, Math.min(e.clientX - bounds.left, bounds.width));
        const percentage = (x / bounds.width) * 100;
        setSliderPos(percentage);
    };

    return (
        <section id="collaboration" className="relative py-32 px-6 bg-transparent overflow-hidden">
            <div className="max-w-7xl mx-auto relative z-10 flex flex-col items-center">

                {/* Section Header */}
                <Reveal delay={0}>
                    <div className="text-center mb-16 max-w-3xl">
                        <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-6">
                            Zéro ambiguïté.<br />
                            <span className="bg-gradient-to-r from-white to-[#D4AF37] text-transparent bg-clip-text">Une validation instantanée.</span>
                        </h2>
                        <p className="text-lg text-white/60 font-medium leading-relaxed">
                            Permettez à vos clients de comparer les versions et d'annoter vos assets en temps réel. Fini les allers-retours chaotiques par email.
                        </p>
                    </div>
                </Reveal>

                {/* Interactive Diff Comparator & Sidebar Layout */}
                <div className="w-full flex flex-col lg:flex-row gap-6 max-w-6xl">

                    {/* Left: The Diff Comparator Area */}
                    <Reveal delay={200} className="flex-1 landing-glass rounded-3xl border border-white/10 p-2 md:p-4 overflow-hidden relative shadow-[0_0_50px_rgba(0,0,0,0.8)]">
                        <div className="w-full relative rounded-2xl overflow-hidden aspect-video cursor-ew-resize group select-none"
                            onMouseMove={handleMouseMove}
                            onTouchMove={(e) => {
                                const bounds = e.currentTarget.getBoundingClientRect();
                                const x = Math.max(0, Math.min(e.touches[0].clientX - bounds.left, bounds.width));
                                setSliderPos((x / bounds.width) * 100);
                            }}
                        >
                            {/* Version 2 (Underneath / The "After") - Color Graded */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-[#D4AF37]/30 via-black to-[#000000] flex items-center justify-center">
                                {/* Abstract shape to represent the graded content */}
                                <svg className="w-full h-full opacity-60" viewBox="0 0 100 100" preserveAspectRatio="none">
                                    <path d="M0,100 L30,40 L60,80 L100,20 L100,100 Z" fill="rgba(212, 175, 55, 0.4)" />
                                    <circle cx="20" cy="30" r="10" fill="rgba(212, 175, 55, 0.6)" />
                                </svg>

                                {/* Label V2 */}
                                <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg border border-[#D4AF37]/30 text-xs font-semibold text-[#D4AF37]">
                                    V2 - Color Graded
                                </div>
                            </div>

                            {/* Version 1 (On Top / The "Before") - Draft */}
                            <div
                                className="absolute inset-y-0 left-0 bg-gradient-to-tr from-gray-800 via-gray-900 to-black overflow-hidden border-r border-[#D4AF37]/40 shadow-[2px_0_15px_rgba(0,0,0,0.5)]"
                                style={{ width: `${sliderPos}%` }}
                            >
                                {/* We duplicate the SVG shapes but make them gray to simulate raw/ungraded form */}
                                <svg className="absolute top-0 left-0 w-[100vw] lg:w-[calc(1152px*0.66)] h-full opacity-40 grayscale" viewBox="0 0 100 100" preserveAspectRatio="none">
                                    <path d="M0,100 L30,40 L60,80 L100,20 L100,100 Z" fill="rgba(255, 255, 255, 0.2)" />
                                    <circle cx="20" cy="30" r="10" fill="rgba(255, 255, 255, 0.3)" />
                                </svg>

                                {/* Label V1 */}
                                <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 text-xs font-semibold text-white/70">
                                    V1 - Draft
                                </div>
                            </div>

                            {/* The Slider Handle */}
                            <div
                                className="absolute top-0 bottom-0 flex items-center justify-center pointer-events-none"
                                style={{ left: `${sliderPos}%`, transform: 'translateX(-50%)' }}
                            >
                                <div className="w-0.5 h-full bg-[#D4AF37] opacity-80 shadow-[0_0_10px_#D4AF37]"></div>
                                <div className="w-10 h-10 rounded-full bg-black border-2 border-[#D4AF37] flex items-center justify-center shadow-[0_0_20px_rgba(212,175,55,0.4)] absolute transition-transform group-hover:scale-110">
                                    <ChevronsLeftRight className="w-5 h-5 text-[#D4AF37]" />
                                </div>
                            </div>

                        </div>
                    </Reveal>

                    {/* Right: The Annotation Sidebar */}
                    <Reveal delay={400} className="w-full lg:w-80 landing-glass rounded-3xl border border-white/10 p-5 flex flex-col gap-4 relative overflow-hidden backdrop-blur-xl bg-[#1A1A1A]/60">
                        {/* Background subtle glow for the sidebar */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37]/5 rounded-full blur-2xl pointer-events-none"></div>

                        <div className="flex items-center justify-between border-b border-white/10 pb-4 relative z-10">
                            <h3 className="font-semibold text-white text-lg flex items-center space-x-2">
                                <MessageSquare className="w-4 h-4 text-[#D4AF37]" />
                                <span>Feedbacks</span>
                            </h3>
                            <span className="bg-white/10 text-white/80 text-xs px-2 py-1 rounded-md font-medium">1 Commentaire</span>
                        </div>

                        {/* Comments List Sim */}
                        <div className="flex-1 flex flex-col gap-4 relative z-10">
                            {/* A simulated comment */}
                            <div className="bg-white/5 border border-white/5 rounded-xl p-4 flex gap-3 group hover:border-[#D4AF37]/20 transition-colors">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500/40 to-blue-500/40 border border-white/10 flex-shrink-0"></div>
                                <div className="flex flex-col gap-1">
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-semibold text-white/90">Client Studio Lux</span>
                                        <span className="text-xs text-white/40">2m ago</span>
                                    </div>
                                    <p className="text-sm text-white/80 leading-relaxed">
                                        Le rendu doré sur la V2 est absolument parfait. J'adore la colorimétrie !
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Input Field Sim */}
                        <div className="relative z-10 mt-auto">
                            <div className="h-12 w-full bg-black/40 border border-white/10 rounded-xl flex items-center px-4 focus-within:border-[#D4AF37]/50 transition-colors shadow-inner">
                                <input
                                    type="text"
                                    placeholder="Ajouter un feedback..."
                                    className="bg-transparent border-none outline-none text-sm text-white flex-1 placeholder:text-white/30"
                                    disabled
                                />
                                <button className="ml-2 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#D4AF37] hover:text-black transition-all cursor-not-allowed group">
                                    <Send className="w-3 h-3 text-white/50 group-hover:text-black" />
                                </button>
                            </div>
                        </div>
                    </Reveal>

                </div>

                {/* Call To Action below the comparator */}
                <Reveal delay={600} direction="up" className="mt-12 w-full max-w-2xl relative z-10">
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <button className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[#D4AF37] hover:bg-[#b5952f] text-black font-bold text-base transition-all duration-300 flex items-center justify-center space-x-2 shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:shadow-[0_0_40px_rgba(212,175,55,0.5)] transform hover:-translate-y-1">
                            <Check className="w-5 h-5 stroke-[3]" />
                            <span>Approuver la version</span>
                        </button>

                        <button className="w-full sm:w-auto px-8 py-4 rounded-xl landing-glass border border-[#D4AF37]/50 text-white font-semibold text-base hover:bg-white/5 transition-all duration-300 flex items-center justify-center space-x-2">
                            <X className="w-5 h-5" />
                            <span>Demander des modifications</span>
                        </button>
                    </div>
                </Reveal>

            </div>
        </section>
    );
};

export default CollaborationSection;
