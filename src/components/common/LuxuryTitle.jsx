import React from 'react';

export const LuxuryTitle = ({ text, className = "", size = "text-3xl" }) => {
    // Deterministic "randomness" based on character index and value
    const isItalic = (char, index) => {
        // Logic: Italicize roughly 30% of characters, creating a rhythm
        // Using charCode to make it consistent for the same text
        if (char === ' ') return false;
        const code = char.charCodeAt(0) + index;
        return code % 3 === 0;
    };

    return (
        <h1 className={`${className} ${size} font-light tracking-tight flex flex-wrap gap-[1px]`}>
            {text.split('').map((char, i) => (
                <span
                    key={i}
                    className={`${isItalic(char, i) ? 'italic font-normal' : 'font-light'} transition-all hover:text-mv-gold cursor-default`}
                >
                    {char === ' ' ? '\u00A0' : char}
                </span>
            ))}
        </h1>
    );
};
