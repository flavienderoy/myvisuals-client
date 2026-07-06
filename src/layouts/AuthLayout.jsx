import React from 'react';
import { LuxuryTitle } from '../components/common/LuxuryTitle';

export const AuthLayout = ({ children, title, subtitle }) => {
    return (
        <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6 relative overflow-hidden">
            {/* Ambient Background */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-mv-gold/5 rounded-full blur-[120px] animate-pulse"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-mv-gold/10 rounded-full blur-[120px]" style={{ animationDuration: '10s' }}></div>
            </div>

            {/* Auth Card */}
            <div className="w-full max-w-md relative z-10 animate-fade-in-up">
                <div className="text-center mb-10">
                    <div className="mb-6 flex justify-center">
                        <div className="w-12 h-12 border border-white/20 rotate-45 flex items-center justify-center">
                            <div className="w-8 h-8 bg-mv-gold/20 backdrop-blur"></div>
                        </div>
                    </div>
                    <LuxuryTitle text={title} size="text-4xl" className="text-white mb-2 justify-center" />
                    {subtitle && <p className="text-gray-500 font-light">{subtitle}</p>}
                </div>

                <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-2xl shadow-2xl">
                    {children}
                </div>

                <div className="mt-8 text-center text-xs text-gray-600 font-mono">
                    MyVisuals • SECURE ACCESS
                </div>
            </div>
        </div>
    );
};
