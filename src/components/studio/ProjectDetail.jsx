import React, { useState } from 'react';
import { ArrowLeft, Grid, Layout, Package, CheckCircle, Plus, Palette, Lightbulb, ShieldCheck, Clock, Monitor, Settings } from 'lucide-react';
import { LuxuryTitle } from '../common/LuxuryTitle';
import { ProductionView } from './StudioViews';
import { PageTransition } from '../common/PageTransition';
import { Modal } from '../common/Modal';
import { EditProjectModal } from './modals/EditProjectModal';
import { ImageUploader } from '../common/ImageUploader';
import { Moodboard } from './Moodboard';
import { ColorPalette } from './ColorPalette';
import { AuditTrail } from './AuditTrail';
import { SmartInvoice } from './SmartInvoice';

export const ProjectDetail = ({ project, onBack, onAddAsset, isClient = false }) => {
    // Tabs: 'strategy' (was overview), 'production', 'governance' (was delivery)
    const [activeTab, setActiveTab] = useState('strategy');
    const [isUploadOpen, setIsUploadOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);

    const handleUpload = (fileData) => {
        onAddAsset(fileData);
    };

    return (
        <PageTransition className="h-full flex flex-col">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-[10px] text-gray-500 mb-4 font-mono uppercase tracking-widest">
                <button onClick={onBack} className="hover:text-mv-gold transition-colors">Portefeuille</button>
                <span>/</span>
                <span className="hover:text-white transition-colors cursor-pointer">{project.client}</span>
                <span>/</span>
                <span className="text-white bg-white/5 px-2 py-0.5 rounded">{project.name}</span>
            </div>

            {/* Header */}
            <div className="flex items-center gap-4 mb-4">
                <button
                    onClick={onBack}
                    className="w-8 h-8 flex items-center justify-center rounded-full border border-white/10 text-gray-400 hover:text-white hover:border-mv-gold transition-colors"
                    title="Retour au Dashboard"
                >
                    <ArrowLeft size={16} />
                </button>
                <div className="flex-1">
                    <div className="flex items-center gap-3">
                        <LuxuryTitle text={project.name} size="text-2xl" className="text-white" />
                        <span className="px-2 py-0.5 text-xs border border-white/20 rounded text-gray-400 uppercase tracking-wider">
                            {project.client}
                        </span>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-4">
                    {!isClient && (
                        <>
                            <button
                                onClick={() => setIsEditOpen(true)}
                                className="w-10 h-10 flex items-center justify-center rounded-full border border-white/10 text-gray-400 hover:text-white hover:border-mv-gold hover:bg-white/5 transition-colors"
                                title="Paramètres du projet"
                            >
                                <Settings size={18} />
                            </button>

                            <button
                                onClick={() => window.open(`/showroom/${project.id}`, '_blank')}
                                className="flex items-center gap-2 px-4 py-2 bg-transparent text-white border border-white/20 rounded-full hover:border-mv-gold hover:text-mv-gold transition-all text-sm font-medium"
                                title="Ouvrir le Showroom de livraison"
                            >
                                <Monitor size={16} />
                                <span className="hidden md:inline">Voir Showroom</span>
                            </button>

                            <button
                                onClick={() => setIsUploadOpen(true)}
                                className="flex items-center gap-2 px-4 py-2 bg-mv-gold/10 text-mv-gold border border-mv-gold/20 rounded-full hover:bg-mv-gold hover:text-black transition-all text-sm font-medium"
                            >
                                <Plus size={16} />
                                <span className="hidden md:inline">Ajouter des images</span>
                            </button>
                        </>
                    )}

                    {/* Status (Top Right) */}
                    <div className="flex items-center gap-2 text-sm text-gray-400 border-l border-white/10 pl-4">
                        <div className={`w-2 h-2 rounded-full ${project.status === 'in_progress' ? 'bg-orange-500 animate-pulse' :
                            project.status === 'completed' ? 'bg-green-500' : 'bg-gray-500'
                            }`}></div>
                        <span className="uppercase tracking-widest text-xs">{project.status.replace('_', ' ')}</span>
                    </div>
                </div>
            </div>

            {/* Workspace Tabs */}
            <div className="flex items-center gap-8 border-b border-white/10 mb-8">
                <button
                    onClick={() => setActiveTab('strategy')}
                    className={`pb-3 text-sm font-medium tracking-widest uppercase transition-colors relative ${activeTab === 'strategy' ? 'text-mv-gold' : 'text-gray-500 hover:text-gray-300'}`}
                >
                    <span className="flex items-center gap-2">
                        <Lightbulb size={14} /> Stratégie
                    </span>
                    {activeTab === 'strategy' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-mv-gold"></div>}
                </button>
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
                    onClick={() => setActiveTab('governance')}
                    className={`pb-3 text-sm font-medium tracking-widest uppercase transition-colors relative ${activeTab === 'governance' ? 'text-mv-gold' : 'text-gray-500 hover:text-gray-300'}`}
                >
                    <span className="flex items-center gap-2">
                        <ShieldCheck size={14} /> Gouvernance
                    </span>
                    {activeTab === 'governance' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-mv-gold"></div>}
                </button>
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-y-auto pr-2 scrollbar-hide">
                {activeTab === 'strategy' && (
                    <div className="space-y-8 animate-fade-in max-w-6xl mx-auto">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {/* Brief Section */}
                            <div className="md:col-span-2 space-y-8">
                                <div>
                                    <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4">Brief Projet</h3>
                                    <p className="text-gray-400 font-bold tracking-tight text-white leading-relaxed mb-6 bg-white/5 p-6 rounded-lg border border-white/10 hover:border-white/30 transition-all duration-300">
                                        {project.description || "Aucune description fournie."}
                                    </p>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-4 bg-white/5 rounded border border-white/10 hover:border-white/30 transition-all duration-300">
                                            <div className="text-xs text-gray-500 uppercase tracking-widest mb-1">Date d'Échéance</div>
                                            <div className="text-white">{project.date}</div>
                                        </div>
                                        <div className="p-4 bg-white/5 rounded border border-white/10 hover:border-white/30 transition-all duration-300">
                                            <div className="text-xs text-gray-500 uppercase tracking-widest mb-1">Total Fichiers</div>
                                            <div className="text-white">{project.assets?.length || 0}</div>
                                        </div>
                                    </div>
                                </div>

                                <ColorPalette />
                            </div>

                            {/* Moodboard Section */}
                            <div>
                                <Moodboard />
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'production' && (
                    <ProductionView
                        project={project}
                        onOpenUpload={() => setIsUploadOpen(true)}
                    />
                )}

                {activeTab === 'governance' && (
                    <div className="animate-fade-in max-w-6xl mx-auto">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                            {/* Audit Trail */}
                            <div className="lg:col-span-2">
                                <AuditTrail />
                            </div>

                            {/* Invoice */}
                            <div>
                                <SmartInvoice />
                            </div>
                        </div>

                        {/* Delivery Console (Existing) */}
                        <div className="bg-white/5 border border-white/10 rounded-xl p-8 text-center relative overflow-hidden group">
                            <Package size={48} className="mx-auto text-white/50 mb-6" />

                            <h3 className="text-2xl text-white font-bold tracking-tight text-white mb-2">Console de Livraison</h3>
                            <p className="text-gray-400 max-w-md mx-auto mb-8 leading-relaxed">
                                {project.status === 'completed'
                                    ? "Tous les fichiers sont validés et déverrouillés. Vous pouvez télécharger les assets finaux ci-dessous."
                                    : "Les fichiers haute définition seront déverrouillés une fois la validation finale approuvée par le client."
                                }
                            </p>

                            {project.status === 'completed' ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-lg mx-auto animate-fade-in-up">
                                    <button className="flex items-center justify-center gap-3 p-4 bg-white/5 border border-white/10 rounded-lg hover:border-mv-gold hover:bg-white/10 transition-all group/btn">
                                        <div className="p-2 bg-black rounded-full text-white group-hover/btn:text-mv-gold transition-colors">
                                            <Layout size={20} />
                                        </div>
                                        <div className="text-left">
                                            <div className="text-sm text-white font-medium">Pack Web (JPG)</div>
                                            <div className="text-xs text-gray-500">Optimisé • 45 MB</div>
                                        </div>
                                    </button>
                                    <button className="flex items-center justify-center gap-3 p-4 bg-white/5 border border-white/10 rounded-lg hover:border-mv-gold hover:bg-white/10 transition-all group/btn">
                                        <div className="p-2 bg-black rounded-full text-white group-hover/btn:text-mv-gold transition-colors">
                                            <Package size={20} />
                                        </div>
                                        <div className="text-left">
                                            <div className="text-sm text-white font-medium">Pack Print (TIFF)</div>
                                            <div className="text-xs text-gray-500">Master • 1.2 GB</div>
                                        </div>
                                    </button>
                                </div>
                            ) : (
                                <div className="inline-flex items-center gap-3 bg-white/5 border border-white/10 text-gray-300 px-8 py-3 rounded-lg font-bold uppercase tracking-widest">
                                    <Clock size={16} className="text-mv-gold" />
                                    En attente de validation client
                                </div>
                            )}

                            <div className="mt-8 pt-8 border-t border-white/10 hover:border-white/30 transition-all duration-300 flex justify-center gap-8 text-xs text-gray-500 font-mono uppercase tracking-widest">
                                <span className="flex items-center gap-2"><CheckCircle size={12} className="text-green-500" /> Validation Requise</span>
                                <span className="flex items-center gap-2">Livraison via portail client</span>
                            </div>
                        </div>
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
