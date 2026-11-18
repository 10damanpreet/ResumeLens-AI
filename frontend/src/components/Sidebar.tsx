import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  ShieldCheck,
  Table,
  Sliders,
  TrendingUp,
  GraduationCap,
  BookOpen,
  FolderGit2,
  Briefcase,
  Search,
  Trophy,
  BookmarkCheck,
  Sparkles,
  Wand2,
  Kanban,
  Settings,
  Cpu,
  LogOut,
  Building2,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  userEmail: string;
  isRecruiter?: boolean;
}

export default function Sidebar({
  collapsed,
  onToggle,
  userEmail,
  isRecruiter = false,
}: SidebarProps) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user_role');
    localStorage.removeItem('user_email');
    localStorage.removeItem('recruiter_access_verified');
    navigate('/login');
  };

  const navItemClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
      isActive
        ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/20'
        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
    }`;

  return (
    <aside
      className={`fixed top-0 left-0 h-screen z-40 bg-white border-r border-slate-200 transition-all duration-300 flex flex-col shadow-sm ${
        collapsed ? '-translate-x-full md:translate-x-0 md:w-20' : 'translate-x-0 w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="h-16 border-b border-slate-100 flex items-center justify-between px-4 flex-shrink-0">
        <div className="flex items-center gap-2.5 overflow-hidden">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-sm shadow-indigo-500/30 flex-shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="font-extrabold text-slate-900 text-sm tracking-tight leading-none">
                Resume<span className="text-indigo-600">Lens</span> AI
              </span>
              <span className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase mt-1">
                Student Platform
              </span>
            </div>
          )}
        </div>

        <button
          onClick={onToggle}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Workspace Active Indicator */}
      {!collapsed && (
        <div className="p-3 mx-3 my-2 rounded-xl bg-slate-50 border border-slate-200/80 text-[11px] flex items-center justify-between">
          <div className="truncate">
            <span className="text-slate-400 block text-[9px] uppercase font-bold tracking-wider">Candidate</span>
            <span className="font-bold text-slate-800 truncate block">{userEmail || 'student@resumelens.ai'}</span>
          </div>
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse flex-shrink-0" />
        </div>
      )}

      {/* Navigation Scrollable Body */}
      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-6 scrollbar-thin">
        {/* ANALYZE */}
        <div>
          {!collapsed && (
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 px-3 block mb-1.5">
              Analyze
            </span>
          )}
          <div className="space-y-1">
            <NavLink to="/" end className={navItemClass} title="Dashboard">
              <LayoutDashboard className="w-4 h-4 text-indigo-500 flex-shrink-0" />
              {!collapsed && <span>Dashboard</span>}
            </NavLink>

            <NavLink to="/ats" className={navItemClass} title="6-Platform ATS Analysis">
              <ShieldCheck className="w-4 h-4 text-emerald-500 flex-shrink-0" />
              {!collapsed && (
                <div className="flex items-center justify-between flex-1">
                  <span>ATS Analysis</span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded-md bg-emerald-100 text-emerald-800 font-extrabold">
                    6 ATS
                  </span>
                </div>
              )}
            </NavLink>

            <NavLink to="/requirements" className={navItemClass} title="Requirements Matrix">
              <Table className="w-4 h-4 text-amber-500 flex-shrink-0" />
              {!collapsed && <span>Requirements</span>}
            </NavLink>

            <NavLink to="/simulator" className={navItemClass} title="What-If Simulator">
              <Sliders className="w-4 h-4 text-violet-500 flex-shrink-0" />
              {!collapsed && (
                <div className="flex items-center justify-between flex-1">
                  <span>What-If Simulator</span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded-md bg-violet-100 text-violet-800 font-extrabold">
                    &plusmn;&Delta;
                  </span>
                </div>
              )}
            </NavLink>
          </div>
        </div>

        {/* DEVELOP */}
        <div>
          {!collapsed && (
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 px-3 block mb-1.5">
              Develop
            </span>
          )}
          <div className="space-y-1">
            <NavLink to="/skill-gaps" className={navItemClass} title="Skill Gaps">
              <TrendingUp className="w-4 h-4 text-rose-500 flex-shrink-0" />
              {!collapsed && <span>Skill Gaps</span>}
            </NavLink>

            <NavLink to="/learning-plan" className={navItemClass} title="Learning Plan & Practice Tests">
              <GraduationCap className="w-4 h-4 text-sky-500 flex-shrink-0" />
              {!collapsed && (
                <div className="flex items-center justify-between flex-1">
                  <span>Learning Plan</span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded-md bg-sky-100 text-sky-800 font-extrabold">
                    LeetCode
                  </span>
                </div>
              )}
            </NavLink>

            <NavLink to="/resources" className={navItemClass} title="Official Docs & Video Masterclasses">
              <BookOpen className="w-4 h-4 text-teal-500 flex-shrink-0" />
              {!collapsed && (
                <div className="flex items-center justify-between flex-1">
                  <span>Resources</span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded-md bg-teal-100 text-teal-800 font-extrabold">
                    Docs & Videos
                  </span>
                </div>
              )}
            </NavLink>

            <NavLink to="/projects" className={navItemClass} title="Portfolio Projects Blueprint">
              <FolderGit2 className="w-4 h-4 text-purple-500 flex-shrink-0" />
              {!collapsed && <span>Projects</span>}
            </NavLink>
          </div>
        </div>

        {/* OPPORTUNITIES */}
        <div>
          {!collapsed && (
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 px-3 block mb-1.5">
              Opportunities
            </span>
          )}
          <div className="space-y-1">
            <NavLink to="/internships" className={navItemClass} title="Internships & Google Queries">
              <Briefcase className="w-4 h-4 text-blue-500 flex-shrink-0" />
              {!collapsed && (
                <div className="flex items-center justify-between flex-1">
                  <span>Internships</span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded-md bg-blue-100 text-blue-800 font-extrabold">
                    Live
                  </span>
                </div>
              )}
            </NavLink>

            <NavLink to="/jobs-feed" className={navItemClass} title="Full-Time Engineering Jobs">
              <Search className="w-4 h-4 text-emerald-500 flex-shrink-0" />
              {!collapsed && <span>Jobs</span>}
            </NavLink>

            <NavLink to="/hackathons" className={navItemClass} title="Upcoming Hackathons (Google, Devpost, MLH)">
              <Trophy className="w-4 h-4 text-amber-500 flex-shrink-0" />
              {!collapsed && (
                <div className="flex items-center justify-between flex-1">
                  <span>Hackathons</span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded-md bg-amber-100 text-amber-800 font-extrabold">
                    Google
                  </span>
                </div>
              )}
            </NavLink>

            <NavLink to="/saved" className={navItemClass} title="Saved Opportunities">
              <BookmarkCheck className="w-4 h-4 text-pink-500 flex-shrink-0" />
              {!collapsed && <span>Saved</span>}
            </NavLink>
          </div>
        </div>

        {/* SUPER TOOLS */}
        <div>
          {!collapsed && (
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 px-3 block mb-1.5">
              Super-Tools
            </span>
          )}
          <div className="space-y-1">
            <NavLink to="/studio" className={navItemClass} title="ATS Clean PDF Revamp Studio">
              <Sparkles className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              {!collapsed && (
                <div className="flex items-center justify-between flex-1">
                  <span>ATS Studio (PDF)</span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded-md bg-emerald-100 text-emerald-800 font-extrabold">
                    1-Click
                  </span>
                </div>
              )}
            </NavLink>

            <NavLink to="/tailor" className={navItemClass} title="Google XYZ Resume Tailor">
              <Wand2 className="w-4 h-4 text-pink-500 flex-shrink-0" />
              {!collapsed && <span>AI Tailor (XYZ)</span>}
            </NavLink>

            <NavLink to="/tracker" className={navItemClass} title="Kanban Job Tracker">
              <Kanban className="w-4 h-4 text-sky-500 flex-shrink-0" />
              {!collapsed && <span>Job Tracker</span>}
            </NavLink>
          </div>
        </div>
      </div>

      {/* Footer Navigation */}
      <div className="p-3 border-t border-slate-100 space-y-1 flex-shrink-0 bg-slate-50/50">
        <NavLink to="/settings" className={navItemClass} title="Settings & Candidate Profile">
          <Settings className="w-4 h-4 text-slate-500 flex-shrink-0" />
          {!collapsed && <span>Settings</span>}
        </NavLink>

        <NavLink to="/methodology" className={navItemClass} title="Method & Model Architecture">
          <Cpu className="w-4 h-4 text-slate-500 flex-shrink-0" />
          {!collapsed && <span>Method & Model</span>}
        </NavLink>

        {isRecruiter && (
          <NavLink
            to="/recruiter"
            className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 transition-colors"
            title="Switch to Recruiter Suite"
          >
            <Building2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            {!collapsed && <span>Recruiter Suite &rarr;</span>}
          </NavLink>
        )}

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors text-left"
          title="Sign Out"
        >
          <LogOut className="w-4 h-4 text-slate-400 flex-shrink-0" />
          {!collapsed && <span>Sign Out</span>}
        </button>
      </div>
    </aside>
  );
}
