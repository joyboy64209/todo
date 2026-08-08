import type { Todo } from '../types/todo';

interface TodoDescriptionProps {
  todo: Todo;
  isExpanded: boolean;
  descInputValue: string;
  onDescInputChange: (value: string) => void;
  onSave: () => void;
  onEdit: () => void;
}

export default function TodoDescription({
  todo,
  isExpanded,
  descInputValue,
  onDescInputChange,
  onSave,
  onEdit,
}: TodoDescriptionProps) {
  return (
    <div
      className={`overflow-hidden transition-all duration-300 ease-in-out ${
        isExpanded ? 'max-h-40 mt-3' : 'max-h-0'
      }`}
    >
      {todo.description ? (
        <div className="space-y-2">
          <p className="text-sm text-slate-400 whitespace-pre-wrap leading-relaxed bg-slate-900/30 rounded-lg p-3 border border-slate-700/40">
            {todo.description}
          </p>
          <button
            onClick={onEdit}
            className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors cursor-pointer"
          >
            Edit description
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          <textarea
            value={descInputValue}
            onChange={(e) => onDescInputChange(e.target.value)}
            placeholder="Add a description..."
            rows={2}
            className="w-full bg-slate-900/80 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-400 resize-none"
          />
          <button
            onClick={onSave}
            disabled={!descInputValue.trim()}
            className="text-xs bg-emerald-500 hover:bg-emerald-400 disabled:bg-slate-700 disabled:text-slate-500 text-slate-900 font-semibold py-1.5 px-3 rounded-lg transition-all cursor-pointer disabled:cursor-not-allowed"
          >
            Save Description
          </button>
        </div>
      )}
    </div>
  );
}