import api from './api';

export const projectService = {
  getProjects: async (filters = {}) => {
    const { data } = await api.get('/projects', { params: filters });
    return data;
  },
  getProjectById: async (id) => {
    const { data } = await api.get(`/projects/${id}`);
    return data;
  },
  createProject: async (project) => {
    const { data } = await api.post('/projects', project);
    return data;
  },
  updateProject: async (id, updates) => {
    const { data } = await api.put(`/projects/${id}`, updates);
    return data;
  },
  deleteProject: async (id) => {
    const { data } = await api.delete(`/projects/${id}`);
    return data;
  },
  getProjectMembers: async (id) => {
    const { data } = await api.get(`/projects/${id}/members`);
    return data;
  },
  getStats: async () => {
    const { data } = await api.get('/projects/stats');
    return data;
  }
};
