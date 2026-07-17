import api from './api';

export const profileService = {
    getProfile: async () => {
        const { data } = await api.get('/profile');
        return data;
    },
    updateProfile: async (updates) => {
        const { data } = await api.put('/profile', updates);
        return data;
    },
    uploadAvatar: async (file) => {
        const formData = new FormData();
        formData.append('avatar', file);
        const { data } = await api.post('/profile/avatar', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return data;
    },
    deleteAccount: async () => {
        const { data } = await api.delete('/profile/account');
        return data;
    }
};
