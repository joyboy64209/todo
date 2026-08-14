import { useState } from 'react';
import { AuthProvider, useAuthContext } from './auth/AuthContext';
import { useTodos } from './hooks/useTodos';
import TodoHeader from './components/TodoHeader';
import TodoForm from './components/TodoForm';
import TodoList from './components/TodoList';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import OtpVerificationForm from './components/OtpVerificationForm';

type AuthView = 'login' | 'register' | 'otp';

function AuthScreen() {
  const [view, setView] = useState<AuthView>('login');
  const [pendingEmail, setPendingEmail] = useState('');

  if (view === 'register') {
    return (
      <RegisterForm
        onSwitchToLogin={() => setView('login')}
        onRegistered={(email) => {
          setPendingEmail(email);
          setView('otp');
        }}
      />
    );
  }

  if (view === 'otp') {
    return (
      <OtpVerificationForm
        email={pendingEmail}
        onBack={() => setView('register')}
      />
    );
  }

  return <LoginForm onSwitchToRegister={() => setView('register')} />;
}

function TodoApp() {
  const { user, logout } = useAuthContext();
  const todo = useTodos();

  return (
    <div className="min-h-screen bg-slate-900">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-4">
          <TodoHeader />
          <div className="flex items-center gap-3">
            <span className="text-sm text-slate-400">{user?.email}</span>
            <button
              onClick={logout}
              className="text-sm bg-slate-700 hover:bg-slate-600 text-slate-300 py-1 px-3 rounded-lg transition-all cursor-pointer"
            >
              Logout
            </button>
          </div>
        </div>
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

function AppContent() {
  const { isAuthenticated } = useAuthContext();

  return isAuthenticated ? <TodoApp /> : <AuthScreen />;
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}