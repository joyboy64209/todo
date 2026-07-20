export interface Todo {
  id: number;
  title: string;
  description: string | null;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

const API_URL = '/api';

export const todoService = {
  async getAll(): Promise<Todo[]> {
    const response = await fetch(`${API_URL}/todo`);
    if (!response.ok) throw new Error('Failed to fetch tasks');
    return response.json();
  },

  async create(title: string, description: string): Promise<Todo> {
    const response = await fetch(`${API_URL}/todo`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description }),
    });
    if (!response.ok) throw new Error('Failed to create task');
    return response.json();
  },

  async update(id: number, data: Partial<{ title: string; description: string; completed: boolean }>): Promise<Todo> {
    const response = await fetch(`${API_URL}/todo/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update task');
    return response.json();
  },

  async delete(id: number): Promise<void> {
    const response = await fetch(`${API_URL}/todo/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete task');
  },
};