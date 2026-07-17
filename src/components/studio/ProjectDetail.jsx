import React, { useState } from 'react';
import { ArrowLeft, Grid, Package, CheckCircle, Plus, ShieldCheck, Clock, Monitor, Settings, Download, Loader2 } from 'lucide-react';
import { LuxuryTitle } from '../common/LuxuryTitle';
import { ProductionView } from './StudioViews';
import { PageTransition } from '../common/PageTransition';
import { Modal } from '../common/Modal';
import { EditProjectModal } from './modals/EditProjectModal';
import { ImageUploader } from '../common/ImageUploader';
import { AuditTrail } from './AuditTrail';
import { assetService } from '../../services/assetService';
import { saveBlob } from '../../utils/download';
import { useToast } from '../../hooks/useToast';

export const ProjectDetail = ({ project, onBack, onAddAsset, isClient = false }) => {
    const [activeTab, setActiveTab] = useState('production');
    const [isUploadOpen, setIsUploadOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);
    const toast = useToast();

    const assets = project.assets || [];
    const approvedCount = assets.filter(a => a.status === 'approved').length;
    const allApproved = assets.length > 0 && approvedCount === assets.length;
    // Studio can always zip; a client can as soon as something is approved
    const canDownloadZip = !isClient ? assets.length > 0 : approvedCount > 0;

    const handleUpload = (fileData) => {
        onAddAsset(fileData);
    };

    const handleDownloadAll = async () => {
        setIsDownloading(true);
        try {
            await toast.promise(
                assetService.downloadProjectZip(project.id).then((blob) => saveBlob(blob, `${project.name || 'projet'}.zip`)),
                {
                    loading: 'Préparation de l\'archive…',
                    success: 'Archive téléchargée',
                    error: 'Aucun fichier disponible ou accès refusé',
                }
            );
        } finally {
            setIsDownloading(false);
        }
    };

    return (
        <PageTransition className="h-full flex flex-col">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-[10px] text-gray-500 mb-4 font-mono uppercase tracking-widest">
                <button onClick={onBack} className="hover:text-mv-gold transition-colors">Portefeuille</button>
                <span>/</span>
                <span className="text-gray-400">{project.client}</span>
                <span>/</span>
                <span className="text-white bg-white/5 px-2 py-0.5 rounded">{project.name}</span>
            </div>

            {/* Header */}
            <div className="flex items-center gap-4 mb-2">
                <button
                    onClick={onBack}
                    className="w-8 h-8 flex items-center justify-center rounded-full border border-white/10 text-gray-400 hover:text-white hover:border-mv-gold transition-colors"
                    title="Retour"
                    aria-label="Retour"
                >
                    <ArrowLeft size={16} />
                </button>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3">
                        <LuxuryTitle text={project.name} size="text-2xl" className="text-white" />
                        <span className="px-2 py-0.5 text-xs border border-white/20 rounded text-gray-400 uppercase tracking-wider">
                            {project.client}
                        </span>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3">
                    {!isClient && (
                        <>
                            <button
                                onClick={() => setIsEditOpen(true)}
                                className="w-10 h-10 flex items-center justify-center rounded-full border border-white/10 text-gray-400 hover:text-white hover:border-mv-gold hover:bg-white/5 transition-colors"
                                title="Paramètres du projet"
                                aria-label="Paramètres du projet"
                            >
                                <Settings size={18} />
                            </button>

                            <button
                                onClick={() => window.open(`/showroom/${project.id}`, '_blank')}
                                className="flex items-center gap-2 px-4 py-2 bg-transparent text-white border border-white/20 rounded-full hover:border-mv-gold hover:text-mv-gold transition-all text-sm font-medium"
                                title="Ouvrir le Showroom de livraison"
                            >
                                <Monitor size={16} />
                                <span className="hidden md:inline">Showroom</span>
                            </button>

                            <button
                                onClick={() => setIsUploadOpen(true)}
                                className="flex items-center gap-2 px-5 py-2 bg-mv-gold text-black rounded-full hover:bg-white transition-all text-sm font-bold"
                            >
                                <Plus size={16} />
                                <span className="hidden md:inline">Ajouter des images</span>
                            </button>
                        </>
                    )}

                    {/* Status */}
                    <div className="flex items-center gap-2 text-sm text-gray-400 border-l border-white/10 pl-4">
                        <div className={`w-2 h-2 rounded-full ${project.status === 'in_progress' ? 'bg-orange-500 animate-pulse' :
                            project.status === 'completed' ? 'bg-green-500' : 'bg-gray-500'
                            }`}></div>
                        <span className="uppercase tracking-widest text-xs">{project.status.replace('_', ' ')}</span>
                    </div>
                </div>
            </div>

            {/* Compact brief line — description + key facts, no dedicated tab */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-1 text-sm text-gray-500 mb-6 pl-12">
                {project.description && <span className="text-gray-400 truncate max-w-xl">{project.description}</span>}
                <span className="shrink-0">Échéance : <span className="text-gray-300">{project.date || '—'}</span></span>
                <span className="shrink-0 tabular-nums">{assets.length} fichier{assets.length > 1 ? 's' : ''}</span>
                {assets.length > 0 && (
                    <span className="shrink-0 tabular-nums">
                        <span className={approvedCount === assets.length ? 'text-green-400' : 'text-mv-gold'}>{approvedCount}</span>
                        <span> / {assets.length} validé{approvedCount > 1 ? 's' : ''}</span>
                    </span>
                )}
            </div>

            {/* Workspace Tabs */}
            <div className="flex items-center gap-8 border-b border-white/10 mb-8">
                <button
                    onClick={() => setActiveTab('production')}
                    className={`pb-3 text-sm font-medium tracking-widest uppercase transition-colors relative ${activeTab === 'production' ? 'text-mv-gold' : 'text-gray-500 hover:text-gray-300'}`}
                >
                    <span className="flex items-center gap-2">
                        <Grid size={14} /> Production
                    </span>
                    {activeTab === 'production' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-mv-gold"></div>}
                </button>
                <button
                    onClick={() => setActiveTab('delivery')}
                    className={`pb-3 text-sm font-medium tracking-widest uppercase transition-colors relative ${activeTab === 'delivery' ? 'text-mv-gold' : 'text-gray-500 hover:text-gray-300'}`}
                >
                    <span className="flex items-center gap-2">
                        <ShieldCheck size={14} /> Livraison
                    </span>
                    {activeTab === 'delivery' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-mv-gold"></div>}
                </button>
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-y-auto pr-2 scrollbar-hide">
                {activeTab === 'production' && (
                    <ProductionView
                        project={project}
                        onOpenUpload={() => setIsUploadOpen(true)}
                    />
                )}

                {activeTab === 'delivery' && (
                    <div className="animate-fade-in max-w-6xl mx-auto space-y-8">
                        {/* Delivery Console */}
                        <div className="bg-white/5 border border-white/10 rounded-xl p-8 text-center relative overflow-hidden">
                            <Package size={48} className="mx-auto text-white/50 mb-6" />

                            <h3 className="text-2xl text-white font-bold tracking-tight mb-2">Console de Livraison</h3>

                            {/* Real validation progress */}
                            {assets.length > 0 ? (
                                <div className="max-w-sm mx-auto mb-6">
                                    <div className="flex justify-between text-xs text-gray-500 mb-2">
                                        <span>Validation client</span>
                                        <span className="tabular-nums">{approvedCount} / {assets.length}</span>
                                    </div>
                                    <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full rounded-full transition-all duration-500 ${allApproved ? 'bg-green-500' : 'bg-mv-gold'}`}
                                            style={{ width: `${assets.length ? (approvedCount / assets.length) * 100 : 0}%` }}
                                        />
                                    </div>
                                </div>
                            ) : (
                                <p className="text-gray-500 text-sm mb-6">Aucun fichier dans ce projet pour l'instant.</p>
                            )}

                            <p className="text-gray-400 max-w-md mx-auto mb-8 leading-relaxed text-sm">
                                {isClient
                                    ? (approvedCount > 0
                                        ? 'Vos fichiers validés sont disponibles en haute définition.'
                                        : 'Approuvez vos visuels pour débloquer les fichiers haute définition.')
                                    : 'Archive complète des originaux du projet, à tout moment.'}
                            </p>

                            {canDownloadZip ? (
                                <div className="max-w-lg mx-auto animate-fade-in-up">
                                    <button
                                        onClick={handleDownloadAll}
                                        disabled={isDownloading}
                                        className="w-full flex items-center justify-center gap-3 p-4 bg-mv-gold text-black rounded-lg hover:bg-white transition-all font-bold uppercase tracking-widest disabled:opacity-60 disabled:cursor-not-allowed"
                                    >
                                        {isDownloading ? <Loader2 size={20} className="animate-spin" /> : <Download size={20} />}
                                        {isDownloading ? 'Préparation…' : isClient ? `Télécharger les fichiers validés (${approvedCount})` : 'Télécharger tout le projet (ZIP)'}
                                    </button>
                                </div>
                            ) : (
                                <div className="inline-flex items-center gap-3 bg-white/5 border border-white/10 text-gray-300 px-8 py-3 rounded-lg font-bold uppercase tracking-widest text-sm">
                                    <Clock size={16} className="text-mv-gold" />
                                    En attente de validation
                                </div>
                            )}

                            <div className="mt-8 pt-8 border-t border-white/10 flex justify-center gap-8 text-xs text-gray-500 font-mono uppercase tracking-widest">
                                <span className="flex items-center gap-2"><CheckCircle size={12} className="text-green-500" /> Validation requise</span>
                                <span className="flex items-center gap-2">Livraison via portail client</span>
                            </div>
                        </div>

                        {/* Audit trail — studio only */}
                        {!isClient && <AuditTrail />}
                    </div>
                )}
            </div>

            <Modal isOpen={isUploadOpen} onClose={() => setIsUploadOpen(false)} title="Ajouter des images">
                <div className="space-y-4">
                    <p className="text-sm text-gray-400">
                        Glissez vos images ci-dessous pour les ajouter au projet.
                    </p>
                    <ImageUploader onUpload={handleUpload} />
                </div>
            </Modal>

            <EditProjectModal
                isOpen={isEditOpen}
                onClose={() => setIsEditOpen(false)}
                project={project}
            />
        </PageTransition>
    );
};
