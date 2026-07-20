import React from 'react';
import { ChatView } from '../components/common/ChatView';

const Messages = () => (
    <div className="h-screen w-full overflow-hidden">
        <ChatView fullPage />
    </div>
);

export default Messages;
