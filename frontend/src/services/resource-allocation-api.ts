import axios from 'axios';
import { ResourceAllocationRequest, QueryResponse } from '../types/resource-allocation';

const API_BASE_URL = (import.meta.env?.VITE_API_BASE_URL as string) || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const ragApi = {
  // Query with resource allocation parameters
  queryResourceAllocation: async (request: ResourceAllocationRequest): Promise<QueryResponse> => {
    const response = await api.post('/rag/query-resource-allocation', request);
    return response.data;
  },

  // Regular query for follow-up questions
  query: async (question: string): Promise<QueryResponse> => {
    const response = await api.post('/rag/query', { question });
    return response.data;
  },

  // Get data statistics
  getDataStats: async () => {
    const response = await api.get('/rag/data-stats');
    return response.data;
  },

  // Health check
  healthCheck: async () => {
    const response = await api.get('/rag/health');
    return response.data;
  },
};

export default api;