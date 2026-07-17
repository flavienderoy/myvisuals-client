import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { LuxuryTitle } from '../common/LuxuryTitle';
import { Plus, LayoutGrid, Clock, CheckCircle } from 'lucide-react';
import { ProjectSlider } from './ProjectSlider';
import { AddProjectModal } from './modals/AddProjectModal';

export const ClientOverview = ({ clientName }) => {
    const { projects, selectProject, clients } = useData();
    const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);

    // Find client object
    const client = clients.find(c => c.name === clientName);

    // Filter projects for this client
    const clientProjects = projects.filter(p => p.client === clientName);

    // Calculate stats (real data only)
    const activeProjects = clientProjects.filter(p => p.status === 'in_progress').length;
    const completedProjects = clientProjects.filter(p => p.status === 'completed').length;
    const pendingAssets = clientProjects.reduce((acc, p) => acc + (p.assets?.filter(a => a.status === 'pending').length || 0), 0);

    return (
        <div className="space-y-8 animate-fade-in p-8 pb-20">
            {/* Header */}
            <div className="flex items-end justify-between border-b border-white/10 pb-6">
                <div>
                    <h2 className="text-gray-500 text-sm font-bold uppercase tracking-widest mb-2">Espace Client</h2>
                    <div className="flex items-center gap-4">
                        {client?.avatar ? (
                            <img src={client.avatar} alt={clientName} className="w-16 h-16 rounded-full object-cover border-2 border-white/10" />
                        ) : (
                            <div className="w-16 h-16 rounded-full bg-mv-gold text-black flex items-center justify-center text-3xl font-bold shadow-lg border-2 border-white/10">
                                {clientName.charAt(0)}
                            </div>
                        )}
                        <LuxuryTitle text={clientName} size="text-5xl" className="text-white" />
                    </div>
                </div>
                <button
                    onClick={() => setIsProjectModalOpen(true)}
                    className="flex items-center gap-2 px-6 py-3 bg-mv-gold text-black rounded-full font-bold uppercase tracking-widest hover:bg-white transition-colors"
                >
                    <Plus size={16} />
                    <span>Nouveau Projet</span>
                </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white/5 border border-white/10 hover:border-white/20 transition-all duration-300 p-8 rounded-xl">
                    <div className="text-gray-500 text-xs uppercase tracking-widest mb-2">Projets Actifs</div>
                    <div className="text-3xl text-white font-bold tracking-tight text-white flex items-center gap-3">
                        {activeProjects}
                        <Clock size={20} className="text-orange-500" />
                    </div>
                </div>
                <div className="bg-white/5 border border-white/10 hover:border-white/20 transition-all duration-300 p-8 rounded-xl">
                    <div className="text-gray-500 text-xs uppercase tracking-widest mb-2">Projets Livrés</div>
                    <div className="text-3xl text-white font-bold tracking-tight text-white flex items-center gap-3">
                        {completedProjects}
                        <CheckCircle size={20} className="text-green-500" />
                    </div>
                </div>
                <div className="bg-white/5 border border-white/10 hover:border-white/20 transition-all duration-300 p-8 rounded-xl">
                    <div className="text-gray-500 text-xs uppercase tracking-widest mb-2">En attente de validation</div>
                    <div className="text-3xl text-mv-gold font-bold tracking-tight tabular-nums">
                        {pendingAssets}
                    </div>
                </div>
            </div>

            {/* Projects Slider */}
            <div>
                <div className="flex items-center gap-2 mb-6 text-white/50">
                    <LayoutGrid size={16} />
                    <span className="text-sm font-medium uppercase tracking-wider">Tous les projets</span>
                </div>

                {clientProjects.length > 0 ? (
                    <div className="-mx-8 px-8">
                        <ProjectSlider
                            projects={clientProjects}
                            onSelectProject={selectProject}
                        />
                    </div>
                ) : (
                    <div className="text-center py-20 border border-dashed border-white/10 rounded-xl">
                        <p className="text-gray-500">Aucun projet pour ce client.</p>
                    </div>
                )}
            </div>

            <AddProjectModal
                isOpen={isProjectModalOpen}
                onClose={() => setIsProjectModalOpen(false)}
                initialClientId={client?.id}
            />
        </div>
    );
};
