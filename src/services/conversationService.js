import api from './api';

export const conversationService = {
    list: async () => {
        const { data } = await api.get('/conversations');
        return data;
    },
    contacts: async () => {
        const { data } = await api.get('/conversations/contacts');
        return data;
    },
    getMessages: async (conversationId) => {
        const { data } = await api.get(`/conversations/${conversationId}/messages`);
        return data;
    },
    sendMessage: async (conversationId, payload) => {
        const { data } = await api.post(`/conversations/${conversationId}/messages`, payload);
        return data;
    },
    markRead: async (conversationId) => {
        const { data } = await api.post(`/conversations/${conversationId}/read`);
        return data;
    },
    createGroup: async ({ title, participantIds, project_id }) => {
        const { data } = await api.post('/conversations', { title, participantIds, project_id });
        return data;
    },
    direct: async (userId) => {
        const { data } = await api.post('/conversations/direct', { userId });
        return data;
    },
    update: async (conversationId, payload) => {
        const { data } = await api.patch(`/conversations/${conversationId}`, payload);
        return data;
    },
};
