import React from 'react';

const BrandLogo = ({ className = "h-8" }) => {
    return (
        <div className={`flex items-center gap-3 ${className}`}>
            {/* Logo M : Formé par deux tracés entrelacés (façon Wallet inversé) */}
            <svg
                viewBox="0 0 120 100"
                className="h-full w-auto drop-shadow-md"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <defs>
                    <linearGradient id="grad-left" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#FFFFFF" />
                        <stop offset="100%" stopColor="#FFE173" />
                    </linearGradient>
                    <linearGradient id="grad-right" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#FFE173" />
                        <stop offset="100%" stopColor="#D4AF37" />
                    </linearGradient>
                </defs>

                {/* 1er "Check" inversé (Côté Gauche du M) - Derrière */}
                <path
                    d="M 15 65 L 40 25 L 75 80"
                    stroke="url(#grad-left)"
                    strokeWidth="16"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />

                {/* 2ème "Check" inversé (Côté Droit du M) - Devant, crée l'entrelacement */}
                <path
                    d="M 45 60 L 70 20 L 105 75"
                    stroke="url(#grad-right)"
                    strokeWidth="16"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>

            <span className="text-[22px] font-bold tracking-tight text-white flex items-center lowercase" style={{ letterSpacing: '-0.02em', fontFamily: 'var(--font-sans)' }}>
                my<span className="text-[#D4AF37]">visuals</span>
            </span>
        </div>
    );
};

export default BrandLogo;
