import type { Todo } from '../types/todo';
import TodoItem from './TodoItem';

interface TodoListProps {
  todos: Todo[];
  loading: boolean;
  editingId: number | null;
  expandedDescId: number | null;
  editTitle: string;
  editDescription: string;
  descInputValue: string;
  onEditTitleChange: (value: string) => void;
  onEditDescriptionChange: (value: string) => void;
  onDescInputChange: (value: string) => void;
  onToggleComplete: (id: number, currentStatus: boolean) => void;
  onDelete: (id: number) => void;
  onStartEdit: (todo: Todo) => void;
  onCancelEdit: () => void;
  onSaveEdit: (id: number) => void;
  onToggleDescription: (id: number, currentDesc: string | null) => void;
  onSaveDescription: (id: number) => void;
  onBeginDescriptionEdit: (todo: Todo) => void;
}

export default function TodoList({
  todos,
  loading,
  editingId,
  expandedDescId,
  editTitle,
  editDescription,
  descInputValue,
  onEditTitleChange,
  onEditDescriptionChange,
  onDescInputChange,
  onToggleComplete,
  onDelete,
  onStartEdit,
  onCancelEdit,
  onSaveEdit,
  onToggleDescription,
  onSaveDescription,
  onBeginDescriptionEdit,
}: TodoListProps) {
  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block w-8 h-8 border-4 border-emerald-400/30 border-t-emerald-400 rounded-full animate-spin" />
        <p className="text-slate-400 mt-3">Loading tasks...</p>
      </div>
    );
  }

  if (todos.length === 0) {
    return (
      <div className="text-center py-12 bg-slate-800/50 rounded-xl border border-slate-700/50">
        <p className="text-4xl mb-3">🎉</p>
        <p className="text-slate-400 text-lg">No tasks yet. Create one above!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          isEditing={editingId === todo.id}
          isExpanded={expandedDescId === todo.id}
          editTitle={editTitle}
          editDescription={editDescription}
          descInputValue={descInputValue}
          onEditTitleChange={onEditTitleChange}
          onEditDescriptionChange={onEditDescriptionChange}
          onDescInputChange={onDescInputChange}
          onToggleComplete={onToggleComplete}
          onDelete={onDelete}
          onStartEdit={onStartEdit}
          onCancelEdit={onCancelEdit}
          onSaveEdit={onSaveEdit}
          onToggleDescription={onToggleDescription}
          onSaveDescription={onSaveDescription}
          onBeginDescriptionEdit={onBeginDescriptionEdit}
        />
      ))}
    </div>
  );
}