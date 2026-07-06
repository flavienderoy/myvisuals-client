import React, { useState } from 'react';
import { Download, CheckSquare, X } from 'lucide-react';
import { useToast } from '../../hooks/useToast';

export const BulkSelector = ({ assets, onClose }) => {
    const [selectedAssets, setSelectedAssets] = useState(new Set());
    const toast = useToast();

    const toggleAsset = (assetId) => {
        const newSelected = new Set(selectedAssets);
        if (newSelected.has(assetId)) {
            newSelected.delete(assetId);
        } else {
            newSelected.add(assetId);
        }
        setSelectedAssets(newSelected);
    };

    const selectAll = () => {
        setSelectedAssets(new Set(assets.map(a => a.id)));
    };

    const deselectAll = () => {
        setSelectedAssets(new Set());
    };

    const handleDownload = () => {
        if (selectedAssets.size === 0) {
            toast.error('Sélectionnez au moins un asset');
            return;
        }

        // Simulate ZIP download (would be real with backend)
        toast.promise(
            new Promise((resolve) => {
                setTimeout(() => {
                    resolve();
                }, 1500);
            }),
            {
                loading: `Préparation du ZIP (${selectedAssets.size} fichiers)...`,
                success: `${selectedAssets.size} fichiers téléchargés !`,
                error: 'Erreur lors du téléchargement',
            }
        );

        // In real app: create ZIP and trigger download
        // const blob = await createZip(selectedAssets);
        // downloadBlob(blob, 'assets.zip');
    };

    return (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-mv-dark border border-white/10 rounded-xl max-w-4xl w-full max-h-[80vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="p-6 border-b border-white/10 flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight text-white mb-1">Sélection Multiple</h2>
                        <p className="text-sm text-gray-400">
                            {selectedAssets.size} / {assets.length} sélectionné{selectedAssets.size > 1 ? 's' : ''}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    >
                        <X className="text-gray-400" size={20} />
                    </button>
                </div>

                {/* Actions */}
                <div className="p-4 border-b border-white/10 flex gap-3">
                    <button
                        onClick={selectAll}
                        className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-lg text-sm transition-colors"
                    >
                        Tout sélectionner
                    </button>
                    <button
                        onClick={deselectAll}
                        className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-lg text-sm transition-colors"
                    >
                        Tout désélectionner
                    </button>
                    <div className="flex-1" />
                    <button
                        onClick={handleDownload}
                        disabled={selectedAssets.size === 0}
                        className="px-6 py-2 bg-mv-gold hover:bg-white text-black font-medium rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Download size={16} />
                        Télécharger ({selectedAssets.size})
                    </button>
                </div>

                {/* Asset Grid */}
                <div className="flex-1 overflow-y-auto p-6">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {assets.map(asset => {
                            const isSelected = selectedAssets.has(asset.id);
                            return (
                                <div
                                    key={asset.id}
                                    onClick={() => toggleAsset(asset.id)}
                                    className={`relative aspect-square rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${isSelected
                                        ? 'border-mv-gold scale-95'
                                        : 'border-transparent hover:border-white/20'
                                        }`}
                                >
                                    <img
                                        src={asset.url}
                                        alt={asset.name}
                                        className="w-full h-full object-cover"
                                    />

                                    {/* Checkbox Overlay */}
                                    <div className={`absolute inset-0 flex items-center justify-center transition-opacity ${isSelected ? 'bg-mv-gold/20' : 'bg-black/0 hover:bg-black/40'
                                        }`}>
                                        <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${isSelected
                                            ? 'bg-mv-gold border-mv-gold scale-110'
                                            : 'bg-white/10 border-white/10 hover:border-white/30 transition-all duration-300'
                                            }`}>
                                            {isSelected && <CheckSquare className="text-black" size={18} />}
                                        </div>
                                    </div>

                                    {/* Asset Name */}
                                    <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent">
                                        <p className="text-xs text-white truncate">{asset.name}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};
