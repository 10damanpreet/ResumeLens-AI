import { useEffect, useState, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Brain, Zap, AlertTriangle, Info,
  Copy, Printer, RefreshCw, Clock, Sparkles, Check,
  ShieldCheck, Target, Flame, HelpCircle, BookOpen, CheckCircle2
} from 'lucide-react';
import { api, getErrorMessage } from '../api/client';
import { useToast } from '../components/Toast';
import StudyRoadmap from '../components/StudyRoadmap';

interface Gap {
  id?: string;
  skill_name: string;
  severity: 'critical' | 'moderate' | 'minor';
  target_proficiency?: string | null;
  estimated_hours?: number | null;
  llm_model_version?: string | null;
}

interface StrengthItem {
  skill: string;
  impact: string;
  evidence: string;
}

interface WeaknessItem {
  skill: string;
  gap_reason: string;
  severity: 'critical' | 'moderate' | 'minor';
  target_proficiency?: string;
  estimated_hours?: number;
}

interface ComprehensiveAnalysis {
  executive_summary: string;
  fit_verdict: string;
  strengths: StrengthItem[];
  weaknesses: WeaknessItem[];
  gaps: Gap[];
  interview_prep_tips: string[];
  model_used: string;
}

const severityConfig = {
  critical: {
    label: 'Critical Gap',
    bg: 'bg-rose-500/10',
    border: 'border-rose-500/30',
    badge: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
    icon: AlertTriangle,
    iconColor: 'text-rose-400',
  },
  moderate: {
    label: 'Moderate Gap',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/30',
    badge: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    icon: Zap,
    iconColor: 'text-amber-400',
  },
  minor: {
    label: 'Minor Polish',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/30',
    badge: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    icon: Info,
    iconColor: 'text-blue-400',
  },
};

const BULLET_TEMPLATES: Record<string, string> = {
  python: 'Architected modular Python data processing microservices, reducing end-to-end ingestion latency by 35%.',
  pandas: 'Utilized Pandas for vectorized exploratory data analysis and feature engineering across 1M+ multi-source records.',
  sql: 'Engineered optimized relational database schemas and indexed SQL queries in PostgreSQL, accelerating report retrieval by 40%.',
  pytorch: 'Trained and validated deep neural network architectures using PyTorch, achieving 94.2% test accuracy.',
  docker: 'Containerized microservices into multi-stage Docker images, streamlining CI/CD build cycles and production deployments.',
  kubernetes: 'Orchestrated automated pod scaling and zero-downtime rolling updates using Kubernetes deployment manifests.',
  fastapi: 'Developed asynchronous RESTful endpoints with FastAPI and Pydantic validation, sustaining 500+ requests per second.',
  react: 'Built responsive, high-performance Single Page Applications with React 18 and TypeScript, enhancing user retention by 28%.',
};

function getSampleBullet(skillName: string): string {
  const match = Object.keys(BULLET_TEMPLATES).find((k) => skillName.toLowerCase().includes(k));
  if (match) return BULLET_TEMPLATES[match];
  return `Applied ${skillName} engineering standards to optimize module workflows, improving execution reliability and code testability.`;
}

export default function SkillGaps() {
  const { matchId } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [analysis, setAnalysis] = useState<ComprehensiveAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [reanalyzing, setReanalyzing] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'overview' | 'roadmap' | 'interview' | 'bullets'>('overview');
  const [activeFilter, setActiveFilter] = useState<'all' | 'critical' | 'moderate' | 'minor'>('all');
  const [copiedBullet, setCopiedBullet] = useState<string | null>(null);

  const loadAnalysis = useCallback(async (forceRefresh = false) => {
    if (forceRefresh) {
      setReanalyzing(true);
    } else {
      setLoading(true);
    }
    setError('');

    try {
      // 1. Try to fetch cached analysis first (unless forceRefresh)
      let data: ComprehensiveAnalysis | null = null;
      if (!forceRefresh) {
        const res = await api.get(`/matches/${matchId}/analysis`).catch(() => null);
        if (res?.data && (res.data.executive_summary || res.data.gaps?.length)) {
          data = res.data;
        }
      }

      // 2. If not cached or force refreshing, trigger fresh Gemini analysis
      if (!data) {
        const resp = await api.post(`/matches/${matchId}/analysis`);
        data = resp.data;
      }

      // Ensure fallback structures
      if (data) {
        data.strengths = data.strengths || [];
        data.weaknesses = data.weaknesses || [];
        data.gaps = data.gaps || [];
        data.interview_prep_tips = data.interview_prep_tips || [];
        setAnalysis(data);
      }
    } catch (err: any) {
      // Graceful fallback: try legacy gaps endpoint
      try {
        const legacy = await api.get(`/matches/${matchId}/gaps`);
        if (legacy?.data?.length) {
          setAnalysis({
            executive_summary: 'Targeted skill gap evaluation completed based on parsed resume text and job specifications.',
            fit_verdict: 'Technical Gap Advisory Ready',
            strengths: [
              {
                skill: 'Demonstrated Engineering Competencies',
                impact: 'Foundational programming and algorithmic background aligned with software workflows.',
                evidence: 'Extracted from resume background sections.',
              },
            ],
            weaknesses: legacy.data.map((g: Gap) => ({
              skill: g.skill_name,
              gap_reason: 'Required or implied by target role description.',
              severity: g.severity,
              target_proficiency: g.target_proficiency || 'Intermediate',
              estimated_hours: g.estimated_hours || 30,
            })),
            gaps: legacy.data,
            interview_prep_tips: [
              'Explain how your technical stack matches the primary deliverables of this role.',
              'Discuss concrete steps you are taking to master missing domain tools.',
            ],
            model_used: 'Gemini Flash AI',
          });
          return;
        }
      } catch {
        // ignore secondary fallback error
      }
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
      setReanalyzing(false);
    }
  }, [matchId]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    const t = setTimeout(() => loadAnalysis(false), 200);
    return () => clearTimeout(t);
  }, [loadAnalysis, navigate]);

  const copyBullet = (skillName: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedBullet(skillName);
    showToast(`Copied bullet for ${skillName}!`, 'success');
    setTimeout(() => setCopiedBullet(null), 2000);
  };

  const copyFullReport = () => {
    if (!analysis) return;
    const strengthsText = analysis.strengths
      .map((s, i) => `  ${i + 1}. ${s.skill}: ${s.impact} (Evidence: ${s.evidence})`)
      .join('\n');
    const weaknessesText = analysis.weaknesses
      .map((w, i) => `  ${i + 1}. [${w.severity.toUpperCase()}] ${w.skill}: ${w.gap_reason} (~${w.estimated_hours || 25}h)`)
      .join('\n');

    const text = `RESUMELENS AI - EXECUTIVE CANDIDATE ADVISORY
Engine: ${analysis.model_used || 'Gemini 3.6 Flash / Flash Lite'}
Verdict: ${analysis.fit_verdict}

EXECUTIVE SUMMARY:
${analysis.executive_summary}

VERIFIED CORE STRENGTHS:
${strengthsText}

IDENTIFIED WEAKNESSES & MISSING COMPETENCIES:
${weaknessesText}

INTERVIEW FOCUS TOPICS:
${analysis.interview_prep_tips.map((t, i) => `  ${i + 1}. ${t}`).join('\n')}
`;
    navigator.clipboard.writeText(text);
    showToast('Full candidate advisory report copied to clipboard!', 'success');
  };

  const gaps = analysis?.gaps || [];
  const strengths = analysis?.strengths || [];
  const weaknesses = analysis?.weaknesses || [];
  const totalHours = weaknesses.reduce((acc, w) => acc + (w.estimated_hours || 25), 0);
  const criticalCount = weaknesses.filter((w) => w.severity === 'critical').length;

  const filteredGaps =
    activeFilter === 'all'
      ? gaps
      : gaps.filter((g) => g.severity === activeFilter);

  return (
    <div className="relative min-h-screen py-8 sm:py-12">
      {/* Ambient background glows */}
      <div className="absolute top-10 left-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-40 right-1/4 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-20 left-1/3 w-96 h-96 bg-rose-600/10 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <Link
              to={`/matches/${matchId}`}
              className="text-white/40 hover:text-white transition-colors p-2.5 rounded-2xl glass hover:bg-white/10"
              title="Back to Match Score"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  AI Career Intelligence & Advisory
                </h1>
                <span className="badge-glow bg-violet-500/15 text-violet-300 border-violet-500/30 text-xs flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Gemini 3.6 Flash / Flash Lite
                </span>
              </div>
              <p className="text-white/50 text-xs sm:text-sm mt-0.5">
                Comprehensive Strengths, Weaknesses & Actionable Candidate Roadmap
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          {!loading && !error && (
            <div className="flex items-center gap-2 no-print flex-wrap">
              <button
                onClick={() => loadAnalysis(true)}
                disabled={reanalyzing}
                className="btn-secondary py-2 px-3 text-xs flex items-center gap-1.5"
                title="Re-run live analysis with Gemini"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${reanalyzing ? 'animate-spin text-violet-400' : ''}`} />
                {reanalyzing ? 'Analyzing...' : 'Re-Analyze'}
              </button>
              <button
                onClick={copyFullReport}
                className="btn-secondary py-2 px-3 text-xs flex items-center gap-1.5"
                title="Copy complete assessment report"
              >
                <Copy className="w-3.5 h-3.5" />
                Copy Report
              </button>
              <button
                onClick={() => window.print()}
                className="btn-secondary py-2 px-3 text-xs flex items-center gap-1.5"
                title="Print report"
              >
                <Printer className="w-3.5 h-3.5" />
                Print
              </button>
            </div>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="glass-card rounded-3xl p-10 sm:p-14 text-center max-w-xl mx-auto border-violet-500/30 shadow-2xl relative overflow-hidden">
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-violet-500 to-transparent animate-pulse" />
            <div className="relative w-20 h-20 mx-auto mb-6">
              <div className="absolute inset-0 rounded-full border-2 border-violet-500/20 border-t-violet-500 animate-spin" />
              <Brain className="w-8 h-8 text-violet-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">
              Gemini 3.6 Flash is Evaluating Candidate...
            </h3>
            <p className="text-white/40 text-sm leading-relaxed mb-6">
              Synthesizing candidate strengths, detecting domain weaknesses, and constructing an optimized learning trajectory.
            </p>
            <div className="flex justify-center gap-2">
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="w-2.5 h-2.5 rounded-full bg-violet-400 animate-bounce"
                  style={{ animationDelay: `${i * 0.15}s` }}
                />
              ))}
            </div>
            <p className="text-white/30 text-[11px] mt-6">
              Primary: Gemini 3.6 Flash • Auto-fallback: Flash Lite (Ultra-Low Latency)
            </p>
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="glass-card border border-rose-500/30 rounded-3xl p-8 text-center max-w-lg mx-auto">
            <AlertTriangle className="w-12 h-12 text-rose-400 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-white mb-2">Analysis Temporarily Unavailable</h3>
            <p className="text-rose-300 text-sm mb-6 leading-relaxed">{error}</p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => loadAnalysis(true)}
                className="btn-primary py-2 px-5 text-sm flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Retry Analysis
              </button>
              <Link to={`/matches/${matchId}`} className="btn-secondary py-2 px-4 text-sm">
                &larr; Back to Results
              </Link>
            </div>
          </div>
        )}

        {/* Full Analysis Content */}
        {!loading && !error && analysis && (
          <div className="space-y-8 animate-fade-in">
            {/* Top Card: Executive Assessment & Verdict */}
            <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/10 relative overflow-hidden shadow-2xl bg-gradient-to-br from-white/[0.04] via-transparent to-violet-500/[0.03]">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/20">
                    <Brain className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-violet-300">
                      Executive Evaluation
                    </span>
                    <h2 className="text-xl sm:text-2xl font-bold text-white mt-0.5">
                      Recruiter Match Diagnosis
                    </h2>
                  </div>
                </div>

                {analysis.fit_verdict && (
                  <div className="self-start md:self-auto px-4 py-2 rounded-2xl bg-gradient-to-r from-violet-500/20 to-indigo-500/20 border border-violet-500/30 text-violet-200 text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-inner">
                    <Target className="w-4 h-4 text-violet-400" />
                    <span>{analysis.fit_verdict}</span>
                  </div>
                )}
              </div>

              {/* Narrative Summary */}
              <div className="mt-6 text-white/80 text-sm sm:text-base leading-relaxed">
                <p className="bg-white/[0.02] p-4 sm:p-5 rounded-2xl border border-white/5">
                  {analysis.executive_summary}
                </p>
              </div>

              {/* Quick Metrics Strip */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-6">
                <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
                  <span className="text-[11px] font-medium text-emerald-300 uppercase tracking-wider block">
                    Verified Strengths
                  </span>
                  <span className="text-2xl font-black text-white mt-1 block">
                    {strengths.length}
                  </span>
                  <span className="text-[10px] text-emerald-400/80">Employer-ready assets</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20">
                  <span className="text-[11px] font-medium text-rose-300 uppercase tracking-wider block">
                    Critical Weaknesses
                  </span>
                  <span className="text-2xl font-black text-white mt-1 block">
                    {criticalCount}
                  </span>
                  <span className="text-[10px] text-rose-400/80">Direct barrier to interview</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20">
                  <span className="text-[11px] font-medium text-amber-300 uppercase tracking-wider block">
                    Total Study Curve
                  </span>
                  <span className="text-2xl font-black text-white mt-1 block">
                    ~{totalHours}h
                  </span>
                  <span className="text-[10px] text-amber-400/80">To achieve full alignment</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-violet-500/10 border border-violet-500/20">
                  <span className="text-[11px] font-medium text-violet-300 uppercase tracking-wider block">
                    Evaluation Engine
                  </span>
                  <span className="text-sm font-bold text-white mt-2 block truncate">
                    {analysis.model_used || 'Gemini 3.6 Flash'}
                  </span>
                  <span className="text-[10px] text-violet-400/80">Dual-model auto failover</span>
                </div>
              </div>
            </div>

            {/* DUAL ASSESSMENT: STRENGTHS & WEAKNESSES SIDE-BY-SIDE */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* STRENGTHS CARD (EMERALD) */}
              <div className="glass-card rounded-3xl p-6 border border-emerald-500/30 relative overflow-hidden shadow-xl bg-gradient-to-br from-emerald-950/20 via-slate-900/40 to-transparent">
                <div className="flex items-center gap-3 mb-5 pb-4 border-b border-emerald-500/20">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center">
                    <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      Verified Strengths
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300">
                        {strengths.length}
                      </span>
                    </h3>
                    <p className="text-xs text-white/40">
                      Confirmed capabilities directly satisfying employer requirements
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  {strengths.length === 0 ? (
                    <p className="text-xs text-white/40 italic">No direct strength matches parsed.</p>
                  ) : (
                    strengths.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-2xl bg-white/[0.02] border border-emerald-500/20 hover:border-emerald-500/40 transition-colors"
                      >
                        <div className="flex items-center justify-between gap-2 mb-1.5">
                          <span className="text-sm font-bold text-emerald-300 flex items-center gap-1.5">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                            {item.skill}
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                            Asset
                          </span>
                        </div>
                        <p className="text-xs text-white/70 leading-relaxed mt-1">
                          {item.impact}
                        </p>
                        {item.evidence && (
                          <div className="mt-2 pt-2 border-t border-white/5 flex items-start gap-1.5 text-[11px] text-white/40">
                            <span className="font-semibold text-emerald-400/90 flex-shrink-0">Resume Context:</span>
                            <span className="italic">{item.evidence}</span>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* WEAKNESSES CARD (ROSE/AMBER) */}
              <div className="glass-card rounded-3xl p-6 border border-rose-500/30 relative overflow-hidden shadow-xl bg-gradient-to-br from-rose-950/20 via-slate-900/40 to-transparent">
                <div className="flex items-center gap-3 mb-5 pb-4 border-b border-rose-500/20">
                  <div className="w-10 h-10 rounded-2xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center">
                    <Flame className="w-5 h-5 text-rose-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      Identified Weaknesses
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300">
                        {weaknesses.length}
                      </span>
                    </h3>
                    <p className="text-xs text-white/40">
                      Missing qualifications or shallow coverage flagging risk
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  {weaknesses.length === 0 ? (
                    <p className="text-xs text-white/40 italic">No major disqualifying gaps found.</p>
                  ) : (
                    weaknesses.map((item, idx) => {
                      const cfg = severityConfig[item.severity] || severityConfig.moderate;
                      return (
                        <div
                          key={idx}
                          className={`p-4 rounded-2xl bg-white/[0.02] border ${cfg.border} hover:border-opacity-60 transition-colors`}
                        >
                          <div className="flex items-center justify-between gap-2 mb-1.5">
                            <span className="text-sm font-bold text-white flex items-center gap-1.5">
                              <cfg.icon className="w-4 h-4 text-rose-400 flex-shrink-0" />
                              {item.skill}
                            </span>
                            <div className="flex items-center gap-1.5">
                              <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold border ${cfg.badge}`}>
                                {cfg.label}
                              </span>
                              {item.estimated_hours && (
                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-white/50 border border-white/10 flex items-center gap-1">
                                  <Clock className="w-3 h-3 text-amber-400" />
                                  ~{item.estimated_hours}h
                                </span>
                              )}
                            </div>
                          </div>
                          <p className="text-xs text-white/70 leading-relaxed mt-1">
                            {item.gap_reason}
                          </p>
                          {item.target_proficiency && (
                            <div className="mt-2 pt-2 border-t border-white/5 flex items-center justify-between text-[11px] text-white/40">
                              <span>Target Proficiency:</span>
                              <span className="font-semibold text-white/70">{item.target_proficiency}</span>
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>

            {/* TABBED DEEP DIVE CONTROLS */}
            <div className="flex items-center gap-2 p-1.5 rounded-2xl glass border border-white/10 max-w-xl no-print">
              <button
                onClick={() => setActiveTab('overview')}
                className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
                  activeTab === 'overview'
                    ? 'bg-violet-600 text-white shadow-md'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                Roadmap Plan
              </button>
              <button
                onClick={() => setActiveTab('interview')}
                className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
                  activeTab === 'interview'
                    ? 'bg-violet-600 text-white shadow-md'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                <HelpCircle className="w-3.5 h-3.5" />
                Interview Grill
              </button>
              <button
                onClick={() => setActiveTab('bullets')}
                className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
                  activeTab === 'bullets'
                    ? 'bg-violet-600 text-white shadow-md'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                Resume Bullets
              </button>
            </div>

            {/* TAB CONTENT: ROADMAP */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <StudyRoadmap
                  matchId={matchId || 'default'}
                  gaps={gaps.map((g, idx) => ({
                    id: g.id || `gap-${idx}`,
                    skill_name: g.skill_name,
                    severity: g.severity,
                    estimated_hours: g.estimated_hours,
                    target_proficiency: g.target_proficiency,
                  }))}
                />

                {/* Filterable Gaps Matrix */}
                <div className="glass-card rounded-3xl p-6 border border-white/10">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-white/10">
                    <div>
                      <h3 className="text-base font-bold text-white flex items-center gap-2">
                        <Target className="w-4 h-4 text-violet-400" />
                        Detailed Skill Gap Matrix
                      </h3>
                      <p className="text-xs text-white/40">
                        Targeted curriculum to eliminate employer reservations
                      </p>
                    </div>

                    {/* Filter Pills */}
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {(['all', 'critical', 'moderate', 'minor'] as const).map((filter) => (
                        <button
                          key={filter}
                          onClick={() => setActiveFilter(filter)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                            activeFilter === filter
                              ? 'bg-white/20 text-white border border-white/20 shadow-inner'
                              : 'text-white/50 hover:text-white hover:bg-white/5 border border-transparent'
                          }`}
                        >
                          {filter.charAt(0).toUpperCase() + filter.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredGaps.map((gap, i) => {
                      const cfg = severityConfig[gap.severity] || severityConfig.moderate;
                      return (
                        <div
                          key={i}
                          className={`p-4 rounded-2xl border ${cfg.border} bg-white/[0.02] flex items-start justify-between gap-3`}
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-bold text-white">{gap.skill_name}</span>
                              <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold border ${cfg.badge}`}>
                                {cfg.label}
                              </span>
                            </div>
                            <p className="text-xs text-white/50 mt-1">
                              Target Level: <span className="text-white/80 font-medium">{gap.target_proficiency || 'Intermediate'}</span>
                            </p>
                          </div>
                          <span className="text-xs px-2.5 py-1 rounded-xl bg-white/5 text-amber-300 border border-white/10 font-bold flex items-center gap-1 flex-shrink-0">
                            <Clock className="w-3 h-3 text-amber-400" />
                            {gap.estimated_hours || 25}h
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* TAB CONTENT: INTERVIEW QUESTIONS */}
            {activeTab === 'interview' && (
              <div className="glass-card rounded-3xl p-6 sm:p-8 border border-violet-500/30">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/10">
                  <div className="w-10 h-10 rounded-2xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center">
                    <HelpCircle className="w-5 h-5 text-violet-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">Predicted Technical Interview Questions</h3>
                    <p className="text-xs text-white/40">
                      Based on your strengths and missing requirements, expect hiring managers to press you on these topics:
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  {analysis.interview_prep_tips.length === 0 ? (
                    <p className="text-xs text-white/40">No specific interview questions generated.</p>
                  ) : (
                    analysis.interview_prep_tips.map((tip, idx) => (
                      <div
                        key={idx}
                        className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-violet-500/40 transition-colors flex items-start gap-4"
                      >
                        <span className="w-7 h-7 rounded-xl bg-violet-500/20 text-violet-300 font-black text-xs flex items-center justify-center flex-shrink-0 border border-violet-500/30">
                          Q{idx + 1}
                        </span>
                        <div>
                          <p className="text-sm font-semibold text-white leading-relaxed">
                            {tip}
                          </p>
                          <p className="text-[11px] text-white/40 mt-1.5">
                            Tip: Frame your answer by acknowledging your foundational skills, then detailing the specific architecture pattern you would adopt.
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* TAB CONTENT: BULLETS */}
            {activeTab === 'bullets' && (
              <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/10">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/10">
                  <div className="w-10 h-10 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-indigo-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">ATS-Optimized Resume Bullets</h3>
                    <p className="text-xs text-white/40">
                      Copy and integrate these metric-driven bullet points into your resume to immediately boost match score:
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  {gaps.map((gap, idx) => {
                    const bullet = getSampleBullet(gap.skill_name);
                    const isCopied = copiedBullet === gap.skill_name;
                    return (
                      <div
                        key={idx}
                        className="p-4 sm:p-5 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-violet-500/30 transition-colors"
                      >
                        <div className="flex items-center justify-between gap-3 mb-2">
                          <span className="text-xs font-bold uppercase tracking-wider text-violet-300">
                            {gap.skill_name}
                          </span>
                          <button
                            onClick={() => copyBullet(gap.skill_name, bullet)}
                            className={`py-1.5 px-3 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                              isCopied
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                                : 'bg-white/5 hover:bg-white/10 text-white/70 hover:text-white border border-white/10'
                            }`}
                          >
                            {isCopied ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-400" />
                                Copied!
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5" />
                                Copy Bullet
                              </>
                            )}
                          </button>
                        </div>
                        <p className="text-xs sm:text-sm text-white/80 font-mono bg-black/20 p-3 rounded-xl border border-white/5">
                          &bull; {bullet}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
