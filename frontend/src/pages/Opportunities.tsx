import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Briefcase,
  Search,
  Trophy,
  BookmarkCheck,
  ExternalLink,
  MapPin,
  Calendar,
  DollarSign,
  Bookmark,
  Globe,
} from 'lucide-react';
import { useToast } from '../components/Toast';

interface OpportunityItem {
  id: string;
  title: string;
  company: string;
  location: string;
  type: 'Internship' | 'Full-Time' | 'Hackathon';
  stipendOrSalary: string;
  deadlineOrDate: string;
  url: string;
  tags: string[];
}

const SAMPLE_INTERNSHIPS: OpportunityItem[] = [
  {
    id: 'int-1',
    title: 'Software Engineering Intern — Summer 2026',
    company: 'Google',
    location: 'Bangalore / Hyderabad / Hybrid',
    type: 'Internship',
    stipendOrSalary: '₹1,25,000 / month',
    deadlineOrDate: 'Open Now • Rolling Basis',
    url: 'https://careers.google.com/jobs/results/?q=Software%20Engineering%20Intern',
    tags: ['Python', 'C++', 'Data Structures', 'Distributed Systems'],
  },
  {
    id: 'int-2',
    title: 'Software Development Engineer Intern',
    company: 'Microsoft',
    location: 'Noida / Hyderabad / Remote',
    type: 'Internship',
    stipendOrSalary: '₹1,20,000 / month',
    deadlineOrDate: 'Applications Open',
    url: 'https://careers.microsoft.com/professionals/us/en/search-results?keywords=intern',
    tags: ['Algorithms', 'Azure', 'C# / TypeScript', 'FastAPI'],
  },
  {
    id: 'int-3',
    title: 'SDE Intern — Cloud Architecture & APIs',
    company: 'Amazon Web Services',
    location: 'Bangalore, India',
    type: 'Internship',
    stipendOrSalary: '₹1,10,000 / month',
    deadlineOrDate: 'Summer Cohort',
    url: 'https://www.amazon.jobs/en/search?base_query=Software+Development+Engineer+Intern',
    tags: ['AWS', 'Distributed Systems', 'Python', 'Docker'],
  },
  {
    id: 'int-4',
    title: 'Frontend Engineering Intern',
    company: 'Atlassian',
    location: 'Remote (India)',
    type: 'Internship',
    stipendOrSalary: '₹95,000 / month',
    deadlineOrDate: 'Q2 Intake',
    url: 'https://www.atlassian.com/company/careers/students',
    tags: ['React 18', 'TypeScript', 'Tailwind CSS', 'Redux'],
  },
];

const SAMPLE_JOBS: OpportunityItem[] = [
  {
    id: 'job-1',
    title: 'Software Development Engineer I (Graduate)',
    company: 'Amazon',
    location: 'Bangalore / Hyderabad',
    type: 'Full-Time',
    stipendOrSalary: '₹22,00,000 – ₹32,00,000 / yr',
    deadlineOrDate: 'Immediate Hiring',
    url: 'https://www.amazon.jobs/en/search?base_query=Software+Development+Engineer+I',
    tags: ['Java / Python', 'System Design', 'Microservices'],
  },
  {
    id: 'job-2',
    title: 'Backend Systems Engineer',
    company: 'Stripe',
    location: 'Remote (Worldwide)',
    type: 'Full-Time',
    stipendOrSalary: '₹28,00,000 – ₹42,00,000 / yr',
    deadlineOrDate: 'Continuous Screening',
    url: 'https://stripe.com/jobs/search?q=engineer',
    tags: ['PostgreSQL', 'FastAPI / Go', 'Redis', 'Kafka'],
  },
  {
    id: 'job-3',
    title: 'AI & Machine Learning Engineer',
    company: 'Anthropic Labs (Partner)',
    location: 'San Francisco, CA / Remote',
    type: 'Full-Time',
    stipendOrSalary: '$160,000 – $220,000 / yr',
    deadlineOrDate: 'Actively Interviewing',
    url: 'https://www.google.com/search?q=Anthropic+AI+Engineer+jobs',
    tags: ['Vector Search', 'RAG Pipelines', 'Transformers', 'PyTorch'],
  },
];

const SAMPLE_HACKATHONS: OpportunityItem[] = [
  {
    id: 'hack-1',
    title: 'Google Solution Challenge 2026',
    company: 'Google Developer Student Clubs (GDSC)',
    location: 'Global Online',
    type: 'Hackathon',
    stipendOrSalary: '$12,000 in Prizes & Mentorship',
    deadlineOrDate: 'Registration Open for 2026',
    url: 'https://developers.google.com/community/gdsc-solution-challenge',
    tags: ['Google Cloud', 'Flutter', 'TensorFlow', 'Gemini AI'],
  },
  {
    id: 'hack-2',
    title: 'MLH Global Hack Week — Generative AI & Cloud',
    company: 'Major League Hacking (MLH)',
    location: 'Virtual Worldwide',
    type: 'Hackathon',
    stipendOrSalary: 'Swag Packs & Tech Grants',
    deadlineOrDate: 'Upcoming This Month',
    url: 'https://globalhackweek.mlh.io/',
    tags: ['Open Source', 'FastAPI', 'Docker', 'React'],
  },
  {
    id: 'hack-3',
    title: 'Devpost AI & Cloud Innovation Hackathon',
    company: 'Devpost & Industry Sponsors',
    location: 'Online',
    type: 'Hackathon',
    stipendOrSalary: '$50,000 Global Prize Pool',
    deadlineOrDate: 'Submissions Close Soon',
    url: 'https://devpost.com/hackathons',
    tags: ['AI Agents', 'Full Stack', 'Web3 / APIs'],
  },
  {
    id: 'hack-4',
    title: 'Unstop National Tech Challenge',
    company: 'Unstop (Formerly Dare2Compete)',
    location: 'India / Virtual',
    type: 'Hackathon',
    stipendOrSalary: '₹5,00,000 + Pre-Placement Interviews',
    deadlineOrDate: 'College Student Eligible',
    url: 'https://unstop.com/hackathons',
    tags: ['DSA', 'Competitive Coding', 'Hackathon'],
  },
];

export default function Opportunities({ initialTab = 'internships' }: { initialTab?: 'internships' | 'jobs' | 'hackathons' | 'saved' }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const getTabFromPath = (): 'internships' | 'jobs' | 'hackathons' | 'saved' => {
    if (location.pathname === '/hackathons') return 'hackathons';
    if (location.pathname === '/saved') return 'saved';
    if (location.pathname === '/jobs-feed' || location.pathname === '/jobs') return 'jobs';
    if (location.pathname === '/internships') return 'internships';
    return initialTab;
  };

  const [tab, setTab] = useState<'internships' | 'jobs' | 'hackathons' | 'saved'>(getTabFromPath());

  useEffect(() => {
    setTab(getTabFromPath());
  }, [location.pathname, initialTab]);

  const handleTabChange = (newTab: 'internships' | 'jobs' | 'hackathons' | 'saved') => {
    setTab(newTab);
    const pathMap: Record<string, string> = {
      internships: '/internships',
      jobs: '/jobs-feed',
      hackathons: '/hackathons',
      saved: '/saved',
    };
    if (pathMap[newTab] && location.pathname !== pathMap[newTab]) {
      navigate(pathMap[newTab]);
    }
  };

  const [savedItems, setSavedItems] = useState<OpportunityItem[]>(() => {
    try {
      const stored = localStorage.getItem('resumelens_saved_opportunities');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const isSaved = (id: string) => savedItems.some((s) => s.id === id);

  const toggleSave = (item: OpportunityItem) => {
    let updated: OpportunityItem[];
    if (isSaved(item.id)) {
      updated = savedItems.filter((s) => s.id !== item.id);
      showToast('Removed from Saved Opportunities', 'info');
    } else {
      updated = [item, ...savedItems];
      showToast('Saved to your Bookmarked Opportunities!', 'success');
    }
    setSavedItems(updated);
    localStorage.setItem('resumelens_saved_opportunities', JSON.stringify(updated));
  };

  // Google Search query generator
  const triggerGoogleInternshipSearch = () => {
    const query = encodeURIComponent('Software Engineering Internship 2026 site:linkedin.com/jobs OR site:boards.greenhouse.io OR site:jobs.lever.co');
    window.open(`https://www.google.com/search?q=${query}`, '_blank');
  };

  const triggerGoogleJobSearch = () => {
    const query = encodeURIComponent('Entry Level Software Engineer SDE 1 2026 site:linkedin.com/jobs OR site:jobs.lever.co');
    window.open(`https://www.google.com/search?q=${query}`, '_blank');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 sm:py-12 space-y-8 animate-fade-in text-slate-800">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-100">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold uppercase tracking-wider mb-2">
              <Briefcase className="w-3.5 h-3.5 text-blue-600" />
              Opportunities & Student Career Portal
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Internships, Full-Time Jobs & Global Hackathons
            </h1>
            <p className="text-slate-500 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed font-medium">
              Discover active student internships, full-time engineering openings, and upcoming Google & Devpost hackathons, with instant 1-click Google Search and ATS bookmarking.
            </p>
          </div>

          {/* Quick Google Search Launcher Buttons */}
          <div className="flex flex-wrap gap-2 flex-shrink-0">
            <button
              type="button"
              onClick={triggerGoogleInternshipSearch}
              className="px-4 py-2.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1.5 shadow-sm transition-all"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Live Google Search: 2026 Internships</span>
              <ExternalLink className="w-3 h-3 text-blue-200" />
            </button>
            <button
              type="button"
              onClick={triggerGoogleJobSearch}
              className="px-4 py-2.5 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white flex items-center gap-1.5 shadow-sm transition-all"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Google Jobs: SDE-1</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 pt-6 overflow-x-auto scrollbar-none">
          <button
            type="button"
            onClick={() => handleTabChange('internships')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              tab === 'internships'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>Internships ({SAMPLE_INTERNSHIPS.length})</span>
          </button>

          <button
            type="button"
            onClick={() => handleTabChange('jobs')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              tab === 'jobs'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
            }`}
          >
            <Search className="w-3.5 h-3.5" />
            <span>Jobs ({SAMPLE_JOBS.length})</span>
          </button>

          <button
            type="button"
            onClick={() => handleTabChange('hackathons')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              tab === 'hackathons'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
            }`}
          >
            <Trophy className="w-3.5 h-3.5" />
            <span>Hackathons ({SAMPLE_HACKATHONS.length})</span>
          </button>

          <button
            type="button"
            onClick={() => handleTabChange('saved')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              tab === 'saved'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
            }`}
          >
            <BookmarkCheck className="w-3.5 h-3.5" />
            <span>Saved ({savedItems.length})</span>
          </button>
        </div>
      </div>

      {/* Tab Panels */}
      {tab === 'internships' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {SAMPLE_INTERNSHIPS.map((item) => (
            <OpportunityCard key={item.id} item={item} isSaved={isSaved(item.id)} onToggleSave={() => toggleSave(item)} />
          ))}
        </div>
      )}

      {tab === 'jobs' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {SAMPLE_JOBS.map((item) => (
            <OpportunityCard key={item.id} item={item} isSaved={isSaved(item.id)} onToggleSave={() => toggleSave(item)} />
          ))}
        </div>
      )}

      {tab === 'hackathons' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {SAMPLE_HACKATHONS.map((item) => (
            <OpportunityCard key={item.id} item={item} isSaved={isSaved(item.id)} onToggleSave={() => toggleSave(item)} />
          ))}
        </div>
      )}

      {tab === 'saved' && (
        <div>
          {savedItems.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm max-w-md mx-auto">
              <Bookmark className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-900 mb-1">No Saved Opportunities Yet</h3>
              <p className="text-xs text-slate-500 mb-6 font-medium">
                Click the bookmark icon on any internship, job, or hackathon card to save it for quick reference.
              </p>
              <button
                type="button"
                onClick={() => handleTabChange('internships')}
                className="btn-primary py-2 px-4 text-xs font-bold shadow-md shadow-violet-200"
              >
                Browse Internships
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {savedItems.map((item) => (
                <OpportunityCard key={item.id} item={item} isSaved={true} onToggleSave={() => toggleSave(item)} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function OpportunityCard({
  item,
  isSaved,
  onToggleSave,
}: {
  item: OpportunityItem;
  isSaved: boolean;
  onToggleSave: () => void;
}) {
  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200 hover:border-indigo-400 hover:shadow-md transition-all flex flex-col justify-between shadow-xs">
      <div>
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={`text-[10px] uppercase font-black tracking-wider px-2.5 py-0.5 rounded-full border ${
                item.type === 'Internship'
                  ? 'bg-blue-50 text-blue-800 border-blue-200'
                  : item.type === 'Hackathon'
                  ? 'bg-amber-50 text-amber-800 border-amber-200'
                  : 'bg-emerald-50 text-emerald-800 border-emerald-200'
              }`}
            >
              {item.type}
            </span>
            <span className="text-xs font-extrabold text-slate-900">{item.company}</span>
          </div>

          <button
            type="button"
            onClick={onToggleSave}
            className={`p-1.5 rounded-xl border transition-colors ${
              isSaved
                ? 'bg-purple-50 text-purple-600 border-purple-200'
                : 'text-slate-400 hover:text-slate-700 hover:bg-slate-50 border-slate-200'
            }`}
            title={isSaved ? 'Remove from Saved' : 'Bookmark Opportunity'}
          >
            {isSaved ? <BookmarkCheck className="w-4 h-4 fill-purple-600" /> : <Bookmark className="w-4 h-4" />}
          </button>
        </div>

        <h3 className="text-base font-bold text-slate-900 mb-2 leading-snug">{item.title}</h3>

        <div className="space-y-1.5 text-xs text-slate-500 mb-4 font-medium">
          <div className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
            <span className="truncate">{item.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <DollarSign className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
            <span className="font-bold text-slate-800">{item.stipendOrSalary}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
            <span>{item.deadlineOrDate}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5 mb-6">
          {item.tags.map((tag) => (
            <span key={tag} className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-semibold border border-slate-200">
              {tag}
            </span>
          ))}
        </div>
      </div>

      <a
        href={item.url}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white flex items-center justify-center gap-1.5 shadow-sm transition-all"
      >
        <span>Apply on Official Portal</span>
        <ExternalLink className="w-3 h-3 text-slate-400" />
      </a>
    </div>
  );
}
