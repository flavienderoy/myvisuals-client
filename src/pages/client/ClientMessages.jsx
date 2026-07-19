import React from 'react';
import { LuxuryTitle } from '../../components/common/LuxuryTitle';
import { ChatView } from '../../components/common/ChatView';

const ClientMessages = () => (
    <div className="max-w-7xl mx-auto px-10 py-12 space-y-6 animate-fade-in">
        <div>
            <LuxuryTitle text="Messagerie" size="text-4xl" className="text-white mb-2" />
            <p className="text-gray-400 text-lg">Vos échanges avec le studio — canaux et messages directs.</p>
        </div>
        <ChatView />
    </div>
);

export default ClientMessages;
