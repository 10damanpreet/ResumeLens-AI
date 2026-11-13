import { useState, useEffect } from 'react';
import { CheckCircle2, Circle, Clock, ExternalLink, BookOpen, Sparkles, Award } from 'lucide-react';

interface Gap {
  id: string;
  skill_name: string;
  severity: 'critical' | 'moderate' | 'minor';
  target_proficiency?: string | null;
  estimated_hours?: number | null;
}

interface StudyRoadmapProps {
  gaps: Gap[];
  matchId: string;
  onCopyPlan?: () => void;
}

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
  aws: { url: 'https://aws.amazon.com/training/', label: 'AWS Cloud Training' },
  react: { url: 'https://react.dev/learn', label: 'React Documentation' },
  fastapi: { url: 'https://fastapi.tiangolo.com/tutorial/', label: 'FastAPI Tutorial' },
  tableau: { url: 'https://www.tableau.com/learn/training', label: 'Tableau Free Training' },
  statistics: { url: 'https://www.khanacademy.org/math/statistics-probability', label: 'Khan Academy Stats' },
  graphql: { url: 'https://graphql.org/learn/', label: 'GraphQL Full Course' },
  git: { url: 'https://git-scm.com/doc', label: 'Git Reference Manual' },
};

function getResource(skillName: string) {
  const key = Object.keys(resourceLinks).find((k) => skillName.toLowerCase().includes(k));
  return key ? resourceLinks[key] : null;
}

export default function StudyRoadmap({ gaps, matchId }: StudyRoadmapProps) {
  const storageKey = `resumelens_completed_skills_${matchId}`;

  const [completed, setCompleted] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(completed));
    } catch {}
  }, [completed, storageKey]);

  const toggleSkill = (skillName: string) => {
    setCompleted((prev) => ({
      ...prev,
      [skillName]: !prev[skillName],
    }));
  };

  const totalGaps = gaps.length;
  const completedCount = gaps.filter((g) => completed[g.skill_name]).length;
  const totalHours = gaps.reduce((acc, g) => acc + (g.estimated_hours || 25), 0);
  const remainingHours = gaps
    .filter((g) => !completed[g.skill_name])
    .reduce((acc, g) => acc + (g.estimated_hours || 25), 0);
  const progressPercent = totalGaps > 0 ? Math.round((completedCount / totalGaps) * 100) : 0;

  return (
    <div className="glass-card rounded-2xl p-6 sm:p-7">
      {/* Header and Progress */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-violet-400" />
              Interactive Skill Mastery Roadmap
            </h3>
          </div>
          <p className="text-white/40 text-xs sm:text-sm">
            Check off skills as you learn them to track your role qualification progress.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-xl text-right">
            <div className="flex items-center gap-1.5 text-xs text-white/50">
              <Clock className="w-3.5 h-3.5 text-violet-400" />
              Est. Study Remaining
            </div>
            <div className="text-lg font-bold text-white tabular-nums">
              {remainingHours} <span className="text-xs font-normal text-white/40">/ {totalHours} hrs</span>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6 bg-white/[0.03] p-4 rounded-xl border border-white/5">
        <div className="flex justify-between items-center text-xs mb-2">
          <span className="font-semibold text-white/80 flex items-center gap-1.5">
            <Award className="w-4 h-4 text-amber-400" />
            Curriculum Completion
          </span>
          <span className="font-bold text-violet-300">
            {completedCount} of {totalGaps} Mastered ({progressPercent}%)
          </span>
        </div>
        <div className="h-2.5 w-full bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-violet-500 via-indigo-500 to-emerald-400 transition-all duration-500 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Checklist items */}
      <div className="space-y-3">
        {gaps.map((gap) => {
          const isDone = !!completed[gap.skill_name];
          const resource = getResource(gap.skill_name);
          const hours = gap.estimated_hours || 25;

          return (
            <div
              key={gap.id || gap.skill_name}
              onClick={() => toggleSkill(gap.skill_name)}
              className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl border transition-all duration-200 cursor-pointer ${
                isDone
                  ? 'bg-emerald-950/20 border-emerald-500/30 text-white/60'
                  : 'bg-white/[0.02] border-white/10 hover:border-violet-500/30 hover:bg-white/[0.05]'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <button
                  type="button"
                  aria-label={`Toggle ${gap.skill_name}`}
                  className="flex-shrink-0 text-white/40 hover:text-white transition-colors"
                >
                  {isDone ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  ) : (
                    <Circle className="w-5 h-5 text-white/30 hover:text-violet-400" />
                  )}
                </button>
                <div className="min-w-0">
                  <p
                    className={`font-semibold text-sm truncate ${
                      isDone ? 'line-through text-white/50' : 'text-white'
                    }`}
                  >
                    {gap.skill_name}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span
                      className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded ${
                        gap.severity === 'critical'
                          ? 'bg-red-500/20 text-red-300'
                          : gap.severity === 'moderate'
                          ? 'bg-amber-500/20 text-amber-300'
                          : 'bg-blue-500/20 text-blue-300'
                      }`}
                    >
                      {gap.severity}
                    </span>
                    <span className="text-white/40 text-xs">
                      Target: {gap.target_proficiency || 'Intermediate'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 self-end sm:self-auto" onClick={(e) => e.stopPropagation()}>
                <span className="flex items-center gap-1 text-xs text-white/50 bg-white/5 px-2.5 py-1 rounded-lg">
                  <Clock className="w-3.5 h-3.5 text-violet-400" />
                  {hours} hrs
                </span>

                {resource && (
                  <a
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-medium text-violet-400 hover:text-violet-300 bg-violet-500/10 hover:bg-violet-500/20 px-3 py-1 rounded-lg border border-violet-500/20 transition-colors"
                  >
                    <BookOpen className="w-3 h-3" />
                    {resource.label}
                    <ExternalLink className="w-3 h-3 ml-0.5" />
                  </a>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
