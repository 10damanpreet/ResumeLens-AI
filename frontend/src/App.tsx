import { useEffect, useState } from 'react';
import { Routes, Route, Link, useNavigate, useLocation, Navigate } from 'react-router-dom';
import {
  Sparkles,
  LogOut,
  Cpu,
  Lock,
  GraduationCap,
  Menu,
} from 'lucide-react';
import Dashboard from './pages/Dashboard';
import MatchResults from './pages/MatchResults';
import SkillGaps from './pages/SkillGaps';
import Login from './pages/Login';
import Register from './pages/Register';
import RecruiterPortal from './pages/RecruiterPortal';
import JobTracker from './pages/JobTracker';
import ResumeTailor from './pages/ResumeTailor';
import ResumeStudio from './pages/ResumeStudio';
import Sidebar from './components/Sidebar';
import LearningPlan from './pages/LearningPlan';
import Resources from './pages/Resources';
import ProjectsCatalog from './pages/ProjectsCatalog';
import Opportunities from './pages/Opportunities';
import SettingsPage from './pages/SettingsPage';
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
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-indigo-200 shadow-xl">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-center mx-auto mb-4">
            <GraduationCap className="w-8 h-8 text-indigo-600" />
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-2">
            Access Restricted &bull; Student Account Required
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 mb-2">
            Student Workspace Restricted
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm mb-6 leading-relaxed">
            You are signed in with a <strong className="text-emerald-700">Recruiter Account</strong> ({userEmail}).
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
              className="btn-primary py-3 px-6 text-xs sm:text-sm"
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

  if (userRole !== 'recruiter' && userRole !== 'admin') {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center animate-fade-in">
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-rose-200 shadow-xl">
          <div className="w-16 h-16 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-rose-600" />
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold uppercase tracking-wider mb-2">
            Access Restricted &bull; Recruiter Account Required
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 mb-2">
            Recruiter Portal Restricted
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm mb-6 leading-relaxed">
            You are signed in with a <strong className="text-indigo-600">Student Account</strong> ({userEmail}).
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

function SmartTabRedirect({ tab }: { tab: string }) {
  const recentScansRaw = localStorage.getItem('resumelens_recent_scans');
  let targetMatchId = 'latest';
  try {
    if (recentScansRaw) {
      const parsed = JSON.parse(recentScansRaw);
      if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].id) {
        targetMatchId = parsed[0].id;
      }
    }
  } catch {}
  return <Navigate to={`/matches/${targetMatchId}?tab=${tab}`} replace />;
}

function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));
  const [userRole, setUserRole] = useState<string>(() => localStorage.getItem('user_role') || 'user');
  const [userEmail, setUserEmail] = useState<string>(() => localStorage.getItem('user_email') || '');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

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

  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';
  const isRecruiter = userRole === 'recruiter' || userRole === 'admin';
  const isRecruiterPath = location.pathname.startsWith('/recruiter');
  const showSidebar = !isAuthPage && !isRecruiter && !isRecruiterPath;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      {/* Left Sidebar for Student Workspace */}
      {showSidebar && (
        <Sidebar
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
          userEmail={userEmail}
          isRecruiter={isRecruiter}
        />
      )}

      {/* Main Content Area: dynamically adjusted for Sidebar */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${
          showSidebar ? (sidebarCollapsed ? 'md:pl-20' : 'md:pl-64') : ''
        }`}
      >
        {/* Top Header Navbar */}
        <header className="sticky top-0 z-30 bg-white border-b border-slate-200 shadow-2xs">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              {showSidebar && (
                <button
                  type="button"
                  onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                  className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                  title={sidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
                >
                  <Menu className="w-5 h-5" />
                </button>
              )}

              <Link to={isRecruiter ? '/recruiter' : '/'} className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-600 flex items-center justify-center text-white shadow-sm shadow-indigo-600/30">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div className="flex flex-col">
                  <span className="font-extrabold text-slate-900 text-base tracking-tight leading-none">
                    Resume<span className="text-indigo-600">Lens</span> AI
                  </span>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">
                    {isRecruiter ? 'Recruiter Suite' : 'Student Career Workspace'}
                  </span>
                </div>
              </Link>
            </div>

            {/* Status Pills & Controls */}
            <div className="flex items-center gap-3">
              <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200 text-xs text-slate-600 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <Cpu className="w-3.5 h-3.5 text-indigo-600" />
                <span>Gemini 3.6 Flash / Flash Lite Dual Failover</span>
              </div>

              {token ? (
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-700 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200 hidden sm:inline">
                    {isRecruiter ? 'Recruiter: ' : 'Student: '}
                    {userEmail || 'Active'}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-600 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 transition-colors flex items-center gap-1"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    to="/login"
                    className="px-4 py-2 rounded-xl text-xs font-bold text-indigo-600 hover:bg-indigo-50 border border-indigo-200 transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link to="/register" className="btn-primary py-2 px-4 text-xs">
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Dynamic Route Pages */}
        <main className="flex-1">
          <Routes>
            {/* Public Auth Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Candidate Protected Core Routes */}
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
            <Route
              path="/studio"
              element={
                <CandidateRoute>
                  <ResumeStudio />
                </CandidateRoute>
              }
            />
            <Route
              path="/revamp"
              element={
                <CandidateRoute>
                  <ResumeStudio />
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

            {/* Direct Tab Redirections */}
            <Route path="/ats" element={<CandidateRoute><SmartTabRedirect tab="ats" /></CandidateRoute>} />
            <Route path="/ats-screener" element={<CandidateRoute><SmartTabRedirect tab="ats" /></CandidateRoute>} />
            <Route path="/requirements" element={<CandidateRoute><SmartTabRedirect tab="requirements" /></CandidateRoute>} />
            <Route path="/simulator" element={<CandidateRoute><SmartTabRedirect tab="whatif" /></CandidateRoute>} />
            <Route path="/what-if" element={<CandidateRoute><SmartTabRedirect tab="whatif" /></CandidateRoute>} />
            <Route path="/github-audit" element={<CandidateRoute><SmartTabRedirect tab="github" /></CandidateRoute>} />

            {/* DEVELOP Section Routes */}
            <Route
              path="/skill-gaps"
              element={
                <CandidateRoute>
                  <SkillGaps />
                </CandidateRoute>
              }
            />
            <Route
              path="/skill-gaps/:matchId"
              element={
                <CandidateRoute>
                  <SkillGaps />
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
              path="/learning-plan"
              element={
                <CandidateRoute>
                  <LearningPlan />
                </CandidateRoute>
              }
            />
            <Route
              path="/resources"
              element={
                <CandidateRoute>
                  <Resources />
                </CandidateRoute>
              }
            />
            <Route
              path="/projects"
              element={
                <CandidateRoute>
                  <ProjectsCatalog />
                </CandidateRoute>
              }
            />

            {/* OPPORTUNITIES Section Routes */}
            <Route
              path="/internships"
              element={
                <CandidateRoute>
                  <Opportunities initialTab="internships" />
                </CandidateRoute>
              }
            />
            <Route
              path="/jobs-feed"
              element={
                <CandidateRoute>
                  <Opportunities initialTab="jobs" />
                </CandidateRoute>
              }
            />
            <Route
              path="/hackathons"
              element={
                <CandidateRoute>
                  <Opportunities initialTab="hackathons" />
                </CandidateRoute>
              }
            />
            <Route
              path="/saved"
              element={
                <CandidateRoute>
                  <Opportunities initialTab="saved" />
                </CandidateRoute>
              }
            />

            {/* UTILITIES & SETTINGS */}
            <Route
              path="/settings"
              element={
                <CandidateRoute>
                  <SettingsPage defaultTab="settings" />
                </CandidateRoute>
              }
            />
            <Route
              path="/methodology"
              element={
                <CandidateRoute>
                  <SettingsPage defaultTab="methodology" />
                </CandidateRoute>
              }
            />

            {/* Recruiter Suite */}
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
        <footer className="py-8 text-center text-slate-400 text-xs border-t border-slate-200 mt-16 bg-white">
          <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-700">ResumeLens AI</span>
              <span>&bull;</span>
              <span>UCS503P Software Engineering Platform (3rd Year)</span>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2 text-[11px] text-slate-500">
              <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200">FastAPI Async</span>
              <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200">React 18 + TS</span>
              <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200">all-MiniLM-L6-v2 (384-D)</span>
              <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200">Gemini 3.6 Flash / Flash Lite</span>
              <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200">Thapar Institute (TIET)</span>
            </div>
          </div>
        </footer>
      </div>
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
