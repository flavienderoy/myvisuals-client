import api from './api';

export const annotationService = {
    getAnnotations: async (assetId) => {
        const { data } = await api.get('/annotations', { params: { assetId } });
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
    }
};
