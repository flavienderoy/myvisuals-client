import api from './api';

export const clientService = {
  getClients: async () => {
    const { data } = await api.get('/clients');
    return data;
  },
  getClientById: async (id) => {
    const { data } = await api.get(`/clients/${id}`);
    return data;
  },
  createClient: async (client) => {
    const { data } = await api.post('/clients', client);
    return data;
  },
  updateClient: async (id, updates) => {
    const { data } = await api.put(`/clients/${id}`, updates);
    return data;
  },
  deleteClient: async (id) => {
    const { data } = await api.delete(`/clients/${id}`);
    return data;
  }
};
