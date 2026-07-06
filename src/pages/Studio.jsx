import React, { useEffect } from 'react';
import { Dashboard } from '../components/studio/Dashboard';
import { ProjectDetail } from '../components/studio/ProjectDetail';
import { ClientOverview } from '../components/studio/ClientOverview';
import { useData } from '../context/DataContext';
import { PageTransition } from '../components/common/PageTransition';

const Studio = () => {
    const { projects, addAsset, currentSelection, selectGlobal } = useData();

    // Default to Global view if no selection
    const viewType = currentSelection?.type || 'global';

    // Helper: Find selected project object
    const selectedProject = viewType === 'project'
        ? projects.find(p => p.id === currentSelection.id)
        : null;

    return (
        <div className="max-w-7xl mx-auto px-0 py-0 min-h-screen">
            <PageTransition key={currentSelection?.id || 'global'}>
                {viewType === 'global' && (
                    <Dashboard
                        onSelectProject={(id) => {
                            // This prop might be redundant if we fully switch to Context
                            // But keeping it for backward compat with Dashboard internal links
                        }}
                    />
                )}

                {viewType === 'client' && (
                    <ClientOverview clientName={currentSelection.id} />
                )}

                {viewType === 'project' && selectedProject && (
                    <div className="px-6 py-8">
                        <ProjectDetail
                            project={selectedProject}
                            onBack={selectGlobal}
                            onAddAsset={(assetData) => addAsset(selectedProject.id, assetData)}
                        />
                    </div>
                )}
            </PageTransition>
        </div>
    );
};

export default Studio;
