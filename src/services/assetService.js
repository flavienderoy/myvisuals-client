import api from './api';

export const assetService = {
  getAssets: async (projectId) => {
    const { data } = await api.get(`/assets/project/${projectId}`);
    return data;
  },
  getAssetById: async (id) => {
    const { data } = await api.get(`/assets/${id}`);
    return data;
  },
  createAsset: async (projectId, file, metadata) => {
    const formData = new FormData();
    formData.append('file', file);
    if (metadata.name) formData.append('name', metadata.name);
    if (metadata.look_id) formData.append('look_id', metadata.look_id);
    
    // Removing strict Content-Type to let Axios set boundary automatically
    const { data } = await api.post(`/assets/project/${projectId}`, formData);
    return data;
  },
  updateAsset: async (id, updates) => {
    const { data } = await api.put(`/assets/${id}`, updates);
    return data;
  },
  deleteAsset: async (id) => {
    const { data } = await api.delete(`/assets/${id}`);
    return data;
  },
  addAnnotation: async (id, annotation) => {
    const { data } = await api.post(`/assets/${id}/annotations`, annotation);
    return data;
  },
  uploadVersion: async (id, file, comment) => {
    const formData = new FormData();
    formData.append('file', file);
    if (comment) formData.append('comment', comment);

    // Removing strict Content-Type to let Axios set boundary automatically
    const { data } = await api.post(`/assets/${id}/versions`, formData);
    return data;
  }
};
