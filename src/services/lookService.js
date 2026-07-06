import api from './api';

export const lookService = {
    getLooks: async (projectId) => {
        const { data } = await api.get(`/looks/project/${projectId}`);
        return data;
    },
    createLook: async (projectId, lookData) => {
        const { data } = await api.post(`/looks/project/${projectId}`, lookData);
        return data;
    },
    updateLook: async (id, updateData) => {
        const { data } = await api.put(`/looks/${id}`, updateData);
        return data;
    },
    deleteLook: async (id) => {
        const { data } = await api.delete(`/looks/${id}`);
        return data;
    },
    reorderLooks: async (looks) => {
        const { data } = await api.post('/looks/reorder', { looks });
        return data;
    }
};
