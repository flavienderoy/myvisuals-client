import React from 'react';
import { ArrowRight, Lock } from 'lucide-react';
import { LuxuryTitle } from '../common/LuxuryTitle';

export const WelcomeScreen = ({ onEnter }) => {
    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-6 animate-fade-in-up">
            <div className="w-16 h-16 bg-mv-gold rounded-full flex items-center justify-center mb-8 shadow-[0_0_30px_rgba(212,175,55,0.3)]">
                <Lock className="text-mv-black" size={32} />
            </div>

            <LuxuryTitle text="Maison Éclat." size="text-4xl md:text-6xl" className="mb-4 text-white" />
            <p className="text-gray-400 max-w-md mx-auto mb-10 text-lg font-light">
                Secure Showroom Access. <br />
                Spring Collection 2026 Preview.
            </p>

            <button
                onClick={onEnter}
                className="group relative px-8 py-4 bg-white text-black font-medium tracking-widest uppercase hover:bg-mv-gold transition-colors duration-300"
            >
                <span className="flex items-center gap-2">
                    Enter Showroom <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </span>
            </button>

            <div className="mt-16 text-xs text-gray-600 font-mono">
                Link expires in 24 hours. Secured by AES-256.
            </div>
        </div>
    );
};
