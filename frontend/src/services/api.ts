import axios from 'axios';
import { Fuckup, AddFuckupRequest } from '../types/Fuckup';

const API_BASE_URL = 'http://fuckupboard-backend:8080';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const fuckupApi = {
  // Get all fuckups
  getFuckups: async (): Promise<Fuckup[]> => {
    const response = await api.get('/list');
    return response.data;
  },

  // Add a new fuckup
  addFuckup: async (fuckup: AddFuckupRequest): Promise<{ msg: string }> => {
    const response = await api.post('/add', fuckup);
    return response.data;
  },

  // Like a fuckup
  likeFuckup: async (id: string): Promise<{ msg: string; id: string }> => {
    const response = await api.put(`/like?id=${id}`);
    return response.data;
  },

  // Unlike a fuckup
  unlikeFuckup: async (id: string): Promise<{ msg: string; id: string }> => {
    const response = await api.delete(`/unlike?id=${id}`);
    return response.data;
  },
}; 