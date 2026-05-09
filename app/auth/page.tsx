'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Compass, Eye, EyeOff, ArrowRight, Sparkles, Linkedin, CheckCircle2 } from 'lucide-react';

export default function AuthPage() {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, signUp, signInWithGoogle } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (mode === 'login') {
      const { error: signInError } = await signIn(email, password);
      if (signInError) {
        setError(signInError.message);
      } else {
        router.push('/');
      }
    } else {
      if (!fullName.trim()) {
        setError('Full name is required');
        setLoading(false);
        return;
      }

      const { error: signUpError } = await signUp(email, password, fullName);
      if (signUpError) {
        setError(signUpError.message);
      } else {
        router.push('/');
      }
    }

    setLoading(false);
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);
    const { error: googleError } = await signInWithGoogle();

    if (googleError) {
      setError(googleError.message);
    } else {
      router.push('/');
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-surface">
      <div className="min-h-screen flex flex-col lg:flex-row">
        <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-primary-container text-on-primary flex-col items-center justify-center p-12">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.18),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(181,120,95,0.16),transparent_26%)]" />
          <div className="absolute top-8 left-8 w-40 h-40 rounded-full bg-tertiary-fixed-dim/20 blur-3xl" />
          <div className="absolute bottom-10 right-12 w-56 h-56 rounded-full bg-secondary-fixed/15 blur-3xl" />

          <div className="relative z-10 max-w-md text-center">
              <div className="flex items-center justify-center gap-3 mb-8">
              <div className="w-12 h-12 bg-surface rounded-2xl flex items-center justify-center shadow-lg shadow-[0_10px_30px_-12px_rgba(0,31,63,0.22)] p-1">
                <img
                  src="/opportunity-finder-logo.png"
                  alt="Opportunity Finder"
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    const img = e.currentTarget as HTMLImageElement;
                    img.onerror = null;
                    img.src = '/favicon.svg';
                  }}
                />
              </div>
              <span className="text-2xl font-semibold tracking-tight">Opportunity Finder</span>
            </div>

            <h2 className="text-4xl font-semibold tracking-tight leading-tight mb-4">Chart your path with precision.</h2>
            <p className="text-base opacity-90 mb-10 leading-relaxed">
              Join students using AI to discover scholarships, internships, and jobs that fit their story.
            </p>

            <div className="space-y-4 text-left">
              {[
                'AI-powered opportunity matching',
                'Curated global opportunities',
                'Track applications and saved items',
              ].map((text) => (
                <div key={text} className="flex items-center gap-3 bg-surface/10 rounded-xl px-5 py-3 backdrop-blur-sm border border-surface/10">
                  <CheckCircle2 className="w-5 h-5 text-tertiary-fixed" />
                  <span className="text-sm text-on-primary/90 font-medium">{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
          <div className="w-full max-w-md">
            <div className="lg:hidden flex items-center gap-2 mb-8">
              <div className="w-9 h-9 bg-primary-container rounded-xl flex items-center justify-center p-1">
                <img
                  src="/opportunity-finder-logo.png"
                  alt="Opportunity Finder"
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    const img = e.currentTarget as HTMLImageElement;
                    img.onerror = null;
                    img.src = '/favicon.svg';
                  }}
                />
              </div>
              <span className="text-xl font-semibold tracking-tight text-primary">Opportunity Finder</span>
            </div>

            <div className="tactile-card rounded-2xl p-6 sm:p-8">
              <div className="mb-8">
                <div className="inline-flex items-center gap-2 bg-on-tertiary-fixed-variant/10 text-on-tertiary-fixed-variant rounded-full px-3 py-1.5 mb-4 text-xs font-semibold uppercase tracking-[0.18em]">
                  <Sparkles className="w-4 h-4" />
                  Secure access
                </div>
                <h1 className="text-3xl font-semibold tracking-tight text-primary mb-2">
                  {mode === 'login' ? 'Welcome back' : 'Create your account'}
                </h1>
                <p className="text-on-surface-variant text-sm leading-relaxed">
                  {mode === 'login'
                    ? 'Sign in to access your personalized opportunities and saved matches.'
                    : 'Join Opportunity Finder and start building a sharper career search.'}
                </p>
              </div>

              <div className="flex bg-surface-container rounded-full p-1 mb-6 border border-outline-variant/70">
                <button
                  onClick={() => { setMode('login'); setError(''); }}
                  className={`flex-1 py-2.5 rounded-full text-sm font-semibold transition-all ${
                    mode === 'login'
                      ? 'bg-primary text-on-primary shadow-sm'
                      : 'text-on-surface-variant hover:text-primary'
                  }`}
                >
                  Sign in
                </button>
                <button
                  onClick={() => { setMode('signup'); setError(''); }}
                  className={`flex-1 py-2.5 rounded-full text-sm font-semibold transition-all ${
                    mode === 'signup'
                      ? 'bg-primary text-on-primary shadow-sm'
                      : 'text-on-surface-variant hover:text-primary'
                  }`}
                >
                  Sign up
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                <button
                  onClick={handleGoogleSignIn}
                  disabled={loading}
                  className="h-12 bg-surface hover:bg-surface-container-low text-primary border border-outline-variant rounded-xl text-sm font-semibold transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden="true">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  Continue with Google
                </button>

                <button
                  type="button"
                  disabled
                  className="h-12 bg-surface hover:bg-surface-container-low text-primary border border-outline-variant rounded-xl text-sm font-semibold transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <Linkedin className="w-5 h-5 text-[#0077b5]" />
                  LinkedIn coming soon
                </button>
              </div>

              <div className="relative mb-6 text-center">
                <div aria-hidden="true" className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-outline-variant" />
                </div>
                <span className="relative px-4 bg-surface text-outline uppercase tracking-widest text-xs font-semibold">or</span>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {mode === 'signup' && (
                  <div>
                    <Label htmlFor="fullName" className="block text-sm font-semibold text-on-surface-variant mb-2">
                      Full name
                    </Label>
                    <Input
                      id="fullName"
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="John Doe"
                      className="h-12 rounded-xl border-outline-variant bg-surface text-primary placeholder:text-outline focus-visible:ring-on-tertiary-fixed-variant/20 focus-visible:border-on-tertiary-fixed-variant"
                      required
                    />
                  </div>
                )}

                <div>
                  <Label htmlFor="email" className="block text-sm font-semibold text-on-surface-variant mb-2">
                    Email address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="h-12 rounded-xl border-outline-variant bg-surface text-primary placeholder:text-outline focus-visible:ring-on-tertiary-fixed-variant/20 focus-visible:border-on-tertiary-fixed-variant"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="password" className="block text-sm font-semibold text-on-surface-variant mb-2">
                    Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="h-12 rounded-xl border-outline-variant bg-surface text-primary placeholder:text-outline focus-visible:ring-on-tertiary-fixed-variant/20 focus-visible:border-on-tertiary-fixed-variant pr-12"
                      required
                      minLength={6}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-primary transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="bg-error-container border border-error/20 rounded-xl px-4 py-3 text-error text-sm">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 bg-primary hover:bg-on-surface text-on-primary font-semibold rounded-xl text-sm shadow-[0_10px_30px_-12px_rgba(0,31,63,0.18)] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      {mode === 'login' ? 'Signing in...' : 'Creating account...'}
                    </span>
                  ) : (
                    <>
                      {mode === 'login' ? 'Sign in' : 'Create account'}
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-8 bg-surface-container-low rounded-xl p-4 flex items-start gap-3 border border-outline-variant/70">
                <Sparkles className="w-5 h-5 text-on-tertiary-fixed-variant shrink-0 mt-0.5" />
                <p className="text-on-surface-variant text-sm leading-relaxed">
                  Upload your CV after signing in and let the AI find the best matches for you.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
