import type { Todo } from '../types/todo';
import { authService } from './auth';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

export interface TodoUpdate {
  title?: string;
  description?: string;
  completed?: boolean;
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const token = authService.getToken();
  const headers: Record<string, string> = {
    ...(options?.headers as Record<string, string> | undefined),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const response = await fetch(`${API_URL}${path}`, { ...options, headers });

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status} ${response.statusText}`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
}

export const todoService = {
  async getAll(): Promise<Todo[]> {
    return request<Todo[]>('/todo');
  },

  async create(title: string, description: string): Promise<Todo> {
    return request<Todo>('/todo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description }),
    });
  },

  async update(id: number, data: TodoUpdate): Promise<Todo> {
    return request<Todo>(`/todo/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  },

  async delete(id: number): Promise<void> {
    await request<void>(`/todo/${id}`, {
      method: 'DELETE',
    });
  },
};