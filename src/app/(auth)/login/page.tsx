'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Loader2, Eye, EyeOff } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

type Step = 'form' | 'reset-sent';

export default function LoginPage() {
  const [email, setEmail]         = useState('');
  const [password, setPassword]   = useState('');
  const [showPw, setShowPw]       = useState(false);
  const [loading, setLoading]     = useState(false);
  const [step, setStep]           = useState<Step>('form');
  const [error, setError]         = useState<string | null>(null);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    setLoading(false);

    if (authError) {
      setError(
        authError.message.includes('Invalid login')
          ? 'Incorrect email or password. Try again or reset your password.'
          : authError.message,
      );
    } else {
      window.location.href = '/';
    }
  }

  async function handleGoogle() {
    setError(null);
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/callback` },
    });
  }

  async function handleForgotPassword() {
    if (!email.trim()) {
      setError('Enter your email above first, then click Forgot Password.');
      return;
    }
    setLoading(true);
    setError(null);
    const supabase = createClient();
    await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/callback?next=/reset-password`,
    });
    setLoading(false);
    setStep('reset-sent');
  }

  return (
    <div className="w-full max-w-sm">
      {/* Logo */}
      <div className="mb-8 flex flex-col items-center gap-3">
        <Image src="/helmet.png" alt="SaintSal Labs" width={72} height={72}
          style={{ filter: 'drop-shadow(0 0 16px rgba(212,175,55,0.5))' }} priority />
        <span style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 22, letterSpacing: 3,
          background: 'linear-gradient(135deg,#D4AF37,#F3D06D,#8A7129)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          SaintSal™ Labs
        </span>
      </div>

      <div className="rounded-xl border border-sal-border bg-sal-surface p-6">
        {step === 'reset-sent' ? (
          <div className="text-center">
            <div className="mb-3 text-2xl">📬</div>
            <p className="text-sm font-semibold text-sal-text">Password reset sent</p>
            <p className="mt-2 text-xs text-sal-text-muted">
              Check <strong className="text-sal-text">{email}</strong> for a reset link.
              Click it and you&apos;ll be back in seconds.
            </p>
            <button onClick={() => setStep('form')}
              className="mt-4 text-xs text-sal-gold hover:underline">
              ← Back to login
            </button>
          </div>
        ) : (
          <>
            <h1 className="mb-1 text-center text-lg font-semibold text-sal-text">Welcome back</h1>
            <p className="mb-6 text-center text-xs text-sal-text-muted">
              Sign in to SaintSal™ Labs
            </p>

            <form onSubmit={handleLogin}>
              <label className="mb-1 block text-xs text-sal-text-muted">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="mb-3 w-full rounded-lg border border-sal-border2 bg-sal-input px-3 py-2.5 text-sm text-sal-text placeholder:text-sal-text-muted outline-none focus:border-sal-gold/50"
              />

              <label className="mb-1 block text-xs text-sal-text-muted">Password</label>
              <div className="relative mb-1">
                <input
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full rounded-lg border border-sal-border2 bg-sal-input px-3 py-2.5 pr-10 text-sm text-sal-text placeholder:text-sal-text-muted outline-none focus:border-sal-gold/50"
                />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-sal-text-muted hover:text-sal-text">
                  {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>

              <div className="mb-4 flex justify-end">
                <button type="button" onClick={handleForgotPassword}
                  className="text-[11px] text-sal-text-muted hover:text-sal-gold">
                  Forgot password?
                </button>
              </div>

              <button type="submit" disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-sal-gold px-4 py-2.5 text-sm font-semibold text-black transition-colors hover:bg-sal-gold-hover disabled:opacity-60">
                {loading && <Loader2 size={14} className="animate-spin" />}
                Sign In
              </button>
            </form>

            <div className="my-5 flex items-center gap-3">
              <div className="h-px flex-1 bg-sal-border" />
              <span className="text-xs text-sal-text-muted">or</span>
              <div className="h-px flex-1 bg-sal-border" />
            </div>

            <button onClick={handleGoogle}
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-sal-border2 bg-sal-surface2 px-4 py-2.5 text-sm text-sal-text transition-colors hover:bg-[#161620]">
              <svg width="16" height="16" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button>

            {error && <p className="mt-4 text-center text-xs text-sal-red">{error}</p>}
          </>
        )}
      </div>

      <p className="mt-4 text-center text-xs text-sal-text-muted">
        Don&apos;t have an account?{' '}
        <Link href="/signup" className="text-sal-gold hover:underline">Sign up free</Link>
      </p>
    </div>
  );
}
