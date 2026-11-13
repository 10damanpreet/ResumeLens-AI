import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { Sparkles, LayoutDashboard, LogIn, UserPlus, LogOut, Cpu } from 'lucide-react';
import Dashboard from './pages/Dashboard';
import MatchResults from './pages/MatchResults';
import SkillGaps from './pages/SkillGaps';
import Login from './pages/Login';
import Register from './pages/Register';
import { ToastProvider } from './components/Toast';

function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

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

      {/* Modern Navbar */}
      <nav className="glass sticky top-0 z-50 border-b border-white/10 backdrop-blur-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 sm:h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-violet-600 via-indigo-600 to-purple-700 flex items-center justify-center shadow-lg shadow-violet-600/30 group-hover:shadow-violet-500/60 group-hover:scale-105 transition-all duration-300">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-lg sm:text-xl tracking-tight text-white group-hover:text-violet-200 transition-colors">
                  Resume<span className="text-gradient">Lens</span> AI
                </span>
                <span className="text-[10px] text-white/40 tracking-wider font-medium uppercase -mt-0.5">
                  Career Intelligence Platform
                </span>
              </div>
            </Link>

            {/* AI Engine Status Pill (Hidden on mobile) */}
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full glass border border-white/10 text-xs text-white/70">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <Cpu className="w-3.5 h-3.5 text-violet-400" />
              <span>Gemini 3.6 Flash / Flash Lite & 384-D Vector Engine</span>
            </div>

            {/* Nav links */}
            <div className="flex items-center gap-2 sm:gap-3">
              {token ? (
                <>
                  <Link
                    to="/"
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all ${
                      location.pathname === '/'
                        ? 'bg-white/15 text-white shadow-inner border border-white/10'
                        : 'text-white/70 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-medium text-white/60 hover:text-red-300 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all ${
                      location.pathname === '/login'
                        ? 'bg-white/15 text-white border border-white/10'
                        : 'text-white/70 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <LogIn className="w-4 h-4" />
                    Sign In
                  </Link>
                  <Link to="/register" className="btn-primary py-2 px-4 text-xs sm:text-sm">
                    <UserPlus className="w-4 h-4" />
                    Start Free
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/matches/:matchId" element={<MatchResults />} />
          <Route path="/matches/:matchId/gaps" element={<SkillGaps />} />
        </Routes>
      </main>

      {/* Footer */}
      <footer className="py-8 text-center text-white/40 text-xs border-t border-white/10 mt-16 glass backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-white/70">ResumeLens AI</span>
            <span>&bull;</span>
            <span>UCS503P Software Engineering Project</span>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-white/40">
            <span className="px-2 py-0.5 rounded bg-white/5 border border-white/5">FastAPI</span>
            <span className="px-2 py-0.5 rounded bg-white/5 border border-white/5">React 18</span>
            <span className="px-2 py-0.5 rounded bg-white/5 border border-white/5">all-MiniLM-L6-v2</span>
            <span className="px-2 py-0.5 rounded bg-white/5 border border-white/5">Gemini 3.8</span>
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
