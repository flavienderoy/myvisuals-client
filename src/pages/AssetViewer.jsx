import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ArrowLeft, CheckCircle, Clock, AlertCircle, Download, UploadCloud,
    MessageSquare, Info, Loader2, Send, X, Columns2, CornerDownRight,
} from 'lucide-react';
import { assetService } from '../services/assetService';
import { annotationService } from '../services/annotationService';
import { projectService } from '../services/projectService';
import { useData } from '../context/DataContext';
import { useToast } from '../hooks/useToast';
import { openDownloadUrl } from '../utils/download';
import { DiffComparator } from '../components/studio/DiffComparator';
import AnnotationPopup from '../components/studio/AnnotationPopup';

const STATUS_META = {
    approved: { label: 'Validé', icon: CheckCircle, classes: 'bg-green-500/10 text-green-400 border-green-500/30' },
    pending: { label: 'En attente de validation', icon: Clock, classes: 'bg-white/5 text-gray-300 border-white/15' },
    needs_review: { label: 'Retouches demandées', icon: AlertCircle, classes: 'bg-orange-500/10 text-orange-400 border-orange-500/30' },
};

const StatusBadge = ({ status }) => {
    const meta = STATUS_META[status] || STATUS_META.pending;
    const Icon = meta.icon;
    return (
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-medium ${meta.classes}`}>
            <Icon size={13} />
            {meta.label}
        </span>
    );
};

const formatDate = (iso) => {
    if (!iso) return '';
    try {
        return new Date(iso).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    } catch { return ''; }
};

const AssetViewer = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const toast = useToast();
    const { currentUser, patchAsset } = useData();
    const isClient = currentUser?.role === 'client';

    const [asset, setAsset] = useState(null);
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);

    const [annotations, setAnnotations] = useState([]);
    const [selectedPin, setSelectedPin] = useState(null);
    const [draft, setDraft] = useState(null); // {x, y}
    const [draftText, setDraftText] = useState('');
    const [posting, setPosting] = useState(false);
    const [projectMembers, setProjectMembers] = useState([]);

    // Split flat annotations into pinned threads (parent) + their replies
    const threads = useMemo(() => {
        const roots = annotations.filter((a) => !a.parent_id);
        const repliesByParent = annotations.reduce((acc, a) => {
            if (a.parent_id) (acc[a.parent_id] ||= []).push(a);
            return acc;
        }, {});
        return roots.map((r) => ({
            ...r,
            replies: (repliesByParent[r.id] || []).sort((a, b) => new Date(a.created_at) - new Date(b.created_at)),
        }));
    }, [annotations]);

    const [tab, setTab] = useState('comments'); // comments | details
    const [comparing, setComparing] = useState(false);
    const [busyAction, setBusyAction] = useState(null); // 'approve' | 'review' | 'download' | 'version'

    const canvasRef = useRef(null);

    const loadAsset = useCallback(async () => {
        try {
            const data = await assetService.getAssetById(id);
            setAsset(data);
            setAnnotations(data.annotations || []);
            
            if (data.project_id) {
                projectService.getProjectMembers(data.project_id)
                    .then(setProjectMembers)
                    .catch(() => {});
            }
        } catch {
            setNotFound(true);
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => { loadAsset(); }, [loadAsset]);

    // Displayed image: latest version if any, else the asset preview
    const versions = asset?.versions || [];
    const sortedVersions = [...versions].sort((a, b) => (a.version_number || 0) - (b.version_number || 0));
    const latestVersion = sortedVersions[sortedVersions.length - 1];
    const displayUrl = latestVersion?.url || asset?.url;
    const firstVersionUrl = sortedVersions[0]?.url;

    // ----- Annotations -----
    const handleCanvasClick = (e) => {
        if (comparing || !canvasRef.current) return;
        const rect = canvasRef.current.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        setDraft({ x, y });
        setSelectedPin(null);
        setTab('comments');
    };

    const submitAnnotation = async () => {
        if (!draft || !draftText.trim() || posting) return;
        setPosting(true);
        try {
            const mentions = projectMembers.filter(m => draftText.includes(`@${m.name}`)).map(m => m.id);
            const created = await annotationService.createAnnotation({
                asset_id: id,
                content: draftText.trim(),
                x_position: draft.x,
                y_position: draft.y,
                mentions: mentions
            });
            setAnnotations((prev) => [...prev, created]);
            setDraft(null);
            setDraftText('');
        } catch {
            toast.error("Impossible d'ajouter le commentaire");
        } finally {
            setPosting(false);
        }
    };

    const handleReply = async (parentId, text) => {
        try {
            const mentions = projectMembers.filter(m => text.includes(`@${m.name}`)).map(m => m.id);
            const created = await annotationService.createAnnotation({
                asset_id: id,
                content: text,
                parent_id: parentId,
                mentions: mentions
            });
            setAnnotations((prev) => [...prev, created]);
        } catch {
            toast.error("Impossible d'envoyer la réponse");
            throw new Error(); // let popup know
        }
    };

    const handleResolve = async (annotationId) => {
        try {
            const updated = await annotationService.resolveAnnotation(annotationId);
            setAnnotations((prev) => prev.map(a => a.id === annotationId ? { ...a, ...updated } : a));
            toast.success('Ticket résolu');
        } catch {
            toast.error('Impossible de résoudre le ticket');
            throw new Error();
        }
    };

    const handleReopen = async (annotationId) => {
        try {
            const updated = await annotationService.reopenAnnotation(annotationId);
            setAnnotations((prev) => prev.map(a => a.id === annotationId ? { ...a, ...updated } : a));
            toast.success('Ticket rouvert');
        } catch {
            toast.error('Impossible de rouvrir le ticket');
            throw new Error();
        }
    };

    const closePopup = () => {
        setSelectedPin(null);
        setDraft(null);
        setDraftText('');
    };

    useEffect(() => {
        const onKey = (e) => { if (e.key === 'Escape') closePopup(); };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, []);

    // ----- Status actions -----
    const setStatus = async (status, actionKey) => {
        setBusyAction(actionKey);
        try {
            await assetService.updateAsset(id, { status });
            setAsset((prev) => ({ ...prev, status }));
            patchAsset?.(id, { status });
            toast.success(status === 'approved' ? 'Visuel validé' : 'Retouches demandées');
        } catch {
            toast.error('Action impossible');
        } finally {
            setBusyAction(null);
        }
    };

    const handleDownload = async () => {
        setBusyAction('download');
        try {
            const url = await assetService.getDownloadUrl(id);
            openDownloadUrl(url, asset?.name);
        } catch {
            toast.error('Téléchargement non autorisé');
        } finally {
            setBusyAction(null);
        }
    };

    const handleNewVersion = async (file) => {
        if (!file) return;
        setBusyAction('version');
        try {
            await assetService.uploadVersion(id, file, 'Nouvelle itération');
            toast.success('Nouvelle version en ligne');
            await loadAsset();
        } catch {
            toast.error("Échec de l'upload de la version");
        } finally {
            setBusyAction(null);
        }
    };

    // ----- Ticket stats -----
    const openTickets = threads.filter(t => t.status !== 'resolved').length;
    const resolvedTickets = threads.filter(t => t.status === 'resolved').length;

    // ----- Render -----
    if (loading) {
        return (
            <div className="h-dvh flex items-center justify-center bg-[#0a0a0a] text-gray-500 gap-3">
                <Loader2 className="animate-spin" size={22} /> Chargement du visuel…
            </div>
        );
    }

    if (notFound || !asset) {
        return (
            <div className="h-dvh flex flex-col items-center justify-center bg-[#0a0a0a] gap-4">
                <p className="text-gray-400">Visuel introuvable ou accès refusé.</p>
                <button onClick={() => navigate(-1)} className="text-mv-gold hover:text-white transition-colors font-medium">
                    ← Retour
                </button>
            </div>
        );
    }

    const isApproved = asset.status === 'approved';
    const canDownload = !isClient || isApproved;

    // Find the selected thread for the popup
    const selectedThread = selectedPin ? threads.find(t => t.id === selectedPin) : null;
    const selectedPinIndex = selectedThread ? threads.indexOf(selectedThread) + 1 : 0;

    return (
        <div className="h-dvh flex flex-col bg-[#0a0a0a] text-white overflow-hidden">
            {/* ===== Top bar ===== */}
            <header className="h-16 shrink-0 border-b border-white/10 bg-[#111]/90 backdrop-blur flex items-center justify-between px-4 md:px-6 gap-4">
                <div className="flex items-center gap-4 min-w-0">
                    <button
                        onClick={() => navigate(-1)}
                        aria-label="Retour"
                        className="p-2 -ml-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div className="min-w-0">
                        <h1 className="text-sm md:text-base font-bold truncate">{asset.name}</h1>
                        <p className="text-[11px] text-gray-500 truncate">
                            {sortedVersions.length > 0 ? `Version ${sortedVersions.length + 1}` : 'Version 1'} · {formatDate(asset.created_at)}
                        </p>
                    </div>
                    <StatusBadge status={asset.status} />
                </div>

                <div className="flex items-center gap-2 shrink-0">
                    {sortedVersions.length > 0 && (
                        <button
                            onClick={() => setComparing((c) => !c)}
                            className={`hidden md:flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-medium transition-colors ${comparing ? 'border-mv-gold text-mv-gold bg-mv-gold/10' : 'border-white/15 text-gray-300 hover:text-white hover:border-white/30'}`}
                        >
                            <Columns2 size={14} /> Comparer
                        </button>
                    )}

                    {isClient ? (
                        /* Client : décision */
                        isApproved ? (
                            <button
                                onClick={handleDownload}
                                disabled={busyAction === 'download'}
                                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-mv-gold text-black text-sm font-bold hover:bg-white transition-colors disabled:opacity-60"
                            >
                                {busyAction === 'download' ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
                                Télécharger HD
                            </button>
                        ) : (
                            <>
                                <button
                                    onClick={() => setStatus('needs_review', 'review')}
                                    disabled={!!busyAction}
                                    className="px-4 py-2 rounded-lg border border-white/15 text-sm text-gray-300 hover:text-white hover:border-white/30 transition-colors disabled:opacity-60"
                                >
                                    {busyAction === 'review' ? <Loader2 size={16} className="animate-spin" /> : 'Demander des retouches'}
                                </button>
                                <button
                                    onClick={() => setStatus('approved', 'approve')}
                                    disabled={!!busyAction}
                                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-mv-gold text-black text-sm font-bold hover:bg-white transition-colors disabled:opacity-60"
                                >
                                    {busyAction === 'approve' ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle size={16} />}
                                    Approuver
                                </button>
                            </>
                        )
                    ) : (
                        /* Studio : gestion */
                        <>
                            <label className="flex items-center gap-2 px-3 py-2 rounded-lg border border-white/15 text-xs font-medium text-gray-300 hover:text-white hover:border-white/30 transition-colors cursor-pointer">
                                <input type="file" accept="image/*" className="hidden" onChange={(e) => handleNewVersion(e.target.files?.[0])} />
                                {busyAction === 'version' ? <Loader2 size={14} className="animate-spin" /> : <UploadCloud size={14} />}
                                Nouvelle version
                            </label>
                            <button
                                onClick={handleDownload}
                                disabled={busyAction === 'download'}
                                className="flex items-center gap-2 px-3 py-2 rounded-lg border border-white/15 text-xs font-medium text-gray-300 hover:text-white hover:border-white/30 transition-colors disabled:opacity-60"
                            >
                                {busyAction === 'download' ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
                                Original
                            </button>
                            {!isApproved && (
                                <button
                                    onClick={() => setStatus('approved', 'approve')}
                                    disabled={!!busyAction}
                                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-mv-gold text-black text-sm font-bold hover:bg-white transition-colors disabled:opacity-60"
                                >
                                    {busyAction === 'approve' ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle size={16} />}
                                    Marquer validé
                                </button>
                            )}
                        </>
                    )}
                </div>
            </header>

            {/* ===== Body ===== */}
            <div className="flex-1 flex min-h-0">
                {/* Canvas */}
                <main className="flex-1 relative flex items-center justify-center bg-[#0a0a0a] p-4 md:p-8 min-w-0">
                    {comparing && firstVersionUrl ? (
                        <div className="w-full max-w-5xl">
                            <DiffComparator beforeImage={firstVersionUrl} afterImage={displayUrl} />
                        </div>
                    ) : (
                        <div
                            ref={canvasRef}
                            onClick={handleCanvasClick}
                            className="relative max-w-full max-h-full cursor-crosshair select-none"
                        >
                            <img
                                src={displayUrl}
                                alt={asset.name}
                                className="max-h-[calc(100dvh-8rem)] max-w-full object-contain rounded-lg pointer-events-none"
                                draggable={false}
                            />

                            {/* Pins (top-level threads only) */}
                            {threads.map((ann, i) => (
                                <button
                                    key={ann.id || i}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedPin(selectedPin === ann.id ? null : ann.id);
                                        setDraft(null);
                                        setDraftText('');
                                        setTab('comments');
                                    }}
                                    aria-label={`Commentaire ${i + 1}`}
                                    className={`absolute w-7 h-7 -ml-3.5 -mt-3.5 rounded-full border-2 flex items-center justify-center text-xs font-bold shadow-lg transition-all duration-200 ${
                                        ann.status === 'resolved'
                                            ? (selectedPin === ann.id
                                                ? 'bg-green-500 text-white border-white scale-110'
                                                : 'bg-green-500/80 text-white border-green-400/60 hover:scale-110 opacity-60 hover:opacity-100')
                                            : (selectedPin === ann.id
                                                ? 'bg-mv-gold text-black border-white scale-110'
                                                : 'bg-black/80 text-mv-gold border-mv-gold hover:scale-110')
                                    }`}
                                    style={{ left: `${ann.x ?? ann.x_position}%`, top: `${ann.y ?? ann.y_position}%` }}
                                >
                                    {i + 1}
                                </button>
                            ))}

                            {/* Draft pin */}
                            {draft && (
                                <div
                                    className="absolute w-7 h-7 -ml-3.5 -mt-3.5 bg-mv-gold rounded-full border-2 border-white shadow-lg animate-annotation-pulse"
                                    style={{ left: `${draft.x}%`, top: `${draft.y}%` }}
                                />
                            )}

                            {/* ===== POPUP: New draft ===== */}
                            {draft && (
                                <AnnotationPopup
                                    isNewDraft
                                    anchorPosition={draft}
                                    canvasRef={canvasRef}
                                    draftText={draftText}
                                    onDraftTextChange={setDraftText}
                                    onSubmitDraft={submitAnnotation}
                                    draftPosting={posting}
                                    projectMembers={projectMembers}
                                    onClose={() => { setDraft(null); setDraftText(''); }}
                                />
                            )}

                            {/* ===== POPUP: Selected thread ===== */}
                            {selectedThread && !draft && (
                                <AnnotationPopup
                                    thread={selectedThread}
                                    pinIndex={selectedPinIndex}
                                    anchorPosition={{
                                        x: selectedThread.x ?? selectedThread.x_position,
                                        y: selectedThread.y ?? selectedThread.y_position,
                                    }}
                                    canvasRef={canvasRef}
                                    onReply={handleReply}
                                    onResolve={handleResolve}
                                    onReopen={handleReopen}
                                    onClose={() => setSelectedPin(null)}
                                    projectMembers={projectMembers}
                                />
                            )}
                        </div>
                    )}

                    {/* Hint */}
                    {!comparing && !draft && !selectedPin && (
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-black/70 border border-white/10 text-[11px] text-gray-400 pointer-events-none">
                            Cliquez sur l'image pour ajouter un commentaire
                        </div>
                    )}
                </main>

                {/* ===== Sidebar ===== */}
                <aside className="w-80 lg:w-96 shrink-0 border-l border-white/10 bg-[#111] flex flex-col min-h-0">
                    {/* Tabs */}
                    <div className="flex border-b border-white/10 shrink-0">
                        <button
                            onClick={() => setTab('comments')}
                            className={`flex-1 flex items-center justify-center gap-2 py-3.5 text-xs font-bold uppercase tracking-widest transition-colors ${tab === 'comments' ? 'text-mv-gold border-b-2 border-mv-gold' : 'text-gray-500 hover:text-white'}`}
                        >
                            <MessageSquare size={14} /> Commentaires
                            {threads.length > 0 && (
                                <span className="ml-1 px-1.5 py-0.5 rounded-full bg-white/10 text-[10px] text-white">{threads.length}</span>
                            )}
                        </button>
                        <button
                            onClick={() => setTab('details')}
                            className={`flex-1 flex items-center justify-center gap-2 py-3.5 text-xs font-bold uppercase tracking-widest transition-colors ${tab === 'details' ? 'text-mv-gold border-b-2 border-mv-gold' : 'text-gray-500 hover:text-white'}`}
                        >
                            <Info size={14} /> Détails
                        </button>
                    </div>

                    {tab === 'comments' ? (
                        <div className="flex-1 flex flex-col min-h-0">
                            {/* Ticket stats bar */}
                            {threads.length > 0 && (
                                <div className="px-4 py-3 border-b border-white/10 flex items-center gap-3 shrink-0">
                                    <span className="flex items-center gap-1.5 text-[11px] text-gray-400">
                                        <span className="w-2 h-2 rounded-full bg-mv-gold"></span>
                                        {openTickets} ouvert{openTickets !== 1 ? 's' : ''}
                                    </span>
                                    <span className="flex items-center gap-1.5 text-[11px] text-gray-400">
                                        <span className="w-2 h-2 rounded-full bg-green-500"></span>
                                        {resolvedTickets} résolu{resolvedTickets !== 1 ? 's' : ''}
                                    </span>
                                </div>
                            )}

                            {/* List of threads (simplified — click opens popup) */}
                            <div className="flex-1 overflow-y-auto p-4 space-y-2">
                                {threads.length === 0 ? (
                                    <div className="text-center pt-16 px-6">
                                        <MessageSquare size={28} className="mx-auto text-gray-700 mb-3" />
                                        <p className="text-sm text-gray-500">Aucun commentaire pour l'instant.</p>
                                        <p className="text-xs text-gray-600 mt-1">Cliquez sur l'image pour épingler un retour précis.</p>
                                    </div>
                                ) : (
                                    threads.map((ann, i) => (
                                        <button
                                            key={ann.id || i}
                                            onClick={() => {
                                                setSelectedPin(ann.id);
                                                setDraft(null);
                                                setDraftText('');
                                            }}
                                            className={`w-full text-left rounded-xl border transition-all p-3 group ${
                                                selectedPin === ann.id
                                                    ? 'border-mv-gold/60 bg-mv-gold/5'
                                                    : 'border-white/10 bg-white/[0.03] hover:border-white/25 hover:bg-white/[0.05]'
                                            }`}
                                        >
                                            <div className="flex items-center gap-2 mb-1.5">
                                                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 transition-colors ${
                                                    ann.status === 'resolved'
                                                        ? 'bg-green-500 text-white'
                                                        : (selectedPin === ann.id ? 'bg-mv-gold text-black' : 'bg-white/10 text-mv-gold')
                                                }`}>
                                                    {i + 1}
                                                </span>
                                                <span className="text-xs font-bold text-white truncate">{ann.author?.name || 'Utilisateur'}</span>
                                                {/* Status indicator */}
                                                <span className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full border ml-auto shrink-0 ${
                                                    ann.status === 'resolved'
                                                        ? 'bg-green-500/10 text-green-400 border-green-500/20'
                                                        : 'bg-mv-gold/10 text-mv-gold border-mv-gold/20'
                                                }`}>
                                                    {ann.status === 'resolved' ? 'Résolu' : 'Ouvert'}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-400 leading-relaxed pl-7 line-clamp-2">{ann.content}</p>
                                            {ann.replies && ann.replies.length > 0 && (
                                                <div className="flex items-center gap-1.5 pl-7 mt-2 text-[10px] text-gray-600">
                                                    <CornerDownRight size={10} />
                                                    {ann.replies.length} réponse{ann.replies.length > 1 ? 's' : ''}
                                                </div>
                                            )}
                                        </button>
                                    ))
                                )}
                            </div>
                        </div>
                    ) : (
                        /* ===== Details tab ===== */
                        <div className="flex-1 overflow-y-auto p-5 space-y-6">
                            <section>
                                <h3 className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-3">Informations</h3>
                                <dl className="space-y-2.5 text-sm">
                                    <div className="flex justify-between gap-4">
                                        <dt className="text-gray-500">Statut</dt>
                                        <dd><StatusBadge status={asset.status} /></dd>
                                    </div>
                                    <div className="flex justify-between gap-4">
                                        <dt className="text-gray-500">Format</dt>
                                        <dd className="text-white font-medium uppercase">{(asset.mime_type || asset.type || '—').split('/').pop()}</dd>
                                    </div>
                                    <div className="flex justify-between gap-4">
                                        <dt className="text-gray-500">Poids</dt>
                                        <dd className="text-white font-medium tabular-nums">
                                            {asset.file_size ? `${(asset.file_size / (1024 * 1024)).toFixed(2)} Mo` : '—'}
                                        </dd>
                                    </div>
                                    <div className="flex justify-between gap-4">
                                        <dt className="text-gray-500">Ajouté le</dt>
                                        <dd className="text-white font-medium">{formatDate(asset.created_at)}</dd>
                                    </div>
                                </dl>
                            </section>

                            <section>
                                <h3 className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-3">
                                    Versions ({sortedVersions.length + 1})
                                </h3>
                                <ol className="space-y-2">
                                    {[...sortedVersions].reverse().map((v, idx) => (
                                        <li key={v.id} className="flex items-center gap-3 p-3 rounded-xl border border-white/10 bg-white/[0.03]">
                                            <span className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold text-white shrink-0">
                                                V{v.version_number + 1}
                                            </span>
                                            <div className="min-w-0 flex-1">
                                                <p className="text-xs text-gray-400 truncate">{v.comment || 'Itération'}</p>
                                                <p className="text-[10px] text-gray-600">{formatDate(v.created_at)}</p>
                                            </div>
                                            {idx === 0 && (
                                                <span className="text-[9px] bg-mv-gold/10 text-mv-gold px-2 py-0.5 rounded-full border border-mv-gold/25 font-bold shrink-0">ACTUELLE</span>
                                            )}
                                        </li>
                                    ))}
                                    <li className="flex items-center gap-3 p-3 rounded-xl border border-white/10 bg-white/[0.03]">
                                        <span className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold text-white shrink-0">V1</span>
                                        <div className="min-w-0 flex-1">
                                            <p className="text-xs text-gray-400">Version originale</p>
                                            <p className="text-[10px] text-gray-600">{formatDate(asset.created_at)}</p>
                                        </div>
                                        {sortedVersions.length === 0 && (
                                            <span className="text-[9px] bg-mv-gold/10 text-mv-gold px-2 py-0.5 rounded-full border border-mv-gold/25 font-bold shrink-0">ACTUELLE</span>
                                        )}
                                    </li>
                                </ol>
                            </section>
                        </div>
                    )}
                </aside>
            </div>
        </div>
    );
};

export default AssetViewer;
