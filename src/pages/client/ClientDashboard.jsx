import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { LuxuryTitle } from '../../components/common/LuxuryTitle';
import { ProjectCard } from '../../components/studio/ProjectSlider';
import { ActivityFeed } from '../../components/studio/ActivityFeed';
import { FolderOpen, Clock, CheckCircle, Download, ArrowRight, AlertCircle, Eye } from 'lucide-react';

const ClientDashboard = () => {
    const navigate = useNavigate();
    const { projects, currentUser, selectProject } = useData();

    // Fallback if no specific client logic is implemented, default to 'Maison Éclat' for demo
    const clientName = currentUser.role === 'client' ? currentUser.name : 'Maison Éclat';

    // Filter projects for this client
    const clientProjects = projects.filter(p => p.client === clientName);

    const stats = {
        activeProjects: clientProjects.filter(p => p.status === 'in_progress').length,
        pendingApprovals: clientProjects.reduce((acc, p) => acc + (p.assets?.filter(a => a.status === 'pending').length || 0), 0),
        filesReady: clientProjects.reduce((acc, p) => acc + (p.assets?.filter(a => a.status === 'approved').length || 0), 0)
    };

    return (
        <div className="max-w-7xl mx-auto px-10 py-12 space-y-16 animate-fade-in overflow-hidden">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                <div>
                    <LuxuryTitle text="Espace Client" size="text-4xl" className="text-white mb-3" />
                    <p className="text-gray-400 text-lg">Bienvenue, <span className="text-white">{clientName}</span>.</p>
                </div>
                <div className="text-right">
                    <p className="text-xs text-gray-500 uppercase tracking-widest font-medium mb-1">Dernière Connexion</p>
                    <p className="text-sm text-white">Aujourd'hui, 09:45</p>
                </div>
            </div>

            {/* KPI Cards matching Studio DA */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* Active Projects */}
                <div className="bg-white/5 border border-white/10 hover:border-white/20 transition-all duration-300 rounded-xl p-8 group">
                    <div className="flex items-start justify-between mb-4">
                        <div className="p-3 bg-white/5 rounded-lg text-gray-400 group-hover:text-white transition-colors border border-white/5">
                            <FolderOpen size={20} />
                        </div>
                    </div>
                    <div>
                        <p className="text-gray-500 text-xs uppercase tracking-widest font-medium mb-1">Projets Actifs</p>
                        <h3 className="text-3xl font-normal tracking-tight text-white">{stats.activeProjects}</h3>
                    </div>
                </div>

                {/* Pending Approvals */}
                <div className="bg-white/5 border border-white/10 hover:border-white/20 transition-all duration-300 rounded-xl p-8 group">
                    <div className="flex items-start justify-between mb-4">
                        <div className="p-3 bg-white/5 rounded-lg text-gray-400 group-hover:text-white transition-colors border border-white/5">
                            <Clock size={20} />
                        </div>
                    </div>
                    <div>
                        <p className="text-gray-500 text-xs uppercase tracking-widest font-medium mb-1">Approbations</p>
                        <h3 className="text-3xl font-normal tracking-tight text-white">{stats.pendingApprovals}</h3>
                    </div>
                </div>

                {/* Files Ready */}
                <div className="bg-white/5 border border-white/10 hover:border-white/20 transition-all duration-300 rounded-xl p-8 group">
                    <div className="flex items-start justify-between mb-4">
                        <div className="p-3 bg-white/5 rounded-lg text-gray-400 group-hover:text-white transition-colors border border-white/5">
                            <Download size={20} />
                        </div>
                    </div>
                    <div>
                        <p className="text-gray-500 text-xs uppercase tracking-widest font-medium mb-1">Fichiers Prêts</p>
                        <h3 className="text-3xl font-normal tracking-tight text-white">{stats.filesReady}</h3>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 border-b border-white/5 pb-10">
                <button
                    onClick={() => navigate('/client/projects')}
                    className="bg-white hover:bg-gray-200 text-black font-medium py-4 px-6 rounded-lg transition-all flex items-center justify-center gap-3 group"
                >
                    <FolderOpen size={18} />
                    <span>Voir mes Projets</span>
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </button>
                <button className="bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium py-4 px-6 rounded-lg transition-all flex items-center justify-center gap-3">
                    <AlertCircle size={18} className="text-white/60" />
                    <span>Voir les Approbations</span>
                </button>
                <button className="bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium py-4 px-6 rounded-lg transition-all flex items-center justify-center gap-3">
                    <CheckCircle size={18} className="text-white/60" />
                    <span>Messagerie Complète</span>
                </button>
            </div>

            {/* Recent Activity */}
            <div>
                <div className="flex items-center justify-between mb-8 border-b border-white/10 pb-3">
                    <h2 className="text-sm font-bold text-gray-500 uppercase tracking-widest">Activité du Portfolio</h2>
                </div>
                <ActivityFeed limit={5} showFilters={false} />
            </div>

            {/* Projects List */}
            <div>
                <div className="flex items-center justify-between mb-8 border-b border-white/10 pb-3">
                    <h2 className="text-sm font-bold text-gray-500 uppercase tracking-widest">Vos Projets</h2>
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
                        <p className="text-gray-500 text-sm">Aucun projet en cours.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ClientDashboard;
