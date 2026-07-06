import React from 'react';

export const LuxuryTitle = ({ text, className = "", size = "text-4xl md:text-5xl" }) => {
    return (
        <h1 className={`${className} ${size} font-bold tracking-tight text-white leading-tight`}>
            {text}
        </h1>
    );
};
