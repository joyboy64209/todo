import { useCallback, useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { todoService } from '../services/api';
import type { Todo } from '../types/todo';

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [expandedDescId, setExpandedDescId] = useState<number | null>(null);
  const [descInputValue, setDescInputValue] = useState('');

  const fetchTodos = useCallback(async () => {
    try {
      const data = await todoService.getAll();
      setTodos(data);
    } catch (error) {
      console.error('Error fetching todos:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  const handleCreateTodo = async (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    try {
      const newTodo = await todoService.create(title, '');
      setTodos((prev) => [newTodo, ...prev]);
      setTitle('');
    } catch (error) {
      console.error('Error creating todo:', error);
    }
  };

  const handleToggleComplete = async (id: number, currentStatus: boolean) => {
    try {
      const updatedTodo = await todoService.update(id, {
        completed: !currentStatus,
      });
      setTodos((prev) => prev.map((todo) => (todo.id === id ? updatedTodo : todo)));
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };

  const handleDeleteTodo = async (id: number) => {
    try {
      await todoService.delete(id);
      setTodos((prev) => prev.filter((todo) => todo.id !== id));
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  const startEditing = useCallback((todo: Todo) => {
    setEditingId(todo.id);
    setEditTitle(todo.title);
    setEditDescription(todo.description ?? '');
  }, []);

  const cancelEditing = useCallback(() => {
    setEditingId(null);
    setEditTitle('');
    setEditDescription('');
  }, []);

  const handleSaveEdit = async (id: number) => {
    if (!editTitle.trim()) return;
    try {
      const updatedTodo = await todoService.update(id, {
        title: editTitle,
        description: editDescription || undefined,
      });
      setTodos((prev) => prev.map((todo) => (todo.id === id ? updatedTodo : todo)));
      cancelEditing();
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };

  const toggleDescription = useCallback((id: number, currentDesc: string | null) => {
    if (expandedDescId === id) {
      setExpandedDescId(null);
      setDescInputValue('');
    } else {
      setExpandedDescId(id);
      setDescInputValue(currentDesc ?? '');
    }
  }, [expandedDescId]);

  const handleSaveDescription = async (id: number) => {
    try {
      const updatedTodo = await todoService.update(id, {
        description: descInputValue || undefined,
      });
      setTodos((prev) => prev.map((todo) => (todo.id === id ? updatedTodo : todo)));
      setExpandedDescId(null);
      setDescInputValue('');
    } catch (error) {
      console.error('Error saving description:', error);
    }
  };

  const beginDescriptionEdit = useCallback((todo: Todo) => {
    setExpandedDescId(todo.id);
    setDescInputValue(todo.description ?? '');
  }, []);

  return {
    todos,
    loading,
    title,
    setTitle,
    editingId,
    editTitle,
    setEditTitle,
    editDescription,
    setEditDescription,
    expandedDescId,
    descInputValue,
    setDescInputValue,
    handleCreateTodo,
    handleToggleComplete,
    handleDeleteTodo,
    startEditing,
    cancelEditing,
    handleSaveEdit,
    toggleDescription,
    handleSaveDescription,
    beginDescriptionEdit,
  };
}