import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { Sparkles, LayoutDashboard, LogIn, UserPlus, LogOut } from 'lucide-react';
import Dashboard from './pages/Dashboard';
import MatchResults from './pages/MatchResults';
import SkillGaps from './pages/SkillGaps';
import Login from './pages/Login';
import Register from './pages/Register';

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <nav className="glass sticky top-0 z-50 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/30 group-hover:shadow-violet-500/50 transition-shadow">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-lg text-gradient">ResumeMatcher AI</span>
            </Link>

            {/* Nav links */}
            <div className="flex items-center gap-2">
              {token ? (
                <>
                  <Link
                    to="/"
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      location.pathname === '/' ? 'bg-white/10 text-white' : 'text-white/60 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-white/60 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      location.pathname === '/login' ? 'bg-white/10 text-white' : 'text-white/60 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <LogIn className="w-4 h-4" />
                    Login
                  </Link>
                  <Link to="/register" className="btn-primary py-1.5 px-4 text-sm">
                    <UserPlus className="w-4 h-4" />
                    Sign Up Free
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
      <footer className="py-6 text-center text-white/30 text-xs border-t border-white/5">
        <p>ResumeMatcher AI &mdash; Intelligent Career Intelligence Platform</p>
      </footer>
    </div>
  );
}

export default App;
