import { useEffect, useRef, useState, type FormEvent } from 'react';
import { useAuthContext } from '../auth/AuthContext';

interface OtpVerificationFormProps {
  email: string;
  onBack: () => void;
}

const RESEND_COOLDOWN = 30;

export default function OtpVerificationForm({ email, onBack }: OtpVerificationFormProps) {
  const { verifyOtp, resendOtp, loading, error } = useAuthContext();
  const [otp, setOtp] = useState('');
  const [cooldown, setCooldown] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (otp.length === 6) {
      await verifyOtp(email, otp);
    }
  };

  const handleResend = async () => {
    await resendOtp(email);
    setCooldown(RESEND_COOLDOWN);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-slate-800/80 backdrop-blur-sm p-8 rounded-xl border border-slate-700 shadow-xl w-full max-w-md space-y-4"
      >
        <h1 className="text-3xl font-bold text-emerald-400 text-center mb-2">📋 Todo App</h1>
        <h2 className="text-xl font-semibold text-slate-100 text-center">Enter Verification Code</h2>
        <p className="text-sm text-slate-400 text-center">
          We sent a 6-digit code to <span className="text-emerald-400 font-medium">{email}</span>
        </p>

        {error && (
          <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/30 rounded-lg p-3">
            {error}
          </p>
        )}

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Verification Code</label>
          <input
            ref={inputRef}
            type="text"
            inputMode="numeric"
            maxLength={6}
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
            placeholder="••••••"
            className="w-full bg-slate-900/80 border border-slate-700 rounded-lg px-4 py-3 text-center text-2xl tracking-[0.5em] text-white focus:outline-none focus:border-emerald-400 placeholder-slate-600"
          />
        </div>

        <button
          type="submit"
          disabled={loading || otp.length !== 6}
          className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:bg-slate-700 disabled:text-slate-500 text-slate-900 font-bold py-2 px-4 rounded-lg transition-all cursor-pointer"
        >
          {loading ? 'Verifying...' : 'Verify & Continue'}
        </button>

        <div className="flex items-center justify-between text-sm">
          <button
            type="button"
            onClick={handleResend}
            disabled={cooldown > 0 || loading}
            className="text-emerald-400 hover:text-emerald-300 disabled:text-slate-600 cursor-pointer"
          >
            {cooldown > 0 ? `Resend code (${cooldown}s)` : 'Resend code'}
          </button>
          <button
            type="button"
            onClick={onBack}
            className="text-slate-400 hover:text-slate-300 cursor-pointer"
          >
            ← Back
          </button>
        </div>
      </form>
    </div>
  );
}