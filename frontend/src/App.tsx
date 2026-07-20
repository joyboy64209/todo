import { useEffect, useState } from 'react';
import { todoService, Todo } from './services/api';

export default function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');

  const fetchTodos = async () => {
    try {
      const data = await todoService.getAll();
      setTodos(data);
    } catch (error) {
      console.error('Error fetching todos:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const handleCreateTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    try {
      const newTodo = await todoService.create(title, description);
      setTodos((prev) => [newTodo, ...prev]);
      setTitle('');
      setDescription('');
    } catch (error) {
      console.error('Error creating todo:', error);
    }
  };

  const handleToggleComplete = async (id: number, currentStatus: boolean) => {
    try {
      const updatedTodo = await todoService.update(id, { completed: !currentStatus });
      setTodos((prev) =>
        prev.map((todo) => (todo.id === id ? updatedTodo : todo))
      );
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

  const startEditing = (todo: Todo) => {
    setEditingId(todo.id);
    setEditTitle(todo.title);
    setEditDescription(todo.description || '');
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditTitle('');
    setEditDescription('');
  };

  const handleSaveEdit = async (id: number) => {
    if (!editTitle.trim()) return;
    try {
      const updatedTodo = await todoService.update(id, {
        title: editTitle,
        description: editDescription || undefined,
      });
      setTodos((prev) =>
        prev.map((todo) => (todo.id === id ? updatedTodo : todo))
      );
      cancelEditing();
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900">
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-emerald-400 mb-2">📋 Todo App</h1>
          <p className="text-slate-400">Stay organized, get things done</p>
        </div>

        {/* Create Todo Form */}
        <form
          onSubmit={handleCreateTodo}
          className="bg-slate-800/80 backdrop-blur-sm p-6 rounded-xl border border-slate-700 shadow-xl mb-8 space-y-4"
        >
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What needs to be done?"
              className="w-full bg-slate-900/80 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400/50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Description (Optional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add some details..."
              rows={2}
              className="w-full bg-slate-900/80 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400/50 resize-none"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-bold py-2 px-4 rounded-lg transition-all duration-200 cursor-pointer hover:-translate-y-0.5"
          >
            Add Todo
          </button>
        </form>

        {/* Todo List */}
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block w-8 h-8 border-4 border-emerald-400/30 border-t-emerald-400 rounded-full animate-spin" />
              <p className="text-slate-400 mt-3">Loading tasks...</p>
            </div>
          ) : todos.length === 0 ? (
            <div className="text-center py-12 bg-slate-800/50 rounded-xl border border-slate-700/50">
              <p className="text-4xl mb-3">🎉</p>
              <p className="text-slate-400 text-lg">No tasks yet. Create one above!</p>
            </div>
          ) : (
            todos.map((todo) => (
              <div
                key={todo.id}
                className="bg-slate-800/80 backdrop-blur-sm p-5 rounded-xl border border-slate-700 shadow-md hover:border-slate-600 transition-all duration-200"
              >
                {editingId === todo.id ? (
                  /* Edit Mode */
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="w-full bg-slate-900/80 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-400"
                      autoFocus
                    />
                    <textarea
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                      rows={2}
                      className="w-full bg-slate-900/80 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-400 resize-none"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleSaveEdit(todo.id)}
                        className="flex-1 bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-semibold py-1.5 px-3 rounded-lg transition-all cursor-pointer text-sm"
                      >
                        Save
                      </button>
                      <button
                        onClick={cancelEditing}
                        className="flex-1 bg-slate-600 hover:bg-slate-500 text-white font-semibold py-1.5 px-3 rounded-lg transition-all cursor-pointer text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Display Mode */
                  <div>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleToggleComplete(todo.id, todo.completed)}
                            className={`shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all cursor-pointer ${
                              todo.completed
                                ? 'bg-emerald-500 border-emerald-500'
                                : 'border-slate-500 hover:border-emerald-400'
                            }`}
                          >
                            {todo.completed && (
                              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </button>
                          <h3
                            className={`text-lg font-semibold truncate ${
                              todo.completed ? 'text-slate-500 line-through' : 'text-slate-100'
                            }`}
                          >
                            {todo.title}
                          </h3>
                        </div>
                        {todo.description && (
                          <p className="text-sm text-slate-400 mt-1.5 ml-7 whitespace-pre-wrap">
                            {todo.description}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => startEditing(todo)}
                          className="text-sm p-1.5 rounded-lg bg-slate-700/50 hover:bg-slate-600 text-slate-400 hover:text-white transition-all cursor-pointer"
                          title="Edit"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDeleteTodo(todo.id)}
                          className="text-sm p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-all cursor-pointer"
                          title="Delete"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <footer className="mt-12 text-center text-slate-600 text-sm">
          <p>Built with React, TypeScript, Tailwind CSS & NestJS</p>
        </footer>
      </div>
    </div>
  );
}