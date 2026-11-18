import { ShieldCheck, CheckCircle2, Info } from 'lucide-react';

interface ATSHealthCardProps {
  score?: number;
}

export default function ATSHealthCard({ score = 96 }: ATSHealthCardProps) {
  const checks = [
    { label: 'Dual-Engine Text Extractability', status: 'pass', detail: 'PDFPlumber + python-docx clean ASCII parse' },
    { label: 'Candidate PII Anonymization', status: 'pass', detail: 'spaCy NER + Regex: Email & Phone redacted' },
    { label: 'Standard Section Headers', status: 'pass', detail: 'Summary, Skills, Experience, Education detected' },
    { label: 'Dense Vector Embeddings (384-D)', status: 'pass', detail: 'Generated with all-MiniLM-L6-v2' },
  ];

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <h3 className="text-slate-900 font-bold text-base flex items-center gap-2">
              ATS Compliance & Privacy Audit
              <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold px-2 py-0.5 rounded-full text-[11px]">
                Grade A+
              </span>
            </h3>
            <p className="text-slate-500 text-xs font-medium">Automated parsing verification & applicant privacy checks</p>
          </div>
        </div>

        <div className="flex items-baseline gap-1.5 bg-emerald-50 border border-emerald-200 px-4 py-2 rounded-xl self-start sm:self-auto">
          <span className="text-2xl font-black text-emerald-600 tabular-nums">{score}</span>
          <span className="text-xs text-emerald-700 font-semibold">/ 100 ATS Health</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {checks.map((item, idx) => (
          <div
            key={idx}
            className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200 hover:border-slate-300 transition-colors"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold text-slate-800">{item.label}</p>
              <p className="text-xs text-slate-500 mt-0.5">{item.detail}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 p-3.5 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center gap-2.5 text-xs text-indigo-900">
        <Info className="w-4 h-4 text-indigo-600 flex-shrink-0" />
        <span>
          <strong>Pro-tip:</strong> Your resume has clean single-column hierarchy that passes modern Applicant Tracking Systems (Workday, Greenhouse, Lever) without table truncation.
        </span>
      </div>
    </div>
  );
}
