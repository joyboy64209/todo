import type { Todo } from '../types/todo';

interface TodoTitleRowProps {
  todo: Todo;
  isExpanded: boolean;
  onToggleComplete: (id: number, currentStatus: boolean) => void;
  onToggleDescription: (id: number, currentDesc: string | null) => void;
}

export default function TodoTitleRow({
  todo,
  isExpanded,
  onToggleComplete,
  onToggleDescription,
}: TodoTitleRowProps) {
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => onToggleComplete(todo.id, todo.completed)}
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
      <button
        onClick={() => onToggleDescription(todo.id, todo.description)}
        className="text-slate-500 hover:text-slate-300 transition-colors cursor-pointer shrink-0"
        title={isExpanded ? 'Collapse' : 'Add or view description'}
      >
        <svg
          className={`w-4 h-4 transition-transform duration-300 ${isExpanded ? 'rotate-180 text-emerald-400' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
    </div>
  );
}