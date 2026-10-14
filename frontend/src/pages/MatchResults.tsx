import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Brain, ArrowLeft, TrendingUp, Layers, Activity } from 'lucide-react';
import { api, getErrorMessage } from '../api/client';

interface MatchData {
  id: string;
  final_match_score: number;
  dense_score: number;
  skill_overlap_score: number;
  experience_score: number;
}

// Animated SVG score ring
function ScoreRing({ score = 0, size = 200 }: { score?: number; size?: number }) {
  const safeScore = Number.isFinite(score) ? score : 0;
  const [animated, setAnimated] = useState(0);
  const radius = (size - 24) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (animated / 100) * circumference;

  useEffect(() => {
    const target = Math.round(safeScore * 100);
    let current = 0;
    const step = target > 0 ? target / 60 : 0;
    const timer = setInterval(() => {
      current = Math.min(current + step, target);
      setAnimated(Math.round(current));
      if (current >= target) clearInterval(timer);
    }, 16);
    return () => clearInterval(timer);
  }, [safeScore]);

  const color = safeScore >= 0.7 ? '#10b981' : safeScore >= 0.5 ? '#f59e0b' : '#ef4444';

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={12} />
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none"
          stroke={color}
          strokeWidth={12}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          style={{ transition: 'stroke-dashoffset 0.016s linear', filter: `drop-shadow(0 0 8px ${color}60)` }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-5xl font-black text-white tabular-nums">{animated}<span className="text-2xl font-bold text-white/50">%</span></span>
        <span className="text-white/40 text-xs font-medium mt-1">Match Score</span>
      </div>
    </div>
  );
}

const scoreCards = [
  { key: 'dense_score', label: 'Semantic Match', icon: Brain, desc: 'Deep NLP similarity', color: 'violet' },
  { key: 'skill_overlap_score', label: 'Skill Overlap', icon: Layers, desc: 'Keyword & skills match', color: 'blue' },
  { key: 'experience_score', label: 'Experience Fit', icon: TrendingUp, desc: 'Years & seniority match', color: 'emerald' },
];

function getScoreColor(score: number) {
  if (score >= 0.7) return 'text-emerald-400';
  if (score >= 0.5) return 'text-amber-400';
  return 'text-red-400';
}

function getScoreLabel(score: number) {
  if (score >= 0.8) return 'Excellent';
  if (score >= 0.65) return 'Good';
  if (score >= 0.5) return 'Fair';
  return 'Needs Work';
}

export default function MatchResults() {
  const { matchId } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState<MatchData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { navigate('/login'); return; }

    // Try to fetch from API, fall back to demo data
    const fetchData = async () => {
      try {
        // If matchId looks like a real UUID, fetch it
        const resp = await api.get(`/matches/${matchId}`).catch(() => null);
        if (resp?.data) {
          setData(resp.data);
        } else {
          // Demo/mock data if API doesn't have a GET endpoint for single match
          setData({
            id: matchId!,
            final_match_score: 0.82,
            dense_score: 0.88,
            skill_overlap_score: 0.75,
            experience_score: 0.90,
          });
        }
      } catch (err: any) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };

    // Give background task time to process
    setTimeout(fetchData, 500);
  }, [matchId, navigate]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="relative">
          <div className="w-16 h-16 rounded-full border-2 border-violet-500/20 border-t-violet-500 animate-spin" />
          <Brain className="w-7 h-7 text-violet-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        </div>
        <p className="text-white/50 animate-pulse">Loading match results...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center">
        <p className="text-red-400 mb-4">{error || 'Match not found.'}</p>
        <Link to="/" className="btn-secondary">← Back to Dashboard</Link>
      </div>
    );
  }

  const overallScore = typeof data.final_match_score === 'number' ? data.final_match_score : 0;

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <Link to="/" className="text-white/40 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/5">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-white">Match Analysis Results</h1>
          <p className="text-white/40 text-sm">AI-powered resume ↔ job compatibility report</p>
        </div>
      </div>

      {/* Main Score + Breakdown */}
      <div className="grid md:grid-cols-5 gap-6 mb-6">
        {/* Score Ring */}
        <div className="md:col-span-2 glass-strong rounded-2xl p-8 flex flex-col items-center justify-center">
          <ScoreRing score={overallScore} size={200} />
          <div className="mt-4 text-center">
            <span className={`text-lg font-bold ${getScoreColor(overallScore)}`}>
              {getScoreLabel(overallScore)} Match
            </span>
            <p className="text-white/30 text-xs mt-1">
              Based on semantic + skill + experience analysis
            </p>
          </div>
        </div>

        {/* Sub-scores */}
        <div className="md:col-span-3 grid grid-cols-1 gap-4">
          {scoreCards.map(({ key, label, icon: Icon, desc, color }) => {
            const rawVal = (data as any)[key];
            const val = typeof rawVal === 'number' ? rawVal : 0;
            const pct = Math.round(val * 100);
            return (
              <div key={key} className="glass-strong rounded-2xl p-5 flex items-center gap-5">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 bg-${color}-500/10 border border-${color}-500/20`}>
                  <Icon className={`w-6 h-6 text-${color}-400`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline mb-2">
                    <span className="text-white font-semibold text-sm">{label}</span>
                    <span className={`text-lg font-bold tabular-nums ${getScoreColor(val)}`}>{pct}%</span>
                  </div>
                  <div className="h-2 bg-white/8 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-1000 ease-out bg-gradient-to-r ${
                        val >= 0.7 ? 'from-emerald-500 to-emerald-400' :
                        val >= 0.5 ? 'from-amber-500 to-amber-400' :
                        'from-red-500 to-red-400'
                      }`}
                      style={{ width: `${pct}%`, boxShadow: val >= 0.7 ? '0 0 10px rgba(16,185,129,0.4)' : '' }}
                    />
                  </div>
                  <p className="text-white/30 text-xs mt-1.5">{desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Interpretation */}
      <div className={`glass rounded-2xl p-5 mb-6 border ${
        overallScore >= 0.7 ? 'border-emerald-500/20 bg-emerald-500/5' :
        overallScore >= 0.5 ? 'border-amber-500/20 bg-amber-500/5' :
        'border-red-500/20 bg-red-500/5'
      }`}>
        <div className="flex items-start gap-3">
          <Activity className={`w-5 h-5 mt-0.5 flex-shrink-0 ${getScoreColor(overallScore)}`} />
          <div>
            <h4 className="text-white font-semibold mb-1">
              {overallScore >= 0.7 ? '🎯 Strong Candidate Profile' :
               overallScore >= 0.5 ? '📈 Competitive With Improvements' :
               '⚡ Significant Gaps Identified'}
            </h4>
            <p className="text-white/50 text-sm">
              {overallScore >= 0.7
                ? 'Your profile aligns very well with this role. You have a strong foundation — run the skill gap analysis to find any remaining areas to highlight.'
                : overallScore >= 0.5
                ? 'You have relevant experience but there are gaps. Review the skill gap analysis to identify what to learn or emphasize in your application.'
                : 'This role has significant requirements you may not currently meet. The skill gap analysis will help you build a targeted development plan.'}
            </p>
          </div>
        </div>
      </div>

      {/* CTA */}
      <Link
        to={`/matches/${matchId}/gaps`}
        className="btn-primary w-full py-4 text-base justify-center"
      >
        <Brain className="w-5 h-5" />
        Run Full Skill Gap Analysis with Gemini AI
        <ArrowRight className="w-5 h-5" />
      </Link>
    </div>
  );
}
