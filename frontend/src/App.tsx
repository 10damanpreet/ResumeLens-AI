import React, { useEffect, useState } from 'react';
import { Routes, Route, Link, useNavigate, useLocation, Navigate } from 'react-router-dom';
import {
  Sparkles,
  LayoutDashboard,
  LogIn,
  UserPlus,
  LogOut,
  Cpu,
  Building2,
  Kanban,
  Wand2,
  Lock,
  ShieldCheck,
  GraduationCap,
} from 'lucide-react';
import Dashboard from './pages/Dashboard';
import MatchResults from './pages/MatchResults';
import SkillGaps from './pages/SkillGaps';
import Login from './pages/Login';
import Register from './pages/Register';
import RecruiterPortal from './pages/RecruiterPortal';
import JobTracker from './pages/JobTracker';
import ResumeTailor from './pages/ResumeTailor';
import { ToastProvider } from './components/Toast';
import { api } from './api/client';

function CandidateRoute({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('user_role') || 'user';
  const userEmail = localStorage.getItem('user_email') || 'Recruiter';
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If a recruiter visits candidate routes, strictly block them
  if (userRole === 'recruiter' || userRole === 'admin') {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center animate-fade-in">
        <div className="glass-card rounded-3xl p-8 sm:p-10 border border-violet-500/30 shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-violet-500/20 border border-violet-500/30 flex items-center justify-center mx-auto mb-4">
            <GraduationCap className="w-8 h-8 text-violet-400" />
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-500/15 border border-violet-500/30 text-violet-300 text-xs font-bold uppercase tracking-wider mb-2">
            Access Restricted &bull; Student Account Required
          </div>
          <h2 className="text-2xl font-extrabold text-white mb-2">
            Student Workspace Restricted
          </h2>
          <p className="text-white/60 text-xs sm:text-sm mb-6 leading-relaxed">
            You are signed in with a <strong className="text-emerald-300">Recruiter Account</strong> ({userEmail}).
            Recruiter accounts cannot access personal student career tools.
            Please sign out of your Recruiter account to access the Student Workspace.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => {
                localStorage.removeItem('token');
                localStorage.removeItem('user_role');
                localStorage.removeItem('user_email');
                localStorage.removeItem('recruiter_access_verified');
                window.location.href = '/login';
              }}
              className="btn-primary py-3 px-6 text-xs sm:text-sm bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500"
            >
              Log Out & Sign In as Student
            </button>
            <Link to="/recruiter" className="btn-secondary py-3 px-6 text-xs sm:text-sm">
              &rarr; Return to Recruiter Suite
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

function RecruiterRoute({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('user_role') || 'user';
  const userEmail = localStorage.getItem('user_email') || 'Student';
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If a student tries to visit recruiter route, strictly block them
  if (userRole !== 'recruiter' && userRole !== 'admin') {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center animate-fade-in">
        <div className="glass-card rounded-3xl p-8 sm:p-10 border border-red-500/30 shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-red-500/20 border border-red-500/30 flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-red-400" />
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/15 border border-red-500/30 text-red-300 text-xs font-bold uppercase tracking-wider mb-2">
            Access Restricted &bull; Recruiter Account Required
          </div>
          <h2 className="text-2xl font-extrabold text-white mb-2">
            Recruiter Portal Restricted
          </h2>
          <p className="text-white/60 text-xs sm:text-sm mb-6 leading-relaxed">
            You are signed in with a <strong className="text-violet-300">Student Account</strong> ({userEmail}).
            Candidate accounts cannot view applicant leaderboards or talent screening pipelines.
            Please sign out of your Student account to access the Recruiter Suite.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => {
                localStorage.removeItem('token');
                localStorage.removeItem('user_role');
                localStorage.removeItem('user_email');
                localStorage.removeItem('recruiter_access_verified');
                window.location.href = '/login';
              }}
              className="btn-primary py-3 px-6 text-xs sm:text-sm bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500"
            >
              Log Out & Sign In as Recruiter
            </button>
            <Link to="/" className="btn-secondary py-3 px-6 text-xs sm:text-sm">
              &larr; Return to Student Workspace
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));
  const [userRole, setUserRole] = useState<string>(() => localStorage.getItem('user_role') || 'user');
  const [userEmail, setUserEmail] = useState<string>(() => localStorage.getItem('user_email') || '');

  // Validate session on route change & prune expired/stale tokens
  useEffect(() => {
    const curToken = localStorage.getItem('token');
    setToken(curToken);
    setUserRole(localStorage.getItem('user_role') || 'user');
    setUserEmail(localStorage.getItem('user_email') || '');

    if (curToken) {
      api
        .get('/auth/me')
        .then((res) => {
          setUserRole(res.data.role);
          setUserEmail(res.data.email);
          localStorage.setItem('user_role', res.data.role);
          localStorage.setItem('user_email', res.data.email);
        })
        .catch(() => {
          // Token is expired, invalid, or rejected by backend: clear session and ask for login
          localStorage.removeItem('token');
          localStorage.removeItem('user_role');
          localStorage.removeItem('user_email');
          localStorage.removeItem('recruiter_access_verified');
          setToken(null);
          if (location.pathname !== '/login' && location.pathname !== '/register') {
            navigate('/login');
          }
        });
    } else {
      // Unauthenticated visitor: redirect directly to /login
      if (location.pathname !== '/login' && location.pathname !== '/register') {
        navigate('/login');
      }
    }
  }, [location.pathname, navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user_role');
    localStorage.removeItem('user_email');
    localStorage.removeItem('recruiter_access_verified');
    setToken(null);
    navigate('/login');
  };

  const isRecruiter = userRole === 'recruiter' || userRole === 'admin';

  return (
    <div className="min-h-screen flex flex-col relative selection:bg-violet-500/30 selection:text-violet-200">
      {/* Dynamic ambient background orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-violet-600/15 rounded-full blur-[100px] animate-pulse-slow" />
        <div
          className="absolute top-1/3 -right-32 w-[30rem] h-[30rem] bg-indigo-600/10 rounded-full blur-[120px] animate-pulse-slow"
          style={{ animationDelay: '2s' }}
        />
        <div
          className="absolute -bottom-32 left-1/3 w-[28rem] h-[28rem] bg-sky-500/10 rounded-full blur-[120px] animate-pulse-slow"
          style={{ animationDelay: '3.5s' }}
        />
        <div className="absolute inset-0 glow-mesh-overlay opacity-30" />
      </div>

      {/* Role-Segregated Navbar */}
      <nav className="glass sticky top-0 z-50 border-b border-white/10 backdrop-blur-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 sm:h-20 gap-4">
            {/* Logo */}
            <Link to={isRecruiter ? '/recruiter' : '/'} className="flex items-center gap-3 group flex-shrink-0">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-violet-600 via-indigo-600 to-purple-700 flex items-center justify-center shadow-lg shadow-violet-600/30 group-hover:shadow-violet-500/60 group-hover:scale-105 transition-all duration-300">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-lg sm:text-xl tracking-tight text-white group-hover:text-violet-200 transition-colors">
                  Resume<span className="text-gradient">Lens</span> AI
                </span>
                <span className="text-[10px] text-white/40 tracking-wider font-medium uppercase -mt-0.5">
                  {isRecruiter ? 'Recruiter Talent Suite' : 'Student Career Platform'}
                </span>
              </div>
            </Link>

            {/* Navigation Links STRICTLY segregated by role */}
            {token && (
              <div className="hidden md:flex items-center gap-1 p-1 rounded-2xl glass border border-white/10 shadow-inner">
                {isRecruiter ? (
                  /* Recruiter ONLY links */
                  <Link
                    to="/recruiter"
                    className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      location.pathname === '/recruiter'
                        ? 'bg-gradient-to-r from-emerald-500/30 to-teal-500/30 text-emerald-300 border border-emerald-500/40 shadow'
                        : 'text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10'
                    }`}
                  >
                    <Building2 className="w-3.5 h-3.5 text-emerald-400" />
                    Recruiter Talent Suite
                    <span className="text-[9px] uppercase px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 font-extrabold border border-emerald-500/30">
                      ACTIVE
                    </span>
                  </Link>
                ) : (
                  /* Student ONLY links */
                  <>
                    <Link
                      to="/"
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                        location.pathname === '/'
                          ? 'bg-violet-600/40 text-white shadow-md border border-violet-500/30'
                          : 'text-white/60 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <LayoutDashboard className="w-3.5 h-3.5 text-violet-400" />
                      Candidate Hub
                    </Link>

                    <Link
                      to="/tailor"
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                        location.pathname.startsWith('/tailor')
                          ? 'bg-violet-600/40 text-white shadow-md border border-violet-500/30'
                          : 'text-white/60 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <Wand2 className="w-3.5 h-3.5 text-pink-400" />
                      AI Tailor
                    </Link>

                    <Link
                      to="/tracker"
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                        location.pathname === '/tracker'
                          ? 'bg-violet-600/40 text-white shadow-md border border-violet-500/30'
                          : 'text-white/60 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <Kanban className="w-3.5 h-3.5 text-sky-400" />
                      Job Tracker
                    </Link>
                  </>
                )}
              </div>
            )}

            {/* AI Engine Status Pill & Auth Controls */}
            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
              <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-full glass border border-white/10 text-xs text-white/70">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <Cpu className="w-3.5 h-3.5 text-violet-400" />
                <span>Gemini 3.6 Flash / Flash Lite Dual Failover</span>
              </div>

              {token ? (
                <div className="flex items-center gap-2">
                  <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-xl glass border border-white/10 text-xs text-white/70">
                    {isRecruiter ? (
                      <>
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-300 font-bold">
                          Recruiter: {userEmail || 'Active'}
                        </span>
                      </>
                    ) : (
                      <>
                        <GraduationCap className="w-3.5 h-3.5 text-violet-400" />
                        <span className="text-violet-300 font-medium">
                          Student: {userEmail || 'Active'}
                        </span>
                      </>
                    )}
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium text-white/60 hover:text-red-300 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    to="/login"
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all ${
                      location.pathname === '/login'
                        ? 'bg-white/15 text-white border border-white/10'
                        : 'text-white/70 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <LogIn className="w-4 h-4" />
                    <span>Sign In</span>
                  </Link>
                  <Link to="/register" className="btn-primary py-2 px-4 text-xs sm:text-sm">
                    <UserPlus className="w-4 h-4" />
                    <span>Register</span>
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Secondary Subnav (Role-segregated) */}
          {token && (
            <div className="flex md:hidden items-center justify-around py-2.5 border-t border-white/5 text-xs">
              {isRecruiter ? (
                <Link
                  to="/recruiter"
                  className="flex items-center gap-1 py-1 px-3 rounded-lg text-emerald-300 font-bold bg-emerald-500/15"
                >
                  <Building2 className="w-3.5 h-3.5" />
                  Recruiter Suite
                </Link>
              ) : (
                <>
                  <Link
                    to="/"
                    className={`flex items-center gap-1 py-1 px-2 rounded-lg ${
                      location.pathname === '/' ? 'text-violet-300 font-bold bg-violet-500/10' : 'text-white/60'
                    }`}
                  >
                    <LayoutDashboard className="w-3.5 h-3.5" />
                    Candidate
                  </Link>
                  <Link
                    to="/tailor"
                    className={`flex items-center gap-1 py-1 px-2 rounded-lg ${
                      location.pathname.startsWith('/tailor') ? 'text-pink-300 font-bold bg-pink-500/10' : 'text-white/60'
                    }`}
                  >
                    <Wand2 className="w-3.5 h-3.5" />
                    Tailor
                  </Link>
                  <Link
                    to="/tracker"
                    className={`flex items-center gap-1 py-1 px-2 rounded-lg ${
                      location.pathname === '/tracker' ? 'text-sky-300 font-bold bg-sky-500/10' : 'text-white/60'
                    }`}
                  >
                    <Kanban className="w-3.5 h-3.5" />
                    Tracker
                  </Link>
                </>
              )}
            </div>
          )}
        </div>
      </nav>

      {/* Main Content with Strictly Segregated Routes */}
      <main className="flex-1">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Student / Candidate Routes */}
          <Route
            path="/"
            element={
              <CandidateRoute>
                <Dashboard />
              </CandidateRoute>
            }
          />
          <Route
            path="/matches/:matchId"
            element={
              <CandidateRoute>
                <MatchResults />
              </CandidateRoute>
            }
          />
          <Route
            path="/matches/:matchId/gaps"
            element={
              <CandidateRoute>
                <SkillGaps />
              </CandidateRoute>
            }
          />
          <Route
            path="/tracker"
            element={
              <CandidateRoute>
                <JobTracker />
              </CandidateRoute>
            }
          />
          <Route
            path="/tailor"
            element={
              <CandidateRoute>
                <ResumeTailor />
              </CandidateRoute>
            }
          />
          <Route
            path="/tailor/:matchId"
            element={
              <CandidateRoute>
                <ResumeTailor />
              </CandidateRoute>
            }
          />

          {/* Recruiter ONLY Route */}
          <Route
            path="/recruiter"
            element={
              <RecruiterRoute>
                <RecruiterPortal />
              </RecruiterRoute>
            }
          />
        </Routes>
      </main>

      {/* Footer */}
      <footer className="py-8 text-center text-white/40 text-xs border-t border-white/10 mt-16 glass backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-white/70">ResumeLens AI</span>
            <span>&bull;</span>
            <span>UCS503P Capstone Software Engineering Platform</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 text-[11px] text-white/40">
            <span className="px-2 py-0.5 rounded bg-white/5 border border-white/5">FastAPI Async</span>
            <span className="px-2 py-0.5 rounded bg-white/5 border border-white/5">React 18 + TS</span>
            <span className="px-2 py-0.5 rounded bg-white/5 border border-white/5">all-MiniLM-L6-v2 (384-D)</span>
            <span className="px-2 py-0.5 rounded bg-white/5 border border-white/5">Gemini 3.6 Flash / Flash Lite</span>
            <span className="px-2 py-0.5 rounded bg-white/5 border border-white/5">Role-Based Access Control</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <AppContent />
    </ToastProvider>
  );
}
