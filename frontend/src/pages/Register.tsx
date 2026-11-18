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
  CheckCircle2,
  ShieldCheck,
  Building2,
  User,
} from 'lucide-react';
import { api, getErrorMessage } from '../api/client';
import { useToast } from '../components/Toast';

export default function Register() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [role, setRole] = useState<'user' | 'recruiter'>('user');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      showToast('Passwords do not match', 'error');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      showToast('Password must be at least 8 characters', 'error');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await api.post('/auth/register', { email, password, role });
      setSuccess(true);
      showToast('Account created successfully! Logging you in...', 'success');

      // Auto-login
      const portal = role === 'recruiter' ? 'recruiter' : 'candidate';
      const loginResp = await api.post('/auth/login', { email, password, portal });
      const { access_token } = loginResp.data;

      localStorage.setItem('token', access_token);
      localStorage.setItem('user_role', role);

      if (role === 'recruiter') {
        localStorage.setItem('recruiter_access_verified', 'true');
        setTimeout(() => navigate('/recruiter'), 1000);
      } else {
        localStorage.removeItem('recruiter_access_verified');
        setTimeout(() => navigate('/'), 1000);
      }
    } catch (err: any) {
      const msg = getErrorMessage(err);
      setError(msg);
      showToast(msg, 'error');
      setLoading(false);
    }
  };

  const getStrength = () => {
    if (password.length === 0) return null;
    if (password.length < 6) return { label: 'Weak', color: 'bg-red-500', width: '25%' };
    if (password.length < 10) return { label: 'Moderate', color: 'bg-amber-500', width: '50%' };
    if (password.length < 14) return { label: 'Good', color: 'bg-sky-500', width: '75%' };
    return { label: 'Strong', color: 'bg-emerald-500', width: '100%' };
  };

  const strength = getStrength();

  return (
    <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center px-4 py-10 sm:py-16">
      <div className="w-full max-w-md relative">
        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 shadow-xl shadow-indigo-500/25 mb-3 animate-float">
            <Sparkles className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Create an Account</h1>
          <p className="text-slate-600 text-xs sm:text-sm mt-1 font-medium">Select your account persona and enter details</p>
        </div>

        {/* Auth Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200/90">
          {success ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto mb-4 animate-bounce">
                <CheckCircle2 className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-2">Account Ready!</h3>
              <p className="text-slate-600 text-sm">Logging you in and preparing your workspace...</p>
            </div>
          ) : (
            <>
              {/* Account Role Selector */}
              <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-2xl mb-6 border border-slate-200">
                <button
                  type="button"
                  onClick={() => setRole('user')}
                  className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                    role === 'user'
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                  }`}
                >
                  <User className="w-3.5 h-3.5" />
                  Candidate Account
                </button>
                <button
                  type="button"
                  onClick={() => setRole('recruiter')}
                  className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                    role === 'recruiter'
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                  }`}
                >
                  <Building2 className="w-3.5 h-3.5" />
                  Recruiter Account
                </button>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-2xl px-4 py-3 mb-6 text-red-700 text-xs sm:text-sm flex items-center gap-2.5 animate-slide-up">
                  <span className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0" />
                  <span className="font-medium">{error}</span>
                </div>
              )}

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
                      placeholder={role === 'recruiter' ? 'recruiter@enterprise.com' : 'student@university.edu'}
                      required
                      className="w-full bg-white border border-slate-300 rounded-xl pl-10 pr-4 py-2.5 text-slate-900 text-sm font-medium placeholder:text-slate-400 focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Password (min. 8 characters)
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Create a strong password"
                      required
                      minLength={8}
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

                  {strength && (
                    <div className="mt-2 space-y-1">
                      <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${strength.color} transition-all duration-300`}
                          style={{ width: strength.width }}
                        />
                      </div>
                      <p className="text-[11px] text-slate-500 font-medium">
                        Strength:{' '}
                        <span className="font-bold text-slate-800">{strength.label}</span>
                      </p>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Repeat password"
                      required
                      className="w-full bg-white border border-slate-300 rounded-xl pl-10 pr-4 py-2.5 text-slate-900 text-sm font-medium placeholder:text-slate-400 focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 transition-all"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-3.5 mt-2 rounded-xl font-bold text-sm text-white flex items-center justify-center gap-2 transition-all shadow-md active:scale-[0.98] ${
                    role === 'recruiter'
                      ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-emerald-500/20'
                      : 'bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 shadow-indigo-500/20'
                  }`}
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                  ) : (
                    <>
                      <span>Register as {role === 'recruiter' ? 'Recruiter' : 'Candidate'}</span>
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </>
                  )}
                </button>
              </form>

              <p className="text-center text-slate-600 text-xs sm:text-sm mt-6 font-medium">
                Already have an account?{' '}
                <Link
                  to="/login"
                  className="text-indigo-600 hover:text-indigo-800 font-bold hover:underline transition-colors ml-1"
                >
                  Sign in
                </Link>
              </p>
            </>
          )}
        </div>

        {/* Security Footer Note */}
        <div className="flex items-center justify-center gap-2 mt-6 text-xs text-slate-500 font-medium">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Bcrypt password hashing &bull; Stateless JWT authentication</span>
        </div>
      </div>
    </div>
  );
}
