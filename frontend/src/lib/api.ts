import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

// Optional: add response interceptor for debugging
api.interceptors.response.use(
  res => res,
  err => {
    console.error('API error:', err.response?.data || err.message);
    return Promise.reject(err);
  }
);

export const TodoAPI = {
  list: async () => {
    const res = await api.get('/todos');
    return res.data;
  },
  create: async (payload: { title: string; description?: string }) => {
    const res = await api.post('/todos', payload);
    return res.data;
  },
  update: async (id: string, payload: Partial<{ title: string; description: string; completed: boolean }>) => {
    const res = await api.put(`/todos/${id}`, payload);
    return res.data;
  },
  remove: async (id: string) => {
    const res = await api.delete(`/todos/${id}`);
    return res.data;
  },
};


// src/lib/api.ts
export async function apiRequest(endpoint: string, method = 'POST', body?: any) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
