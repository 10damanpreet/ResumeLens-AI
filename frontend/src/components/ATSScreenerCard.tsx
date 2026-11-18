import { useState } from 'react';
import {
  AlertTriangle, CheckCircle2,
  ChevronDown, ChevronUp, HelpCircle,
  Building2
} from 'lucide-react';

export interface PlatformScore {
  name: string;
  vendor: string;
  market_share: string;
  description: string;
  overall_score: number;
  passing_score: number;
  passes_filter: boolean;
  keyword_strategy: string;
  quirk_tips: string[];
}

export interface GranularBars {
  parsed_parsing: number;
  parsed_structure: number;
  required_terminology: number;
  required_skill_evidence: number;
  preferred_skill_coverage: number;
  requirement_coverage: number;
  evidence_quality: number;
}

export interface RiskItem {
  severity: 'critical' | 'moderate' | 'minor';
  title: string;
  description: string;
  remedy: string;
}

export interface ATSScreenerData {
  overall_readiness_score: number;
  required_requirements_evidenced: string;
  evidenced_count: number;
  total_requirements: number;
  risks_flagged_count: number;
  risks: RiskItem[];
  breakdown_bars: GranularBars;
  platforms: PlatformScore[];
  matched_keywords: string[];
  missing_keywords: string[];
}

export default function ATSScreenerCard({ data }: { data: ATSScreenerData }) {
  const [expandedPlatform, setExpandedPlatform] = useState<string | null>(null);
  const [showCalculationInfo, setShowCalculationInfo] = useState(false);

  const togglePlatform = (name: string) => {
    setExpandedPlatform(expandedPlatform === name ? null : name);
  };

  const getBarColor = (val: number) => {
    if (val >= 80) return 'bg-emerald-500 shadow-emerald-500/30';
    if (val >= 55) return 'bg-amber-500 shadow-amber-500/30';
    return 'bg-rose-500 shadow-rose-500/30';
  };

  const getSeverityBadge = (sev: string) => {
    if (sev === 'critical') return 'bg-rose-500/20 text-rose-300 border-rose-500/30';
    if (sev === 'moderate') return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
    return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Banner: Overall ATS Readiness Dial & Granular Progress Bars */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-100">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-2">
              Enterprise ATS Multi-Platform Engine
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
              ATS-Style Résumé Analysis
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm mt-1 max-w-2xl font-medium">
              Parsing, structure, terminology, and evidence checks simulated across 6 major applicant tracking systems — each explained and traceable.
            </p>
          </div>

          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 shadow-xs">
              <div className="text-center">
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
                  ATS Readiness
                </span>
                <span className="text-3xl font-black text-slate-900 tabular-nums">
                  {data.overall_readiness_score}
                  <span className="text-sm font-bold text-slate-400">/100</span>
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-1 text-xs text-slate-600 font-medium">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Evidenced Criteria: <strong className="text-slate-900">{data.required_requirements_evidenced}</strong>
              </span>
              <span className="flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                Risks Flagged: <strong className="text-amber-700">{data.risks_flagged_count}</strong>
              </span>
            </div>
          </div>
        </div>

        {/* Granular Breakdown Bars (Exact match with Career Atlas inspection layout) */}
        <div className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
          <div>
            <div className="flex justify-between items-center text-xs mb-1.5">
              <span className="text-slate-700 font-semibold">Parsed Parsing Integrity</span>
              <span className="font-bold text-emerald-600 tabular-nums">{data.breakdown_bars.parsed_parsing}%</span>
            </div>
            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${getBarColor(data.breakdown_bars.parsed_parsing)}`}
                style={{ width: `${data.breakdown_bars.parsed_parsing}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center text-xs mb-1.5">
              <span className="text-slate-700 font-semibold">Standard Section Structure</span>
              <span className="font-bold text-emerald-600 tabular-nums">{data.breakdown_bars.parsed_structure}%</span>
            </div>
            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${getBarColor(data.breakdown_bars.parsed_structure)}`}
                style={{ width: `${data.breakdown_bars.parsed_structure}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center text-xs mb-1.5">
              <span className="text-slate-700 font-semibold">Required Terminology (Keywords)</span>
              <span className="font-bold text-slate-900 tabular-nums">{data.breakdown_bars.required_terminology}%</span>
            </div>
            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${getBarColor(data.breakdown_bars.required_terminology)}`}
                style={{ width: `${data.breakdown_bars.required_terminology}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center text-xs mb-1.5">
              <span className="text-slate-700 font-semibold">Required Skill Evidence Depth</span>
              <span className="font-bold text-slate-900 tabular-nums">{data.breakdown_bars.required_skill_evidence}%</span>
            </div>
            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${getBarColor(data.breakdown_bars.required_skill_evidence)}`}
                style={{ width: `${data.breakdown_bars.required_skill_evidence}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center text-xs mb-1.5">
              <span className="text-slate-700 font-semibold">Requirement Coverage Ratio</span>
              <span className="font-bold text-slate-900 tabular-nums">{data.breakdown_bars.requirement_coverage}%</span>
            </div>
            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${getBarColor(data.breakdown_bars.requirement_coverage)}`}
                style={{ width: `${data.breakdown_bars.requirement_coverage}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center text-xs mb-1.5">
              <span className="text-slate-700 font-semibold">Evidence Quality (Google XYZ Metrics)</span>
              <span className="font-bold text-slate-900 tabular-nums">{data.breakdown_bars.evidence_quality}%</span>
            </div>
            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${getBarColor(data.breakdown_bars.evidence_quality)}`}
                style={{ width: `${data.breakdown_bars.evidence_quality}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 6 Enterprise Platform Simulation Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-indigo-600" />
              6 Real Enterprise ATS Platform Simulations
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Simulated outcomes based on real platform parser behavior, keyword strategies, and threshold filters.
            </p>
          </div>
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider hidden sm:block">
            Click any platform to inspect quirks
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.platforms.map((platform) => {
            const isExpanded = expandedPlatform === platform.name;
            return (
              <div
                key={platform.name}
                onClick={() => togglePlatform(platform.name)}
                className={`cursor-pointer rounded-2xl p-5 border transition-all duration-300 ${
                  isExpanded
                    ? 'border-indigo-400 bg-indigo-50/40 shadow-md'
                    : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-sm'
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <h4 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-1.5">
                      {platform.name}
                    </h4>
                    <span className="text-[11px] text-slate-500 block font-medium">
                      {platform.vendor} &bull; {platform.market_share}
                    </span>
                  </div>

                  <div className="flex flex-col items-end">
                    <span
                      className={`text-xl font-black tabular-nums ${
                        platform.passes_filter ? 'text-emerald-600' : 'text-rose-600'
                      }`}
                    >
                      {platform.overall_score}
                      <span className="text-xs font-semibold text-slate-400">/100</span>
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border mt-1 ${
                        platform.passes_filter
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-rose-50 text-rose-700 border-rose-200'
                      }`}
                    >
                      {platform.passes_filter ? 'Passes Filter' : 'Risk of Auto-Reject'}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed mb-3">
                  {platform.description}
                </p>

                <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-[11px] text-slate-500">
                  <span className="capitalize">
                    Strategy: <strong className="text-slate-800">{platform.keyword_strategy.replace('_', ' ')}</strong>
                  </span>
                  <span className="flex items-center gap-1 text-indigo-600 font-semibold hover:text-indigo-700">
                    {isExpanded ? 'Hide Quirks' : 'View Quirks'}
                    {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </span>
                </div>

                {isExpanded && (
                  <div className="mt-3 pt-3 border-t border-slate-200 space-y-2 animate-fade-in">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 block">
                      Platform Quirks & Screening Traps:
                    </span>
                    <ul className="space-y-1.5 text-xs text-slate-700">
                      {platform.quirk_tips.map((q, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <span className="text-amber-500">&bull;</span>
                          <span>{q}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Risks to Address Card */}
      {data.risks && data.risks.length > 0 && (
        <div className="bg-amber-50/60 border border-amber-200 rounded-2xl p-6 shadow-xs">
          <div className="flex items-center gap-2.5 mb-4">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
            <h3 className="text-base font-bold text-slate-900">
              Risks to Address ({data.risks.length} Flagged)
            </h3>
          </div>

          <div className="space-y-3">
            {data.risks.map((risk, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-white border border-amber-200 shadow-xs">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-[10px] uppercase font-black px-2 py-0.5 rounded-full border ${getSeverityBadge(risk.severity)}`}>
                    {risk.severity}
                  </span>
                  <h4 className="text-xs font-bold text-slate-900">{risk.title}</h4>
                </div>
                <p className="text-xs text-slate-600 mb-2 leading-relaxed">{risk.description}</p>
                <div className="flex items-start gap-1.5 text-[11px] text-emerald-700 font-medium">
                  <span className="font-bold">Recommended Fix:</span>
                  <span>{risk.remedy}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Calculation Transparency Accordion */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
        <button
          onClick={() => setShowCalculationInfo(!showCalculationInfo)}
          className="w-full flex items-center justify-between text-xs font-bold text-slate-700 hover:text-slate-900"
        >
          <span className="flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-indigo-600" />
            How the 6-Platform Simulation Score is Calculated
          </span>
          {showCalculationInfo ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {showCalculationInfo && (
          <div className="mt-3 pt-3 border-t border-slate-100 text-xs text-slate-600 space-y-2 leading-relaxed animate-fade-in">
            <p>
              Each ATS platform weights resume attributes according to its real-world implementation. Workday and Taleo enforce exact string taxonomy matching and standard section schemas (failing resumes with non-standard formatting), while iCIMS evaluates 384-dimensional semantic proximity. Greenhouse and Lever act as recruiter productivity suites where human skim time and quantified Google XYZ metrics dominate hiring outcomes.
            </p>
            <p className="text-slate-400 text-[11px]">
              Note: This simulation is an independent academic heuristic model for UCS503P Software Engineering and is not affiliated with the named vendors.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
