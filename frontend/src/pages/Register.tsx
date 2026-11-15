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
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-600 via-indigo-600 to-purple-700 shadow-xl shadow-violet-500/30 mb-3 animate-float">
            <Sparkles className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Create an Account</h1>
          <p className="text-white/50 text-xs sm:text-sm mt-1">Select your account persona and enter details</p>
        </div>

        {/* Auth Card */}
        <div className="glass-card rounded-3xl p-6 sm:p-8 shadow-2xl border-white/10">
          {success ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mx-auto mb-4 animate-bounce">
                <CheckCircle2 className="w-8 h-8 text-emerald-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Account Ready!</h3>
              <p className="text-white/50 text-sm">Logging you in and preparing your workspace...</p>
            </div>
          ) : (
            <>
              {/* Account Role Selector */}
              <div className="grid grid-cols-2 gap-2 p-1 bg-white/5 rounded-2xl mb-6 border border-white/10">
                <button
                  type="button"
                  onClick={() => setRole('user')}
                  className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                    role === 'user'
                      ? 'bg-violet-600 text-white shadow-md'
                      : 'text-white/60 hover:text-white'
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
                      ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md'
                      : 'text-white/60 hover:text-white'
                  }`}
                >
                  <Building2 className="w-3.5 h-3.5" />
                  Recruiter Account
                </button>
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-2xl px-4 py-3 mb-6 text-red-200 text-xs sm:text-sm flex items-center gap-2.5 animate-slide-up">
                  <span className="w-2 h-2 rounded-full bg-red-400 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

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
                      placeholder={role === 'recruiter' ? 'recruiter@enterprise.com' : 'student@university.edu'}
                      required
                      className="input-field pl-10"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-white/70 uppercase tracking-wider mb-2">
                    Password (min. 8 characters)
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Create a strong password"
                      required
                      minLength={8}
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

                  {strength && (
                    <div className="mt-2 space-y-1">
                      <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${strength.color} transition-all duration-300`}
                          style={{ width: strength.width }}
                        />
                      </div>
                      <p className="text-[10px] text-white/40">
                        Strength:{' '}
                        <span className="font-semibold text-white/70">{strength.label}</span>
                      </p>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-white/70 uppercase tracking-wider mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Repeat password"
                      required
                      className="input-field pl-10"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-3.5 mt-2 rounded-xl font-bold text-sm text-white flex items-center justify-center gap-2 transition-all shadow-xl ${
                    role === 'recruiter'
                      ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500'
                      : 'btn-primary'
                  }`}
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <span>Register as {role === 'recruiter' ? 'Recruiter' : 'Candidate'}</span>
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </>
                  )}
                </button>
              </form>

              <p className="text-center text-white/50 text-xs sm:text-sm mt-6">
                Already have an account?{' '}
                <Link
                  to="/login"
                  className="text-violet-400 hover:text-violet-300 font-semibold transition-colors"
                >
                  Sign in
                </Link>
              </p>
            </>
          )}
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
