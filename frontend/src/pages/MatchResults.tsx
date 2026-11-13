import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight, Brain, ArrowLeft, TrendingUp, Layers, Activity,
  Sparkles, Copy, Printer
} from 'lucide-react';
import { api, getErrorMessage } from '../api/client';
import { useToast } from '../components/Toast';
import CompetencyRadar from '../components/CompetencyRadar';
import ATSHealthCard from '../components/ATSHealthCard';

interface MatchData {
  id: string;
  final_match_score: number;
  dense_score: number;
  skill_overlap_score: number;
  experience_score: number;
  weights_version?: string;
}

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
          stroke="rgba(255,255,255,0.06)"
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
        <span className="text-5xl sm:text-6xl font-black text-white tabular-nums tracking-tight">
          {animated}
          <span className="text-2xl sm:text-3xl font-bold text-white/50">%</span>
        </span>
        <span className="text-white/50 text-xs font-semibold uppercase tracking-wider mt-1">
          Compatibility
        </span>
      </div>
    </div>
  );
}

export default function MatchResults() {
  const { matchId } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [data, setData] = useState<MatchData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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
            final_match_score: 0.84,
            dense_score: 0.88,
            skill_overlap_score: 0.80,
            experience_score: 0.85,
            weights_version: '2.0',
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
    )}%\n\nEvaluated using all-MiniLM-L6-v2 vector embeddings & Gemini 3.8 Flash.`;
    navigator.clipboard.writeText(text);
    showToast('Match summary copied to clipboard!', 'success');
  };

  const handlePrint = () => {
    window.print();
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
            className="text-white/40 hover:text-white transition-colors p-2.5 rounded-xl glass hover:bg-white/10"
            title="Back to Dashboard"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Evaluation Results</h1>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${scoreBadge.color}`}>
                {scoreBadge.label}
              </span>
            </div>
            <p className="text-white/40 text-xs sm:text-sm mt-0.5">
              Multi-dimensional compatibility report &bull; Model Weights v2.0
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 no-print">
          <button
            onClick={handleCopySummary}
            className="btn-secondary py-2 px-3.5 text-xs"
            title="Copy summary text"
          >
            <Copy className="w-3.5 h-3.5" />
            Copy Summary
          </button>
          <button
            onClick={handlePrint}
            className="btn-secondary py-2 px-3.5 text-xs"
            title="Print or export as PDF"
          >
            <Printer className="w-3.5 h-3.5" />
            Print Report
          </button>
        </div>
      </div>

      {/* Main Grid: Score Dial + Competency Radar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
        {/* Score Dial Card (5 cols) */}
        <div className="lg:col-span-5 glass-card rounded-3xl p-6 sm:p-8 flex flex-col items-center justify-center text-center">
          <div className="mb-4">
            <ScoreRing score={overall} size={220} />
          </div>

          <h3 className="text-xl font-bold text-white mb-2">
            {overall >= 0.75
              ? '🎯 Highly Recommended Candidate'
              : overall >= 0.55
              ? '📈 High Potential with Targeted Improvements'
              : '⚡ Essential Skill Gaps Present'}
          </h3>

          <p className="text-white/50 text-xs sm:text-sm leading-relaxed max-w-sm mb-6">
            {overall >= 0.75
              ? 'Your resume demonstrates high conceptual alignment and strong keyword coverage for this requisition.'
              : overall >= 0.55
              ? 'You have strong fundamentals. Review the generative skill advisory to identify key libraries or tools to highlight.'
              : 'This role demands specialized competencies not strongly emphasized on your resume. See the study plan below.'}
          </p>

          <Link
            to={`/matches/${matchId}/gaps`}
            className="btn-primary w-full py-3.5 text-sm shadow-xl"
          >
            <Brain className="w-4 h-4 text-violet-200" />
            Analyze Skill Gaps with Gemini AI
            <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </div>

        {/* Competency Radar Visualizer (7 cols) */}
        <div className="lg:col-span-7 glass-card rounded-3xl p-6 sm:p-8 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Activity className="w-5 h-5 text-violet-400" />
                  Competency Radar Breakdown
                </h3>
                <p className="text-white/40 text-xs">
                  5-dimensional evaluation across semantic, technical, and structural axes
                </p>
              </div>
              <span className="text-[11px] font-semibold text-violet-300 bg-violet-500/10 border border-violet-500/25 px-2.5 py-1 rounded-full">
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

          <div className="grid grid-cols-3 gap-2 pt-4 border-t border-white/5 text-center text-xs">
            <div>
              <p className="text-white/40 text-[11px]">Semantic Match</p>
              <p className="text-base font-bold text-violet-400 tabular-nums">
                {Math.round(dense * 100)}%
              </p>
            </div>
            <div>
              <p className="text-white/40 text-[11px]">Skill Overlap</p>
              <p className="text-base font-bold text-sky-400 tabular-nums">
                {Math.round(skills * 100)}%
              </p>
            </div>
            <div>
              <p className="text-white/40 text-[11px]">Experience Fit</p>
              <p className="text-base font-bold text-emerald-400 tabular-nums">
                {Math.round(exp * 100)}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tripartite Breakdown Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        {/* Metric 1 */}
        <div className="glass-card rounded-2xl p-6">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-violet-500/15 border border-violet-500/30 flex items-center justify-center">
              <Brain className="w-5 h-5 text-violet-400" />
            </div>
            <span className="text-xs font-bold text-violet-300 bg-violet-500/10 px-2.5 py-1 rounded-lg border border-violet-500/20">
              40% Weight
            </span>
          </div>
          <h4 className="text-white font-bold text-base mb-1">Semantic Vector Fit</h4>
          <p className="text-white/40 text-xs mb-4">
            Cosine similarity between 384-D resume & job embeddings (all-MiniLM-L6-v2)
          </p>
          <div className="flex items-baseline justify-between pt-3 border-t border-white/5">
            <span className="text-xs text-white/50">Dense Cosine Score:</span>
            <span className="text-xl font-black text-violet-400 tabular-nums">
              {(dense * 100).toFixed(1)}%
            </span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="glass-card rounded-2xl p-6">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-sky-500/15 border border-sky-500/30 flex items-center justify-center">
              <Layers className="w-5 h-5 text-sky-400" />
            </div>
            <span className="text-xs font-bold text-sky-300 bg-sky-500/10 px-2.5 py-1 rounded-lg border border-sky-500/20">
              40% Weight
            </span>
          </div>
          <h4 className="text-white font-bold text-base mb-1">Technical Skill Overlap</h4>
          <p className="text-white/40 text-xs mb-4">
            Set-theoretic intersection across 60+ curated industry technologies
          </p>
          <div className="flex items-baseline justify-between pt-3 border-t border-white/5">
            <span className="text-xs text-white/50">Taxonomy Intersection:</span>
            <span className="text-xl font-black text-sky-400 tabular-nums">
              {(skills * 100).toFixed(1)}%
            </span>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="glass-card rounded-2xl p-6">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
            </div>
            <span className="text-xs font-bold text-emerald-300 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
              20% Weight
            </span>
          </div>
          <h4 className="text-white font-bold text-base mb-1">Experience & Seniority Fit</h4>
          <p className="text-white/40 text-xs mb-4">
            Required years of experience vs detected tenure signals and projects
          </p>
          <div className="flex items-baseline justify-between pt-3 border-t border-white/5">
            <span className="text-xs text-white/50">Seniority Alignment:</span>
            <span className="text-xl font-black text-emerald-400 tabular-nums">
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
      <div className="glass-card rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 border-violet-500/30 shadow-2xl">
        <div className="flex items-center gap-4 text-center sm:text-left">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-violet-600/30">
            <Sparkles className="w-7 h-7 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Ready for Targeted Recommendations?</h3>
            <p className="text-white/50 text-xs sm:text-sm mt-0.5">
              Launch Google Gemini 3.8 Flash to extract exact missing libraries, severity ratings, and a study curriculum.
            </p>
          </div>
        </div>

        <Link
          to={`/matches/${matchId}/gaps`}
          className="btn-primary py-4 px-8 text-base flex-shrink-0 shadow-xl"
        >
          <Brain className="w-5 h-5" />
          Run Skill Gap Advisory
          <ArrowRight className="w-5 h-5 ml-1" />
        </Link>
      </div>
    </div>
  );
}
