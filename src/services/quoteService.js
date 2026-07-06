import api from './api';

export const quoteService = {
    getQuotes: async () => {
        const response = await api.get('/quotes');
        return response.data;
    },
    getQuoteById: async (id) => {
        const response = await api.get(`/quotes/${id}`);
        return response.data;
    },
    createQuote: async (quoteData) => {
        const response = await api.post('/quotes', quoteData);
        return response.data;
    },
    updateQuote: async (id, updates) => {
        const response = await api.put(`/quotes/${id}`, updates);
        return response.data;
    },
    deleteQuote: async (id) => {
        const response = await api.delete(`/quotes/${id}`);
        return response.data;
    }
};
