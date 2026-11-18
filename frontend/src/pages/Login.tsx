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
      const cleanEmail = email.trim().toLowerCase();
      const cleanPassword = password.trim();
      const response = await api.post('/auth/login', { email: cleanEmail, password: cleanPassword, portal });
      const { access_token, role } = response.data;

      const activeRole = role || (portalMode === 'recruiter' ? 'recruiter' : 'user');
      localStorage.setItem('token', access_token);
      localStorage.setItem('user_role', activeRole);
      localStorage.setItem('user_email', cleanEmail);

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
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 shadow-xl shadow-indigo-500/25 mb-3 animate-float">
            <Sparkles className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Sign In to ResumeLens AI
          </h1>
          <p className="text-slate-600 text-xs sm:text-sm mt-1 font-medium">
            Choose your account role to sign in to your dedicated portal
          </p>
        </div>

        {/* Auth Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200/90">
          {/* Distinct Persona Selector Tabs */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-2xl mb-6 border border-slate-200">
            <button
              type="button"
              onClick={() => {
                setPortalMode('candidate');
                setError('');
              }}
              className={`py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                portalMode === 'candidate'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
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
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <Building2 className="w-4 h-4" />
              Recruiter Portal
            </button>
          </div>

          {/* Persona Description */}
          <div className="mb-5 p-3.5 rounded-xl border text-xs leading-relaxed">
            {portalMode === 'candidate' ? (
              <div className="bg-indigo-50/70 border border-indigo-200/80 -m-3.5 p-3.5 rounded-xl text-slate-700">
                <strong className="text-indigo-950 font-bold block sm:inline">Student Account: </strong>
                <span>Access resume scanning, ATS compliance health check, Google XYZ bullet tailoring, and Kanban job tracker.</span>
              </div>
            ) : (
              <div className="bg-emerald-50/70 border border-emerald-200/80 -m-3.5 p-3.5 rounded-xl text-slate-700">
                <strong className="text-emerald-950 font-bold block sm:inline">Recruiter Account: </strong>
                <span>Access corporate talent screening, ranked applicant leaderboards, AI JD generator, and candidate comparison.</span>
              </div>
            )}
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-2xl px-4 py-3 mb-6 text-red-700 text-xs sm:text-sm flex items-center gap-2.5 animate-slide-up">
              <span className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0" />
              <span className="font-medium">{error}</span>
            </div>
          )}

          {/* 1-Click Dedicated Role Login Buttons */}
          <div className="mb-6">
            {portalMode === 'candidate' ? (
              <button
                type="button"
                onClick={handleDemoStudentLogin}
                disabled={demoLoading || loading}
                className="w-full py-3 px-4 rounded-xl font-bold text-xs sm:text-sm bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white flex items-center justify-center gap-2 transition-all shadow-md shadow-indigo-600/20 active:scale-[0.98]"
              >
                {demoLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                ) : (
                  <Zap className="w-4 h-4 text-amber-300" />
                )}
                <span>⚡ 1-Click Sign In: Student Account</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleDemoRecruiterLogin}
                disabled={demoLoading || loading}
                className="w-full py-3 px-4 rounded-xl font-bold text-xs sm:text-sm bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white flex items-center justify-center gap-2 transition-all shadow-md shadow-emerald-600/20 active:scale-[0.98]"
              >
                {demoLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                ) : (
                  <Building2 className="w-4 h-4 text-emerald-200" />
                )}
                <span>🏢 1-Click Sign In: Recruiter Account</span>
              </button>
            )}
            
            <p className="text-xs text-slate-500 text-center mt-2 font-medium">
              {portalMode === 'candidate' ? (
                <>Pre-seeded: <code className="px-1.5 py-0.5 rounded bg-indigo-50 border border-indigo-200 text-indigo-700 font-mono font-bold">student@resumelens.ai</code> &bull; Pass: <code className="px-1.5 py-0.5 rounded bg-indigo-50 border border-indigo-200 text-indigo-700 font-mono font-bold">Password123!</code></>
              ) : (
                <>Pre-seeded: <code className="px-1.5 py-0.5 rounded bg-emerald-50 border border-emerald-200 text-emerald-700 font-mono font-bold">recruiter@resumelens.ai</code> &bull; Pass: <code className="px-1.5 py-0.5 rounded bg-emerald-50 border border-emerald-200 text-emerald-700 font-mono font-bold">Password123!</code></>
              )}
            </p>

            {/* Quick Fill Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-3">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Auto-Fill:</span>
              {portalMode === 'candidate' ? (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      setEmail('student@resumelens.ai');
                      setPassword('Password123!');
                    }}
                    className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200 text-slate-700 hover:bg-indigo-50 hover:border-indigo-300 hover:text-indigo-700 transition-colors"
                  >
                    student@resumelens.ai
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEmail('test@example.com');
                      setPassword('Password123!');
                    }}
                    className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200 text-slate-700 hover:bg-indigo-50 hover:border-indigo-300 hover:text-indigo-700 transition-colors"
                  >
                    test@example.com
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setEmail('recruiter@resumelens.ai');
                    setPassword('Password123!');
                  }}
                  className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200 text-slate-700 hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-700 transition-colors"
                >
                  recruiter@resumelens.ai
                </button>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3 mb-5">
            <div className="h-px bg-slate-200 flex-1" />
            <span className="text-[11px] text-slate-400 uppercase font-bold tracking-wider">Or enter credentials</span>
            <div className="h-px bg-slate-200 flex-1" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={portalMode === 'recruiter' ? 'recruiter@resumelens.ai' : 'student@resumelens.ai'}
                  required
                  className="w-full bg-white border border-slate-300 rounded-xl pl-10 pr-4 py-2.5 text-slate-900 text-sm font-medium placeholder:text-slate-400 focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="w-full bg-white border border-slate-300 rounded-xl pl-10 pr-10 py-2.5 text-slate-900 text-sm font-medium placeholder:text-slate-400 focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || demoLoading}
              className={`w-full py-3.5 mt-2 rounded-xl font-bold text-sm text-white flex items-center justify-center gap-2 transition-all shadow-md active:scale-[0.98] ${
                portalMode === 'recruiter'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-emerald-500/20'
                  : 'bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 shadow-indigo-500/20'
              }`}
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin text-white" />
              ) : (
                <>
                  <span>Sign In as {portalMode === 'recruiter' ? 'Recruiter' : 'Student'}</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-slate-600 text-xs sm:text-sm mt-6 font-medium">
            Don't have an account?{' '}
            <Link
              to="/register"
              className="text-indigo-600 hover:text-indigo-800 font-bold hover:underline transition-colors ml-1"
            >
              Create one free
            </Link>
          </p>
        </div>

        {/* Security Footer Note */}
        <div className="flex items-center justify-center gap-2 mt-6 text-xs text-slate-500 font-medium">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Strict Role Segregation &bull; Student and Recruiter Portals are Isolated</span>
        </div>
      </div>
    </div>
  );
}
