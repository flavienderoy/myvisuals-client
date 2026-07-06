import React from 'react';

export const ColorPalette = () => {
    const colors = [
        { hex: '#D4AF37', name: 'Gold' },
        { hex: '#1C1C1C', name: 'Obsidian' }, // Using CSS hex, but description is conceptual
        { hex: '#F5F5F0', name: 'Off-White' }, // Cream
        { hex: '#8B4513', name: 'Leather' }   // SaddleBrown approximation
    ];

    return (
        <div className="bg-white/5 border border-white/10 hover:border-white/20 transition-all duration-300 rounded-xl p-8">
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4">Palette & Tons</h3>

            <div className="flex items-center gap-4">
                {colors.map((color, idx) => (
                    <div key={idx} className="group relative">
                        <div
                            className="w-12 h-12 rounded-full border border-white/10 shadow-lg transition-transform hover:scale-110 cursor-pointer"
                            style={{ backgroundColor: color.hex }}
                        ></div>
                        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-[10px] text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                            {color.hex}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
