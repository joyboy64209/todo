import type { Todo } from '../types/todo';
import TodoEditForm from './TodoEditForm';
import TodoDescription from './TodoDescription';
import TodoTitleRow from './TodoTitleRow';
import TodoActions from './TodoActions';

interface TodoItemProps {
  todo: Todo;
  isEditing: boolean;
  isExpanded: boolean;
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

export default function TodoItem(props: TodoItemProps) {
  const { todo, isEditing } = props;

  const displayMode = (
    <div>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <TodoTitleRow
            todo={todo}
            isExpanded={props.isExpanded}
            onToggleComplete={props.onToggleComplete}
            onToggleDescription={props.onToggleDescription}
          />
        </div>
        <TodoActions todo={todo} onEdit={props.onStartEdit} onDelete={props.onDelete} />
      </div>
      <TodoDescription
        todo={todo}
        isExpanded={props.isExpanded}
        descInputValue={props.descInputValue}
        onDescInputChange={props.onDescInputChange}
        onSave={() => props.onSaveDescription(todo.id)}
        onEdit={() => props.onBeginDescriptionEdit(todo)}
      />
    </div>
  );

  return (
    <div className="bg-slate-800/80 backdrop-blur-sm p-5 rounded-xl border border-slate-700 shadow-md hover:border-slate-600 transition-all duration-200">
      {isEditing ? (
        <TodoEditForm
          editTitle={props.editTitle}
          editDescription={props.editDescription}
          onEditTitleChange={props.onEditTitleChange}
          onEditDescriptionChange={props.onEditDescriptionChange}
          onSave={() => props.onSaveEdit(todo.id)}
          onCancel={props.onCancelEdit}
        />
      ) : (
        displayMode
      )}
    </div>
  );
}