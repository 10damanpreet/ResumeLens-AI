import { Routes, Route, Link } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import MatchResults from './pages/MatchResults';
import SkillGaps from './pages/SkillGaps';
import { Briefcase } from 'lucide-react';

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <Link to="/" className="flex-shrink-0 flex items-center gap-2 text-indigo-600 font-bold text-xl">
                <Briefcase className="h-6 w-6" />
                ResumeMatcher AI
              </Link>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <Link to="/" className="border-indigo-500 text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                  Dashboard
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-1 max-w-7xl w-full mx-auto py-6 sm:px-6 lg:px-8">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/matches/:matchId" element={<MatchResults />} />
          <Route path="/matches/:matchId/gaps" element={<SkillGaps />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
