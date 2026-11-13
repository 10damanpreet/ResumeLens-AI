import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, Mail, Lock, Loader2, ArrowRight, Eye, EyeOff, Zap, ShieldCheck } from 'lucide-react';
import { api, getErrorMessage } from '../api/client';
import { useToast } from '../components/Toast';

export default function Login() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [demoLoading, setDemoLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', response.data.access_token);
      showToast('Welcome back! Signed in successfully.', 'success');
      navigate('/');
    } catch (err: any) {
      const msg = getErrorMessage(err);
      setError(msg);
      showToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setDemoLoading(true);
    setError('');
    const demoEmail = 'evaluator@resumelens.ai';
    const demoPass = 'ProjectDemo2026!';

    try {
      // Try login first
      const resp = await api.post('/auth/login', { email: demoEmail, password: demoPass }).catch(async () => {
        // If demo user doesn't exist yet, register then login
        await api.post('/auth/register', { email: demoEmail, password: demoPass });
        return await api.post('/auth/login', { email: demoEmail, password: demoPass });
      });

      localStorage.setItem('token', resp.data.access_token);
      showToast('Logged in with 1-Click Demo Account!', 'success');
      navigate('/');
    } catch (err: any) {
      const msg = getErrorMessage(err);
      setError(msg);
      showToast(msg, 'error');
    } finally {
      setDemoLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center px-4 py-10 sm:py-16">
      <div className="w-full max-w-md relative">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 shadow-xl shadow-violet-500/30 mb-4 animate-float">
            <Sparkles className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Welcome Back</h1>
          <p className="text-white/50 text-sm mt-1">Sign in to your ResumeLens AI workspace</p>
        </div>

        {/* Auth Card */}
        <div className="glass-card rounded-3xl p-7 sm:p-8 shadow-2xl border-white/10">
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-2xl px-4 py-3 mb-6 text-red-200 text-sm flex items-center gap-2.5 animate-slide-up">
              <span className="w-2 h-2 rounded-full bg-red-400 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* 1-Click Quick Demo Login Button */}
          <button
            type="button"
            onClick={handleDemoLogin}
            disabled={demoLoading || loading}
            className="w-full py-3 px-4 rounded-xl mb-6 font-semibold text-xs sm:text-sm bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-amber-500/20 text-amber-200 border border-amber-500/40 hover:bg-amber-500/30 flex items-center justify-center gap-2 transition-all shadow-md active:scale-[0.98]"
          >
            {demoLoading ? (
              <Loader2 className="w-4 h-4 animate-spin text-amber-300" />
            ) : (
              <Zap className="w-4 h-4 text-amber-400" />
            )}
            <span>⚡ 1-Click Demo Login (Fast Evaluator Access)</span>
          </button>

          <div className="flex items-center gap-3 mb-6">
            <div className="h-px bg-white/10 flex-1" />
            <span className="text-xs text-white/40 uppercase font-medium">Or email sign in</span>
            <div className="h-px bg-white/10 flex-1" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-white/70 uppercase tracking-wider mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  required
                  className="input-field pl-10"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-white/70 uppercase tracking-wider mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="input-field pl-10 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors p-1"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || demoLoading}
              className="btn-primary w-full py-3.5 mt-2"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  Sign in
                  <ArrowRight className="w-4 h-4 ml-1" />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-white/50 text-sm mt-6">
            Don't have an account?{' '}
            <Link
              to="/register"
              className="text-violet-400 hover:text-violet-300 font-semibold transition-colors"
            >
              Create one free
            </Link>
          </p>
        </div>

        {/* Security Footer Note */}
        <div className="flex items-center justify-center gap-2 mt-6 text-xs text-white/40">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Bcrypt password hashing &bull; Stateless JWT authentication</span>
        </div>
      </div>
    </div>
  );
}
