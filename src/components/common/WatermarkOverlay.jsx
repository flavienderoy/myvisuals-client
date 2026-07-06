import React from 'react';
import { useData } from '../../context/DataContext';

export const WatermarkOverlay = () => {
    const { watermarkSettings } = useData();
    const text = watermarkSettings?.text || "MyVisuals • PREVIEW";
    const opacityValue = (watermarkSettings?.opacity || 30) / 100;

    return (
        <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden select-none flex items-center justify-center" style={{ opacity: opacityValue }}>
            {/* Repeated Grid Pattern */}
            <div className="absolute inset-0 flex flex-wrap content-center justify-center gap-24 p-12 rotate-[-30deg] scale-125">
                {Array.from({ length: 20 }).map((_, i) => (
                    <div key={i} className="whitespace-nowrap text-white/40 font-bold text-4xl uppercase tracking-widest border-2 border-white/20 px-4 py-2 rounded-lg">
                        {text}
                    </div>
                ))}
            </div>
        </div>
    );
};
