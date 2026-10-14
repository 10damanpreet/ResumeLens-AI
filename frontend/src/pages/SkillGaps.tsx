import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Brain, Zap, AlertTriangle, Info, CheckCircle2, BookOpen, ExternalLink } from 'lucide-react';
import { api, getErrorMessage } from '../api/client';

interface Gap {
  id: string;
  skill_name: string;
  severity: 'critical' | 'moderate' | 'minor';
  target_proficiency?: string | null;
  estimated_hours?: number | null;
  llm_model_version?: string | null;
}

const severityConfig = {
  critical: {
    label: 'Critical Gap',
    bg: 'bg-red-500/10',
    border: 'border-red-500/30',
    badge: 'bg-red-500/20 text-red-300 border border-red-500/30',
    icon: AlertTriangle,
    iconColor: 'text-red-400',
    glow: 'shadow-red-500/10',
  },
  moderate: {
    label: 'Moderate Gap',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/30',
    badge: 'bg-amber-500/20 text-amber-300 border border-amber-500/30',
    icon: Zap,
    iconColor: 'text-amber-400',
    glow: 'shadow-amber-500/10',
  },
  minor: {
    label: 'Minor Gap',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/30',
    badge: 'bg-blue-500/20 text-blue-300 border border-blue-500/30',
    icon: Info,
    iconColor: 'text-blue-400',
    glow: 'shadow-blue-500/10',
  },
};

const resourceLinks: Record<string, { url: string; label: string }> = {
  python: { url: 'https://docs.python.org/3/tutorial/', label: 'Python Official Tutorial' },
  pandas: { url: 'https://pandas.pydata.org/docs/user_guide/', label: 'Pandas User Guide' },
  numpy: { url: 'https://numpy.org/doc/stable/user/quickstart.html', label: 'NumPy Quickstart' },
  sql: { url: 'https://www.w3schools.com/sql/', label: 'SQL Practice Guide' },
  'scikit-learn': { url: 'https://scikit-learn.org/stable/tutorial/', label: 'Scikit-Learn Guide' },
  sklearn: { url: 'https://scikit-learn.org/stable/tutorial/', label: 'Scikit-Learn Guide' },
  'machine learning': { url: 'https://developers.google.com/machine-learning/crash-course', label: 'Google ML Crash Course' },
  pytorch: { url: 'https://pytorch.org/tutorials/', label: 'PyTorch Tutorials' },
  tensorflow: { url: 'https://www.tensorflow.org/tutorials', label: 'TensorFlow Docs' },
  docker: { url: 'https://docs.docker.com/get-started/', label: 'Docker Docs' },
  kubernetes: { url: 'https://kubernetes.io/docs/tutorials/', label: 'Kubernetes Tutorials' },
  aws: { url: 'https://aws.amazon.com/training/', label: 'AWS Training' },
  react: { url: 'https://react.dev/learn', label: 'React Docs' },
  tableau: { url: 'https://www.tableau.com/learn/training', label: 'Tableau Free Training' },
  statistics: { url: 'https://www.khanacademy.org/math/statistics-probability', label: 'Khan Academy Stats' },
  graphql: { url: 'https://graphql.org/learn/', label: 'GraphQL Learn' },
};

function getResource(skillName: string) {
  const key = Object.keys(resourceLinks).find(k => skillName.toLowerCase().includes(k));
  return key ? resourceLinks[key] : null;
}

export default function SkillGaps() {
  const { matchId } = useParams();
  const navigate = useNavigate();
  const [gaps, setGaps] = useState<Gap[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { navigate('/login'); return; }

    const load = async () => {
      try {
        // First try to get existing gaps
        const existingResp = await api.get(`/matches/${matchId}/gaps`).catch(() => null);
        if (existingResp?.data?.length) {
          setGaps(existingResp.data);
          setLoading(false);
          return;
        }
        // Otherwise trigger generation
        const resp = await api.post(`/matches/${matchId}/gaps`);
        setGaps(resp.data);
      } catch (err: any) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };

    // Small delay for dramatic effect
    setTimeout(load, 800);
  }, [matchId, navigate]);

  const criticalCount = gaps.filter(g => g.severity === 'critical').length;
  const moderateCount = gaps.filter(g => g.severity === 'moderate').length;
  const minorCount = gaps.filter(g => g.severity === 'minor').length;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <Link to={`/matches/${matchId}`} className="text-white/40 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/5">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-white">Skill Gap Analysis</h1>
          <p className="text-white/40 text-sm flex items-center gap-1.5">
            <Brain className="w-3.5 h-3.5" /> Powered by Gemini AI
          </p>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="glass-strong rounded-2xl p-12 text-center">
          <div className="relative w-16 h-16 mx-auto mb-6">
            <div className="absolute inset-0 rounded-full border-2 border-violet-500/20 border-t-violet-500 animate-spin" />
            <Brain className="w-7 h-7 text-violet-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
          </div>
          <h3 className="text-white font-bold text-lg mb-2">Gemini is analyzing your profile...</h3>
          <p className="text-white/40 text-sm">Comparing your skills against the job requirements</p>
          <div className="flex justify-center gap-1 mt-6">
            {[0, 1, 2].map(i => (
              <div
                key={i}
                className="w-2 h-2 rounded-full bg-violet-500 animate-bounce"
                style={{ animationDelay: `${i * 0.15}s` }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="glass border border-red-500/30 rounded-2xl p-6 text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <Link to={`/matches/${matchId}`} className="btn-secondary">← Back to Results</Link>
        </div>
      )}

      {/* Results */}
      {!loading && !error && (
        <>
          {/* Summary Bar */}
          {gaps.length > 0 && (
            <div className="glass rounded-2xl p-5 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-semibold">Gap Summary</h3>
                <span className="text-white/40 text-sm">{gaps.length} gaps identified</span>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-center">
                  <div className="text-2xl font-black text-red-400">{criticalCount}</div>
                  <div className="text-xs text-red-300/70 mt-0.5">Critical</div>
                </div>
                <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3 text-center">
                  <div className="text-2xl font-black text-amber-400">{moderateCount}</div>
                  <div className="text-xs text-amber-300/70 mt-0.5">Moderate</div>
                </div>
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-3 text-center">
                  <div className="text-2xl font-black text-blue-400">{minorCount}</div>
                  <div className="text-xs text-blue-300/70 mt-0.5">Minor</div>
                </div>
              </div>
            </div>
          )}

          {/* Gap Cards */}
          {gaps.length > 0 ? (
            <div className="space-y-4">
              {['critical', 'moderate', 'minor'].map(sev =>
                gaps
                  .filter(g => g.severity === sev)
                  .map(gap => {
                    const config = severityConfig[gap.severity] || severityConfig.minor;
                    const Icon = config.icon;
                    const resource = getResource(gap.skill_name || '');

                    return (
                      <div
                        key={gap.id}
                        className={`glass-strong rounded-2xl p-5 border ${config.border} ${config.bg} shadow-lg ${config.glow} hover:scale-[1.01] transition-transform duration-200`}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${config.bg} border ${config.border}`}>
                              <Icon className={`w-5 h-5 ${config.iconColor}`} />
                            </div>
                            <div className="min-w-0">
                              <h4 className="text-white font-bold text-base">{gap.skill_name}</h4>
                              <p className="text-white/40 text-xs mt-0.5">
                                {config.label}
                                {gap.estimated_hours ? ` · ~${gap.estimated_hours}h to learn` : ''}
                                {gap.target_proficiency ? ` · Target: ${gap.target_proficiency}` : ''}
                              </p>
                            </div>
                          </div>
                          <span className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full flex-shrink-0 ${config.badge}`}>
                            {gap.severity}
                          </span>
                        </div>

                        {resource && (
                          <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between">
                            <div className="flex items-center gap-1.5 text-white/30 text-xs">
                              <BookOpen className="w-3.5 h-3.5" />
                              Recommended resource
                            </div>
                            <a
                              href={resource.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`flex items-center gap-1.5 text-xs font-medium transition-colors ${config.iconColor} hover:opacity-80`}
                            >
                              {resource.label}
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                        )}
                      </div>
                    );
                  })
              )}
            </div>
          ) : (
            <div className="glass-strong rounded-2xl p-12 text-center">
              <CheckCircle2 className="w-14 h-14 text-emerald-400 mx-auto mb-4" />
              <h3 className="text-white font-bold text-xl mb-2">No Significant Gaps Found!</h3>
              <p className="text-white/50 text-sm max-w-sm mx-auto">
                Your profile strongly matches this role. You are well-qualified to apply — consider highlighting your relevant experience.
              </p>
            </div>
          )}

          {/* LLM Attribution */}
          {gaps.length > 0 && (
            <p className="text-white/20 text-xs text-center mt-6 flex items-center justify-center gap-1.5">
              <Brain className="w-3.5 h-3.5" />
              Analysis generated by Gemini AI ({gaps[0]?.llm_model_version || 'gemini-1.5-flash'})
            </p>
          )}
        </>
      )}
    </div>
  );
}
