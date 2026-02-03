import React, { useState, useEffect } from 'react';
import { Leaf, Eye, Maximize2 } from 'lucide-react';
import { LuxuryTitle } from '../common/LuxuryTitle';

const ImageItem = ({ asset, onClick }) => {
    const [loaded, setLoaded] = useState(false);
    const version = asset.versions.find(v => v.isLatest) || asset.versions[0];

    return (
        <div
            onClick={() => onClick(asset)}
            className="relative bg-mv-dark aspect-[3/4] cursor-pointer group overflow-hidden"
        >
            {/* Skeleton / Lazy Load */}
            <div className={`absolute inset-0 bg-gray-800 animate-pulse transition-opacity duration-700 ${loaded ? 'opacity-0' : 'opacity-100'}`}></div>

            <img
                src={version.url}
                alt={asset.name}
                onLoad={() => setLoaded(true)}
                className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-105 ${loaded ? 'opacity-100 blur-0' : 'opacity-0 blur-xl'}`}
            />

            {/* Watermark Simulation */}
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-30 select-none overflow-hidden">
                <div className="rotate-[-45deg] text-4xl font-bold text-white/10 whitespace-nowrap">
                    MYVISUALS PREVIEW  MYVISUALS PREVIEW MYVISUALS PREVIEW
                </div>
            </div>

            {/* Hover Actions */}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
                <button className="p-3 bg-white text-black rounded-full hover:bg-mv-gold transition-colors">
                    <Maximize2 size={20} />
                </button>
            </div>

            {/* Status Badge */}
            <div className="absolute top-4 left-4">
                {asset.status === 'feedback_received' && <span className="px-2 py-1 bg-orange-500 text-white text-xs font-bold uppercase tracking-wide">Feedback Open</span>}
                {asset.status === 'approved' && <span className="px-2 py-1 bg-green-500 text-white text-xs font-bold uppercase tracking-wide">Approved</span>}
            </div>
        </div>
    );
};

export const ImmersiveGallery = ({ project, onSelectAsset }) => {
    return (
        <div className="animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
                <div>
                    <LuxuryTitle text={project.name} size="text-2xl" className="text-white" />
                    <p className="text-gray-400 text-sm">Gallery Preview</p>
                </div>

                {/* Eco Indicator */}
                <div className="flex items-center gap-2 text-green-500 border border-green-900/30 bg-green-900/10 px-3 py-1.5 rounded-full text-xs">
                    <Leaf size={12} />
                    <span>Eco-Mode: Optimized Assets (~12MB)</span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-1">
                {project.assets.map(asset => (
                    <ImageItem key={asset.id} asset={asset} onClick={onSelectAsset} />
                ))}
            </div>
        </div>
    );
};
