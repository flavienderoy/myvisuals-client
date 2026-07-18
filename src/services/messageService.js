import api from './api';

export const messageService = {
    getMessages: async (projectId) => {
        const { data } = await api.get(`/messages/project/${projectId}`);
        return data;
    },
    sendMessage: async (projectId, payload) => {
        const { data } = await api.post(`/messages/project/${projectId}`, payload);
        return data;
    },
    markAsRead: async (projectId) => {
        const { data } = await api.post(`/messages/project/${projectId}/read`);
        return data;
    },
    toggleReaction: async (messageId, emoji) => {
        const { data } = await api.post(`/messages/${messageId}/react`, { emoji });
        return data;
    },
    deleteMessage: async (id) => {
        const { data } = await api.delete(`/messages/${id}`);
        return data;
    }
};
