import api from './api';

export const timeEntryService = {
    getTimeEntries: async () => {
        const response = await api.get('/time-entries');
        return response.data;
    },
    createTimeEntry: async (entryData) => {
        const response = await api.post('/time-entries', entryData);
        return response.data;
    },
    updateTimeEntry: async (id, updates) => {
        const response = await api.put(`/time-entries/${id}`, updates);
        return response.data;
    },
    deleteTimeEntry: async (id) => {
        const response = await api.delete(`/time-entries/${id}`);
        return response.data;
    }
};
