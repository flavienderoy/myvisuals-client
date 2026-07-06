import React, { useState } from 'react';
import { ChevronDown, MessageCircle } from 'lucide-react';
import Reveal from './Reveal';

const faqs = [
    {
        question: "Mes clients ont-ils besoin d'un compte pour voir le Showroom ?",
        answer: "Non, vos clients accèdent à leur espace via un lien sécurisé et immersif, sans aucune barrière technique."
    },
    {
        question: "Quelle est la limite de taille pour les fichiers vidéo RAW ?",
        answer: "MyVisuals est conçu pour la haute performance. Nous supportons les flux 4K et les fichiers volumineux avec une lecture fluide via HLS."
    },
    {
        question: "Puis-je personnaliser le Showroom avec ma propre marque ?",
        answer: "Absolument. Votre logo, vos couleurs et votre domaine personnalisé sont intégrés pour que l'expérience soit 100% la vôtre."
    }
];

import { motion, AnimatePresence } from 'framer-motion';

const FaqItem = ({ faq, index, isOpen, onClick }) => {
    return (
        <div
            className={`landing-glass border rounded-2xl overflow-hidden transition-colors duration-300 ${isOpen ? 'border-[#D4AF37]/40 bg-white/10' : 'border-white/10 bg-white/5 hover:border-[#D4AF37]/30 hover:bg-white/10'}`}
        >
            <button
                className="w-full text-left px-6 py-5 flex items-center justify-between focus:outline-none"
                onClick={onClick}
                aria-expanded={isOpen}
            >
                <div className="flex items-center space-x-4">
                    <span className="text-[#D4AF37] font-semibold text-sm w-6">
                        {String(index + 1).padStart(2, '0')}
                    </span>
                    <span className="text-white font-medium text-lg pr-4">
                        {faq.question}
                    </span>
                </div>
                <div className={`w-8 h-8 rounded-full border border-white/10 flex items-center justify-center shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180 bg-[#D4AF37]/20 border-[#D4AF37]/50' : 'bg-black/30'}`}>
                    <ChevronDown className={`w-4 h-4 transition-colors ${isOpen ? 'text-[#D4AF37]' : 'text-white/60'}`} />
                </div>
            </button>

            <AnimatePresence initial={false}>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="overflow-hidden"
                    >
                        <div className="px-6 pb-6 pt-0 ml-10">
                            <p className="text-white/80 leading-relaxed font-medium">
                                {faq.answer}
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const FaqSection = () => {
    const [openIndex, setOpenIndex] = useState(0);

    return (
        <section className="relative py-32 px-6 bg-transparent overflow-hidden">
            <div className="max-w-7xl mx-auto relative z-10 flex flex-col lg:flex-row gap-16 items-start">

                {/* Left Column: Intro & Visual Block */}
                <div className="w-full lg:w-1/3 sticky top-32">
                    <div className="relative">
                        <div className="relative z-10">
                            <Reveal delay={0}>
                                <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-4 leading-tight">
                                    Des réponses à<br />
                                    <span className="bg-gradient-to-r from-[#D4AF37] to-white text-transparent bg-clip-text"> vos ambitions.</span>
                                </h2>
                                <p className="text-lg text-white/60 font-medium leading-relaxed mb-10">
                                    Tout ce que vous devez savoir pour transformer votre workflow créatif.
                                </p>
                            </Reveal>

                            <Reveal delay={200}>
                                <div className="landing-glass rounded-3xl border border-white/10 p-8 relative overflow-hidden group hover:border-[#D4AF37]/20 transition-all duration-500">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37]/10 rounded-full blur-2xl pointer-events-none group-hover:bg-[#D4AF37]/20 transition-all"></div>

                                    <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#1A1A1A] border border-[#D4AF37]/30 mb-6">
                                        <div className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse"></div>
                                        <span className="text-xs font-bold text-[#D4AF37] tracking-wider uppercase">Support 24/7</span>
                                    </div>

                                    <h3 className="text-xl font-bold text-white mb-2">Une question manque ?</h3>
                                    <p className="text-sm text-white/50 mb-6">
                                        Notre équipe d'experts est disponible pour vous accompagner dans la configuration de votre studio.
                                    </p>

                                    <button className="w-full flex items-center justify-center space-x-2 py-3 rounded-xl bg-white text-black font-semibold hover:bg-white/90 transition-colors shadow-[0_0_15px_rgba(255,255,255,0.1)]">
                                        <MessageCircle className="w-4 h-4" />
                                        <span>Contacter l'équipe</span>
                                    </button>
                                </div>
                            </Reveal>
                        </div>
                    </div>
                </div>

                {/* Right Column: Accordions */}
                <div className="w-full lg:w-2/3 flex flex-col space-y-4">
                    {faqs.map((faq, index) => (
                        <Reveal key={index} delay={index * 150} direction="up">
                            <FaqItem
                                faq={faq}
                                index={index}
                                isOpen={openIndex === index}
                                onClick={() => setOpenIndex(index === openIndex ? -1 : index)}
                            />
                        </Reveal>
                    ))}
                </div>

            </div>
        </section>
    );
};

export default FaqSection;
