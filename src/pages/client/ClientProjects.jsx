import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { LuxuryTitle } from '../../components/common/LuxuryTitle';
import { ProjectCard } from '../../components/studio/ProjectSlider';

const ClientProjects = () => {
    const navigate = useNavigate();
    const { projects, selectProject } = useData();
    // The API already returns only the projects linked to this client account.
    const clientProjects = projects;

    return (
        <div className="max-w-7xl mx-auto px-10 py-12 space-y-12 animate-fade-in">
            <div className="flex flex-col mb-8">
                <LuxuryTitle text="Projets" size="text-4xl" className="text-white mb-3" />
                <p className="text-gray-400 text-lg">Retrouvez l'ensemble de vos projets passés et en cours.</p>
            </div>

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
            {clientProjects.length === 0 && (
                <div className="text-center py-20 bg-white/5 rounded-xl border border-white/10">
                    <p className="text-gray-500 text-sm">Aucun projet trouvé.</p>
                </div>
            )}
        </div>
    );
};

export default ClientProjects;
