import React, { useState } from 'react';
import { Plus, X, Image as ImageIcon } from 'lucide-react';

export const Moodboard = () => {
    // Mock initial images
    const [images, setImages] = useState([
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=500&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=500&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1517404215738-15263e9f9178?q=80&w=500&auto=format&fit=crop"
    ]);

    const handleAdd = () => {
        // Simulation of adding an image
        const newImage = "https://images.unsplash.com/photo-1492633423870-43d1cd2775eb?q=80&w=500&auto=format&fit=crop";
        setImages([...images, newImage]);
    };

    return (
        <div className="bg-white/5 border border-white/10 hover:border-white/20 transition-all duration-300 rounded-xl p-8">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest">Moodboard</h3>
                <button className="text-xs text-mv-gold hover:underline">Gérer</button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {images.map((img, index) => (
                    <div key={index} className="aspect-square relative group rounded-lg overflow-hidden border border-white/10 hover:border-white/30 transition-all duration-300">
                        <img src={img} alt="Inspiration" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <button className="p-1.5 bg-white/10 rounded-full hover:bg-white/20 text-white transition-colors">
                                <X size={14} />
                            </button>
                        </div>
                    </div>
                ))}

                {/* Add Button */}
                <button
                    onClick={handleAdd}
                    className="aspect-square border border-dashed border-white/10 rounded-lg flex flex-col items-center justify-center text-gray-600 hover:text-white hover:border-white/30 hover:bg-white/5 transition-all group"
                >
                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                        <Plus size={16} />
                    </div>
                    <span className="text-xs font-medium">Ajouter</span>
                </button>
            </div>
        </div>
    );
};
