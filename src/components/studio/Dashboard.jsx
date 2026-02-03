import React, { useState } from 'react';
import { MonitoringWidget } from './MonitoringWidget';
import { LuxuryTitle } from '../common/LuxuryTitle';
import { Search } from 'lucide-react';
import database from '../../data/database.json';
import { ProjectCard, ProjectSlider } from './ProjectSlider';

export const Dashboard = ({ onSelectProject }) => {
    const [searchQuery, setSearchQuery] = useState("");

    // Filter projects based on search query
    const filteredProjects = database.projects.filter(project => {
        const query = searchQuery.toLowerCase();
        return (
            project.name.toLowerCase().includes(query) ||
            project.client.toLowerCase().includes(query)
        );
    });

    // Group filtered projects by client
    const projectsByClient = filteredProjects.reduce((acc, project) => {
        if (!acc[project.client]) {
            acc[project.client] = [];
        }
        acc[project.client].push(project);
        return acc;
    }, {});

    return (
        <div className="space-y-8 animate-fade-in overflow-hidden">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <LuxuryTitle text="Tableau de Bord" size="text-4xl" className="mb-2 text-white" />
                    <p className="text-gray-400">Re-bonjour, <span className="text-white">{database.currentUser.name}</span>.</p>
                </div>

                {/* Search Bar */}
                <div className="relative w-full md:w-72">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                    <input
                        type="text"
                        placeholder="Rechercher un projet, un client..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-mv-dark border border-white/10 rounded-full py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-mv-gold/50 transition-colors placeholder:text-gray-600"
                    />
                </div>
            </div>

            <MonitoringWidget />

            <div>
                <div className="flex items-center justify-between mb-6 border-b border-white/10 pb-2">
                    <h2 className="text-sm font-bold text-gray-500 uppercase tracking-widest">Portefeuille Clients</h2>
                    {searchQuery && (
                        <span className="text-xs text-mv-gold">
                            {filteredProjects.length} résultats trouvés
                        </span>
                    )}
                </div>

                {filteredProjects.length > 0 ? (
                    <div className="space-y-12">
                        {Object.entries(projectsByClient).map(([clientName, projects]) => {
                            const isSlider = projects.length > 3;

                            return (
                                <div key={clientName} className="animate-fade-in-up">
                                    <div className="mb-4 flex items-center gap-4">
                                        <div className="w-2 h-2 rounded-full bg-mv-gold"></div>
                                        <LuxuryTitle text={clientName} size="text-2xl" className="text-white" />
                                        <span className="text-xs text-gray-500 bg-white/5 px-2 py-1 rounded-full">{projects.length} Projets</span>
                                    </div>

                                    {isSlider ? (
                                        <ProjectSlider
                                            projects={projects}
                                            onSelectProject={onSelectProject}
                                        />
                                    ) : (
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                            {projects.map(project => (
                                                <ProjectCard
                                                    key={project.id}
                                                    project={project}
                                                    onClick={() => onSelectProject && onSelectProject(project.id)}
                                                />
                                            ))}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="py-20 text-center text-gray-500">
                        <p className="text-lg">Aucun projet trouvé pour "{searchQuery}"</p>
                        <button
                            onClick={() => setSearchQuery("")}
                            className="mt-4 text-sm text-mv-gold hover:underline"
                        >
                            Effacer la recherche
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};
