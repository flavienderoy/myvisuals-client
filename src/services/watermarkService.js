import api from './api';

export const watermarkService = {
    getSettings: async () => {
        const { data } = await api.get('/watermark');
        return data;
    },
    saveSettings: async (settings) => {
        const { data } = await api.put('/watermark', settings);
        return data;
    }
};
