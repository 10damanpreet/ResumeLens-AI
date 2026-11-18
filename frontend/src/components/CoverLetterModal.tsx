import React, { useState } from 'react';
import { X, Copy, Check, Printer, FileText, Sparkles } from 'lucide-react';
import { api, getErrorMessage } from '../api/client';
import { useToast } from './Toast';

interface CoverLetterModalProps {
  isOpen: boolean;
  onClose: () => void;
  resumeId: string;
  jobId: string;
  jobTitle?: string;
  company?: string;
}

export default function CoverLetterModal({
  isOpen,
  onClose,
  resumeId,
  jobId,
  jobTitle = 'Target Role',
  company = 'Target Company',
}: CoverLetterModalProps) {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [letterData, setLetterData] = useState<{
    subject_line: string;
    cover_letter: string;
    key_highlights: string[];
    model_used?: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  React.useEffect(() => {
    if (isOpen && !letterData) {
      generateLetter();
    }
  }, [isOpen]);

  const generateLetter = async () => {
    setLoading(true);
    setError('');
    try {
      const cleanResumeId = resumeId && !resumeId.includes('demo') ? resumeId : null;
      const cleanJobId = jobId && !jobId.includes('demo') ? jobId : null;
      const resp = await api.post('/resumes/cover-letter', {
        resume_id: cleanResumeId,
        job_id: cleanJobId,
      });
      setLetterData(resp.data);
    } catch (err: any) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!letterData) return;
    const fullText = `Subject: ${letterData.subject_line}\n\n${letterData.cover_letter}`;
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    showToast('Cover letter copied to clipboard!', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-3xl glass-card rounded-3xl p-6 sm:p-8 border border-white/15 shadow-2xl max-h-[90vh] flex flex-col overflow-hidden bg-slate-950/95">
        {/* Header */}
        <div className="flex items-center justify-between pb-5 border-b border-white/10 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center">
              <FileText className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                AI Cover Letter Generator
                <span className="badge-glow bg-indigo-500/15 text-indigo-300 border-indigo-500/30 text-xs">
                  Gemini 3.6 Flash
                </span>
              </h3>
              <p className="text-xs text-white/50">
                Tailored for {jobTitle} at {company}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-white/40 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto py-5 space-y-4">
          {loading && (
            <div className="py-16 text-center space-y-4">
              <div className="w-12 h-12 rounded-full border-2 border-indigo-500/20 border-t-indigo-500 animate-spin mx-auto" />
              <p className="text-sm text-white/70">
                Gemini is drafting an executive, metric-focused cover letter...
              </p>
            </div>
          )}

          {error && (
            <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-sm">
              {error}
              <button
                onClick={generateLetter}
                className="mt-2 block text-xs underline font-semibold"
              >
                Try Again
              </button>
            </div>
          )}

          {!loading && letterData && (
            <div className="space-y-4 animate-fade-in">
              {/* Subject Line Pill */}
              <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-between gap-3">
                <span className="text-xs font-semibold text-white/40 uppercase tracking-wider">Subject:</span>
                <span className="text-xs sm:text-sm text-white font-medium flex-1 truncate">
                  {letterData.subject_line}
                </span>
              </div>

              {/* Highlights */}
              {letterData.key_highlights?.length > 0 && (
                <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20">
                  <span className="text-xs font-bold text-indigo-300 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                    <Sparkles className="w-3.5 h-3.5" />
                    Key Selling Points Emphasized:
                  </span>
                  <ul className="space-y-1 text-xs text-white/70">
                    {letterData.key_highlights.map((h, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                        {h}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Letter Text */}
              <div className="p-5 rounded-2xl bg-black/40 border border-white/10 text-white/80 text-xs sm:text-sm font-sans leading-relaxed whitespace-pre-line select-text">
                {letterData.cover_letter}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        {!loading && letterData && (
          <div className="flex items-center justify-between pt-4 border-t border-white/10 flex-shrink-0 flex-wrap gap-2">
            <span className="text-[11px] text-white/40">
              Generated by {letterData.model_used || 'Gemini Flash AI'}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => window.print()}
                className="btn-secondary py-2 px-3 text-xs flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                Print
              </button>
              <button
                onClick={handleCopy}
                className="btn-primary py-2 px-4 text-xs flex items-center gap-1.5"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    Copy Cover Letter
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
