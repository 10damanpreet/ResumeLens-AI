import { useState, useRef, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api, getErrorMessage } from '../api/client';
import {
  FileText, Loader2, Sparkles, CheckCircle2, ArrowRight,
  CloudUpload, X, Zap, Brain, Shield
} from 'lucide-react';

type Step = 'idle' | 'uploading' | 'analyzing' | 'done';

const features = [
  { icon: Brain, title: 'AI Semantic Matching', desc: 'Deep NLP analysis of your resume vs the job requirements' },
  { icon: Zap, title: 'Instant Scoring', desc: 'Get your match percentage in seconds with detailed breakdown' },
  { icon: Shield, title: 'PII Protected', desc: 'Your personal data is automatically redacted before analysis' },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const [jobText, setJobText] = useState('');
  const [step, setStep] = useState<Step>('idle');
  const [stepLabel, setStepLabel] = useState('');
  const [error, setError] = useState('');

  const token = localStorage.getItem('token');

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped && (dropped.name.endsWith('.pdf') || dropped.name.endsWith('.docx'))) {
      setFile(dropped);
      setError('');
    } else {
      setError('Please upload a PDF or DOCX file.');
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !jobText.trim()) {
      setError('Please upload a resume and enter a job description.');
      return;
    }
    if (!token) {
      navigate('/login');
      return;
    }

    setError('');
    setStep('uploading');
    setStepLabel('Uploading & analyzing resume...');

    try {
      // 1. Upload Resume
      const formData = new FormData();
      formData.append('file', file);
      const resResp = await api.post('/resumes', formData);
      const resumeId = resResp.data.resume_id;

      setStep('analyzing');
      setStepLabel('Creating job profile & computing match...');

      // 2. Create Job
      const jobResp = await api.post('/jobs', {
        title: 'Target Role',
        company: 'Target Company',
        raw_text: jobText,
      });
      const jobId = jobResp.data.id;

      // 3. Trigger Match
      const matchResp = await api.post(`/matches?resume_id=${resumeId}&job_id=${jobId}`);

      setStep('done');
      navigate(`/matches/${matchResp.data.id}`);
    } catch (err: any) {
      setStep('idle');
      setError(getErrorMessage(err));
    }
  };

  const removeFile = () => { setFile(null); setError(''); };

  const isLoading = step === 'uploading' || step === 'analyzing';

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      {/* Hero */}
      <div className="text-center mb-14">
        <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 text-xs font-medium text-violet-300 mb-6 border border-violet-500/20">
          <Sparkles className="w-3.5 h-3.5" />
          Powered by Gemini AI + Sentence Transformers
        </div>
        <h1 className="text-5xl sm:text-6xl font-black text-white mb-4 leading-tight">
          Know Your <span className="text-gradient">Match Score</span>
          <br />Before You Apply
        </h1>
        <p className="text-white/50 text-lg max-w-2xl mx-auto leading-relaxed">
          Upload your resume, paste a job description, and get an AI-powered compatibility 
          score with a detailed skill gap analysis — in under 30 seconds.
        </p>
      </div>

      {!token ? (
        /* Not logged in CTA */
        <div className="glass-strong rounded-2xl p-10 text-center max-w-lg mx-auto">
          <Sparkles className="w-12 h-12 text-violet-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-3">Start Analyzing</h2>
          <p className="text-white/50 mb-6">Create a free account to upload your resume and get your match score.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/register" className="btn-primary px-8 py-3">
              <Sparkles className="w-4 h-4" />
              Get Started Free
            </Link>
            <Link to="/login" className="btn-secondary px-8 py-3">
              Sign In
            </Link>
          </div>
        </div>
      ) : (
        /* Upload Form */
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="glass border border-red-500/30 rounded-xl px-4 py-3 text-red-300 text-sm flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400 flex-shrink-0" />
              {error}
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-6">
            {/* Resume Upload */}
            <div className="glass-strong rounded-2xl p-6">
              <h3 className="text-base font-semibold text-white mb-1">Your Resume</h3>
              <p className="text-white/40 text-xs mb-4">PDF or DOCX, up to 10MB</p>

              {file ? (
                <div className="flex items-center gap-3 bg-violet-500/10 border border-violet-500/30 rounded-xl p-4">
                  <div className="w-10 h-10 rounded-lg bg-violet-500/20 flex items-center justify-center flex-shrink-0">
                    <FileText className="w-5 h-5 text-violet-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium text-sm truncate">{file.name}</p>
                    <p className="text-white/40 text-xs mt-0.5">{(file.size / 1024).toFixed(0)} KB</p>
                  </div>
                  <button type="button" onClick={removeFile} className="text-white/30 hover:text-red-400 transition-colors p-1">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div
                  onDrop={handleDrop}
                  onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                  onDragLeave={() => setDragging(false)}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200 ${
                    dragging
                      ? 'border-violet-400 bg-violet-500/10 scale-[1.02]'
                      : 'border-white/15 hover:border-violet-500/40 hover:bg-violet-500/5'
                  }`}
                >
                  <CloudUpload className={`w-10 h-10 mx-auto mb-3 transition-colors ${dragging ? 'text-violet-400' : 'text-white/25'}`} />
                  <p className="text-white/70 text-sm font-medium">Drop your resume here</p>
                  <p className="text-white/30 text-xs mt-1">or <span className="text-violet-400">click to browse</span></p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.docx"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) { setFile(f); setError(''); }
                    }}
                  />
                </div>
              )}
            </div>

            {/* Job Description */}
            <div className="glass-strong rounded-2xl p-6 flex flex-col">
              <h3 className="text-base font-semibold text-white mb-1">Job Description</h3>
              <p className="text-white/40 text-xs mb-4">Paste the full job posting text</p>
              <textarea
                rows={8}
                value={jobText}
                onChange={(e) => setJobText(e.target.value)}
                placeholder="Paste the job description here...&#10;&#10;Include requirements, responsibilities, and any listed skills for best results."
                className="input-field flex-1 resize-none text-sm leading-relaxed"
              />
              {jobText && (
                <p className="text-white/25 text-xs mt-2">{jobText.split(/\s+/).filter(Boolean).length} words</p>
              )}
            </div>
          </div>

          {/* Progress Steps */}
          {isLoading && (
            <div className="glass rounded-2xl p-5">
              <div className="flex items-center gap-3 mb-4">
                <Loader2 className="w-5 h-5 text-violet-400 animate-spin" />
                <span className="text-white font-medium">{stepLabel}</span>
              </div>
              <div className="flex gap-2">
                {['Uploading', 'Processing', 'Matching'].map((s, i) => (
                  <div key={s} className="flex-1">
                    <div className={`h-1.5 rounded-full transition-all duration-500 ${
                      (step === 'uploading' && i === 0) || (step === 'analyzing' && i <= 2)
                        ? 'bg-gradient-to-r from-violet-500 to-indigo-500'
                        : 'bg-white/10'
                    }`} />
                    <p className="text-white/40 text-xs mt-1.5">{s}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === 'done' && (
            <div className="glass border border-emerald-500/30 rounded-2xl p-5 flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-emerald-400" />
              <span className="text-emerald-300 font-medium">Analysis complete! Redirecting to results...</span>
            </div>
          )}

          <button type="submit" disabled={isLoading || step === 'done'} className="btn-primary w-full py-4 text-base">
            {isLoading ? (
              <><Loader2 className="w-5 h-5 animate-spin" /> Processing...</>
            ) : step === 'done' ? (
              <><CheckCircle2 className="w-5 h-5" /> Complete!</>
            ) : (
              <><Sparkles className="w-5 h-5" /> Analyze Match <ArrowRight className="w-5 h-5" /></>
            )}
          </button>
        </form>
      )}

      {/* Feature Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-16">
        {features.map(({ icon: Icon, title, desc }) => (
          <div key={title} className="glass rounded-2xl p-5 hover:bg-white/10 transition-colors group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500/20 to-indigo-500/20 border border-violet-500/20 flex items-center justify-center mb-3 group-hover:border-violet-500/40 transition-colors">
              <Icon className="w-5 h-5 text-violet-400" />
            </div>
            <h4 className="text-white font-semibold text-sm mb-1">{title}</h4>
            <p className="text-white/40 text-xs leading-relaxed">{desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
