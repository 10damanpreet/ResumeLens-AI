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
    <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 mt-10 shadow-sm">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-indigo-50 border border-indigo-200 flex items-center justify-center">
            <History className="w-4 h-4 text-indigo-600" />
          </div>
          <h3 className="text-slate-900 font-extrabold text-sm sm:text-base">Your Recent Evaluations</h3>
          <span className="text-xs text-slate-700 bg-slate-100 font-extrabold px-2.5 py-0.5 rounded-full border border-slate-200">
            {scans.length}
          </span>
        </div>
        <button
          onClick={onClear}
          className="text-xs text-slate-500 hover:text-rose-600 flex items-center gap-1 transition-colors font-bold px-2.5 py-1 rounded-lg hover:bg-rose-50"
          title="Clear recent scan history"
        >
          <Trash2 className="w-3.5 h-3.5" />
          Clear History
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
        {scans.slice(0, 6).map((item) => {
          const scorePercent = Math.round(item.score * 100);
          const colorClass =
            scorePercent >= 75
              ? 'text-emerald-700 border-emerald-200 bg-emerald-50 font-black'
              : scorePercent >= 50
              ? 'text-amber-700 border-amber-200 bg-amber-50 font-black'
              : 'text-rose-700 border-rose-200 bg-rose-50 font-black';

          return (
            <Link
              key={item.id}
              to={`/matches/${item.id}`}
              className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/40 hover:shadow-md transition-all group flex items-center justify-between gap-3 shadow-xs"
            >
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-slate-900 truncate group-hover:text-indigo-600 transition-colors">
                  {item.title || 'Target Role'}
                </p>
                <p className="text-xs text-slate-500 truncate mt-0.5 font-semibold">
                  {item.company || 'Direct Requisition'} &bull; {item.date}
                </p>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <span className={`px-2.5 py-1 text-xs rounded-xl border tabular-nums ${colorClass}`}>
                  {scorePercent}%
                </span>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
