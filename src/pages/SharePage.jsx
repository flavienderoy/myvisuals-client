import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Loader2, Lock, X, ImageOff, CheckCircle } from 'lucide-react';
import { projectService } from '../services/projectService';

const initials = (name) => (name || '?').split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase();

const SharePage = () => {
    const { token } = useParams();
    const [state, setState] = useState('loading'); // loading | ok | error
    const [data, setData] = useState(null);
    const [lightbox, setLightbox] = useState(null);

    useEffect(() => {
        let cancelled = false;
        projectService.getSharedProject(token)
            .then((d) => { if (!cancelled) { setData(d); setState('ok'); } })
            .catch(() => { if (!cancelled) setState('error'); });
        return () => { cancelled = true; };
    }, [token]);

    useEffect(() => {
        const onKey = (e) => { if (e.key === 'Escape') setLightbox(null); };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, []);

    if (state === 'loading') {
        return (
            <div className="min-h-dvh bg-mv-black flex items-center justify-center text-gray-500 gap-3">
                <Loader2 className="animate-spin" size={22} /> Chargement du partage…
            </div>
        );
    }

    if (state === 'error') {
        return (
            <div className="min-h-dvh bg-mv-black flex items-center justify-center px-6">
                <div className="text-center max-w-sm">
                    <div className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-5">
                        <Lock className="text-gray-500" size={24} />
                    </div>
                    <h1 className="text-white text-xl font-bold mb-2">Lien indisponible</h1>
                    <p className="text-gray-500 text-sm leading-relaxed">
                        Ce lien de partage n'existe plus ou a été désactivé par le studio.
                    </p>
                </div>
            </div>
        );
    }

    const { project, studio, assets } = data;

    return (
        <div className="min-h-dvh bg-mv-black text-white">
            {/* Header */}
            <header className="sticky top-0 z-30 bg-mv-black/80 backdrop-blur-xl border-b border-white/10">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-3">
                    {studio.avatar_url ? (
                        <img src={studio.avatar_url} alt={studio.name} className="w-9 h-9 rounded-full object-cover" />
                    ) : (
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-mv-gold to-orange-600 flex items-center justify-center text-black text-xs font-bold">
                            {initials(studio.name)}
                        </div>
                    )}
                    <div className="min-w-0">
                        <p className="text-[11px] text-gray-500 uppercase tracking-widest leading-none">{studio.name}</p>
                        <h1 className="text-white font-semibold truncate">{project.name}</h1>
                    </div>
                    <span className="ml-auto inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] text-gray-400 uppercase tracking-widest">
                        <Lock size={11} /> Lecture seule
                    </span>
                </div>
            </header>

            {/* Gallery */}
            <main className="max-w-7xl mx-auto px-6 py-10">
                {project.description && (
                    <p className="text-gray-400 max-w-2xl mb-8 leading-relaxed">{project.description}</p>
                )}

                {assets.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-28 text-center">
                        <ImageOff className="text-gray-700 mb-3" size={32} />
                        <p className="text-gray-500 text-sm">Aucun visuel partagé pour l'instant.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {assets.map((a) => (
                            <button
                                key={a.id}
                                onClick={() => a.url && setLightbox(a)}
                                className="group relative aspect-square rounded-xl overflow-hidden bg-white/5 border border-white/10 hover:border-mv-gold/40 transition-colors"
                            >
                                {a.url ? (
                                    <img src={a.url} alt={a.name} loading="lazy" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-700"><ImageOff size={24} /></div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                <div className="absolute bottom-0 inset-x-0 p-3 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                                    <span className="text-xs text-white truncate">{a.name}</span>
                                    {a.status === 'approved' && <CheckCircle size={14} className="text-emerald-400 shrink-0" />}
                                </div>
                            </button>
                        ))}
                    </div>
                )}
            </main>

            {/* Footer */}
            <footer className="max-w-7xl mx-auto px-6 py-10 text-center border-t border-white/5">
                <p className="text-xs text-gray-600">
                    Créé avec <span className="text-mv-gold font-semibold">Visuals.co</span>
                </p>
            </footer>

            {/* Lightbox */}
            {lightbox && (
                <div
                    className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 md:p-10 animate-fade-in-down"
                    onClick={() => setLightbox(null)}
                >
                    <button
                        onClick={() => setLightbox(null)}
                        className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                        aria-label="Fermer"
                    >
                        <X size={20} />
                    </button>
                    <img
                        src={lightbox.url}
                        alt={lightbox.name}
                        className="max-w-full max-h-full object-contain rounded-lg"
                        onClick={(e) => e.stopPropagation()}
                    />
                    <div className="absolute bottom-5 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-black/60 border border-white/10 text-xs text-gray-300">
                        {lightbox.name}
                    </div>
                </div>
            )}
        </div>
    );
};

export default SharePage;
