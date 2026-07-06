import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { ProjectDetail } from '../../components/studio/ProjectDetail';

const ClientProjectDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { projects } = useData();

    const project = projects.find(p => p.id === id);

    if (!project) {
        return (
            <div className="p-8 space-y-8 max-w-7xl">
                <div className="text-center py-20 bg-white/5 rounded-xl border border-white/10">
                    <p className="text-gray-500 text-sm">Projet introuvable.</p>
                    <button
                        onClick={() => navigate('/client/projects')}
                        className="mt-4 text-mv-gold hover:text-white transition-colors"
                    >
                        Retour aux projets
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-10 py-12 min-h-[calc(100vh-4rem)]">
            <ProjectDetail
                project={project}
                isClient={true}
                onBack={() => navigate(-1)}
            />
        </div>
    );
};

export default ClientProjectDetail;
