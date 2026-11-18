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
  node: { url: 'https://nodejs.org/en/learn', label: 'Node.js Official Guide' },
  express: { url: 'https://expressjs.com/en/starter/installing.html', label: 'Express Docs' },
  security: { url: 'https://owasp.org/www-project-top-ten/', label: 'OWASP Security Guide' },
  cloud: { url: 'https://aws.amazon.com/getting-started/', label: 'Cloud Architecture Basics' },
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
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
      {/* Header and Progress */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 flex items-center gap-2 tracking-tight">
              <Sparkles className="w-5 h-5 text-indigo-600" />
              Interactive Skill Mastery Roadmap
            </h3>
          </div>
          <p className="text-slate-500 text-xs sm:text-sm font-medium">
            Check off skills as you learn them to track your role qualification progress.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-2xl text-right shadow-2xs">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
              <Clock className="w-3.5 h-3.5 text-indigo-600" />
              Est. Study Remaining
            </div>
            <div className="text-lg font-black text-slate-900 tabular-nums">
              {remainingHours} <span className="text-xs font-bold text-slate-400">/ {totalHours} hrs</span>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6 bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200">
        <div className="flex justify-between items-center text-xs mb-2">
          <span className="font-bold text-slate-800 flex items-center gap-1.5">
            <Award className="w-4 h-4 text-amber-500" />
            Curriculum Completion
          </span>
          <span className="font-extrabold text-indigo-700">
            {completedCount} of {totalGaps} Mastered ({progressPercent}%)
          </span>
        </div>
        <div className="h-3 w-full bg-slate-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-indigo-600 via-violet-600 to-emerald-500 transition-all duration-500 rounded-full shadow-xs"
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
              className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl border transition-all duration-200 cursor-pointer shadow-2xs ${
                isDone
                  ? 'bg-emerald-50/70 border-emerald-200 text-slate-500'
                  : 'bg-white border-slate-200 hover:border-indigo-400 hover:bg-slate-50/70'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <button
                  type="button"
                  aria-label={`Toggle ${gap.skill_name}`}
                  className="flex-shrink-0 transition-colors"
                >
                  {isDone ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  ) : (
                    <Circle className="w-5 h-5 text-slate-400 hover:text-indigo-600" />
                  )}
                </button>
                <div className="min-w-0">
                  <p
                    className={`font-bold text-sm truncate ${
                      isDone ? 'line-through text-slate-400' : 'text-slate-900'
                    }`}
                  >
                    {gap.skill_name}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span
                      className={`text-[10px] uppercase font-black tracking-wider px-2 py-0.5 rounded-md border ${
                        gap.severity === 'critical'
                          ? 'bg-rose-50 text-rose-800 border-rose-200'
                          : gap.severity === 'moderate'
                          ? 'bg-amber-50 text-amber-800 border-amber-200'
                          : 'bg-blue-50 text-blue-800 border-blue-200'
                      }`}
                    >
                      {gap.severity}
                    </span>
                    <span className="text-slate-500 text-xs font-medium">
                      Target: <strong className="text-slate-800">{gap.target_proficiency || 'Intermediate'}</strong>
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 self-end sm:self-auto" onClick={(e) => e.stopPropagation()}>
                <span className="flex items-center gap-1.5 text-xs font-bold text-slate-700 bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-xl shadow-2xs">
                  <Clock className="w-3.5 h-3.5 text-indigo-600" />
                  {hours} hrs
                </span>

                {resource && (
                  <a
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-bold text-indigo-700 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-xl border border-indigo-200 transition-colors shadow-2xs"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
                    <span>{resource.label}</span>
                    <ExternalLink className="w-3 h-3 ml-0.5 text-indigo-500" />
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
