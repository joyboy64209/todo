import { useTodos } from './hooks/useTodos';
import TodoHeader from './components/TodoHeader';
import TodoForm from './components/TodoForm';
import TodoList from './components/TodoList';

export default function App() {
  const todo = useTodos();

  return (
    <div className="min-h-screen bg-slate-900">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <TodoHeader />
        <TodoForm
          title={todo.title}
          onTitleChange={todo.setTitle}
          onSubmit={todo.handleCreateTodo}
        />
        <TodoList
          todos={todo.todos}
          loading={todo.loading}
          editingId={todo.editingId}
          expandedDescId={todo.expandedDescId}
          editTitle={todo.editTitle}
          editDescription={todo.editDescription}
          descInputValue={todo.descInputValue}
          onEditTitleChange={todo.setEditTitle}
          onEditDescriptionChange={todo.setEditDescription}
          onDescInputChange={todo.setDescInputValue}
          onToggleComplete={todo.handleToggleComplete}
          onDelete={todo.handleDeleteTodo}
          onStartEdit={todo.startEditing}
          onCancelEdit={todo.cancelEditing}
          onSaveEdit={todo.handleSaveEdit}
          onToggleDescription={todo.toggleDescription}
          onSaveDescription={todo.handleSaveDescription}
          onBeginDescriptionEdit={todo.beginDescriptionEdit}
        />
        <footer className="mt-12 text-center text-slate-600 text-sm">
          <p>Built with React, TypeScript, Tailwind CSS & NestJS</p>
        </footer>
      </div>
    </div>
  );
}