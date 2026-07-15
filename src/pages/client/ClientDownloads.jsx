import React, { useEffect, useMemo, useState } from 'react';
import { LuxuryTitle } from '../../components/common/LuxuryTitle';
import { Download, FileImage, FileVideo, FileArchive, FileText, Search, Clock, Loader2 } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { assetService } from '../../services/assetService';
import { openDownloadUrl } from '../../utils/download';
import { useToast } from '../../hooks/useToast';

const iconFor = (type) => {
    switch (type) {
        case 'video': return <FileVideo size={24} className="text-blue-400" />;
        case 'archive': return <FileArchive size={24} className="text-mv-gold" />;
        case 'image': return <FileImage size={24} className="text-green-400" />;
        case 'document': return <FileText size={24} className="text-purple-400" />;
        default: return <Download size={24} className="text-gray-400" />;
    }
};

const formatSize = (bytes) => {
    if (!bytes) return '—';
    if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} Ko`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`;
};

const formatDate = (iso) => {
    if (!iso) return '';
    try {
        return new Date(iso).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });
    } catch {
        return '';
    }
};

const ClientDownloads = () => {
    const { projects } = useData();
    const toast = useToast();
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [downloadingId, setDownloadingId] = useState(null);
    const [query, setQuery] = useState('');

    useEffect(() => {
        let cancelled = false;
        (async () => {
            setLoading(true);
            const collected = [];
            for (const p of projects) {
                try {
                    const res = await assetService.getAssets(p.id);
                    const list = Array.isArray(res) ? res : res.data || [];
                    list
                        .filter((a) => a.status === 'approved')
                        .forEach((a) => collected.push({
                            id: a.id,
                            name: a.name,
                            type: a.type,
                            size: a.file_size,
                            date: a.created_at,
                            project: p.name,
                        }));
                } catch {
                    // skip projects whose assets can't be loaded
                }
            }
            if (!cancelled) {
                setFiles(collected);
                setLoading(false);
            }
        })();
        return () => { cancelled = true; };
    }, [projects]);

    const visible = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return files;
        return files.filter((f) => f.name?.toLowerCase().includes(q) || f.project?.toLowerCase().includes(q));
    }, [files, query]);

    const handleDownload = async (file) => {
        setDownloadingId(file.id);
        try {
            const url = await assetService.getDownloadUrl(file.id);
            openDownloadUrl(url, file.name);
        } catch {
            toast.error("Téléchargement non autorisé");
        } finally {
            setDownloadingId(null);
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-10 py-12 space-y-12 animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
                <div>
                    <LuxuryTitle text="Téléchargements" size="text-4xl" className="text-white mb-3" />
                    <p className="text-gray-400 text-lg">Retrouvez tous vos fichiers validés, prêts à télécharger.</p>
                </div>
                <div className="flex items-center bg-white/5 border border-white/10 rounded-lg px-4 py-2 w-full md:w-64 focus-within:border-white/30 transition-colors">
                    <Search size={16} className="text-gray-500 mr-2" />
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Rechercher un fichier..."
                        className="bg-transparent border-none text-sm text-white placeholder:text-gray-600 outline-none w-full"
                    />
                </div>
            </div>

            <div className="bg-[#1A1A1A]/50 border border-white/10 rounded-xl overflow-hidden">
                <div className="hidden md:grid grid-cols-12 gap-4 p-4 border-b border-white/10 bg-white/5 text-xs text-gray-500 font-medium uppercase tracking-widest">
                    <div className="col-span-6">Nom du fichier</div>
                    <div className="col-span-3">Projet</div>
                    <div className="col-span-2">Date</div>
                    <div className="col-span-1 text-right">Taille</div>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-20 text-gray-500 gap-3">
                        <Loader2 className="animate-spin" size={20} /> Chargement de vos fichiers…
                    </div>
                ) : visible.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-gray-500 text-sm">
                            {files.length === 0 ? "Aucun fichier validé pour l'instant." : 'Aucun résultat pour cette recherche.'}
                        </p>
                    </div>
                ) : (
                    <div className="divide-y divide-white/5">
                        {visible.map((file) => (
                            <div
                                key={file.id}
                                onClick={() => handleDownload(file)}
                                className="group grid grid-cols-1 md:grid-cols-12 gap-4 p-4 items-center hover:bg-white/5 transition-colors cursor-pointer"
                            >
                                <div className="col-span-6 flex items-center gap-4">
                                    <div className="p-3 bg-black/50 rounded-lg border border-white/5 group-hover:border-white/10 transition-colors">
                                        {downloadingId === file.id ? <Loader2 size={24} className="animate-spin text-mv-gold" /> : iconFor(file.type)}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-white font-medium truncate group-hover:text-mv-gold transition-colors">{file.name}</p>
                                        <p className="text-xs text-gray-500 md:hidden mt-0.5">{file.project} • {formatDate(file.date)}</p>
                                    </div>
                                </div>
                                <div className="col-span-3 hidden md:block text-sm text-gray-400">{file.project}</div>
                                <div className="col-span-2 hidden md:flex items-center gap-2 text-sm text-gray-400">
                                    <Clock size={14} className="text-gray-500" />
                                    {formatDate(file.date)}
                                </div>
                                <div className="col-span-1 flex justify-between md:justify-end items-center text-sm font-medium">
                                    <span className="md:hidden text-gray-500">Taille:</span>
                                    <span className="text-white/70">{formatSize(file.size)}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ClientDownloads;
