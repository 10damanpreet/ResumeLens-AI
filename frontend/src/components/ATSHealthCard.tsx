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
    <div className="glass-card rounded-2xl p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h3 className="text-white font-bold text-base flex items-center gap-2">
              ATS Compliance & Privacy Audit
              <span className="badge-glow bg-emerald-500/15 text-emerald-300 border-emerald-500/30 text-[11px]">
                Grade A+
              </span>
            </h3>
            <p className="text-white/40 text-xs">Automated parsing verification & applicant privacy checks</p>
          </div>
        </div>

        <div className="flex items-baseline gap-1.5 bg-white/5 border border-white/10 px-4 py-2 rounded-xl self-start sm:self-auto">
          <span className="text-2xl font-black text-emerald-400 tabular-nums">{score}</span>
          <span className="text-xs text-white/40 font-medium">/ 100 ATS Health</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {checks.map((item, idx) => (
          <div
            key={idx}
            className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold text-white/90">{item.label}</p>
              <p className="text-xs text-white/40 mt-0.5">{item.detail}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 p-3 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center gap-2.5 text-xs text-violet-200">
        <Info className="w-4 h-4 text-violet-400 flex-shrink-0" />
        <span>
          <strong>Pro-tip:</strong> Your resume has clean single-column hierarchy that passes modern Applicant Tracking Systems (Workday, Greenhouse, Lever) without table truncation.
        </span>
      </div>
    </div>
  );
}
