import React from 'react';
import { LuxuryTitle } from '../components/common/LuxuryTitle';
import { ChatView } from '../components/common/ChatView';

const Messages = () => (
    <div className="max-w-7xl mx-auto px-8 py-10 space-y-6 animate-fade-in">
        <div>
            <LuxuryTitle text="Messagerie" size="text-4xl" className="text-white mb-2" />
            <p className="text-gray-400 text-lg">Canaux de projet, groupes et messages directs.</p>
        </div>
        <ChatView />
    </div>
);

export default Messages;
