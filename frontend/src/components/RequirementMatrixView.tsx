import { useState } from 'react';
import {
  CheckCircle2, AlertCircle, XCircle, Search,
  Briefcase, GraduationCap, Sparkles, Building2
} from 'lucide-react';

export interface RequirementRow {
  id: string;
  name: string;
  category: string;
  jd_sentence: string;
  status: 'evidenced' | 'partial' | 'missing';
  evidence_snippet: string;
  confidence: number;
  is_mandatory: boolean;
  importance: string;
  matched_keywords: string[];
  suggestion?: string | null;
}

export interface RequirementMatrixData {
  job_title: string;
  total_requirements: number;
  evidenced_count: number;
  partial_count: number;
  missing_count: number;
  coverage_percentage: number;
  ratio_label: string;
  requirements: RequirementRow[];
}

export default function RequirementMatrixView({
  data,
  company = 'Target Organization',
}: {
  data: RequirementMatrixData;
  company?: string;
}) {
  const [filter, setFilter] = useState<'all' | 'evidenced' | 'partial' | 'missing'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredRequirements = data.requirements.filter((req) => {
    const matchesFilter = filter === 'all' || req.status === filter;
    const matchesSearch =
      req.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.jd_sentence.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.evidence_snippet.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStatusBadge = (status: string) => {
    if (status === 'evidenced') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          Evidenced
        </span>
      );
    }
    if (status === 'partial') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
          <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
          Partial Match
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
        <XCircle className="w-3.5 h-3.5 text-rose-400" />
        Not Detected
      </span>
    );
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Requisition & Coverage Summary Ribbon */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-100">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-50 border border-pink-200 text-pink-700 text-xs font-bold uppercase tracking-wider mb-2">
              Traceable Sentence-Level Verification
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
              Requirement &rarr; Evidence Matrix
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm mt-1 max-w-2xl font-medium">
              Every job description requirement is extracted from a specific sentence and mapped to exact resume evidence behind its compatibility score.
            </p>
          </div>

          <div className="flex items-center gap-4 flex-wrap">
            <div className="px-5 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-center shadow-xs">
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
                Evidence Coverage
              </span>
              <span className="text-3xl font-black text-emerald-600 tabular-nums">
                {data.coverage_percentage}%
              </span>
            </div>
            <div className="flex flex-col gap-1 text-xs text-slate-600">
              <span className="text-slate-900 font-bold">
                {data.ratio_label}
              </span>
              <span className="text-slate-400 text-[11px] font-medium">
                {data.missing_count} criteria unevidenced
              </span>
            </div>
          </div>
        </div>

        {/* Structured Job Description Metadata Card (Matching Image 3) */}
        <div className="pt-6 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-slate-400 block text-[11px] mb-0.5">Target Role</span>
            <span className="font-bold text-slate-900 flex items-center gap-1">
              <Briefcase className="w-3.5 h-3.5 text-indigo-600" />
              {data.job_title}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-slate-400 block text-[11px] mb-0.5">Company</span>
            <span className="font-bold text-slate-900 flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5 text-emerald-600" />
              {company}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-slate-400 block text-[11px] mb-0.5">Education Check</span>
            <span className="font-bold text-slate-900 flex items-center gap-1">
              <GraduationCap className="w-3.5 h-3.5 text-sky-600" />
              B.E. Computer Engineering (9.25 CGPA)
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-slate-400 block text-[11px] mb-0.5">Audit Status</span>
            <span className="font-bold text-emerald-600 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              100% Traceable Evidence
            </span>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setFilter('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filter === 'all'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200 shadow-xs'
            }`}
          >
            All Criteria ({data.total_requirements})
          </button>
          <button
            onClick={() => setFilter('evidenced')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filter === 'evidenced'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-white text-emerald-700 hover:bg-emerald-50 border border-emerald-200 shadow-xs'
            }`}
          >
            Evidenced ({data.evidenced_count})
          </button>
          <button
            onClick={() => setFilter('partial')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filter === 'partial'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'bg-white text-amber-700 hover:bg-amber-50 border border-amber-200 shadow-xs'
            }`}
          >
            Partial ({data.partial_count})
          </button>
          <button
            onClick={() => setFilter('missing')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filter === 'missing'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'bg-white text-rose-700 hover:bg-rose-50 border border-rose-200 shadow-xs'
            }`}
          >
            Not Detected ({data.missing_count})
          </button>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search criteria or evidence..."
            className="w-full pl-9 pr-3 py-1.5 rounded-xl text-xs bg-white border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 shadow-xs"
          />
        </div>
      </div>

      {/* Requirement -> Evidence Cards / Table */}
      <div className="space-y-4">
        {filteredRequirements.map((req) => (
          <div
            key={req.id}
            className={`bg-white border rounded-2xl p-5 transition-all shadow-xs ${
              req.status === 'evidenced'
                ? 'border-emerald-200 hover:border-emerald-400'
                : req.status === 'partial'
                ? 'border-amber-200 hover:border-amber-400'
                : 'border-rose-200 hover:border-rose-400'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
              <div className="flex items-center gap-2.5 flex-wrap">
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                  {req.category}
                </span>
                <h4 className="text-sm font-bold text-slate-900">{req.name}</h4>
                {req.is_mandatory && (
                  <span className="text-[10px] font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-full">
                    Required
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[11px] text-slate-500 font-medium">
                  Confidence: <strong className="text-slate-900">{Math.round(req.confidence * 100)}%</strong>
                </span>
                {getStatusBadge(req.status)}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-3 border-t border-slate-100">
              {/* JD Requirement Source */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-bold text-indigo-700 uppercase tracking-wider block mb-1">
                  Job Description Sentence
                </span>
                <p className="text-slate-700 leading-relaxed italic">
                  &ldquo;{req.jd_sentence}&rdquo;
                </p>
              </div>

              {/* Matched Resume Evidence Quote */}
              <div className={`p-3 rounded-xl border ${
                req.status === 'evidenced'
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  : req.status === 'partial'
                  ? 'bg-amber-50 border-amber-200 text-amber-900'
                  : 'bg-rose-50 border-rose-200 text-rose-900'
              }`}>
                <span className="text-[10px] font-bold uppercase tracking-wider block mb-1">
                  Candidate Resume Evidence Snippet
                </span>
                <p className="leading-relaxed font-medium">
                  {req.evidence_snippet}
                </p>
                {req.suggestion && (
                  <div className="mt-2 pt-2 border-t border-amber-200 flex items-start gap-1 text-[11px] text-amber-800">
                    <Sparkles className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-amber-600" />
                    <span><strong>ATS Advisory:</strong> {req.suggestion}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
