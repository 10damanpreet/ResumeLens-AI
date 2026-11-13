import { Link } from 'react-router-dom';
import { History, ArrowRight, Trash2 } from 'lucide-react';

export interface ScanItem {
  id: string;
  title: string;
  company: string;
  score: number;
  date: string;
}

interface RecentScansProps {
  scans: ScanItem[];
  onClear: () => void;
}

export default function RecentScans({ scans, onClear }: RecentScansProps) {
  if (scans.length === 0) return null;

  return (
    <div className="glass-card rounded-2xl p-6 mt-10">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-violet-400" />
          <h3 className="text-white font-bold text-sm">Your Recent Evaluations</h3>
          <span className="text-xs text-white/40 bg-white/5 px-2 py-0.5 rounded-full">
            {scans.length}
          </span>
        </div>
        <button
          onClick={onClear}
          className="text-xs text-white/40 hover:text-red-400 flex items-center gap-1 transition-colors"
          title="Clear recent scan history"
        >
          <Trash2 className="w-3.5 h-3.5" />
          Clear History
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {scans.slice(0, 6).map((item) => {
          const scorePercent = Math.round(item.score * 100);
          const colorClass =
            scorePercent >= 75
              ? 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10'
              : scorePercent >= 50
              ? 'text-amber-400 border-amber-500/30 bg-amber-500/10'
              : 'text-red-400 border-red-500/30 bg-red-500/10';

          return (
            <Link
              key={item.id}
              to={`/matches/${item.id}`}
              className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 hover:border-violet-500/40 hover:bg-white/[0.06] transition-all group flex items-center justify-between gap-3"
            >
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-white truncate group-hover:text-violet-300 transition-colors">
                  {item.title || 'Target Role'}
                </p>
                <p className="text-xs text-white/40 truncate mt-0.5">
                  {item.company || 'Direct Requisition'} • {item.date}
                </p>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <span className={`px-2 py-0.5 text-xs font-bold rounded-lg border tabular-nums ${colorClass}`}>
                  {scorePercent}%
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-white/20 group-hover:text-white/60 group-hover:translate-x-0.5 transition-all" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
