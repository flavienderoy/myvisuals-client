import React from 'react';
import { X, Download } from 'lucide-react';

export const ImageDetail = ({ asset, onClose }) => {
    const version = asset.versions.find(v => v.isLatest) || asset.versions[0];

    return (
        <div className="fixed inset-0 z-40 bg-black flex animate-fade-in">
            {/* Main Image Area */}
            <div className="flex-1 relative bg-black flex items-center justify-center overflow-hidden">
                <button
                    onClick={onClose}
                    className="absolute top-6 left-6 z-50 p-3 bg-black/20 backdrop-blur-md border border-white/10 text-white hover:bg-white/10 hover:border-white/20 rounded-full transition-all duration-300"
                >
                    <X size={24} />
                </button>

                <div className="relative max-h-[90vh] max-w-[90vw]">
                    <img
                        src={version.url}
                        alt="Asset"
                        className="max-h-[90vh] object-contain transition-all duration-500 opacity-100"
                    />
                </div>
            </div>

            {/* Sidebar - Pure Delivery DA */}
            <div className="w-[380px] bg-[#1A1A1A]/90 backdrop-blur-2xl border-l border-white/10 p-8 flex flex-col justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-white leading-tight mb-2">{asset.name}</h2>
                    <p className="text-xs font-medium text-gray-500 tracking-widest uppercase mb-8">Livrable Final</p>

                    <div className="space-y-6">
                        <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                            <h3 className="text-xs font-bold tracking-widest text-[#D4AF37] uppercase mb-2">Informations Fichier</h3>
                            <div className="space-y-2 text-sm text-gray-300">
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Format</span>
                                    <span className="font-medium text-white">{asset.type === 'video' ? 'MP4 (H.264)' : 'JPG (Haute Résolution)'}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Taille estimée</span>
                                    <span className="font-medium text-white">{asset.type === 'video' ? '~ 450 MB' : '~ 15 MB'}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Qualité</span>
                                    <span className="font-medium text-white">4K UHD</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="pt-8 mt-auto">
                    <button className="w-full py-4 bg-green-500 hover:bg-green-400 text-white font-bold tracking-wide rounded-xl flex items-center justify-center gap-3 transition-colors shadow-[0_0_20px_rgba(34,197,94,0.2)]">
                        <Download size={20} /> Télécharger l'original
                    </button>
                </div>
            </div>
        </div>
    );
};
