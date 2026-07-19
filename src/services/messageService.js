import api from './api';

// Reactions are message-id based and shared by the chat.
export const messageService = {
    toggleReaction: async (messageId, emoji) => {
        const { data } = await api.post(`/messages/${messageId}/react`, { emoji });
        return data;
    },
};
