import React, { useState } from 'react';
import { X, ArrowLeft, ArrowRight, Grid2X2 } from 'lucide-react';

export const AssetComparison = ({ assets, onClose }) => {
    const [layout, setLayout] = useState('grid'); // 'grid' | 'slider'
    const [currentIndex, setCurrentIndex] = useState(0);

    const maxAssets = Math.min(assets.length, 4);
    const displayAssets = assets.slice(0, maxAssets);

    return (
        <div className="fixed inset-0 z-50 bg-black flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-white/10 flex items-center justify-between bg-mv-dark/80 backdrop-blur-sm">
                <div>
                    <h2 className="text-white font-medium">Comparaison d'Assets</h2>
                    <p className="text-xs text-gray-500">{displayAssets.length} assets</p>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setLayout(layout === 'grid' ? 'slider' : 'grid')}
                        className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-lg text-sm transition-colors flex items-center gap-2"
                    >
                        <Grid2X2 size={14} />
                        {layout === 'grid' ? 'Mode Slider' : 'Mode Grille'}
                    </button>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    >
                        <X className="text-gray-400" size={20} />
                    </button>
                </div>
            </div>

            {/* Content */}
            {layout === 'grid' ? (
                <div className={`flex-1 grid gap-1 p-1 ${displayAssets.length === 2 ? 'grid-cols-2' :
                        displayAssets.length === 3 ? 'grid-cols-3' :
                            'grid-cols-2 grid-rows-2'
                    }`}>
                    {displayAssets.map((asset, idx) => (
                        <div key={asset.id} className="relative bg-black flex items-center justify-center overflow-hidden group">
                            <img
                                src={asset.url}
                                alt={asset.name}
                                className="max-w-full max-h-full object-contain"
                            />
                            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                                <p className="text-white text-sm font-medium">{asset.name}</p>
                                <p className="text-gray-400 text-xs">{asset.version || 'v1'}</p>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex-1 flex items-center justify-center relative">
                    <img
                        src={displayAssets[currentIndex].url}
                        alt={displayAssets[currentIndex].name}
                        className="max-w-full max-h-full object-contain"
                    />

                    {/* Navigation */}
                    {displayAssets.length > 1 && (
                        <>
                            <button
                                onClick={() => setCurrentIndex((currentIndex - 1 + displayAssets.length) % displayAssets.length)}
                                className="absolute left-4 p-3 bg-black/50 hover:bg-black/70 rounded-full transition-colors"
                            >
                                <ArrowLeft className="text-white" size={24} />
                            </button>
                            <button
                                onClick={() => setCurrentIndex((currentIndex + 1) % displayAssets.length)}
                                className="absolute right-4 p-3 bg-black/50 hover:bg-black/70 rounded-full transition-colors"
                            >
                                <ArrowRight className="text-white" size={24} />
                            </button>
                        </>
                    )}

                    {/* Info Overlay */}
                    <div className="absolute bottom-4 left-4 right-4 p-4 bg-black/70 backdrop-blur-sm rounded-lg">
                        <p className="text-white font-medium">{displayAssets[currentIndex].name}</p>
                        <p className="text-gray-400 text-sm">{displayAssets[currentIndex].version || 'v1'}</p>
                        <p className="text-xs text-gray-500 mt-1">
                            {currentIndex + 1} / {displayAssets.length}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};
