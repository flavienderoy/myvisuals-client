import api from './api';

export const teamService = {
    getTeamMembers: async () => {
        const { data } = await api.get('/teams');
        return data;
    },
    inviteMember: async (payload) => {
        const { data } = await api.post('/teams/invite', payload);
        return data;
    },
    updateMember: async (id, payload) => {
        const { data } = await api.put(`/teams/${id}`, payload);
        return data;
    },
    removeMember: async (id) => {
        await api.delete(`/teams/${id}`);
    },
    getMyStudio: async () => {
        const { data } = await api.get('/teams/my-studio');
        return data;
    }
};
