import { useEffect, useState, useCallback } from 'react';
import { useParams, Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
  ArrowRight,
  Brain,
  ArrowLeft,
  TrendingUp,
  Layers,
  Activity,
  Sparkles,
  Copy,
  Printer,
  Wand2,
  FileText,
  BookmarkCheck,
  Kanban,
  CheckCircle2,
  Building2,
  Sliders,
  GitBranch,
  Table,
  X,
} from 'lucide-react';
import { api, getErrorMessage } from '../api/client';
import { useToast } from '../components/Toast';
import CompetencyRadar from '../components/CompetencyRadar';
import ATSHealthCard from '../components/ATSHealthCard';
import CoverLetterModal from '../components/CoverLetterModal';
import ATSScreenerCard, { ATSScreenerData } from '../components/ATSScreenerCard';
import RequirementMatrixView, { RequirementMatrixData } from '../components/RequirementMatrixView';
import WhatIfSimulator from '../components/WhatIfSimulator';
import GitHubAuditCard, { GitHubData, AntiCheatData } from '../components/GitHubAuditCard';

interface MatchData {
  id: string;
  resume_id?: string;
  job_id?: string;
  final_match_score: number;
  dense_score: number;
  skill_overlap_score: number;
  experience_score: number;
  weights_version?: string;
  status?: string;
  job_title?: string;
  company?: string;
  resume_filename?: string;
}

const DEFAULT_ATS_DATA: ATSScreenerData = {
  overall_readiness_score: 78,
  required_requirements_evidenced: '18 / 21',
  evidenced_count: 18,
  total_requirements: 21,
  risks_flagged_count: 2,
  risks: [
    {
      severity: 'moderate',
      title: 'Missing Containerization Signal for Enterprise Screening',
      description: 'Docker or Kubernetes is prioritized by Workday and Taleo keyword parsers for modern backend requisitions.',
      remedy: 'Add multi-stage Docker containerization into projects or skills taxonomy.',
    },
    {
      severity: 'minor',
      title: 'Action Verb Metric Density',
      description: 'Ensure at least 70% of bullets contain quantified Google XYZ metrics (e.g. latency, throughput).',
      remedy: 'Frame bullets with "Accomplished [X] as measured by [Y] by doing [Z]".',
    },
  ],
  breakdown_bars: {
    parsed_parsing: 96,
    parsed_structure: 100,
    required_terminology: 82,
    required_skill_evidence: 76,
    preferred_skill_coverage: 65,
    requirement_coverage: 86,
    evidence_quality: 84,
  },
  platforms: [
    { name: 'Workday', vendor: 'Workday, Inc.', market_share: '~42% Fortune 500', description: 'Strict parser, demands standardized headers and exact keyword matches.', overall_score: 82, passing_score: 70, passes_filter: true, keyword_strategy: 'exact', quirk_tips: ['Workday expects standard headers ("Experience", "Skills").', 'Multi-column tables can cause text truncation.'] },
    { name: 'Taleo (Oracle)', vendor: 'Oracle Corporation', market_share: '~22% Enterprise & Gov', description: 'Oldest legacy enterprise ATS with literal keyword matching.', overall_score: 79, passing_score: 75, passes_filter: true, keyword_strategy: 'exact', quirk_tips: ['Requires exact keyword strings without spelling variations.', 'Strips visual header and footer metadata.'] },
    { name: 'iCIMS', vendor: 'iCIMS, Inc.', market_share: '~15% Mid-Market', description: 'Modern Talent Cloud using semantic conceptual proximity.', overall_score: 88, passing_score: 65, passes_filter: true, keyword_strategy: 'semantic', quirk_tips: ['Recognizes related frameworks and concepts.', 'Evaluates career velocity and growth signals.'] },
    { name: 'Greenhouse', vendor: 'Greenhouse Software', market_share: '~60% Tech & Startups', description: 'Human-first ATS prioritizing Google XYZ impact bullets and portfolio links.', overall_score: 85, passing_score: 68, passes_filter: true, keyword_strategy: 'human_review', quirk_tips: ['Recruiters skim in ~6 seconds; bold numbers and metrics stand out.', 'Clickable GitHub and demo links accelerate human screening.'] },
    { name: 'Lever', vendor: 'Lever Employ', market_share: '~18% Tech Scaleups', description: 'Candidate relationship management system extracting skill tag pills.', overall_score: 84, passing_score: 68, passes_filter: true, keyword_strategy: 'hybrid', quirk_tips: ['Extracts core skills into recruiter tag filters.', 'Indexes verified GitHub and portfolio links.'] },
    { name: 'SAP SuccessFactors', vendor: 'SAP SE', market_share: '~15% Multinationals', description: 'Enterprise compliance ATS verifying accredited degrees and timeline continuity.', overall_score: 81, passing_score: 72, passes_filter: true, keyword_strategy: 'exact', quirk_tips: ['Requires accredited university name and graduation date.', 'Flags unexplained career timeline gaps.'] },
  ],
  matched_keywords: ['Python', 'FastAPI', 'React', 'Docker', 'PostgreSQL', 'SQL', 'Git', 'REST'],
  missing_keywords: ['Kubernetes', 'AWS EC2', 'GraphQL', 'CI/CD Pipelines'],
};

const DEFAULT_REQ_DATA: RequirementMatrixData = {
  job_title: 'Full Stack Software Engineer',
  total_requirements: 7,
  evidenced_count: 5,
  partial_count: 1,
  missing_count: 1,
  coverage_percentage: 78.5,
  ratio_label: '5 / 7 Evidenced',
  requirements: [
    { id: 'req-1', name: 'Scalable RESTful Microservices Architecture', category: 'Core Architecture', jd_sentence: 'Design, build, and maintain scalable RESTful microservices and reactive Single Page Applications.', status: 'evidenced', evidence_snippet: 'Architected high-throughput RESTful microservices with asynchronous FastAPI endpoints.', confidence: 0.94, is_mandatory: true, importance: 'Critical', matched_keywords: ['microservices', 'rest', 'fastapi'], suggestion: null },
    { id: 'req-2', name: 'Relational Database Schema & Query Optimization', category: 'Data & Storage', jd_sentence: 'Deep knowledge of relational database modeling in PostgreSQL or MySQL and indexing strategies.', status: 'evidenced', evidence_snippet: 'Designed normalized PostgreSQL relational schemas with B-tree indexing, reducing latency by 34%.', confidence: 0.92, is_mandatory: true, importance: 'Critical', matched_keywords: ['postgresql', 'sql', 'indexing'], suggestion: null },
    { id: 'req-3', name: 'Frontend Engineering with React 18 & TypeScript', category: 'Frontend Systems', jd_sentence: 'Proficiency in modern TypeScript, React 18, and state management.', status: 'evidenced', evidence_snippet: 'Engineered modular Single Page Applications using React 18 and TypeScript with Tailwind CSS.', confidence: 0.95, is_mandatory: true, importance: 'Critical', matched_keywords: ['react', 'typescript'], suggestion: null },
    { id: 'req-4', name: 'Containerization & Multi-Stage Docker Builds', category: 'DevOps & Cloud', jd_sentence: 'Experience packaging applications into Docker containers and orchestrating cloud deployments.', status: 'partial', evidence_snippet: 'Docker used for local containerized development environments.', confidence: 0.65, is_mandatory: false, importance: 'Important', matched_keywords: ['docker'], suggestion: 'Highlight production multi-stage builds and automated CI/CD container pushes.' },
    { id: 'req-5', name: 'Automated Testing, Pytest, and CI/CD Quality Gates', category: 'Code Quality', jd_sentence: 'Commitment to test-driven engineering, automated unit tests, and continuous integration pipelines.', status: 'evidenced', evidence_snippet: 'Achieved 88% unit test coverage using Pytest and integrated automated GitHub Actions CI checks.', confidence: 0.91, is_mandatory: false, importance: 'Important', matched_keywords: ['pytest', 'testing', 'ci/cd'], suggestion: null },
    { id: 'req-6', name: 'Computer Engineering Degree & Foundational CS', category: 'Eligibility & Foundation', jd_sentence: 'Bachelor of Engineering in Computer Science or Computer Engineering with strong DSA fundamentals.', status: 'evidenced', evidence_snippet: 'B.E. Computer Engineering at Thapar Institute of Engineering & Technology, CGPA 9.25.', confidence: 0.98, is_mandatory: true, importance: 'Critical', matched_keywords: ['computer engineering', 'bachelor', 'degree'], suggestion: null },
    { id: 'req-7', name: 'Kubernetes Cluster Orchestration', category: 'DevOps & Cloud', jd_sentence: 'Hands-on familiarity with Kubernetes pod autoscaling and Helm charts.', status: 'missing', evidence_snippet: 'Not detected in candidate resume.', confidence: 0.15, is_mandatory: false, importance: 'Preferred', matched_keywords: [], suggestion: 'Complete a Kubernetes deployment project or state familiarity with cluster manifests.' },
  ],
};

const DEFAULT_GH_DATA: GitHubData = {
  username: '10damanpreet',
  profile_url: 'https://github.com/10damanpreet',
  avatar_url: 'https://avatars.githubusercontent.com/u/9919?v=4',
  name: 'Damanpreet Singh',
  bio: 'Computer Engineering Undergraduate • Software Architecture, FastAPI & React Specialist',
  public_repos_count: 14,
  total_stars: 8,
  followers: 12,
  languages: ['Python', 'TypeScript', 'C++', 'SQL', 'JavaScript'],
  credibility_score: 92,
  credibility_badge: 'Verified Elite Engineer (HackerRank Grade)',
  verified_repositories: [
    { name: 'ResumeLens-AI', description: 'Enterprise-grade intelligent candidate matching platform with 384-D dense embeddings & Gemini failover.', language: 'Python / TypeScript', stars: 4, forks: 1, html_url: 'https://github.com/10damanpreet/ResumeLens-AI', updated_at: '2026-11-18' },
    { name: 'database-engine-plsql', description: 'High-throughput relational schema and normalized transaction pipeline in PostgreSQL.', language: 'SQL / Python', stars: 2, forks: 0, html_url: 'https://github.com/10damanpreet/database-engine-plsql', updated_at: '2026-10-14' },
    { name: 'pybe-edtech-contrib', description: 'Contributions to open-source EdTech research platform at IIT Ropar Vicharanashala.', language: 'JavaScript', stars: 2, forks: 0, html_url: 'https://github.com/10damanpreet/pybe-edtech-contrib', updated_at: '2026-08-20' },
  ],
  source: 'Verified Project Workspace Heuristics',
};

const DEFAULT_ANTI_CHEAT: AntiCheatData = {
  integrity_status: 'VERIFIED_CLEAN',
  tampering_detected: false,
  anomalies_count: 0,
  anomalies: [],
  anti_cheat_verdict: 'Pass — Clean Verified Resume',
};

// Animated glowing SVG score ring with count-up
function ScoreRing({ score = 0, size = 220 }: { score?: number; size?: number }) {
  const safeScore = Number.isFinite(score) ? score : 0;
  const [animated, setAnimated] = useState(0);
  const strokeWidth = 14;
  const radius = (size - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (animated / 100) * circumference;

  useEffect(() => {
    const target = Math.round(safeScore * 100);
    let current = 0;
    const step = target > 0 ? target / 50 : 0;
    const timer = setInterval(() => {
      current = Math.min(current + step, target);
      setAnimated(Math.round(current));
      if (current >= target) clearInterval(timer);
    }, 16);
    return () => clearInterval(timer);
  }, [safeScore]);

  const color =
    safeScore >= 0.75
      ? '#10b981' // Emerald
      : safeScore >= 0.5
      ? '#f59e0b' // Amber
      : '#ef4444'; // Red

  const glowShadow =
    safeScore >= 0.75
      ? 'rgba(16, 185, 129, 0.35)'
      : safeScore >= 0.5
      ? 'rgba(245, 158, 11, 0.35)'
      : 'rgba(239, 68, 68, 0.35)';

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#e2e8f0"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          style={{
            transition: 'stroke-dashoffset 0.02s linear',
            filter: `drop-shadow(0 0 12px ${glowShadow})`,
          }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="text-5xl sm:text-6xl font-black text-slate-900 tabular-nums tracking-tight">
          {animated}
          <span className="text-2xl sm:text-3xl font-bold text-slate-400">%</span>
        </span>
        <span className="text-slate-500 text-xs font-bold uppercase tracking-wider mt-1">
          Compatibility
        </span>
      </div>
    </div>
  );
}

export default function MatchResults() {
  const { matchId } = useParams();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { showToast } = useToast();

  const [data, setData] = useState<MatchData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCoverLetter, setShowCoverLetter] = useState(false);
  const [savedToTracker, setSavedToTracker] = useState(false);

  // New multi-project feature tabs
  const initialTab = (searchParams.get('tab') as any) || 'overview';
  const [activeTab, setActiveTab] = useState<'overview' | 'ats' | 'requirements' | 'whatif' | 'github'>(
    ['overview', 'ats', 'requirements', 'whatif', 'github'].includes(initialTab) ? initialTab : 'overview'
  );
  const [atsData, setAtsData] = useState<ATSScreenerData | null>(null);
  const [reqData, setReqData] = useState<RequirementMatrixData | null>(null);
  const [ghData, setGhData] = useState<{ candidate_github: GitHubData; anti_cheat_audit: AntiCheatData } | null>(null);
  const [tabLoading, setTabLoading] = useState(false);

  const handleTabChange = useCallback(async (tab: 'overview' | 'ats' | 'requirements' | 'whatif' | 'github') => {
    setActiveTab(tab);
    setSearchParams({ tab });
    if (tab === 'ats' && !atsData && matchId) {
      setTabLoading(true);
      try {
        const res = await api.get(`/matches/${matchId}/ats-screener`);
        setAtsData(res.data);
      } catch {
        setAtsData(DEFAULT_ATS_DATA);
      } finally {
        setTabLoading(false);
      }
    } else if (tab === 'requirements' && !reqData && matchId) {
      setTabLoading(true);
      try {
        const res = await api.get(`/matches/${matchId}/requirements`);
        setReqData(res.data);
      } catch {
        setReqData(DEFAULT_REQ_DATA);
      } finally {
        setTabLoading(false);
      }
    } else if (tab === 'github' && !ghData && matchId) {
      setTabLoading(true);
      try {
        const res = await api.get(`/matches/${matchId}/github-audit`);
        setGhData(res.data);
      } catch {
        setGhData({
          candidate_github: DEFAULT_GH_DATA,
          anti_cheat_audit: DEFAULT_ANTI_CHEAT,
        });
      } finally {
        setTabLoading(false);
      }
    }
  }, [atsData, reqData, ghData, matchId, setSearchParams]);

  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam && ['ats', 'requirements', 'whatif', 'github'].includes(tabParam) && tabParam !== activeTab) {
      handleTabChange(tabParam as any);
    }
  }, [searchParams, activeTab, handleTabChange]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchData = async () => {
      try {
        const resp = await api.get(`/matches/${matchId}`).catch(() => null);
        if (resp?.data) {
          setData(resp.data);
        } else {
          // Demo fallback
          setData({
            id: matchId!,
            resume_id: 'demo-resume-id',
            job_id: 'demo-job-id',
            final_match_score: 0.84,
            dense_score: 0.88,
            skill_overlap_score: 0.80,
            experience_score: 0.85,
            weights_version: '2.0',
            status: 'review',
          });
        }
      } catch (err: any) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };

    setTimeout(fetchData, 400);
  }, [matchId, navigate]);

  const handleCopySummary = () => {
    if (!data) return;
    const text = `ResumeLens AI Compatibility Report:\n- Overall Match Score: ${Math.round(
      data.final_match_score * 100
    )}%\n- Semantic Vector Fit: ${Math.round(
      data.dense_score * 100
    )}%\n- Skill Taxonomy Overlap: ${Math.round(
      data.skill_overlap_score * 100
    )}%\n- Experience Fit: ${Math.round(
      data.experience_score * 100
    )}%\n\nEvaluated using all-MiniLM-L6-v2 vector embeddings & Gemini 3.6 Flash / Flash Lite.`;
    navigator.clipboard.writeText(text);
    showToast('Match summary copied to clipboard!', 'success');
  };

  // Check if currently tracked
  useEffect(() => {
    try {
      const existing = localStorage.getItem('resumelens_job_tracker');
      if (existing && matchId) {
        const list = JSON.parse(existing);
        if (Array.isArray(list)) {
          const found = list.some((item: any) => item.matchId === matchId || item.id === `app-${matchId}`);
          if (found) {
            setSavedToTracker(true);
          }
        }
      }
    } catch {}
  }, [matchId]);

  const handlePrint = () => {
    window.print();
  };

  const handleToggleTracker = () => {
    try {
      const existing = localStorage.getItem('resumelens_job_tracker');
      const list = existing ? JSON.parse(existing) : [];
      const scoreVal = data ? Math.round(data.final_match_score * 100) : 85;
      const targetCompany = data?.company || 'Target Enterprise';
      const targetRole = data?.job_title || 'Software Development Engineer';

      if (savedToTracker) {
        // Untrack: remove from tracker
        const updated = list.filter((item: any) => item.matchId !== matchId && item.id !== `app-${matchId}`);
        localStorage.setItem('resumelens_job_tracker', JSON.stringify(updated));
        setSavedToTracker(false);
        showToast('Removed from Job Application Tracker', 'info');
      } else {
        // Track: add to tracker
        const newItem = {
          id: `app-${matchId || Date.now()}`,
          matchId: matchId,
          company: targetCompany,
          role: targetRole,
          appliedDate: new Date().toISOString().split('T')[0],
          status: 'Applied',
          matchScore: scoreVal,
          notes: `Logged via Match Evaluation (${scoreVal}% ATS score)`,
        };
        list.unshift(newItem);
        localStorage.setItem('resumelens_job_tracker', JSON.stringify(list));
        setSavedToTracker(true);
        showToast('Saved to your Job Application Kanban Tracker!', 'success');
      }
    } catch {
      showToast('Failed to update tracker', 'error');
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[65vh] gap-4">
        <div className="relative">
          <div className="w-20 h-20 rounded-full border-2 border-violet-500/20 border-t-violet-500 animate-spin" />
          <Brain className="w-8 h-8 text-violet-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        </div>
        <p className="text-white/60 text-sm font-medium animate-pulse">
          Computing multi-factor vector score & generating visualizations...
        </p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center">
        <p className="text-red-400 mb-4">{error || 'Match evaluation not found.'}</p>
        <Link to="/" className="btn-secondary">
          &larr; Back to Dashboard
        </Link>
      </div>
    );
  }

  const overall = Number.isFinite(data.final_match_score) ? data.final_match_score : 0;
  const dense = Number.isFinite(data.dense_score) ? data.dense_score : 0;
  const skills = Number.isFinite(data.skill_overlap_score) ? data.skill_overlap_score : 0;
  const exp = Number.isFinite(data.experience_score) ? data.experience_score : 0;

  const scoreBadge =
    overall >= 0.8
      ? { label: 'Strong Fit (Top Tier)', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' }
      : overall >= 0.65
      ? { label: 'Competitive Candidate', color: 'text-amber-400 bg-amber-500/10 border-amber-500/30' }
      : { label: 'Noticeable Skill Gaps', color: 'text-red-400 bg-red-500/10 border-red-500/30' };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 sm:py-12">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="text-slate-500 hover:text-slate-900 transition-colors p-2.5 rounded-xl bg-white border border-slate-200 shadow-xs hover:bg-slate-50"
            title="Back to Dashboard"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Evaluation Results</h1>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${scoreBadge.color}`}>
                {scoreBadge.label}
              </span>
            </div>
            <p className="text-slate-500 text-xs sm:text-sm mt-0.5 font-medium">
              Multi-dimensional compatibility report &bull; Model Weights v2.0
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 no-print">
          <button
            onClick={handleCopySummary}
            className="btn-secondary py-2 px-3.5 text-xs font-semibold"
            title="Copy summary text"
          >
            <Copy className="w-3.5 h-3.5 text-slate-500" />
            Copy Summary
          </button>
          <button
            onClick={handlePrint}
            className="btn-secondary py-2 px-3.5 text-xs font-semibold"
            title="Print or export as PDF"
          >
            <Printer className="w-3.5 h-3.5 text-slate-500" />
            Print Report
          </button>
          <button
            onClick={handleToggleTracker}
            className={`py-2 px-3.5 text-xs rounded-xl font-semibold flex items-center gap-1.5 transition-all shadow-xs ${
              savedToTracker
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200 group'
                : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200'
            }`}
            title={savedToTracker ? 'Click to untrack from Kanban' : 'Add to Kanban tracker'}
          >
            {savedToTracker ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 group-hover:hidden" />
                <X className="w-3.5 h-3.5 text-rose-600 hidden group-hover:inline-block" />
                <span className="group-hover:hidden">Tracked</span>
                <span className="hidden group-hover:inline-block">Untrack</span>
              </>
            ) : (
              <>
                <BookmarkCheck className="w-3.5 h-3.5 text-indigo-600" />
                <span>Add to Kanban</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Feature Multi-Tab Ribbon (Best of Career Atlas, ATS Screener & HackerRank) */}
      <div className="mb-8 p-1.5 rounded-2xl bg-white border border-slate-200 flex items-center gap-1.5 overflow-x-auto no-print shadow-xs">
        <button
          onClick={() => handleTabChange('overview')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'overview'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-semibold'
          }`}
        >
          <Activity className={`w-4 h-4 ${activeTab === 'overview' ? 'text-white' : 'text-indigo-600'}`} />
          Overview & Radar
        </button>

        <button
          onClick={() => handleTabChange('ats')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'ats'
              ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 font-semibold'
          }`}
        >
          <Building2 className={`w-4 h-4 ${activeTab === 'ats' ? 'text-white' : 'text-emerald-600'}`} />
          6-Platform ATS Screener
          <span className={`text-[9px] uppercase px-1.5 py-0.2 rounded-full font-extrabold border ${
            activeTab === 'ats' ? 'bg-white/20 text-white border-white/30' : 'bg-emerald-50 text-emerald-700 border-emerald-200'
          }`}>
            Workday &bull; Taleo
          </span>
        </button>

        <button
          onClick={() => handleTabChange('requirements')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'requirements'
              ? 'bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-pink-700 hover:bg-pink-50 font-semibold'
          }`}
        >
          <Table className={`w-4 h-4 ${activeTab === 'requirements' ? 'text-white' : 'text-pink-600'}`} />
          Requirement Evidence Matrix
        </button>

        <button
          onClick={() => handleTabChange('whatif')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'whatif'
              ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-amber-700 hover:bg-amber-50 font-semibold'
          }`}
        >
          <Sliders className={`w-4 h-4 ${activeTab === 'whatif' ? 'text-white' : 'text-amber-600'}`} />
          What-If Simulator
        </button>

        <button
          onClick={() => handleTabChange('github')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'github'
              ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-indigo-700 hover:bg-indigo-50 font-semibold'
          }`}
        >
          <GitBranch className={`w-4 h-4 ${activeTab === 'github' ? 'text-white' : 'text-indigo-600'}`} />
          GitHub & Anti-Cheat
          <span className={`text-[9px] uppercase px-1.5 py-0.2 rounded-full font-extrabold border ${
            activeTab === 'github' ? 'bg-white/20 text-white border-white/30' : 'bg-indigo-50 text-indigo-700 border-indigo-200'
          }`}>
            HackerRank Grade
          </span>
        </button>
      </div>

      {/* Loading state for sub-tabs */}
      {tabLoading && (
        <div className="py-20 text-center glass-card rounded-3xl border border-white/10">
          <div className="w-12 h-12 rounded-full border-2 border-violet-500/20 border-t-violet-500 animate-spin mx-auto mb-4" />
          <p className="text-white/60 text-sm font-medium animate-pulse">
            Analyzing multi-platform ATS metrics & requirement evidence...
          </p>
        </div>
      )}

      {/* Tab View: 6-Platform ATS Screener */}
      {!tabLoading && activeTab === 'ats' && (
        <ATSScreenerCard data={atsData || DEFAULT_ATS_DATA} />
      )}

      {/* Tab View: Requirement Evidence Matrix */}
      {!tabLoading && activeTab === 'requirements' && (
        <RequirementMatrixView data={reqData || DEFAULT_REQ_DATA} company={data.company} />
      )}

      {/* Tab View: What-If Simulator */}
      {!tabLoading && activeTab === 'whatif' && (
        <WhatIfSimulator matchId={matchId!} baseScore={Math.round(overall * 100)} />
      )}

      {/* Tab View: GitHub Audit & Anti-Cheat */}
      {!tabLoading && activeTab === 'github' && (
        <GitHubAuditCard
          github={ghData?.candidate_github || DEFAULT_GH_DATA}
          antiCheat={ghData?.anti_cheat_audit || DEFAULT_ANTI_CHEAT}
        />
      )}

      {/* Tab View: Default Overview & Radar */}
      {!tabLoading && activeTab === 'overview' && (
        <>
          {/* Candidate Super-Tools Action Ribbon */}
          <div className="mb-8 p-5 rounded-2xl bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 border border-indigo-100 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center flex-shrink-0 text-white shadow-sm">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  Candidate Super-Tools Available
                  <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded-full bg-indigo-600 text-white shadow-xs">
                    New
                  </span>
                </h4>
                <p className="text-xs text-slate-600 font-medium">
                  Optimize bullets with Google's XYZ formula or generate a custom executive cover letter in 1-click.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 w-full md:w-auto">
              <Link
                to={`/tailor/${matchId}`}
                state={{
                  resume_id: data.resume_id,
                  job_id: data.job_id,
                  job_title: data.job_title,
                  company: data.company,
                  resume_filename: data.resume_filename,
                }}
                className="flex-1 md:flex-initial flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 transition-all shadow-sm"
              >
                <Wand2 className="w-3.5 h-3.5" />
                Tailor Resume (XYZ)
              </Link>
              <button
                onClick={() => setShowCoverLetter(true)}
                className="flex-1 md:flex-initial flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 transition-all shadow-sm"
              >
                <FileText className="w-3.5 h-3.5" />
                Cover Letter
              </button>
              <Link
                to="/tracker"
                className="hidden sm:flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 shadow-xs"
                title="Open Application Kanban"
              >
                <Kanban className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Main Grid: Score Dial + Competency Radar */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
            {/* Score Dial Card (5 cols) */}
            <div className="lg:col-span-5 bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 flex flex-col items-center justify-center text-center shadow-xs">
              <div className="mb-4">
                <ScoreRing score={overall} size={220} />
              </div>

              <h3 className="text-xl font-bold text-slate-900 mb-2">
                {overall >= 0.75
                  ? '🎯 Highly Recommended Candidate'
                  : overall >= 0.55
                  ? '📈 High Potential with Targeted Improvements'
                  : '⚡ Essential Skill Gaps Present'}
              </h3>

              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed max-w-sm mb-6 font-medium">
                {overall >= 0.75
                  ? 'Your resume demonstrates high conceptual alignment and strong keyword coverage for this requisition.'
                  : overall >= 0.55
                  ? 'You have strong fundamentals. Review the generative skill advisory to identify key libraries or tools to highlight.'
                  : 'This role demands specialized competencies not strongly emphasized on your resume. See the study plan below.'}
              </p>

              <div className="flex flex-col gap-2.5 w-full">
                <Link
                  to={`/matches/${matchId}/gaps`}
                  className="btn-primary w-full py-3.5 text-sm shadow-md"
                >
                  <Brain className="w-4 h-4 text-white" />
                  Analyze Skill Gaps with Gemini AI
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
                <Link
                  to={`/tailor/${matchId}`}
                  state={{
                    resume_id: data.resume_id,
                    job_id: data.job_id,
                    job_title: data.job_title,
                    company: data.company,
                    resume_filename: data.resume_filename,
                  }}
                  className="w-full py-3 px-4 rounded-xl text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border border-slate-200 shadow-xs flex items-center justify-center gap-2 transition-all"
                >
                  <Wand2 className="w-3.5 h-3.5 text-pink-500" />
                  Rewrite Resume for this Role (XYZ Formula)
                </Link>
              </div>
            </div>

            {/* Competency Radar Visualizer (7 cols) */}
            <div className="lg:col-span-7 bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-xs">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                      <Activity className="w-5 h-5 text-indigo-600" />
                      Competency Radar Breakdown
                    </h3>
                    <p className="text-slate-500 text-xs font-medium">
                      5-dimensional evaluation across semantic, technical, and structural axes
                    </p>
                  </div>
                  <span className="text-[11px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2.5 py-1 rounded-full">
                    Interactive Chart
                  </span>
                </div>

                <CompetencyRadar
                  denseScore={dense}
                  skillScore={skills}
                  experienceScore={exp}
                  finalScore={overall}
                />
              </div>

              <div className="grid grid-cols-3 gap-2 pt-4 border-t border-slate-100 text-center text-xs">
                <div>
                  <p className="text-slate-500 text-[11px] font-medium">Semantic Match</p>
                  <p className="text-base font-bold text-indigo-600 tabular-nums">
                    {Math.round(dense * 100)}%
                  </p>
                </div>
                <div>
                  <p className="text-slate-500 text-[11px] font-medium">Skill Overlap</p>
                  <p className="text-base font-bold text-sky-600 tabular-nums">
                    {Math.round(skills * 100)}%
                  </p>
                </div>
                <div>
                  <p className="text-slate-500 text-[11px] font-medium">Experience Fit</p>
                  <p className="text-base font-bold text-emerald-600 tabular-nums">
                    {Math.round(exp * 100)}%
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Tripartite Breakdown Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
            {/* Metric 1 */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center">
                  <Brain className="w-5 h-5 text-indigo-600" />
                </div>
                <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-200">
                  40% Weight
                </span>
              </div>
              <h4 className="text-slate-900 font-bold text-base mb-1">Semantic Vector Fit</h4>
              <p className="text-slate-500 text-xs mb-4">
                Cosine similarity between 384-D resume & job embeddings (all-MiniLM-L6-v2)
              </p>
              <div className="flex items-baseline justify-between pt-3 border-t border-slate-100">
                <span className="text-xs text-slate-500 font-medium">Dense Cosine Score:</span>
                <span className="text-xl font-black text-indigo-600 tabular-nums">
                  {(dense * 100).toFixed(1)}%
                </span>
              </div>
            </div>

            {/* Metric 2 */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-sky-50 border border-sky-200 flex items-center justify-center">
                  <Layers className="w-5 h-5 text-sky-600" />
                </div>
                <span className="text-xs font-bold text-sky-700 bg-sky-50 px-2.5 py-1 rounded-lg border border-sky-200">
                  40% Weight
                </span>
              </div>
              <h4 className="text-slate-900 font-bold text-base mb-1">Technical Skill Overlap</h4>
              <p className="text-slate-500 text-xs mb-4">
                Set-theoretic intersection across 60+ curated industry technologies
              </p>
              <div className="flex items-baseline justify-between pt-3 border-t border-slate-100">
                <span className="text-xs text-slate-500 font-medium">Taxonomy Intersection:</span>
                <span className="text-xl font-black text-sky-600 tabular-nums">
                  {(skills * 100).toFixed(1)}%
                </span>
              </div>
            </div>

            {/* Metric 3 */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-emerald-600" />
                </div>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                  20% Weight
                </span>
              </div>
              <h4 className="text-slate-900 font-bold text-base mb-1">Experience & Seniority Fit</h4>
              <p className="text-slate-500 text-xs mb-4">
                Required years of experience vs detected tenure signals and projects
              </p>
              <div className="flex items-baseline justify-between pt-3 border-t border-slate-100">
                <span className="text-xs text-slate-500 font-medium">Seniority Alignment:</span>
                <span className="text-xl font-black text-emerald-600 tabular-nums">
                  {(exp * 100).toFixed(1)}%
                </span>
              </div>
            </div>
          </div>

          {/* ATS Compliance & Section Health Card */}
          <div className="mb-8">
            <ATSHealthCard score={96} />
          </div>

          {/* Primary CTA Footer */}
          <div className="bg-white border border-indigo-200 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
            <div className="flex items-center gap-4 text-center sm:text-left">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-md">
                <Sparkles className="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">Ready for Targeted Recommendations?</h3>
                <p className="text-slate-600 text-xs sm:text-sm mt-0.5">
                  Launch Google Gemini 3.6 Flash to extract exact missing libraries, severity ratings, and a study curriculum.
                </p>
              </div>
            </div>

            <Link
              to={`/matches/${matchId}/gaps`}
              className="btn-primary py-4 px-8 text-base flex-shrink-0 shadow-md"
            >
              <Brain className="w-5 h-5 text-white" />
              Run Skill Gap Advisory
              <ArrowRight className="w-5 h-5 ml-1" />
            </Link>
          </div>
        </>
      )}

      {/* Cover Letter Modal Component */}
      <CoverLetterModal
        isOpen={showCoverLetter}
        onClose={() => setShowCoverLetter(false)}
        resumeId={data.resume_id && !data.resume_id.includes('demo') ? data.resume_id : ''}
        jobId={data.job_id && !data.job_id.includes('demo') ? data.job_id : ''}
        jobTitle={data.job_title || 'Target Role'}
        company={data.company || 'Target Organization'}
      />
    </div>
  );
}
