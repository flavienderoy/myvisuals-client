import api from './api';

export const smartFolderService = {
    getSmartFolders: async () => {
        const { data } = await api.get('/smart-folders');
        return data;
    },
    createSmartFolder: async (folderData) => {
        const { data } = await api.post('/smart-folders', folderData);
        return data;
    },
    updateSmartFolder: async (id, updates) => {
        const { data } = await api.put(`/smart-folders/${id}`, updates);
        return data;
    },
    deleteSmartFolder: async (id) => {
        const { data } = await api.delete(`/smart-folders/${id}`);
        return data;
    }
};
