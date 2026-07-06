import React, { useState } from 'react';
import { Leaf, Maximize2, Download, LayoutGrid, List, File } from 'lucide-react';
import { LuxuryTitle } from '../common/LuxuryTitle';

const ImageItem = ({ asset, onClick, viewMode }) => {
    const [loaded, setLoaded] = useState(false);
    const version = asset.versions.find(v => v.isLatest) || asset.versions[0];

    if (viewMode === 'list') {
        const isVideo = version.url.match(/\.(mp4|mov)$/i);
        return (
            <div
                onClick={() => onClick({ ...asset })}
                className="group relative flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10 hover:border-[#D4AF37]/30 cursor-pointer transition-all"
            >
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded bg-black/50 border border-white/10 overflow-hidden shrink-0 flex items-center justify-center">
                        {isVideo ? <File size={20} className="text-blue-400" /> : <img src={version.url} alt={asset.name} className="w-full h-full object-cover opacity-80" />}
                    </div>
                    <div>
                        <p className="text-white text-sm font-medium">{asset.name}</p>
                        <p className="text-xs text-gray-500 uppercase tracking-widest mt-1">
                            {version.url.split('.').pop().toUpperCase() || 'FICHIER'} • {asset.versions?.length > 1 ? `V${asset.versions.length}` : 'V1'}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2 text-xs text-green-500">
                    <Download size={14} /> Télécharger
                </div>
            </div>
        );
    }

    return (
        <div
            onClick={() => onClick({ ...asset })}
            className="relative bg-mv-dark aspect-[3/4] cursor-pointer group overflow-hidden border-white/10 rounded-lg hover:border-[#D4AF37]/50 border transition-all"
        >
            <div className={`absolute inset-0 bg-white/5 transition-opacity duration-700 ${loaded ? 'opacity-0' : 'opacity-100'}`}></div>

            <img
                src={version.url}
                alt={asset.name}
                onLoad={() => setLoaded(true)}
                className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-105 ${loaded ? 'opacity-100 blur-0' : 'opacity-0 blur-xl'}`}
            />

            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
                <button className="p-3 bg-white text-black rounded-full hover:bg-[#D4AF37] transition-colors">
                    <Maximize2 size={20} />
                </button>
            </div>
        </div>
    );
};

export const ImmersiveGallery = ({ project, onSelectAsset }) => {
    const [viewMode, setViewMode] = useState('grid');

    return (
        <div className="animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
                <div>
                    <LuxuryTitle text={project.name} size="text-2xl" className="text-white mb-2" />
                    <div className="flex items-center gap-4">
                        <p className="text-gray-400 text-sm tracking-widest uppercase">Galerie Livrables</p>
                        <div className="flex items-center gap-2 text-green-500 border border-green-900/30 bg-green-900/10 px-3 py-1 rounded-full text-xs">
                            <Leaf size={12} />
                            <span>Eco-Mode (~12MB)</span>
                        </div>
                        <div className="flex bg-white/5 rounded-lg p-1 border border-white/10 ml-4 hidden md:flex">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`p-1.5 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-white/10 text-white shadow-sm' : 'text-gray-500 hover:text-white'}`}
                                title="Vue Grille"
                            >
                                <LayoutGrid size={14} />
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={`p-1.5 rounded-md transition-colors ${viewMode === 'list' ? 'bg-white/10 text-white shadow-sm' : 'text-gray-500 hover:text-white'}`}
                                title="Vue Liste"
                            >
                                <List size={14} />
                            </button>
                        </div>
                    </div>
                </div>

                <div>
                    <button className="px-6 py-3 bg-green-500 hover:bg-green-400 text-white font-bold tracking-wide rounded-xl flex items-center justify-center gap-3 transition-colors shadow-[0_0_20px_rgba(34,197,94,0.2)]">
                        <Download size={18} /> Tout Télécharger (.ZIP)
                    </button>
                </div>
            </div>

            <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2" : "flex flex-col gap-2"}>
                {project.assets.map(asset => (
                    <ImageItem
                        key={asset.id}
                        asset={asset}
                        onClick={onSelectAsset}
                        viewMode={viewMode}
                    />
                ))}
            </div>
        </div>
    );
};
