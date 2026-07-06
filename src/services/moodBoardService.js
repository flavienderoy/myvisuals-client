import api from './api';

export const moodBoardService = {
    getMoodBoards: async () => {
        const response = await api.get('/mood-boards');
        return response.data;
    },
    getMoodBoardById: async (id) => {
        const response = await api.get(`/mood-boards/${id}`);
        return response.data;
    },
    createMoodBoard: async (moodBoardData) => {
        const response = await api.post('/mood-boards', moodBoardData);
        return response.data;
    },
    updateMoodBoard: async (id, updates) => {
        const response = await api.put(`/mood-boards/${id}`, updates);
        return response.data;
    },
    deleteMoodBoard: async (id) => {
        const response = await api.delete(`/mood-boards/${id}`);
        return response.data;
    },
    addAssetToMoodBoard: async (id, assetId) => {
        const response = await api.post(`/mood-boards/${id}/assets`, { asset_id: assetId });
        return response.data;
    },
    removeAssetFromMoodBoard: async (id, assetId) => {
        const response = await api.delete(`/mood-boards/${id}/assets/${assetId}`);
        return response.data;
    }
};
