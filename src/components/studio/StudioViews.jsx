import React, { useState, useRef } from 'react';
import { UploadCloud, CheckCircle, Clock, LayoutGrid, List, File, FileImage, Plus, MessageCircle } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { Modal } from '../common/Modal';
import { DiffComparator } from './DiffComparator';
import { assetService } from '../../services/assetService';
import toast from 'react-hot-toast';

export const ProductionView = ({ project, onOpenUpload }) => {
    // Group assets by looks
    const assetsByLook = project.assets ? project.assets.reduce((acc, asset) => {
        const look = project.looks?.find(l => l.id === asset.lookId)?.name || "Non classé";
        if (!acc[look]) acc[look] = [];
        acc[look].push(asset);
        return acc;
    }, {}) : {};

    const { createLook, createAnnotation, annotations } = useData();
    const [selectedAsset, setSelectedAsset] = useState(null);
    const [viewMode, setViewMode] = useState('grid');
    const [newLookName, setNewLookName] = useState('');
    const [isCreatingLook, setIsCreatingLook] = useState(false);
    
    const imageContainerRef = useRef(null);
    const [draftAnnotation, setDraftAnnotation] = useState(null);
    const [annotationText, setAnnotationText] = useState('');

    // Helper to get asset URL
    const getAssetUrl = (asset) => {
        // Prefer latest version or direct url
        if (asset.versions && asset.versions.length > 0) {
            // Sort versions descending
            const sorted = [...asset.versions].sort((a, b) => b.version - a.version);
            return sorted[0].url;
        }
        return asset.url;
    };

    // Helper to get raw asset URL (for diff) - usually version 1
    const getRawAssetUrl = (asset) => {
        if (asset.versions && asset.versions.length > 0) {
            const sorted = [...asset.versions].sort((a, b) => a.version - b.version);
            return sorted[0].url;
        }
        return asset.url; // Fallback
    };

    const openAssetDetail = (asset) => {
        setSelectedAsset(asset);
    };

    const handleCreateLook = async () => {
        if (!newLookName.trim()) return;
        await createLook(project.id, { name: newLookName });
        setNewLookName('');
        setIsCreatingLook(false);
    };

    const handleImageClick = (e) => {
        if (!imageContainerRef.current || !selectedAsset) return;
        const rect = imageContainerRef.current.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        setDraftAnnotation({ x, y });
    };

    const submitAnnotation = async () => {
        if (!draftAnnotation || !annotationText.trim()) return;
        await createAnnotation({
            asset_id: selectedAsset.id,
            content: annotationText,
            x_position: draftAnnotation.x,
            y_position: draftAnnotation.y
        });
        setDraftAnnotation(null);
        setAnnotationText('');
    };

    // Filter project annotations for the selected asset plus any global state annotations
    const assetAnnotations = [
        ...(selectedAsset?.annotations || []),
        ...annotations.filter(a => a.asset_id === selectedAsset?.id)
    ];

    return (
        <div className="space-y-12 animate-fade-in pb-20">
            {/* Header / Actions for Looks */}
            <div className="flex justify-between items-center bg-white/5 p-4 rounded-xl border border-white/10">
                <h2 className="text-white font-medium">Gestion des Looks</h2>
                {isCreatingLook ? (
                    <div className="flex gap-2">
                        <input 
                            type="text" 
                            className="bg-black/50 border border-white/20 rounded px-3 py-1 text-white text-sm"
                            placeholder="Nom du look..."
                            value={newLookName}
                            onChange={(e) => setNewLookName(e.target.value)}
                        />
                        <button onClick={handleCreateLook} className="bg-mv-gold text-black px-3 py-1 rounded text-sm font-medium">Sauver</button>
                        <button onClick={() => setIsCreatingLook(false)} className="text-gray-400 hover:text-white px-2 py-1 text-sm">Annuler</button>
                    </div>
                ) : (
                    <button onClick={() => setIsCreatingLook(true)} className="flex items-center gap-2 text-sm text-mv-gold hover:text-white transition-colors">
                        <Plus size={16} /> Ajouter un Look
                    </button>
                )}
            </div>
            {Object.keys(assetsByLook).length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 border border-dashed border-white/10 rounded-xl bg-white/5">
                    <p className="text-gray-500 mb-4">Aucune image dans ce projet.</p>
                    <button
                        onClick={onOpenUpload}
                        className="flex items-center gap-2 px-6 py-3 bg-mv-gold hover:bg-white text-black font-medium rounded-full transition-colors"
                    >
                        <UploadCloud size={18} />
                        <span>Télécharger des fichiers</span>
                    </button>
                </div>
            )}

            {Object.entries(assetsByLook).map(([lookName, assets]) => (
                <div key={lookName}>
                    <div className="flex items-center gap-4 mb-6 sticky top-0 bg-mv-black/95 backdrop-blur-md z-10 py-4 border-b border-white/10 hover:border-white/30 transition-all duration-300">
                        <h3 className="text-lg text-white font-medium">{lookName}</h3>
                        <span className="text-xs text-gray-500 bg-white/5 px-2 py-1 rounded-full">{assets.length} items</span>
                    </div>

                    {Object.keys(assetsByLook).length > 0 && (
                        <div className="flex justify-end mb-4">
                            <div className="flex bg-white/5 rounded-lg p-1 border border-white/10">
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className={`p-2 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-white/10 text-white shadow-sm' : 'text-gray-500 hover:text-white'}`}
                                    title="Vue Grille"
                                >
                                    <LayoutGrid size={16} />
                                </button>
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={`p-2 rounded-md transition-colors ${viewMode === 'list' ? 'bg-white/10 text-white shadow-sm' : 'text-gray-500 hover:text-white'}`}
                                    title="Vue Liste"
                                >
                                    <List size={16} />
                                </button>
                            </div>
                        </div>
                    )}

                    <div className={viewMode === 'grid' ? "grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4" : "flex flex-col gap-2"}>
                        {assets.map((asset) => (
                            viewMode === 'grid' ? (
                                <div
                                    key={asset.id}
                                    onClick={() => openAssetDetail(asset)}
                                    className="group relative aspect-[4/5] bg-white/5 rounded-lg overflow-hidden border border-white/10 hover:border-white/30 transition-all duration-300 cursor-pointer"
                                >
                                    <img
                                        src={getAssetUrl(asset)}
                                        alt={asset.name}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                                        <div className="absolute bottom-3 left-3 right-3">
                                            <p className="text-white text-sm font-medium truncate">{asset.name}</p>
                                            <div className="flex items-center justify-between mt-1">
                                                {/* Status Badge */}
                                                {asset.status === 'approved' && <span className="text-[10px] text-green-400 flex items-center gap-1"><CheckCircle size={10} /> Validé</span>}
                                                {asset.status === 'pending' && <span className="text-[10px] text-gray-400 flex items-center gap-1"><Clock size={10} /> En attente</span>}
                                                {asset.status === 'needs_review' && <span className="text-[10px] text-orange-400 flex items-center gap-1"><Clock size={10} /> À revoir</span>}

                                                {/* Version Badge */}
                                                {asset.versions && asset.versions.length > 1 && (
                                                    <span className="text-[10px] bg-white/20 text-white px-1.5 rounded">V{asset.versions.length}</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div
                                    key={asset.id}
                                    onClick={() => openAssetDetail(asset)}
                                    className="group relative flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10 hover:border-white/30 cursor-pointer transition-all"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded bg-black/50 border border-white/10 overflow-hidden shrink-0 flex items-center justify-center">
                                            {asset.url.match(/\.(mp4|mov)$/i) ? <File size={20} className="text-blue-400" /> : <img src={getAssetUrl(asset)} alt={asset.name} className="w-full h-full object-cover opacity-80" />}
                                        </div>
                                        <div>
                                            <p className="text-white text-sm font-medium">{asset.name}</p>
                                            <p className="text-xs text-gray-500 uppercase tracking-widest mt-1">
                                                {asset.url.split('.').pop().toUpperCase() || 'FICHIER'} • {asset.versions?.length > 1 ? `V${asset.versions.length}` : 'V1'}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        {asset.status === 'approved' && <span className="text-xs text-green-400 flex items-center gap-1"><CheckCircle size={14} /> Validé</span>}
                                        {asset.status === 'pending' && <span className="text-xs text-gray-400 flex items-center gap-1"><Clock size={14} /> En attente</span>}
                                        {asset.status === 'needs_review' && <span className="text-xs text-orange-400 flex items-center gap-1"><Clock size={14} /> À revoir</span>}
                                    </div>
                                </div>
                            )
                        ))}
                    </div>
                </div>
            ))}

            {/* Asset Detail Modal */}
            <Modal isOpen={!!selectedAsset} onClose={() => setSelectedAsset(null)} title={selectedAsset?.name || "Détail"}>
                {selectedAsset && (
                    <div className="space-y-6">
                        <div 
                            className="bg-black/50 rounded-lg overflow-hidden border border-white/10 relative" 
                            ref={imageContainerRef}
                            onClick={handleImageClick}
                        >
                            {selectedAsset.versions?.length > 1 ? (
                                <DiffComparator
                                    beforeImage={getRawAssetUrl(selectedAsset)}
                                    afterImage={getAssetUrl(selectedAsset)}
                                />
                            ) : (
                                <img src={getAssetUrl(selectedAsset)} alt="Asset" className="w-full h-auto max-h-[60vh] object-contain mx-auto pointer-events-none" />
                            )}

                            {/* Render Annotations */}
                            {assetAnnotations.map((ann, i) => (
                                <div key={ann.id || i} className="absolute w-6 h-6 -ml-3 -mt-3 bg-red-500 rounded-full border-2 border-white flex items-center justify-center text-xs font-bold text-white shadow-lg cursor-pointer group" style={{ left: `${ann.x_position || ann.x}%`, top: `${ann.y_position || ann.y}%` }}>
                                    {i + 1}
                                    <div className="absolute top-8 left-1/2 -translate-x-1/2 bg-black text-white text-xs whitespace-nowrap px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-10 w-48 text-wrap">
                                        <p className="font-bold text-mv-gold">{ann.author || 'Utilisateur'}</p>
                                        <p>{ann.content || ann.text}</p>
                                    </div>
                                </div>
                            ))}

                            {/* Draft Annotation */}
                            {draftAnnotation && (
                                <div className="absolute w-6 h-6 -ml-3 -mt-3 bg-mv-gold rounded-full border-2 border-white flex items-center justify-center text-xs shadow-lg animate-pulse" style={{ left: `${draftAnnotation.x}%`, top: `${draftAnnotation.y}%` }}>
                                </div>
                            )}
                        </div>

                        {/* Annotation Input Form if draft exists */}
                        {draftAnnotation && (
                            <div className="flex gap-2 items-center bg-white/5 p-3 rounded-lg border border-mv-gold/50">
                                <MessageCircle size={16} className="text-mv-gold" />
                                <input 
                                    type="text" 
                                    autoFocus
                                    className="flex-1 bg-transparent text-sm text-white focus:outline-none"
                                    placeholder="Votre commentaire..."
                                    value={annotationText}
                                    onChange={(e) => setAnnotationText(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') submitAnnotation();
                                        if (e.key === 'Escape') setDraftAnnotation(null);
                                    }}
                                />
                                <button onClick={submitAnnotation} className="px-3 py-1 bg-mv-gold text-black rounded text-xs font-bold">Poster</button>
                            </div>
                        )}

                        {/* Metadata / Actions */}
                        <div className="grid grid-cols-3 gap-6">
                            <div className="col-span-2 space-y-4">
                                <div>
                                    <h4 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-2">Historique des Versions</h4>
                                    <div className="space-y-2">
                                        {selectedAsset.versions?.map((v) => (
                                            <div key={v.version} className="flex items-center justify-between p-3 bg-white/5 rounded hover:bg-white/10 cursor-pointer transition-colors group">
                                                <div className="flex items-center gap-3">
                                                    <span className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold text-white">V{v.version}</span>
                                                    <div className="flex flex-col">
                                                        <span className="text-sm text-white capitalize">{v.type}</span>
                                                        <span className="text-[10px] text-gray-500">12 Mars 2026 • 14:30</span>
                                                    </div>
                                                </div>
                                                {v.version === selectedAsset.versions.length && (
                                                    <span className="text-[10px] bg-mv-gold/10 text-mv-gold px-2 py-0.5 rounded border border-mv-gold/20">ACTUEL</span>
                                                )}
                                            </div>
                                        )) || <p className="text-sm text-gray-500">Version originale (RAW).</p>}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h4 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-2">Actions</h4>
                                <button className="w-full py-2 bg-green-500/10 text-green-500 border border-green-500/20 hover:bg-green-500 hover:text-white rounded transition-colors text-sm font-medium">Validé</button>
                                <button className="w-full py-2 bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500 hover:text-white rounded transition-colors text-sm font-medium">Rejeter</button>
                                <div className="h-px bg-white/10 my-2"></div>
                                <label className="w-full py-2 bg-blue-500/10 text-blue-500 border border-blue-500/20 hover:bg-blue-500 hover:text-white rounded transition-colors text-sm font-medium flex items-center justify-center cursor-pointer">
                                    <input 
                                        type="file" 
                                        className="hidden" 
                                        onChange={async (e) => {
                                            if (!e.target.files?.length) return;
                                            try {
                                                const loadingToast = toast.loading("Upload de la nouvelle version...");
                                                await assetService.uploadVersion(selectedAsset.id, e.target.files[0], "Nouvelle itération");
                                                toast.dismiss(loadingToast);
                                                toast.success("Version uploadée !");
                                            } catch (error) {
                                                toast.error("Erreur lors de l'upload");
                                            }
                                        }}
                                    />
                                    Nouvelle Version
                                </label>
                                <button className="w-full py-2 bg-white/5 text-gray-400 hover:text-white rounded transition-colors text-sm mt-2">Télécharger</button>
                            </div>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};
