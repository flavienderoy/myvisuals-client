import React from 'react';
import { LuxuryTitle } from '../components/common/LuxuryTitle';
import { ProjectMessenger } from '../components/common/ProjectMessenger';

const Messages = () => (
    <div className="max-w-7xl mx-auto px-8 py-10 space-y-8 animate-fade-in">
        <div>
            <LuxuryTitle text="Messagerie" size="text-4xl" className="text-white mb-3" />
            <p className="text-gray-400 text-lg">Échangez avec vos clients, projet par projet.</p>
        </div>
        <ProjectMessenger />
    </div>
);

export default Messages;
