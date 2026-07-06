import api from './api';

export const auditLogService = {
    getAuditLogs: async (filters = {}) => {
        let qs = '';
        if (filters.resourceType) qs += `?resourceType=${filters.resourceType}`;
        if (filters.resourceId) qs += qs ? `&resourceId=${filters.resourceId}` : `?resourceId=${filters.resourceId}`;
        
        const { data } = await api.get(`/audit-logs${qs}`);
        return data;
    },
    logAction: async (actionData) => {
        const { data } = await api.post('/audit-logs', actionData);
        return data;
    }
};
