import React, { useEffect, useState } from 'react';
import { Modal } from '../../common/Modal';
import { Link2, Copy, Check, Loader2, Globe, ExternalLink, ShieldCheck } from 'lucide-react';
import { projectService } from '../../../services/projectService';
import { useToast } from '../../../hooks/useToast';

export const ShareModal = ({ isOpen, onClose, projectId }) => {
    const toast = useToast();
    const [loading, setLoading] = useState(true);
    const [toggling, setToggling] = useState(false);
    const [enabled, setEnabled] = useState(false);
    const [token, setToken] = useState(null);
    const [copied, setCopied] = useState(false);

    const shareUrl = token ? `${window.location.origin}/share/${token}` : '';

    useEffect(() => {
        if (!isOpen || !projectId) return;
        setLoading(true);
        projectService.getProjectById(projectId)
            .then((p) => { setEnabled(!!p.share_enabled); setToken(p.share_token || null); })
            .catch(() => {})
            .finally(() => setLoading(false));
    }, [isOpen, projectId]);

    const toggle = async () => {
        setToggling(true);
        try {
            if (enabled) {
                await projectService.disableShare(projectId);
                setEnabled(false);
                toast.success('Lien de partage désactivé');
            } else {
                const { token: t } = await projectService.enableShare(projectId);
                setToken(t);
                setEnabled(true);
                toast.success('Lien de partage activé');
            }
        } catch {
            toast.error('Action impossible');
        } finally {
            setToggling(false);
        }
    };

    const copy = async () => {
        try {
            await navigator.clipboard.writeText(shareUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 1800);
        } catch {
            toast.error('Copie impossible');
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Partager le projet">
            {loading ? (
                <div className="flex items-center justify-center py-10 text-gray-500 gap-3">
                    <Loader2 size={18} className="animate-spin" /> Chargement…
                </div>
            ) : (
                <div className="space-y-6">
                    {/* Toggle card */}
                    <div className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/10">
                        <div className="w-10 h-10 rounded-lg bg-mv-gold/15 flex items-center justify-center shrink-0">
                            <Globe size={20} className="text-mv-gold" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-white font-medium text-sm">Lien public en lecture seule</p>
                            <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                                Toute personne avec le lien voit les visuels (filigranés), sans compte ni téléchargement.
                            </p>
                        </div>
                        <button
                            onClick={toggle}
                            disabled={toggling}
                            role="switch"
                            aria-checked={enabled}
                            className={`relative w-12 h-7 rounded-full transition-colors shrink-0 ${enabled ? 'bg-mv-gold' : 'bg-white/15'} disabled:opacity-60`}
                        >
                            <span className={`absolute top-1 left-1 w-5 h-5 rounded-full bg-white transition-transform ${enabled ? 'translate-x-5' : ''}`}>
                                {toggling && <Loader2 size={14} className="animate-spin text-black m-[3px]" />}
                            </span>
                        </button>
                    </div>

                    {/* Link row */}
                    {enabled && token && (
                        <div className="space-y-3 animate-fade-in-up">
                            <label className="text-[11px] text-gray-400 uppercase tracking-widest">Lien de partage</label>
                            <div className="flex gap-2">
                                <div className="flex-1 flex items-center gap-2 bg-black/30 border border-white/10 rounded-lg px-3 py-2.5 min-w-0">
                                    <Link2 size={15} className="text-gray-500 shrink-0" />
                                    <span className="text-sm text-gray-300 truncate">{shareUrl}</span>
                                </div>
                                <button
                                    onClick={copy}
                                    className="flex items-center gap-2 px-4 rounded-lg bg-mv-gold text-black font-medium text-sm hover:bg-white transition-colors"
                                >
                                    {copied ? <Check size={15} /> : <Copy size={15} />}
                                    {copied ? 'Copié' : 'Copier'}
                                </button>
                            </div>
                            <a
                                href={shareUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-mv-gold transition-colors"
                            >
                                <ExternalLink size={13} /> Ouvrir l'aperçu public
                            </a>
                        </div>
                    )}

                    {/* Reassurance */}
                    <div className="flex items-center gap-2 text-[11px] text-gray-500 border-t border-white/5 pt-4">
                        <ShieldCheck size={14} className="text-emerald-400/70 shrink-0" />
                        Les fichiers originaux ne sont jamais exposés — seuls les aperçus filigranés. Désactivez le lien pour le révoquer instantanément.
                    </div>
                </div>
            )}
        </Modal>
    );
};
