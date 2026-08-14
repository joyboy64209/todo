import { useState, type FormEvent } from 'react';
import { useAuthContext } from '../auth/AuthContext';

interface RegisterFormProps {
  onSwitchToLogin: () => void;
  onRegistered: (email: string) => void;
}

export default function RegisterForm({ onSwitchToLogin, onRegistered }: RegisterFormProps) {
  const { register, loading, error } = useAuthContext();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const registeredEmail = await register({ name: name || undefined, email, password });

    if (registeredEmail) {
      onRegistered(registeredEmail);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-slate-800/80 backdrop-blur-sm p-8 rounded-xl border border-slate-700 shadow-xl w-full max-w-md space-y-4"
      >
        <h1 className="text-3xl font-bold text-emerald-400 text-center mb-6">📋 Todo App</h1>
        <h2 className="text-xl font-semibold text-slate-100 text-center">Create Account</h2>

        {error && (
          <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/30 rounded-lg p-3">
            {error}
          </p>
        )}

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Name (optional)</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-slate-900/80 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-400"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full bg-slate-900/80 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-400"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className="w-full bg-slate-900/80 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-400"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:bg-slate-700 disabled:text-slate-500 text-slate-900 font-bold py-2 px-4 rounded-lg transition-all cursor-pointer"
        >
          {loading ? 'Creating account...' : 'Register'}
        </button>

        <p className="text-sm text-slate-400 text-center">
          Already have an account?{' '}
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="text-emerald-400 hover:text-emerald-300 cursor-pointer"
          >
            Sign In
          </button>
        </p>
      </form>
    </div>
  );
}