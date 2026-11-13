import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, Mail, Lock, Loader2, ArrowRight, Eye, EyeOff, CheckCircle2, ShieldCheck } from 'lucide-react';
import { api, getErrorMessage } from '../api/client';
import { useToast } from '../components/Toast';

export default function Register() {
  const navigate = useNavigate();
  const { showToast } = useToast();

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
      await api.post('/auth/register', { email, password });
      setSuccess(true);
      showToast('Account created successfully! Logging you in...', 'success');

      // Auto-login
      const loginResp = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', loginResp.data.access_token);
      setTimeout(() => navigate('/'), 1000);
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
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 shadow-xl shadow-violet-500/30 mb-4 animate-float">
            <Sparkles className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Create an Account</h1>
          <p className="text-white/50 text-sm mt-1">Get free career intelligence and gap advisories</p>
        </div>

        {/* Auth Card */}
        <div className="glass-card rounded-3xl p-7 sm:p-8 shadow-2xl border-white/10">
          {success ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mx-auto mb-4 animate-bounce">
                <CheckCircle2 className="w-8 h-8 text-emerald-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Account Ready!</h3>
              <p className="text-white/50 text-sm">Logging you in and redirecting to dashboard...</p>
            </div>
          ) : (
            <>
              {error && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-2xl px-4 py-3 mb-6 text-red-200 text-sm flex items-center gap-2.5 animate-slide-up">
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
                      placeholder="At least 8 characters"
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

                  {strength && (
                    <div className="mt-2.5">
                      <div className="flex justify-between items-center text-[10px] text-white/50 mb-1">
                        <span>Password Strength:</span>
                        <span className="font-semibold text-white/80">{strength.label}</span>
                      </div>
                      <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${strength.color} transition-all duration-300 rounded-full`}
                          style={{ width: strength.width }}
                        />
                      </div>
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
                      placeholder="Repeat your password"
                      required
                      className="input-field pl-10"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full py-3.5 mt-2"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      Create Free Account
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </>
                  )}
                </button>
              </form>

              <p className="text-center text-white/50 text-sm mt-6">
                Already registered?{' '}
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
          <span>Encrypted with SHA-256 bcrypt &bull; Privacy protected</span>
        </div>
      </div>
    </div>
  );
}
