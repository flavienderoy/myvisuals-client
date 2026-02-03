import React, { useState } from 'react';
import { Dashboard } from '../components/studio/Dashboard';
import { ArrowLeft, Clock, Grid, Layout, Package } from 'lucide-react';
import { LuxuryTitle } from '../components/common/LuxuryTitle';
import database from '../data/database.json';
import { ProductionView } from '../components/studio/StudioViews';

const ProjectDetail = ({ project, onBack }) => {
    const [activeTab, setActiveTab] = useState('production'); // 'overview' | 'production' | 'delivery'

    return (
        <div className="h-full flex flex-col animate-fade-in">
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

                {/* Status (Top Right) */}
                <div className="flex items-center gap-2 text-sm text-gray-400">
                    <div className={`w-2 h-2 rounded-full ${project.status === 'in_progress' ? 'bg-orange-500 animate-pulse' :
                            project.status === 'completed' ? 'bg-green-500' : 'bg-gray-500'
                        }`}></div>
                    <span className="uppercase tracking-widest text-xs">{project.status.replace('_', ' ')}</span>
                </div>
            </div>

            {/* Workspace Tabs */}
            <div className="flex items-center gap-8 border-b border-white/10 mb-8">
                <button
                    onClick={() => setActiveTab('overview')}
                    className={`pb-3 text-sm font-medium tracking-widest uppercase transition-colors relative ${activeTab === 'overview' ? 'text-mv-gold' : 'text-gray-500 hover:text-gray-300'}`}
                >
                    Vue d'Ensemble
                    {activeTab === 'overview' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-mv-gold"></div>}
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
                    onClick={() => setActiveTab('delivery')}
                    className={`pb-3 text-sm font-medium tracking-widest uppercase transition-colors relative ${activeTab === 'delivery' ? 'text-mv-gold' : 'text-gray-500 hover:text-gray-300'}`}
                >
                    <span className="flex items-center gap-2">
                        <Package size={14} /> Livraison
                    </span>
                    {activeTab === 'delivery' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-mv-gold"></div>}
                </button>
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-y-auto pr-2 scrollbar-hide">
                {activeTab === 'overview' && (
                    <div className="max-w-2xl">
                        <h3 className="text-lg text-white mb-2 font-light">Brief Projet</h3>
                        <p className="text-gray-400 font-light leading-relaxed mb-8">
                            {project.description || "Aucune description fournie."}
                        </p>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-white/5 rounded border border-white/5">
                                <div className="text-xs text-gray-500 uppercase tracking-widest mb-1">Date d'Échéance</div>
                                <div className="text-white">{project.date}</div>
                            </div>
                            <div className="p-4 bg-white/5 rounded border border-white/5">
                                <div className="text-xs text-gray-500 uppercase tracking-widest mb-1">Total Fichiers</div>
                                <div className="text-white">{project.assets?.length || 0}</div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'production' && (
                    <ProductionView project={project} />
                )}

                {activeTab === 'delivery' && (
                    <div className="flex flex-col items-center justify-center h-64 text-gray-500 border border-dashed border-white/10 rounded-lg">
                        <Package size={32} className="mb-4 opacity-50" />
                        <p>La Console de Livraison nécessite la validation de tous les fichiers.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

const Studio = ({ onViewChange }) => {
    const [selectedProjectId, setSelectedProjectId] = useState(null);
    const selectedProject = database.projects.find(p => p.id === selectedProjectId);

    return (
        <div className="max-w-7xl mx-auto px-6 py-8">
            {selectedProjectId ? (
                <ProjectDetail
                    project={selectedProject}
                    onBack={() => setSelectedProjectId(null)}
                />
            ) : (
                <Dashboard onSelectProject={setSelectedProjectId} />
            )}
        </div>
    );
};

export default Studio;
