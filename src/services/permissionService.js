import api from './api';

export const permissionService = {
    getPermissions: async () => {
        const { data } = await api.get('/permissions');
        return data;
    },
    setPermission: async (permissionData) => {
        const { data } = await api.post('/permissions', permissionData);
        return data;
    },
    revokePermission: async (payload) => {
        // Axios delete with body requires 'data' field
        const { data } = await api.delete('/permissions', { data: payload });
        return data;
    }
};
