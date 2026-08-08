import type { FormEvent } from 'react';

interface TodoFormProps {
  title: string;
  onTitleChange: (value: string) => void;
  onSubmit: (e: FormEvent) => void;
}

export default function TodoForm({ title, onTitleChange, onSubmit }: TodoFormProps) {
  return (
    <form
      onSubmit={onSubmit}
      className="bg-slate-800/80 backdrop-blur-sm p-6 rounded-xl border border-slate-700 shadow-xl mb-8 space-y-4"
    >
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1">
          Title
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder="What needs to be done?"
          className="w-full bg-slate-900/80 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400/50"
        />
      </div>
      <button
        type="submit"
        className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-bold py-2 px-4 rounded-lg transition-all duration-200 cursor-pointer hover:-translate-y-0.5"
      >
        Add Todo
      </button>
    </form>
  );
}