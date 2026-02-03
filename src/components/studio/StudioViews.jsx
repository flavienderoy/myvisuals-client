import React, { useState } from 'react';
import { Layers, Image as ImageIcon, MessageSquare, CheckCircle, Clock } from 'lucide-react';
import { LuxuryTitle } from '../common/LuxuryTitle';
import { AssetDetail } from './AssetDetail';

// --- Production View Component ---
export const ProductionView = ({ project }) => {
    const [selectedAsset, setSelectedAsset] = useState(null);

    // Helpers
    const getLookName = (lookId) => {
        return project.looks?.find(l => l.id === lookId)?.name || "Non classé";
    };

    // Group assets by look
    // (In a real app, we might handle assets without looks, but assuming data integrity for now)
    const assetsByLook = project.assets?.reduce((acc, asset) => {
        const lookId = asset.lookId || 'uncategorized';
        if (!acc[lookId]) acc[lookId] = [];
        acc[lookId].push(asset);
        return acc;
    }, {}) || {};

    return (
        <div className="space-y-12 animate-fade-in-up">
            {/* Iterate over Looks */}
            {Object.entries(assetsByLook).map(([lookId, assets]) => (
                <div key={lookId} className="space-y-4">
                    {/* Look Header */}
                    <div className="flex items-center gap-3 border-b border-white/5 pb-2">
                        <div className="w-1.5 h-1.5 bg-mv-gold rounded-full"></div>
                        <h3 className="text-sm font-medium text-gray-400 uppercase tracking-widest">
                            {getLookName(lookId)}
                        </h3>
                        <span className="text-xs text-gray-600 font-mono">
                            {assets.length} éléments
                        </span>
                    </div>

                    {/* Contact Sheet Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {assets.map(asset => {
                            // Get latest version for thumbnail
                            const versions = asset.versions || [];
                            const latestVersion = versions.length > 0 ? versions[versions.length - 1] : null;

                            if (!latestVersion) return null;

                            return (
                                <div
                                    key={asset.id}
                                    className="group relative cursor-pointer"
                                    onClick={() => setSelectedAsset(asset)}
                                >
                                    {/* Thumbnail Container */}
                                    <div className="aspect-[2/3] bg-mv-dark rounded overflow-hidden border border-white/5 group-hover:border-mv-gold/50 transition-all">
                                        <img
                                            src={latestVersion.url}
                                            alt={asset.name}
                                            className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                                        />

                                        {/* Overlay Info */}
                                        <div className="absolute inset-0 bg-mv-black/20 group-hover:bg-transparent transition-colors"></div>

                                        {/* Status Badge */}
                                        <div className="absolute top-2 right-2">
                                            {asset.status === 'approved' && <CheckCircle size={14} className="text-green-400" />}
                                            {asset.status === 'needs_review' && <MessageSquare size={14} className="text-orange-400" />}
                                            {asset.status === 'pending' && <Clock size={14} className="text-gray-500" />}
                                        </div>

                                        {/* Hover Actions / Metadata */}
                                        <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-mv-black/90 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                                            <div className="flex items-center justify-between text-xs text-white">
                                                <span className="font-mono">{asset.name}</span>
                                                {versions.length > 1 && (
                                                    <span className="flex items-center gap-1 bg-white/10 px-1.5 py-0.5 rounded">
                                                        <Layers size={10} /> v{versions.length}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            ))}

            {Object.keys(assetsByLook).length === 0 && (
                <div className="text-center py-20 border border-dashed border-white/10 rounded-lg">
                    <ImageIcon className="mx-auto text-gray-600 mb-4" size={32} />
                    <p className="text-gray-500">Aucun fichier téléchargé pour ce Look.</p>
                    <div className="mt-4">
                        <button className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white text-sm rounded transition-colors border border-white/5">
                            Télécharger des fichiers
                        </button>
                    </div>
                </div>
            )}

            {/* Detail Modal */}
            {selectedAsset && (
                <AssetDetail
                    asset={selectedAsset}
                    onClose={() => setSelectedAsset(null)}
                />
            )}
        </div>
    );
};
