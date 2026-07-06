import api from './api';

export const messageService = {
    getMessages: async (projectId) => {
        const { data } = await api.get(`/messages/project/${projectId}`);
        return data;
    },
    sendMessage: async (projectId, content) => {
        const { data } = await api.post(`/messages/project/${projectId}`, { content });
        return data;
    },
    deleteMessage: async (id) => {
        const { data } = await api.delete(`/messages/${id}`);
        return data;
    }
};
