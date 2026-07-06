import api from './api';

export const activityService = {
    getActivities: async (projectId) => {
        // if projectId is not provided, backend doesn't have a route. Let's assume we can fetch all or handle it.
        // Actually, looking at the route router.get('/project/:projectId', ...)
        const response = await api.get(`/activities/project/${projectId}`);
        return response.data;
    },
    createActivity: async (activityData) => {
        const response = await api.post('/activities', activityData);
        return response.data;
    }
};
