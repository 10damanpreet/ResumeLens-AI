import {
  GitBranch, Star, GitFork, ShieldCheck, AlertTriangle,
  ExternalLink, Code2
} from 'lucide-react';

export interface VerifiedRepo {
  name: string;
  description: string;
  language: string;
  stars: number;
  forks: number;
  html_url: string;
  updated_at: string;
}

export interface GitHubData {
  username: string;
  profile_url: string;
  avatar_url: string;
  name: string;
  bio: string;
  public_repos_count: number;
  total_stars: number;
  followers: number;
  languages: string[];
  credibility_score: number;
  credibility_badge: string;
  verified_repositories: VerifiedRepo[];
  source: string;
}

export interface AntiCheatData {
  integrity_status: 'VERIFIED_CLEAN' | 'TAMPERING_FLAGGED';
  tampering_detected: boolean;
  anomalies_count: number;
  anomalies: Array<{
    type: string;
    severity: string;
    detail: string;
  }>;
  anti_cheat_verdict: string;
}

export default function GitHubAuditCard({
  github,
  antiCheat,
}: {
  github: GitHubData;
  antiCheat: AntiCheatData;
}) {
  const isTampered = antiCheat?.tampering_detected;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Banner: HackerRank-Grade Code Signal & Anti-Cheat */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-100">
          <div className="flex items-start gap-4">
            <img
              src={github.avatar_url || 'https://github.com/identicons/app.png'}
              alt={github.name}
              className="w-16 h-16 rounded-2xl border-2 border-indigo-200 shadow-sm object-cover bg-slate-100"
            />
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-[11px] font-bold uppercase tracking-wider mb-1.5">
                HackerRank-Grade Engineering Signal
              </div>
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                {github.name}
                <a
                  href={github.profile_url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-slate-400 hover:text-slate-700 transition-colors"
                  title="Open GitHub Profile"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </h2>
              <p className="text-slate-600 text-xs mt-0.5 max-w-xl font-medium">
                {github.bio}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <div className="px-5 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-center shadow-xs">
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
                Code Credibility
              </span>
              <span className="text-3xl font-black text-indigo-600 tabular-nums">
                {github.credibility_score}
                <span className="text-sm font-bold text-slate-400">/100</span>
              </span>
            </div>

            <div className="flex flex-col gap-1 text-xs">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                <Code2 className="w-3.5 h-3.5 text-indigo-600" />
                {github.credibility_badge}
              </span>
              <span className="text-slate-500 text-[11px] px-1 font-medium">
                {github.public_repos_count} Public Repos &bull; {github.total_stars} Stars
              </span>
            </div>
          </div>
        </div>

        {/* Anti-Cheat & Invisible Text Security Audit */}
        <div className="pt-6">
          <div className={`p-4 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
            isTampered
              ? 'bg-rose-50 border-rose-200'
              : 'bg-emerald-50 border-emerald-200'
          }`}>
            <div className="flex items-start gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 border ${
                isTampered
                  ? 'bg-rose-100 border-rose-200 text-rose-600'
                  : 'bg-emerald-100 border-emerald-200 text-emerald-600'
              }`}>
                {isTampered ? <AlertTriangle className="w-5 h-5" /> : <ShieldCheck className="w-5 h-5" />}
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  Anti-Cheat & LLM Injection Defense:
                  <span className={`text-[11px] font-extrabold uppercase px-2.5 py-0.5 rounded-full ${
                    isTampered
                      ? 'bg-rose-600 text-white'
                      : 'bg-emerald-600 text-white'
                  }`}>
                    {antiCheat.anti_cheat_verdict}
                  </span>
                </h4>
                <p className="text-xs text-slate-600 mt-0.5 font-medium">
                  {isTampered
                    ? 'Security scan detected prompt injection or invisible text stuffing intended to game ATS scoring algorithms.'
                    : 'Verified clean: 0 white-on-white text blocks, 0 hidden prompt overrides, and 0 zero-width unicode artifacts.'}
                </p>
              </div>
            </div>

            <span className="text-[11px] text-slate-400 font-medium flex-shrink-0">
              Security Protocol v2.4 (HackerRank Spec)
            </span>
          </div>

          {/* Anomalies List (if any) */}
          {antiCheat.anomalies && antiCheat.anomalies.length > 0 && (
            <div className="mt-3 space-y-2">
              {antiCheat.anomalies.map((ano, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5 text-rose-600" />
                  <div>
                    <strong className="uppercase font-bold">{ano.type} ({ano.severity}):</strong> {ano.detail}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Verified Production Repositories */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <GitBranch className="w-5 h-5 text-indigo-600" />
              Verified Public Software Repositories
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Corroborates claims on resume against verifiable public code repositories and commit histories.
            </p>
          </div>
          <span className="text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full font-semibold hidden sm:block">
            {github.source}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {github.verified_repositories && github.verified_repositories.map((repo, idx) => (
            <div
              key={idx}
              className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs hover:border-indigo-400 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h4 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-1.5 break-all">
                    {repo.name}
                  </h4>
                  <a
                    href={repo.html_url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100 transition-colors flex-shrink-0"
                    title="View Repo"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed line-clamp-3 mb-4">
                  {repo.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span className="inline-flex items-center gap-1 text-indigo-600 font-semibold">
                  <span className="w-2 h-2 rounded-full bg-indigo-500" />
                  {repo.language}
                </span>

                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1 text-amber-600 font-semibold">
                    <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                    {repo.stars}
                  </span>
                  <span className="flex items-center gap-1 text-sky-600 font-semibold">
                    <GitFork className="w-3 h-3 text-sky-500" />
                    {repo.forks}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Language Breakdown Ribbon */}
      {github.languages && github.languages.length > 0 && (
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex items-center gap-3 flex-wrap">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Verified Stack Languages:
          </span>
          <div className="flex flex-wrap gap-2">
            {github.languages.map((lang, idx) => (
              <span
                key={idx}
                className="px-3 py-1 rounded-xl text-xs font-semibold bg-slate-50 text-slate-800 border border-slate-200"
              >
                {lang}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
