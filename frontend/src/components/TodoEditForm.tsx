interface TodoEditFormProps {
  editTitle: string;
  editDescription: string;
  onEditTitleChange: (value: string) => void;
  onEditDescriptionChange: (value: string) => void;
  onSave: () => void;
  onCancel: () => void;
}

export default function TodoEditForm({
  editTitle,
  editDescription,
  onEditTitleChange,
  onEditDescriptionChange,
  onSave,
  onCancel,
}: TodoEditFormProps) {
  return (
    <div className="space-y-3">
      <input
        type="text"
        value={editTitle}
        onChange={(e) => onEditTitleChange(e.target.value)}
        className="w-full bg-slate-900/80 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-400"
        autoFocus
      />
      <textarea
        value={editDescription}
        onChange={(e) => onEditDescriptionChange(e.target.value)}
        rows={2}
        className="w-full bg-slate-900/80 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-400 resize-none"
      />
      <div className="flex gap-2">
        <button
          onClick={onSave}
          className="flex-1 bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-semibold py-1.5 px-3 rounded-lg transition-all cursor-pointer text-sm"
        >
          Save
        </button>
        <button
          onClick={onCancel}
          className="flex-1 bg-slate-600 hover:bg-slate-500 text-white font-semibold py-1.5 px-3 rounded-lg transition-all cursor-pointer text-sm"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}