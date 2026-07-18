import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UploadCloud, CheckCircle, Clock, AlertCircle, LayoutGrid, List, File, Plus } from 'lucide-react';
import { useData } from '../../context/DataContext';

export const ProductionView = ({ project, onOpenUpload }) => {
    const navigate = useNavigate();
    const { createLook } = useData();

    const [viewMode, setViewMode] = useState('grid');
    const [newLookName, setNewLookName] = useState('');
    const [isCreatingLook, setIsCreatingLook] = useState(false);
    const [activeTag, setActiveTag] = useState(null);

    // Unique tags across the project, and the assets matching the active filter
    const allTags = [...new Set((project.assets || []).flatMap((a) => a.tags || []))].sort();
    const filteredAssets = activeTag
        ? (project.assets || []).filter((a) => (a.tags || []).includes(activeTag))
        : (project.assets || []);

    // Group (filtered) assets by looks
    const assetsByLook = filteredAssets.reduce((acc, asset) => {
        const look = project.looks?.find(l => l.id === asset.look_id)?.name || 'Non classé';
        if (!acc[look]) acc[look] = [];
        acc[look].push(asset);
        return acc;
    }, {});

    // Latest version url if any, else the asset preview
    const getAssetUrl = (asset) => {
        if (asset.versions && asset.versions.length > 0) {
            const sorted = [...asset.versions].sort((a, b) => (b.version_number || 0) - (a.version_number || 0));
            return sorted[0].url || asset.url;
        }
        return asset.url;
    };

    const openAsset = (asset) => navigate(`/assets/${asset.id}`);

    const handleCreateLook = async () => {
        if (!newLookName.trim()) return;
        await createLook(project.id, { name: newLookName });
        setNewLookName('');
        setIsCreatingLook(false);
    };

    const statusBadge = (status, size = 10) => {
        if (status === 'approved') return <span className="text-[10px] text-green-400 flex items-center gap-1"><CheckCircle size={size} /> Validé</span>;
        if (status === 'needs_review') return <span className="text-[10px] text-orange-400 flex items-center gap-1"><AlertCircle size={size} /> Retouches</span>;
        return <span className="text-[10px] text-gray-400 flex items-center gap-1"><Clock size={size} /> En attente</span>;
    };

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
                            onKeyDown={(e) => { if (e.key === 'Enter') handleCreateLook(); }}
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

            {/* Tag filter bar */}
            {allTags.length > 0 && (
                <div className="flex flex-wrap items-center gap-2 -mt-6">
                    <span className="text-[11px] text-gray-500 uppercase tracking-widest mr-1">Filtrer</span>
                    <button
                        onClick={() => setActiveTag(null)}
                        className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${!activeTag ? 'bg-white text-black border-white' : 'text-gray-400 border-white/15 hover:border-white/40 hover:text-white'}`}
                    >
                        Tous
                    </button>
                    {allTags.map((t) => (
                        <button
                            key={t}
                            onClick={() => setActiveTag(activeTag === t ? null : t)}
                            className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${activeTag === t ? 'bg-mv-gold text-black border-mv-gold' : 'text-mv-gold/80 border-mv-gold/25 hover:border-mv-gold/60'}`}
                        >
                            #{t}
                        </button>
                    ))}
                </div>
            )}

            {Object.keys(assetsByLook).length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 border border-dashed border-white/10 rounded-xl bg-white/5">
                    <p className="text-gray-500 mb-4">{activeTag ? `Aucun visuel avec le tag #${activeTag}.` : 'Aucune image dans ce projet.'}</p>
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
                    <div className="flex items-center justify-between mb-6 sticky top-0 bg-mv-black/95 backdrop-blur-md z-10 py-4 border-b border-white/10">
                        <div className="flex items-center gap-4">
                            <h3 className="text-lg text-white font-medium">{lookName}</h3>
                            <span className="text-xs text-gray-500 bg-white/5 px-2 py-1 rounded-full">{assets.length} items</span>
                        </div>
                        <div className="flex bg-white/5 rounded-lg p-1 border border-white/10">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`p-2 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-white/10 text-white shadow-sm' : 'text-gray-500 hover:text-white'}`}
                                title="Vue Grille"
                                aria-label="Vue grille"
                            >
                                <LayoutGrid size={16} />
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={`p-2 rounded-md transition-colors ${viewMode === 'list' ? 'bg-white/10 text-white shadow-sm' : 'text-gray-500 hover:text-white'}`}
                                title="Vue Liste"
                                aria-label="Vue liste"
                            >
                                <List size={16} />
                            </button>
                        </div>
                    </div>

                    <div className={viewMode === 'grid' ? 'grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4' : 'flex flex-col gap-2'}>
                        {assets.map((asset) => (
                            viewMode === 'grid' ? (
                                <div
                                    key={asset.id}
                                    onClick={() => openAsset(asset)}
                                    className="group relative aspect-[4/5] bg-white/5 rounded-lg overflow-hidden border border-white/10 hover:border-white/30 transition-all duration-300 cursor-pointer"
                                >
                                    <img
                                        src={getAssetUrl(asset)}
                                        alt={asset.name}
                                        loading="lazy"
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                                        <div className="absolute bottom-3 left-3 right-3">
                                            <p className="text-white text-sm font-medium truncate">{asset.name}</p>
                                            <div className="flex items-center justify-between mt-1">
                                                {statusBadge(asset.status)}
                                                {asset.versions && asset.versions.length > 0 && (
                                                    <span className="text-[10px] bg-white/20 text-white px-1.5 rounded">V{asset.versions.length + 1}</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div
                                    key={asset.id}
                                    onClick={() => openAsset(asset)}
                                    className="group relative flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10 hover:border-white/30 cursor-pointer transition-all"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded bg-black/50 border border-white/10 overflow-hidden shrink-0 flex items-center justify-center">
                                            {(asset.mime_type || '').startsWith('video')
                                                ? <File size={20} className="text-blue-400" />
                                                : <img src={getAssetUrl(asset)} alt={asset.name} loading="lazy" className="w-full h-full object-cover opacity-80" />}
                                        </div>
                                        <div>
                                            <p className="text-white text-sm font-medium">{asset.name}</p>
                                            <p className="text-xs text-gray-500 uppercase tracking-widest mt-1">
                                                {(asset.mime_type || 'fichier').split('/').pop()} • V{(asset.versions?.length || 0) + 1}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        {statusBadge(asset.status, 14)}
                                    </div>
                                </div>
                            )
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};
