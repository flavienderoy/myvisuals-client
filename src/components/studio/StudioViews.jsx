import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    UploadCloud, CheckCircle, Clock, AlertCircle, LayoutGrid, List, File, Plus,
    Folder, FolderPlus, ChevronRight, MoreVertical, Pencil, Trash2, FolderInput, Home, X, Loader2,
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { lookService } from '../../services/lookService';
import { assetService } from '../../services/assetService';
import { useToast } from '../../hooks/useToast';

export const ProductionView = ({ project, onOpenUpload }) => {
    const navigate = useNavigate();
    const { patchAsset } = useData();
    const toast = useToast();

    const [folders, setFolders] = useState([]);
    const [loadingFolders, setLoadingFolders] = useState(true);
    const [currentFolderId, setCurrentFolderId] = useState(null); // null = root
    const [viewMode, setViewMode] = useState('grid');
    const [activeTag, setActiveTag] = useState(null);

    const [creating, setCreating] = useState(false);
    const [newName, setNewName] = useState('');
    const [renamingId, setRenamingId] = useState(null);
    const [renameName, setRenameName] = useState('');
    const [moveMenuFor, setMoveMenuFor] = useState(null); // asset id
    const [folderMenuFor, setFolderMenuFor] = useState(null); // folder id
    const [dragOverId, setDragOverId] = useState(undefined); // folder id being hovered ('root' | id)
    const [draggingAsset, setDraggingAsset] = useState(false);

    const reloadFolders = useCallback(() => {
        setLoadingFolders(true);
        lookService.getLooks(project.id)
            .then((data) => setFolders(Array.isArray(data) ? data : []))
            .catch(() => setFolders([]))
            .finally(() => setLoadingFolders(false));
    }, [project.id]);

    useEffect(() => { reloadFolders(); }, [reloadFolders]);

    // ----- derived -----
    const allTags = useMemo(() => [...new Set((project.assets || []).flatMap((a) => a.tags || []))].sort(), [project.assets]);
    const childFolders = folders.filter((f) => (f.parent_id ?? null) === currentFolderId);
    const assetsHere = (project.assets || []).filter((a) => {
        const inFolder = (a.look_id ?? null) === currentFolderId;
        const tagOk = !activeTag || (a.tags || []).includes(activeTag);
        return inFolder && tagOk;
    });

    // Breadcrumb path from current folder up to the root
    const breadcrumb = useMemo(() => {
        const path = [];
        let id = currentFolderId;
        const byId = Object.fromEntries(folders.map((f) => [f.id, f]));
        while (id && byId[id]) { path.unshift(byId[id]); id = byId[id].parent_id; }
        return path;
    }, [currentFolderId, folders]);

    // Flat folder list with depth (for the "move to" menu)
    const flatFolders = useMemo(() => {
        const out = [];
        const walk = (parentId, depth) => {
            folders.filter((f) => (f.parent_id ?? null) === parentId)
                .forEach((f) => { out.push({ ...f, depth }); walk(f.id, depth + 1); });
        };
        walk(null, 0);
        return out;
    }, [folders]);

    const assetCountIn = (folderId) => (project.assets || []).filter((a) => (a.look_id ?? null) === folderId).length;
    const subCountIn = (folderId) => folders.filter((f) => f.parent_id === folderId).length;

    const getAssetUrl = (asset) => {
        if (asset.versions && asset.versions.length > 0) {
            const sorted = [...asset.versions].sort((a, b) => (b.version_number || 0) - (a.version_number || 0));
            return sorted[0].url || asset.url;
        }
        return asset.url;
    };
    const openAsset = (asset) => navigate(`/assets/${asset.id}`);

    // ----- folder actions -----
    const createFolder = async () => {
        if (!newName.trim()) return;
        try {
            await lookService.createLook(project.id, { name: newName.trim(), parent_id: currentFolderId });
            setNewName(''); setCreating(false);
            reloadFolders();
        } catch { toast.error('Création du dossier impossible'); }
    };
    const renameFolder = async (id) => {
        if (!renameName.trim()) { setRenamingId(null); return; }
        try {
            await lookService.updateLook(id, { name: renameName.trim() });
            setRenamingId(null);
            reloadFolders();
        } catch { toast.error('Renommage impossible'); }
    };
    const deleteFolder = async (folder) => {
        if (!window.confirm(`Supprimer le dossier « ${folder.name} » ? Les visuels reviendront à la racine.`)) return;
        try {
            await lookService.deleteLook(folder.id);
            setFolderMenuFor(null);
            if (currentFolderId === folder.id) setCurrentFolderId(folder.parent_id ?? null);
            reloadFolders();
        } catch { toast.error('Suppression impossible'); }
    };
    const moveAsset = async (assetId, folderId) => {
        setMoveMenuFor(null);
        patchAsset(assetId, { look_id: folderId });
        try { await assetService.updateAsset(assetId, { look_id: folderId }); }
        catch { toast.error('Déplacement impossible'); reloadFolders(); }
    };

    // Drag & drop a visual onto a folder (or the breadcrumb) to file it
    const onAssetDragStart = (e, assetId) => {
        e.dataTransfer.setData('text/asset', assetId);
        e.dataTransfer.effectAllowed = 'move';
        setDraggingAsset(true);
    };
    const onAssetDragEnd = () => { setDraggingAsset(false); setDragOverId(undefined); };
    const allowDrop = (e, key) => { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; setDragOverId(key); };
    const onDropTo = (e, folderId, key) => {
        e.preventDefault();
        const assetId = e.dataTransfer.getData('text/asset');
        setDragOverId(undefined); setDraggingAsset(false);
        if (assetId && key !== undefined) moveAsset(assetId, folderId);
    };

    const statusBadge = (status, size = 10) => {
        if (status === 'approved') return <span className="text-[10px] text-green-400 flex items-center gap-1"><CheckCircle size={size} /> Validé</span>;
        if (status === 'needs_review') return <span className="text-[10px] text-orange-400 flex items-center gap-1"><AlertCircle size={size} /> Retouches</span>;
        return <span className="text-[10px] text-gray-400 flex items-center gap-1"><Clock size={size} /> En attente</span>;
    };

    const isEmpty = childFolders.length === 0 && assetsHere.length === 0;

    return (
        <div className="space-y-6 animate-fade-in pb-20" onClick={() => { setMoveMenuFor(null); setFolderMenuFor(null); }}>
            {/* Toolbar: breadcrumb + actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-white/5 p-3 rounded-xl border border-white/10">
                <nav className="flex items-center gap-1 text-sm min-w-0 flex-wrap">
                    <button
                        onClick={() => setCurrentFolderId(null)}
                        onDragOver={(e) => allowDrop(e, 'root')}
                        onDragLeave={() => setDragOverId(undefined)}
                        onDrop={(e) => onDropTo(e, null, 'root')}
                        className={`flex items-center gap-1.5 px-2 py-1 rounded-lg transition-colors ${dragOverId === 'root' ? 'ring-2 ring-mv-gold bg-mv-gold/10 text-white' : !currentFolderId ? 'text-white' : 'text-gray-400 hover:text-white'}`}
                    >
                        <Home size={15} /> Tous les visuels
                    </button>
                    {breadcrumb.map((f) => (
                        <span key={f.id} className="flex items-center gap-1 min-w-0">
                            <ChevronRight size={14} className="text-gray-600 shrink-0" />
                            <button
                                onClick={() => setCurrentFolderId(f.id)}
                                onDragOver={(e) => allowDrop(e, f.id)}
                                onDragLeave={() => setDragOverId(undefined)}
                                onDrop={(e) => onDropTo(e, f.id, f.id)}
                                className={`px-2 py-1 rounded-lg truncate transition-colors ${dragOverId === f.id ? 'ring-2 ring-mv-gold bg-mv-gold/10 text-white' : currentFolderId === f.id ? 'text-white font-medium' : 'text-gray-400 hover:text-white'}`}
                            >
                                {f.name}
                            </button>
                        </span>
                    ))}
                </nav>
                <div className="flex items-center gap-2">
                    {creating ? (
                        <div className="flex gap-2 items-center" onClick={(e) => e.stopPropagation()}>
                            <input
                                autoFocus type="text" value={newName} onChange={(e) => setNewName(e.target.value)}
                                onKeyDown={(e) => { if (e.key === 'Enter') createFolder(); if (e.key === 'Escape') setCreating(false); }}
                                placeholder="Nom du dossier…"
                                className="bg-black/40 border border-white/15 rounded-lg px-3 py-1.5 text-white text-sm focus:outline-none focus:border-mv-gold/50"
                            />
                            <button onClick={createFolder} className="bg-mv-gold text-black px-3 py-1.5 rounded-lg text-sm font-medium">Créer</button>
                            <button onClick={() => setCreating(false)} className="text-gray-400 hover:text-white px-1"><X size={16} /></button>
                        </div>
                    ) : (
                        <button onClick={(e) => { e.stopPropagation(); setCreating(true); }} className="flex items-center gap-2 text-sm text-mv-gold hover:text-white transition-colors px-2 py-1">
                            <FolderPlus size={16} /> {currentFolderId ? 'Sous-dossier' : 'Dossier'}
                        </button>
                    )}
                    <div className="flex bg-white/5 rounded-lg p-1 border border-white/10">
                        <button onClick={() => setViewMode('grid')} className={`p-1.5 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-white'}`} aria-label="Vue grille"><LayoutGrid size={16} /></button>
                        <button onClick={() => setViewMode('list')} className={`p-1.5 rounded-md transition-colors ${viewMode === 'list' ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-white'}`} aria-label="Vue liste"><List size={16} /></button>
                    </div>
                </div>
            </div>

            {/* Tag filter */}
            {allTags.length > 0 && (
                <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[11px] text-gray-500 uppercase tracking-widest mr-1">Filtrer</span>
                    <button onClick={() => setActiveTag(null)} className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${!activeTag ? 'bg-white text-black border-white' : 'text-gray-400 border-white/15 hover:border-white/40 hover:text-white'}`}>Tous</button>
                    {allTags.map((t) => (
                        <button key={t} onClick={() => setActiveTag(activeTag === t ? null : t)} className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${activeTag === t ? 'bg-mv-gold text-black border-mv-gold' : 'text-mv-gold/80 border-mv-gold/25 hover:border-mv-gold/60'}`}>#{t}</button>
                    ))}
                </div>
            )}

            {/* Sub-folders */}
            {childFolders.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {childFolders.map((f) => (
                        <div
                            key={f.id}
                            onClick={() => setCurrentFolderId(f.id)}
                            onDragOver={(e) => allowDrop(e, f.id)}
                            onDragLeave={() => setDragOverId(undefined)}
                            onDrop={(e) => onDropTo(e, f.id, f.id)}
                            className={`group relative flex items-center gap-3 p-4 bg-white/5 border rounded-xl cursor-pointer transition-all ${dragOverId === f.id ? 'border-mv-gold ring-2 ring-mv-gold/40 bg-mv-gold/10 scale-[1.02]' : 'border-white/10 hover:border-mv-gold/40 hover:bg-white/[0.07]'}`}
                        >
                            <div className="w-10 h-10 rounded-lg bg-mv-gold/10 text-mv-gold flex items-center justify-center shrink-0"><Folder size={20} /></div>
                            <div className="min-w-0 flex-1">
                                {renamingId === f.id ? (
                                    <input
                                        autoFocus value={renameName} onClick={(e) => e.stopPropagation()}
                                        onChange={(e) => setRenameName(e.target.value)}
                                        onKeyDown={(e) => { if (e.key === 'Enter') renameFolder(f.id); if (e.key === 'Escape') setRenamingId(null); }}
                                        onBlur={() => renameFolder(f.id)}
                                        className="w-full bg-black/40 border border-white/15 rounded px-2 py-1 text-white text-sm focus:outline-none"
                                    />
                                ) : (
                                    <p className="text-white text-sm font-medium truncate">{f.name}</p>
                                )}
                                <p className="text-[11px] text-gray-500">{assetCountIn(f.id)} visuels · {subCountIn(f.id)} sous-dossiers</p>
                            </div>
                            <div className="relative" onClick={(e) => e.stopPropagation()}>
                                <button onClick={() => setFolderMenuFor(folderMenuFor === f.id ? null : f.id)} className="p-1.5 rounded-lg text-gray-500 hover:text-white hover:bg-white/10 opacity-0 group-hover:opacity-100 transition" aria-label="Options du dossier"><MoreVertical size={16} /></button>
                                {folderMenuFor === f.id && (
                                    <div className="absolute right-0 top-full mt-1 w-40 bg-mv-dark border border-white/10 rounded-lg shadow-2xl z-30 py-1">
                                        <button onClick={() => { setRenamingId(f.id); setRenameName(f.name); setFolderMenuFor(null); }} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:bg-white/5"><Pencil size={14} /> Renommer</button>
                                        <button onClick={() => deleteFolder(f)} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10"><Trash2 size={14} /> Supprimer</button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Assets in the current folder */}
            {isEmpty ? (
                <div className="flex flex-col items-center justify-center py-16 border border-dashed border-white/10 rounded-xl bg-white/5">
                    {loadingFolders ? (
                        <span className="text-gray-500 flex items-center gap-2"><Loader2 size={16} className="animate-spin" /> Chargement…</span>
                    ) : (
                        <>
                            <p className="text-gray-500 mb-4">{activeTag ? `Aucun visuel avec le tag #${activeTag} ici.` : 'Ce dossier est vide.'}</p>
                            <button onClick={onOpenUpload} className="flex items-center gap-2 px-6 py-3 bg-mv-gold hover:bg-white text-black font-medium rounded-full transition-colors"><UploadCloud size={18} /> Télécharger des fichiers</button>
                        </>
                    )}
                </div>
            ) : assetsHere.length > 0 && (
                <div className={viewMode === 'grid' ? 'grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4' : 'flex flex-col gap-2'}>
                    {assetsHere.map((asset) => {
                        const moveMenu = moveMenuFor === asset.id && (
                            <div className="absolute right-2 top-10 w-52 max-h-64 overflow-y-auto bg-mv-dark border border-white/10 rounded-lg shadow-2xl z-30 py-1" onClick={(e) => e.stopPropagation()}>
                                <p className="px-3 py-1.5 text-[10px] text-gray-500 uppercase tracking-widest">Déplacer vers</p>
                                <button onClick={() => moveAsset(asset.id, null)} className={`w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-white/5 ${!asset.look_id ? 'text-mv-gold' : 'text-gray-300'}`}><Home size={13} /> Tous les visuels</button>
                                {flatFolders.map((f) => (
                                    <button key={f.id} onClick={() => moveAsset(asset.id, f.id)} className={`w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-white/5 ${asset.look_id === f.id ? 'text-mv-gold' : 'text-gray-300'}`} style={{ paddingLeft: `${12 + f.depth * 14}px` }}><Folder size={13} /> <span className="truncate">{f.name}</span></button>
                                ))}
                            </div>
                        );
                        return viewMode === 'grid' ? (
                            <div key={asset.id} draggable onDragStart={(e) => onAssetDragStart(e, asset.id)} onDragEnd={onAssetDragEnd} onClick={() => openAsset(asset)} className={`group relative aspect-[4/5] bg-white/5 rounded-lg overflow-hidden border border-white/10 hover:border-white/30 transition-all duration-300 cursor-pointer ${draggingAsset ? 'active:opacity-50' : ''}`}>
                                <img src={getAssetUrl(asset)} alt={asset.name} loading="lazy" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                                <button onClick={(e) => { e.stopPropagation(); setMoveMenuFor(moveMenuFor === asset.id ? null : asset.id); }} className="absolute top-2 right-2 w-8 h-8 rounded-lg bg-black/60 backdrop-blur text-white flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-black/80 transition z-20" title="Déplacer" aria-label="Déplacer le visuel"><FolderInput size={15} /></button>
                                {moveMenu}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                    <div className="absolute bottom-3 left-3 right-3">
                                        <p className="text-white text-sm font-medium truncate">{asset.name}</p>
                                        <div className="flex items-center justify-between mt-1">
                                            {statusBadge(asset.status)}
                                            {asset.versions && asset.versions.length > 0 && <span className="text-[10px] bg-white/20 text-white px-1.5 rounded">V{asset.versions.length + 1}</span>}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div key={asset.id} draggable onDragStart={(e) => onAssetDragStart(e, asset.id)} onDragEnd={onAssetDragEnd} onClick={() => openAsset(asset)} className="group relative flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10 hover:border-white/30 cursor-pointer transition-all">
                                <div className="flex items-center gap-4 min-w-0">
                                    <div className="w-12 h-12 rounded bg-black/50 border border-white/10 overflow-hidden shrink-0 flex items-center justify-center">
                                        {(asset.mime_type || '').startsWith('video') ? <File size={20} className="text-blue-400" /> : <img src={getAssetUrl(asset)} alt={asset.name} loading="lazy" className="w-full h-full object-cover opacity-80" />}
                                    </div>
                                    <div className="min-w-0"><p className="text-white text-sm font-medium truncate">{asset.name}</p><p className="text-xs text-gray-500 uppercase tracking-widest mt-1">{(asset.mime_type || 'fichier').split('/').pop()}</p></div>
                                </div>
                                <div className="flex items-center gap-3 relative">
                                    {statusBadge(asset.status, 14)}
                                    <button onClick={(e) => { e.stopPropagation(); setMoveMenuFor(moveMenuFor === asset.id ? null : asset.id); }} className="p-1.5 rounded-lg text-gray-500 hover:text-white hover:bg-white/10 transition" title="Déplacer" aria-label="Déplacer le visuel"><FolderInput size={16} /></button>
                                    {moveMenu}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};
