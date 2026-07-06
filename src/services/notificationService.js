import api from './api';

export const notificationService = {
    getNotifications: async () => {
        const { data } = await api.get('/notifications');
        return data;
    },
    getUnreadCount: async () => {
        const { data } = await api.get('/notifications/unread-count');
        return data.count;
    },
    markAsRead: async (id) => {
        const { data } = await api.put(`/notifications/${id}/read`);
        return data;
    },
    markAllAsRead: async () => {
        const { data } = await api.put('/notifications/read-all');
        return data;
    },
    deleteNotification: async (id) => {
        const { data } = await api.delete(`/notifications/${id}`);
        return data;
    }
};
