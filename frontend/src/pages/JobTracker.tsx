import { useState, useEffect } from 'react';
import {
  Plus,
  ArrowRight,
  ArrowLeft,
  Trash2,
  DollarSign,
  Calendar,
} from 'lucide-react';
import { useToast } from '../components/Toast';

export interface TrackerItem {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  appliedDate: string;
  matchScore: number;
  status: 'wishlist' | 'applied' | 'interviewing' | 'offer' | 'archived';
  notes: string;
}

const DEFAULT_TRACKER_ITEMS: TrackerItem[] = [
  {
    id: 'track-1',
    title: 'Senior Python & Backend Engineer',
    company: 'CloudScale Labs',
    location: 'Remote, US',
    salary: '$140k - $165k',
    appliedDate: '2026-11-10',
    matchScore: 86,
    status: 'interviewing',
    notes: 'Technical round scheduled on FastAPI async architecture & Redis caching.',
  },
  {
    id: 'track-2',
    title: 'Full Stack Engineer (React + FastAPI)',
    company: 'Nexus AI Solutions',
    location: 'San Francisco, CA',
    salary: '$130k - $150k',
    appliedDate: '2026-11-12',
    matchScore: 82,
    status: 'interviewing',
    notes: 'Recruiter phone screen passed. Preparing for take-home coding assignment.',
  },
  {
    id: 'track-3',
    title: 'Machine Learning Infrastructure Engineer',
    company: 'DataVanguard',
    location: 'New York, NY',
    salary: '$150k - $180k',
    appliedDate: '2026-11-05',
    matchScore: 78,
    status: 'applied',
    notes: 'Resume tailored with PyTorch and Docker bullet points.',
  },
  {
    id: 'track-4',
    title: 'Cloud DevOps Specialist',
    company: 'HyperScale Systems',
    location: 'Remote',
    salary: '$145k - $170k',
    appliedDate: '2026-11-02',
    matchScore: 71,
    status: 'applied',
    notes: 'Application submitted through referral.',
  },
  {
    id: 'track-5',
    title: 'Staff Software Architect',
    company: 'Stripe',
    location: 'Seattle, WA',
    salary: '$190k - $220k',
    appliedDate: '2026-11-14',
    matchScore: 68,
    status: 'wishlist',
    notes: 'Need to complete Kubernetes & distributed systems study roadmap before applying.',
  },
  {
    id: 'track-6',
    title: 'Backend Systems Engineer',
    company: 'FinTech Pulse',
    location: 'Austin, TX',
    salary: '$135k - $155k',
    appliedDate: '2026-10-28',
    matchScore: 91,
    status: 'offer',
    notes: 'Formal offer received ($148,000 base + equity). Reviewing contract.',
  },
];

const COLUMNS = [
  { id: 'wishlist', label: 'Wishlist & Saved', icon: '💡', badgeBg: 'bg-slate-100 text-slate-700' },
  { id: 'applied', label: 'Applied', icon: '📝', badgeBg: 'bg-blue-100 text-blue-800' },
  { id: 'interviewing', label: 'Interviewing', icon: '🎙️', badgeBg: 'bg-violet-100 text-violet-800' },
  { id: 'offer', label: 'Offer Received', icon: '🏆', badgeBg: 'bg-emerald-100 text-emerald-800' },
  { id: 'archived', label: 'Archived', icon: '📁', badgeBg: 'bg-slate-100 text-slate-600' },
] as const;

export default function JobTracker() {
  const { showToast } = useToast();
  const [items, setItems] = useState<TrackerItem[]>(() => {
    const saved = localStorage.getItem('resumelens_job_tracker');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return DEFAULT_TRACKER_ITEMS;
      }
    }
    return DEFAULT_TRACKER_ITEMS;
  });

  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCompany, setNewCompany] = useState('');
  const [newSalary, setNewSalary] = useState('');
  const [newScore, setNewScore] = useState(75);
  const [newNotes, setNewNotes] = useState('');

  useEffect(() => {
    localStorage.setItem('resumelens_job_tracker', JSON.stringify(items));
  }, [items]);

  const moveItem = (id: string, direction: 'left' | 'right') => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        const currentIdx = COLUMNS.findIndex((col) => col.id === item.status);
        const nextIdx = direction === 'right' ? currentIdx + 1 : currentIdx - 1;
        if (nextIdx >= 0 && nextIdx < COLUMNS.length) {
          const nextStatus = COLUMNS[nextIdx].id as TrackerItem['status'];
          showToast(`Moved ${item.company} to ${COLUMNS[nextIdx].label}`, 'info');
          return { ...item, status: nextStatus };
        }
        return item;
      })
    );
  };

  const deleteItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
    showToast('Job application removed from tracker', 'info');
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newCompany) return;

    const newItem: TrackerItem = {
      id: `track-${Date.now()}`,
      title: newTitle,
      company: newCompany,
      location: 'Remote / Hybrid',
      salary: newSalary || '$120k - $145k',
      appliedDate: new Date().toISOString().split('T')[0],
      matchScore: Number(newScore) || 75,
      status: 'wishlist',
      notes: newNotes || 'Saved from ResumeLens job matching.',
    };

    setItems((prev) => [newItem, ...prev]);
    setShowAddModal(false);
    setNewTitle('');
    setNewCompany('');
    setNewSalary('');
    setNewNotes('');
    showToast('Job added to your application board!', 'success');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Job Application Tracker
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-violet-100 text-violet-800 text-xs font-bold border border-violet-200">
              Kanban Pipeline
            </span>
          </div>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            Manage your matched career applications, interview stages, and offers in one place
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddModal(true)}
            className="btn-primary py-2.5 px-4 text-xs font-bold flex items-center gap-1.5 shadow-md shadow-violet-200"
          >
            <Plus className="w-4 h-4" />
            Add Application
          </button>
        </div>
      </div>

      {/* Kanban Board Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {COLUMNS.map((col, colIdx) => {
          const colItems = items.filter((item) => item.status === col.id);

          return (
            <div
              key={col.id}
              className="bg-slate-50/80 rounded-2xl p-4 flex flex-col border border-slate-200 min-h-[550px]"
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-base">{col.icon}</span>
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    {col.label}
                  </h3>
                </div>
                <span className={`w-5 h-5 rounded-full text-[11px] font-bold flex items-center justify-center ${col.badgeBg}`}>
                  {colItems.length}
                </span>
              </div>

              {/* Cards List */}
              <div className="space-y-3 flex-1 overflow-y-auto pr-1">
                {colItems.length === 0 ? (
                  <div className="py-12 text-center text-slate-400 text-xs border border-dashed border-slate-200 rounded-xl">
                    No applications
                  </div>
                ) : (
                  colItems.map((item) => {
                    const isHigh = item.matchScore >= 80;
                    const isMed = item.matchScore >= 65 && item.matchScore < 80;

                    return (
                      <div
                        key={item.id}
                        className="p-3.5 rounded-xl bg-white border border-slate-200 hover:border-indigo-400/80 transition-all hover:shadow-md shadow-xs group"
                      >
                        {/* Company & Score */}
                        <div className="flex items-center justify-between gap-2 mb-1.5">
                          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider truncate">
                            {item.company}
                          </span>
                          <span
                            className={`text-[11px] font-extrabold px-2 py-0.5 rounded-full border ${
                              isHigh
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : isMed
                                ? 'bg-amber-50 text-amber-700 border-amber-200'
                                : 'bg-rose-50 text-rose-700 border-rose-200'
                            }`}
                          >
                            {item.matchScore}% Match
                          </span>
                        </div>

                        {/* Title */}
                        <h4 className="text-sm font-bold text-slate-900 line-clamp-1 mb-2">
                          {item.title}
                        </h4>

                        {/* Details */}
                        <div className="space-y-1 text-[11px] text-slate-600 mb-3">
                          <div className="flex items-center gap-1.5">
                            <DollarSign className="w-3 h-3 text-emerald-600" />
                            <span>{item.salary}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-3 h-3 text-slate-400" />
                            <span>{item.appliedDate}</span>
                          </div>
                        </div>

                        {/* Notes preview */}
                        {item.notes && (
                          <p className="text-[11px] text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-200 mb-3 line-clamp-2">
                            {item.notes}
                          </p>
                        )}

                        {/* Card Move Actions */}
                        <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-slate-400">
                          <button
                            onClick={() => deleteItem(item.id)}
                            className="hover:text-rose-600 transition-colors p-1"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>

                          <div className="flex items-center gap-1">
                            {colIdx > 0 && (
                              <button
                                onClick={() => moveItem(item.id, 'left')}
                                className="p-1 rounded hover:bg-slate-100 hover:text-slate-800 transition-colors"
                                title="Move left"
                              >
                                <ArrowLeft className="w-3.5 h-3.5" />
                              </button>
                            )}
                            {colIdx < COLUMNS.length - 1 && (
                              <button
                                onClick={() => moveItem(item.id, 'right')}
                                className="p-1 rounded hover:bg-slate-100 hover:text-slate-800 transition-colors"
                                title="Move right"
                              >
                                <ArrowRight className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Application Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-2xl">
            <h3 className="text-xl font-bold text-slate-900 mb-1">Add Job Application</h3>
            <p className="text-xs text-slate-500 mb-6">Track a new target opportunity in your pipeline</p>

            <form onSubmit={handleAddItem} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Job Title *</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Senior Backend Engineer"
                  className="input-field text-sm w-full"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Company Name *</label>
                <input
                  type="text"
                  required
                  value={newCompany}
                  onChange={(e) => setNewCompany(e.target.value)}
                  placeholder="e.g. Google, Stripe, Datadog"
                  className="input-field text-sm w-full"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Estimated Salary</label>
                  <input
                    type="text"
                    value={newSalary}
                    onChange={(e) => setNewSalary(e.target.value)}
                    placeholder="e.g. $130k - $160k"
                    className="input-field text-sm w-full"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Match Score %</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={newScore}
                    onChange={(e) => setNewScore(Number(e.target.value))}
                    className="input-field text-sm w-full"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Notes / Target Strategy</label>
                <textarea
                  rows={3}
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  placeholder="e.g. Applied via employee referral. Need to emphasize FastAPI experience."
                  className="input-field text-sm w-full resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="btn-secondary py-2 px-4 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary py-2 px-5 text-xs font-bold shadow-md shadow-violet-200"
                >
                  Add to Wishlist
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
