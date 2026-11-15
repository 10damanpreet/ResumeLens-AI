import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Mail,
  Lock,
  Loader2,
  ArrowRight,
  Eye,
  EyeOff,
  Zap,
  ShieldCheck,
  Building2,
  GraduationCap,
} from 'lucide-react';
import { api, getErrorMessage } from '../api/client';
import { useToast } from '../components/Toast';

export default function Login() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [portalMode, setPortalMode] = useState<'candidate' | 'recruiter'>('candidate');
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
      const portal = portalMode === 'recruiter' ? 'recruiter' : 'candidate';
      const response = await api.post('/auth/login', { email, password, portal });
      const { access_token, role } = response.data;

      const activeRole = role || (portalMode === 'recruiter' ? 'recruiter' : 'user');
      localStorage.setItem('token', access_token);
      localStorage.setItem('user_role', activeRole);
      localStorage.setItem('user_email', email);

      if (portalMode === 'recruiter') {
        showToast('Signed in to Recruiter Talent Suite.', 'success');
        navigate('/recruiter');
      } else {
        showToast('Signed in to Student Workspace.', 'success');
        navigate('/');
      }
    } catch (err: any) {
      const msg = getErrorMessage(err);
      setError(msg);
      showToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoStudentLogin = async () => {
    setDemoLoading(true);
    setError('');
    const demoEmail = 'student@resumelens.ai';
    const demoPass = 'Password123!';

    try {
      const resp = await api.post('/auth/login', {
        email: demoEmail,
        password: demoPass,
        portal: 'candidate',
      });
      const { access_token, role } = resp.data;

      localStorage.setItem('token', access_token);
      localStorage.setItem('user_role', role || 'user');
      localStorage.setItem('user_email', demoEmail);

      showToast('Logged in as Student (student@resumelens.ai)', 'success');
      navigate('/');
    } catch (err: any) {
      const msg = getErrorMessage(err);
      setError(msg);
      showToast(msg, 'error');
    } finally {
      setDemoLoading(false);
    }
  };

  const handleDemoRecruiterLogin = async () => {
    setDemoLoading(true);
    setError('');
    const demoEmail = 'recruiter@resumelens.ai';
    const demoPass = 'Password123!';

    try {
      const resp = await api.post('/auth/login', {
        email: demoEmail,
        password: demoPass,
        portal: 'recruiter',
      });
      const { access_token, role } = resp.data;

      localStorage.setItem('token', access_token);
      localStorage.setItem('user_role', role || 'recruiter');
      localStorage.setItem('user_email', demoEmail);

      showToast('Logged in as Recruiter (recruiter@resumelens.ai)', 'success');
      navigate('/recruiter');
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
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-600 via-indigo-600 to-purple-700 shadow-xl shadow-violet-500/30 mb-3 animate-float">
            <Sparkles className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Sign In to ResumeLens AI
          </h1>
          <p className="text-white/50 text-xs sm:text-sm mt-1">
            Choose your account role to sign in to your dedicated portal
          </p>
        </div>

        {/* Auth Card */}
        <div className="glass-card rounded-3xl p-6 sm:p-8 shadow-2xl border-white/10">
          {/* Distinct Persona Selector Tabs */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-white/5 rounded-2xl mb-6 border border-white/10">
            <button
              type="button"
              onClick={() => {
                setPortalMode('candidate');
                setError('');
              }}
              className={`py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                portalMode === 'candidate'
                  ? 'bg-violet-600 text-white shadow-md'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              Student Portal
            </button>
            <button
              type="button"
              onClick={() => {
                setPortalMode('recruiter');
                setError('');
              }}
              className={`py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                portalMode === 'recruiter'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              <Building2 className="w-4 h-4" />
              Recruiter Portal
            </button>
          </div>

          {/* Persona Description */}
          <div className="mb-5 p-3 rounded-xl bg-white/[0.03] border border-white/5 text-xs">
            {portalMode === 'candidate' ? (
              <p className="text-violet-200/80">
                <strong className="text-white">Student Account:</strong> Access resume scanning, ATS compliance health check, Google XYZ bullet tailoring, and Kanban job tracker.
              </p>
            ) : (
              <p className="text-emerald-200/80">
                <strong className="text-white">Recruiter Account:</strong> Access corporate talent screening, ranked applicant leaderboards, AI JD generator, and candidate comparison.
              </p>
            )}
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-2xl px-4 py-3 mb-6 text-red-200 text-xs sm:text-sm flex items-center gap-2.5 animate-slide-up">
              <span className="w-2 h-2 rounded-full bg-red-400 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* 1-Click Dedicated Role Login Buttons */}
          <div className="mb-6">
            {portalMode === 'candidate' ? (
              <button
                type="button"
                onClick={handleDemoStudentLogin}
                disabled={demoLoading || loading}
                className="w-full py-3 px-4 rounded-xl font-bold text-xs sm:text-sm bg-gradient-to-r from-violet-600/30 via-indigo-600/30 to-purple-600/30 text-violet-200 border border-violet-500/40 hover:bg-violet-600/40 flex items-center justify-center gap-2 transition-all shadow-md active:scale-[0.98]"
              >
                {demoLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin text-violet-300" />
                ) : (
                  <Zap className="w-4 h-4 text-violet-400" />
                )}
                <span>⚡ 1-Click Sign In: Student Account</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleDemoRecruiterLogin}
                disabled={demoLoading || loading}
                className="w-full py-3 px-4 rounded-xl font-bold text-xs sm:text-sm bg-gradient-to-r from-emerald-600/30 via-teal-600/30 to-emerald-600/30 text-emerald-200 border border-emerald-500/40 hover:bg-emerald-600/40 flex items-center justify-center gap-2 transition-all shadow-md active:scale-[0.98]"
              >
                {demoLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin text-emerald-300" />
                ) : (
                  <Building2 className="w-4 h-4 text-emerald-400" />
                )}
                <span>🏢 1-Click Sign In: Recruiter Account</span>
              </button>
            )}
            <p className="text-[11px] text-white/40 text-center mt-1.5">
              {portalMode === 'candidate' ? (
                <>Pre-seeded: <code className="text-violet-300">student@resumelens.ai</code></>
              ) : (
                <>Pre-seeded: <code className="text-emerald-300">recruiter@resumelens.ai</code></>
              )}
            </p>
          </div>

          <div className="flex items-center gap-3 mb-5">
            <div className="h-px bg-white/10 flex-1" />
            <span className="text-[11px] text-white/40 uppercase font-medium">Or enter credentials</span>
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
                  placeholder={portalMode === 'recruiter' ? 'recruiter@resumelens.ai' : 'student@resumelens.ai'}
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
              className={`w-full py-3.5 mt-2 rounded-xl font-bold text-sm text-white flex items-center justify-center gap-2 transition-all shadow-xl ${
                portalMode === 'recruiter'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500'
                  : 'btn-primary'
              }`}
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <span>Sign In as {portalMode === 'recruiter' ? 'Recruiter' : 'Student'}</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-white/50 text-xs sm:text-sm mt-6">
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
          <span>Strict Role Segregation &bull; Student and Recruiter Portals are Isolated</span>
        </div>
      </div>
    </div>
  );
}
