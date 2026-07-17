import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { LuxuryTitle } from '../../components/common/LuxuryTitle';
import { ProjectCard } from '../../components/studio/ProjectSlider';
import { FolderOpen, Clock, CheckCircle, Download, ArrowRight } from 'lucide-react';

const ClientDashboard = () => {
    const navigate = useNavigate();
    const { projects, currentUser, selectProject } = useData();

    // The API already returns only the projects linked to this client account.
    const clientProjects = projects;

    // The client's actual work queue: every visual awaiting their decision
    const toReview = useMemo(() => (
        clientProjects.flatMap(p =>
            (p.assets || [])
                .filter(a => a.status === 'pending')
                .map(a => ({ ...a, projectName: p.name }))
        )
    ), [clientProjects]);

    const filesReady = clientProjects.reduce((acc, p) => acc + (p.assets?.filter(a => a.status === 'approved').length || 0), 0);

    return (
        <div className="max-w-7xl mx-auto px-10 py-12 space-y-14 animate-fade-in overflow-hidden">
            {/* Header */}
            <div>
                <LuxuryTitle text="Espace Client" size="text-4xl" className="text-white mb-3" />
                <p className="text-gray-400 text-lg">Bienvenue, <span className="text-white">{currentUser?.name || 'cher client'}</span>.</p>
            </div>

            {/* ===== Work queue: visuals awaiting the client's decision ===== */}
            <section>
                <div className="flex items-center justify-between mb-6 border-b border-white/10 pb-3">
                    <h2 className="text-sm font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                        <Clock size={14} className="text-mv-gold" />
                        À valider
                        {toReview.length > 0 && (
                            <span className="px-2 py-0.5 rounded-full bg-mv-gold text-black text-[10px] font-bold tabular-nums">{toReview.length}</span>
                        )}
                    </h2>
                </div>

                {toReview.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {toReview.slice(0, 10).map((asset) => (
                            <button
                                key={asset.id}
                                onClick={() => navigate(`/assets/${asset.id}`)}
                                className="group relative aspect-[4/5] bg-white/5 rounded-lg overflow-hidden border border-white/10 hover:border-mv-gold/60 transition-all duration-300 text-left"
                            >
                                <img
                                    src={asset.url}
                                    alt={asset.name}
                                    loading="lazy"
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent">
                                    <div className="absolute bottom-3 left-3 right-3">
                                        <p className="text-white text-sm font-medium truncate">{asset.name}</p>
                                        <p className="text-[10px] text-gray-400 truncate mb-2">{asset.projectName}</p>
                                        <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-mv-gold">
                                            Donner mon avis <ArrowRight size={11} className="group-hover:translate-x-0.5 transition-transform" />
                                        </span>
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                ) : (
                    <div className="flex items-center gap-4 py-8 px-6 bg-white/5 rounded-xl border border-white/10">
                        <CheckCircle size={22} className="text-green-400 shrink-0" />
                        <div>
                            <p className="text-white text-sm font-medium">Tout est à jour.</p>
                            <p className="text-gray-500 text-xs mt-0.5">Aucun visuel n'attend votre validation pour le moment.</p>
                        </div>
                    </div>
                )}
            </section>

            {/* ===== Downloads shortcut (only when something is ready) ===== */}
            {filesReady > 0 && (
                <button
                    onClick={() => navigate('/client/downloads')}
                    className="w-full flex items-center justify-between p-6 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-mv-gold/40 rounded-xl transition-all group"
                >
                    <div className="flex items-center gap-4">
                        <div className="p-3 rounded-lg bg-mv-gold/10 text-mv-gold border border-mv-gold/20">
                            <Download size={20} />
                        </div>
                        <div className="text-left">
                            <p className="text-white font-medium">
                                {filesReady} fichier{filesReady > 1 ? 's' : ''} haute définition prêt{filesReady > 1 ? 's' : ''} au téléchargement
                            </p>
                            <p className="text-xs text-gray-500 mt-0.5">Vos visuels validés, en qualité originale.</p>
                        </div>
                    </div>
                    <ArrowRight size={18} className="text-gray-500 group-hover:text-mv-gold group-hover:translate-x-1 transition-all" />
                </button>
            )}

            {/* ===== Projects ===== */}
            <section>
                <div className="flex items-center justify-between mb-6 border-b border-white/10 pb-3">
                    <h2 className="text-sm font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                        <FolderOpen size={14} /> Vos Projets
                    </h2>
                </div>
                {clientProjects.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {clientProjects.map(project => (
                            <ProjectCard
                                key={project.id}
                                project={project}
                                onClick={() => {
                                    selectProject(project.id);
                                    navigate(`/client/projects/${project.id}`);
                                }}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 bg-white/5 rounded-xl border border-white/10">
                        <p className="text-gray-500 text-sm">Aucun projet pour le moment.</p>
                        <p className="text-gray-600 text-xs mt-1">Vos projets apparaîtront ici dès que votre studio les partagera.</p>
                    </div>
                )}
            </section>
        </div>
    );
};

export default ClientDashboard;
