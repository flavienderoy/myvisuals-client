import api from './api';

export const annotationService = {
    getAnnotations: async (assetId, status) => {
        const params = {};
        if (assetId) params.assetId = assetId;
        if (status) params.status = status;
        const { data } = await api.get('/annotations', { params });
        return data;
    },
    createAnnotation: async (annotationData) => {
        const { data } = await api.post('/annotations', annotationData);
        return data;
    },
    updateAnnotation: async (id, updateData) => {
        const { data } = await api.put(`/annotations/${id}`, updateData);
        return data;
    },
    deleteAnnotation: async (id) => {
        const { data } = await api.delete(`/annotations/${id}`);
        return data;
    },
    resolveAnnotation: async (id) => {
        const { data } = await api.patch(`/annotations/${id}/resolve`);
        return data;
    },
    reopenAnnotation: async (id) => {
        const { data } = await api.patch(`/annotations/${id}/reopen`);
        return data;
    },
    getTickets: async (status) => {
        const params = {};
        if (status) params.status = status;
        const { data } = await api.get('/annotations/tickets', { params });
        return data;
    },
};
