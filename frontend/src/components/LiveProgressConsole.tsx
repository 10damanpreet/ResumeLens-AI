import { useEffect, useState } from 'react';
import { Terminal, CheckCircle2, Loader2, Sparkles } from 'lucide-react';

interface Stage {
  label: string;
  detail: string;
  durationMs: number;
}

const STAGES: Stage[] = [
  { label: 'Document Ingestion', detail: 'Extracting plain text & structure via PDFPlumber', durationMs: 400 },
  { label: 'Privacy Sanitization', detail: 'Executing PII regex redactor on phone numbers & emails', durationMs: 500 },
  { label: 'Dense Vectorization', detail: 'Computing 384-D sentence embeddings (all-MiniLM-L6-v2)', durationMs: 800 },
  { label: 'Taxonomy Tokenization', detail: 'Cross-referencing RapidFuzz technical skill dictionaries', durationMs: 600 },
  { label: 'Experience Estimation', detail: 'Extracting chronology and role tenure metrics', durationMs: 500 },
  { label: 'Cloud AI Advisory', detail: 'Gemini 3.6 Flash / Flash Lite synthesizing career roadmaps', durationMs: 800 },
];

interface LiveProgressConsoleProps {
  onComplete?: () => void;
}

export default function LiveProgressConsole({ onComplete }: LiveProgressConsoleProps) {
  const [currentStageIdx, setCurrentStageIdx] = useState(0);

  useEffect(() => {
    if (currentStageIdx < STAGES.length) {
      const timer = setTimeout(() => {
        setCurrentStageIdx((prev) => prev + 1);
      }, STAGES[currentStageIdx].durationMs);
      return () => clearTimeout(timer);
    } else if (onComplete) {
      const finishTimer = setTimeout(onComplete, 400);
      return () => clearTimeout(finishTimer);
    }
  }, [currentStageIdx, onComplete]);

  return (
    <div className="glass-card rounded-3xl p-6 sm:p-8 border border-violet-500/30 max-w-xl mx-auto shadow-2xl relative overflow-hidden bg-slate-950/90 font-mono text-left">
      {/* Terminal Title Bar */}
      <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-violet-400" />
          <span className="text-xs font-bold text-white tracking-wide">
            RESUMELENS REAL-TIME PIPELINE STREAM
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
        </div>
      </div>

      {/* Progress Stages */}
      <div className="space-y-3 text-xs">
        {STAGES.map((stage, idx) => {
          const isDone = idx < currentStageIdx;
          const isCurrent = idx === currentStageIdx;

          return (
            <div
              key={idx}
              className={`flex items-start gap-3 p-2.5 rounded-xl transition-all ${
                isCurrent
                  ? 'bg-violet-500/10 border border-violet-500/30 text-white'
                  : isDone
                  ? 'text-white/80'
                  : 'text-white/30'
              }`}
            >
              <div className="mt-0.5">
                {isDone ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : isCurrent ? (
                  <Loader2 className="w-4 h-4 text-violet-400 animate-spin" />
                ) : (
                  <div className="w-4 h-4 rounded-full border border-white/20" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className={`font-semibold ${isCurrent ? 'text-violet-300' : ''}`}>
                    {stage.label}
                  </span>
                  <span className="text-[10px] text-white/40">
                    {isDone ? 'COMPLETE' : isCurrent ? 'RUNNING...' : 'QUEUED'}
                  </span>
                </div>
                <p className="text-[11px] text-white/50 mt-0.5">{stage.detail}</p>
              </div>
            </div>
          );
        })}
      </div>

      {currentStageIdx >= STAGES.length && (
        <div className="mt-5 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center justify-center gap-2">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span>Pipeline execution verified. Loading match results...</span>
        </div>
      )}
    </div>
  );
}
