import { useState, useRef, useCallback, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api, getErrorMessage } from '../api/client';
import { useToast } from '../components/Toast';
import RecentScans, { ScanItem } from '../components/RecentScans';
import {
  FileText, Loader2, Sparkles, CheckCircle2, ArrowRight,
  CloudUpload, X, Zap, Brain, ShieldCheck, Sparkle,
  Code2, Database, Layers, Check
} from 'lucide-react';

type Step = 'idle' | 'uploading' | 'analyzing' | 'done';

const SAMPLE_JOBS = [
  {
    role: 'AI / Machine Learning Engineer',
    icon: Brain,
    company: 'Anthropic Labs (Sample)',
    badge: 'Popular',
    text: `Job Title: Senior AI / Machine Learning Engineer
Location: Remote / Hybrid

We are seeking a talented Senior AI / Machine Learning Engineer to design, build, and deploy production-grade NLP and Generative AI systems.

Responsibilities:
- Build and fine-tune large language model (LLM) workflows, embedding retrieval (RAG) pipelines, and vector databases.
- Develop high-performance backend microservices using FastAPI and Python.
- Train and evaluate predictive ML models with PyTorch, Scikit-learn, and HuggingFace Transformers.
- Design scalable database architectures with PostgreSQL and Redis.
- Containerize and deploy services using Docker and Kubernetes on cloud platforms (AWS / GCP).

Requirements:
- 3+ years of professional experience in Python, Machine Learning, and NLP.
- Strong proficiency in Pandas, NumPy, Scikit-learn, and PyTorch.
- Experience with Vector Search, Cosine Similarity, and relational databases (SQL).
- Hands-on experience with REST APIs, Git version control, and CI/CD pipelines.`,
  },
  {
    role: 'Senior Full-Stack Engineer',
    icon: Code2,
    company: 'Stripe Ecosystem (Sample)',
    badge: 'High Demand',
    text: `Job Title: Senior Full-Stack Engineer
Location: San Francisco, CA / Remote

We are looking for a Senior Full-Stack Engineer to architect and build mission-critical web applications with exceptional user experiences.

Core Responsibilities:
- Architect modern Single Page Applications using React 18, TypeScript, and Tailwind CSS.
- Build clean, resilient RESTful APIs and asynchronous background task workers in Python (FastAPI) or Node.js.
- Optimize database queries and schema design in PostgreSQL.
- Implement automated unit and end-to-end testing with PyTest and Jest.
- Collaborate with product designers using Agile Scrum methodology.

Qualifications:
- 3+ years of experience with React, TypeScript, and modern state management.
- Demonstrated experience in backend development, SQL databases, and Docker containerization.
- Familiarity with CI/CD, Git, and automated testing pipelines.`,
  },
  {
    role: 'Data Scientist & Analytics Specialist',
    icon: Database,
    company: 'FinTech Analytics (Sample)',
    badge: 'Analytical',
    text: `Job Title: Data Scientist & Quantitative Analyst
Location: New York / Remote

We are looking for a Data Scientist to transform massive, high-dimensional datasets into actionable predictive intelligence.

Key Requirements:
- 2+ years of experience in Data Science, Exploratory Data Analysis (EDA), and statistical modeling.
- Advanced expertise in Python, Pandas, NumPy, Scikit-Learn, and SQL.
- Experience building interactive dashboards and reports in Tableau or Power BI.
- Solid background in linear algebra, multivariable calculus, and applied statistics.
- Excellent communication skills to translate complex model insights for executive stakeholders.`,
  },
];

const SKILL_KEYWORDS = [
  'python', 'pandas', 'numpy', 'scikit-learn', 'pytorch', 'tensorflow',
  'sql', 'postgresql', 'fastapi', 'react', 'typescript', 'docker',
  'kubernetes', 'aws', 'machine learning', 'nlp', 'git', 'redis', 'tableau'
];

export default function Dashboard() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [file, setFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const [jobText, setJobText] = useState('');
  const [targetRole, setTargetRole] = useState('Senior AI Engineer');
  const [targetCompany, setTargetCompany] = useState('Tech Innovations Inc.');
  const [step, setStep] = useState<Step>('idle');
  const [stepLabel, setStepLabel] = useState('');
  const [error, setError] = useState('');

  // Recent scans state
  const [recentScans, setRecentScans] = useState<ScanItem[]>(() => {
    try {
      const saved = localStorage.getItem('resumelens_recent_scans');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token, navigate]);

  // Detect technical keywords in Job Description in real-time
  const detectedSkills = SKILL_KEYWORDS.filter((skill) =>
    jobText.toLowerCase().includes(skill)
  );

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped && (dropped.name.endsWith('.pdf') || dropped.name.endsWith('.docx'))) {
      setFile(dropped);
      setError('');
      showToast(`Uploaded ${dropped.name}`, 'success');
    } else {
      setError('Please upload a PDF or DOCX file.');
      showToast('Please upload a valid PDF or DOCX file', 'error');
    }
  }, [showToast]);

  const loadSampleJob = (sample: typeof SAMPLE_JOBS[0]) => {
    setJobText(sample.text);
    setTargetRole(sample.role);
    setTargetCompany(sample.company);
    showToast(`Loaded sample: ${sample.role}`, 'info');
  };

  const loadDemoResume = () => {
    const demoContent = `Damanpreet Singh
Email: damanpreet@example.com | Phone: +1 555-0199 | Location: Patiala, Punjab
GitHub: github.com/10damanpreet | LinkedIn: linkedin.com/in/damanpreet

PROFESSIONAL SUMMARY:
Innovative Software and AI Engineer with expertise in building scalable cloud backends, vector search pipelines, and modern glassmorphic web applications. Experienced in Python, FastAPI, React 18, PostgreSQL/pgvector, PyTorch, and Gemini LLMs.

TECHNICAL SKILLS:
- Languages: Python, TypeScript, JavaScript, SQL, C++, HTML, CSS
- Frameworks & Libraries: FastAPI, React 18, PyTorch, HuggingFace Transformers, Scikit-learn, Tailwind CSS, SQLAlchemy
- Databases & Vector: PostgreSQL, pgvector, SQLite, Redis
- Tools & DevOps: Docker, Git, GitHub Actions CI/CD, Vite, Linux

EXPERIENCE:
Lead Developer & System Architect | ResumeLens AI (2025 - Present)
- Engineered high-throughput semantic resume-job matcher using all-MiniLM-L6-v2 384-dimensional dense vector embeddings.
- Integrated Google Gemini 3.8 Flash Generative AI for structured skill gap advisories with automated multi-model fallback.
- Enforced automated PII redaction (spaCy NER and Regex) to guarantee applicant privacy and eliminate recruitment bias.

Full-Stack Engineering Intern | CloudScale Solutions (2024 - 2025)
- Designed and maintained RESTful microservices handling 50k+ daily API requests using FastAPI and PostgreSQL.
- Implemented responsive glassmorphic interfaces with React 18 and Tailwind CSS.`;

    const blob = new Blob([demoContent], { type: 'application/pdf' });
    const demoFile = new File([blob], 'Damanpreet_Singh_Resume.pdf', { type: 'application/pdf' });
    setFile(demoFile);
    setError('');
    showToast('Loaded demo AI Engineer resume!', 'success');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !jobText.trim()) {
      setError('Please upload a resume and provide a target job description.');
      showToast('Please upload a resume and enter job description', 'error');
      return;
    }
    if (!token) {
      showToast('Please sign in or create a free account to continue', 'info');
      navigate('/login');
      return;
    }

    setError('');
    setStep('uploading');
    setStepLabel('1/3 Extracting text & anonymizing candidate PII...');

    try {
      // 1. Upload Resume
      const formData = new FormData();
      formData.append('file', file);
      const resResp = await api.post('/resumes', formData);
      const resumeId = resResp.data.resume_id;

      setStep('analyzing');
      setStepLabel('2/3 Computing 384-D vector embeddings & skill overlap...');

      // 2. Create Job
      const jobResp = await api.post('/jobs', {
        title: targetRole || 'Target Role',
        company: targetCompany || 'Target Organization',
        raw_text: jobText,
      });
      const jobId = jobResp.data.id;

      setStepLabel('3/3 Evaluating multi-factor compatibility score...');

      // 3. Trigger Match
      const matchResp = await api.post(`/matches?resume_id=${resumeId}&job_id=${jobId}`);
      const matchData = matchResp.data;

      // Save to recent scans history
      const newScan: ScanItem = {
        id: matchData.id,
        title: targetRole || 'Target Role',
        company: targetCompany || 'Direct Requisition',
        score: matchData.final_match_score || 0.85,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      };

      const updatedScans = [newScan, ...recentScans.filter((s) => s.id !== matchData.id)].slice(0, 10);
      setRecentScans(updatedScans);
      try {
        localStorage.setItem('resumelens_recent_scans', JSON.stringify(updatedScans));
      } catch {}

      setStep('done');
      showToast('Evaluation complete! Redirecting to results...', 'success');
      setTimeout(() => {
        navigate(`/matches/${matchData.id}`);
      }, 400);
    } catch (err: any) {
      setStep('idle');
      const msg = getErrorMessage(err);
      setError(msg);
      showToast(msg, 'error');
    }
  };

  const removeFile = () => {
    setFile(null);
    setError('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const clearRecentScans = () => {
    setRecentScans([]);
    localStorage.removeItem('resumelens_recent_scans');
    showToast('Recent scan history cleared', 'info');
  };

  const isLoading = step === 'uploading' || step === 'analyzing';

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 sm:py-12">
      {/* Hero Section */}
      <div className="text-center mb-12 sm:mb-16">
        <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-200/80 rounded-full px-4 py-2 text-xs font-bold text-indigo-700 mb-6 shadow-xs">
          <Sparkle className="w-3.5 h-3.5 text-indigo-600 animate-spin-slow" />
          <span>Bi-Encoder Vector Search &bull; Gemini 3.8 Flash Advisory</span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-slate-900 mb-6 tracking-tight leading-[1.1]">
          Predict Your <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 bg-clip-text text-transparent">Match Score</span>
          <br className="hidden sm:inline" /> Before You Apply
        </h1>

        <p className="text-slate-600 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed font-medium">
          Upload your resume and benchmark it against any target job requisition. 
          Get instant vector similarity scores, 6-platform ATS compliance checks, and a generative skill gap roadmap.
        </p>

        {/* Highlight Stats Pill */}
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 mt-8 text-xs font-bold text-slate-700">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200 shadow-2xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Dual-Engine Extract (PDF & DOCX)</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200 shadow-2xs">
            <ShieldCheck className="w-4 h-4 text-indigo-600" />
            <span>Candidate PII Auto-Anonymized</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200 shadow-2xs">
            <Zap className="w-4 h-4 text-amber-600" />
            <span>Instant Local ML Inference</span>
          </div>
        </div>
      </div>

      {!token ? (
        /* Not logged in CTA Card */
        <div className="bg-white rounded-3xl p-8 sm:p-12 text-center max-w-xl mx-auto border border-slate-200 shadow-xl">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-indigo-200 text-white">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-3">Begin Your Evaluation</h2>
          <p className="text-slate-600 mb-8 text-sm sm:text-base leading-relaxed font-medium">
            Create an account or sign in to upload your resume, compute mathematical match scores, and unlock personalized AI advisories.
          </p>
          <div className="flex flex-col sm:flex-row gap-3.5 justify-center">
            <Link to="/register" className="btn-primary px-8 py-3.5 text-sm font-bold shadow-md shadow-violet-200">
              <Sparkles className="w-4 h-4" />
              Get Started Free
            </Link>
            <Link to="/login" className="btn-secondary px-8 py-3.5 text-sm font-bold">
              Sign In
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* AI Resume Revamp Studio Feature Callout */}
          <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-indigo-50 rounded-3xl p-5 sm:p-6 border border-emerald-200/80 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-emerald-600 text-white flex items-center justify-center flex-shrink-0 shadow-md shadow-emerald-200">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-sm sm:text-base font-extrabold text-slate-900">Have a Weak or Poorly-Formatted Resume?</h3>
                  <span className="bg-emerald-100 text-emerald-800 border border-emerald-200 text-[10px] font-black py-0.5 px-2.5 rounded-full uppercase tracking-wider">
                    NEW ATS STUDIO
                  </span>
                </div>
                <p className="text-xs text-slate-600 font-medium mt-1">
                  Let Gemini AI rebuild your entire resume with Google XYZ metrics & download a clean, ATS-compliant PDF in 1-click.
                </p>
              </div>
            </div>
            <Link
              to="/studio"
              className="btn-primary py-2.5 px-5 text-xs font-bold whitespace-nowrap bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white self-start md:self-center shadow-md shadow-emerald-200 flex items-center gap-1.5"
            >
              <span>Open Resume Studio (PDF)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Interactive Analysis Form */}
          <form onSubmit={handleSubmit} className="space-y-8">
            {error && (
              <div className="border border-red-200 bg-rose-50 rounded-2xl px-5 py-4 text-rose-800 text-sm font-semibold flex items-center justify-between gap-3 animate-slide-up shadow-xs">
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-600 flex-shrink-0 animate-ping" />
                  <span>{error}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setError('')}
                  className="text-rose-400 hover:text-rose-700"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
              {/* Step 1: Resume Upload Card */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 flex flex-col justify-between border border-slate-200 shadow-sm">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2.5">
                      <span className="w-7 h-7 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-200 text-xs font-extrabold flex items-center justify-center">
                        1
                      </span>
                      <h3 className="text-lg font-extrabold text-slate-900">Your Resume</h3>
                    </div>
                    {!file && (
                      <button
                        type="button"
                        onClick={loadDemoResume}
                        className="btn-chip bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100 font-bold"
                        title="Load pre-built AI Engineer resume"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                        Try Demo Resume
                      </button>
                    )}
                  </div>
                  <p className="text-slate-500 text-xs mb-5 font-medium">
                    Supported formats: <strong className="text-slate-800">.pdf</strong> or <strong className="text-slate-800">.docx</strong> (Max 10MB)
                  </p>

                  {file ? (
                    <div className="p-4 sm:p-5 rounded-2xl bg-indigo-50/70 border border-indigo-200 flex items-center gap-4 transition-all">
                      <div className="w-12 h-12 rounded-xl bg-indigo-600 text-white flex items-center justify-center flex-shrink-0 shadow-sm">
                        <FileText className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-slate-900 font-bold text-sm truncate">{file.name}</p>
                        <div className="flex items-center gap-3 text-slate-500 text-xs mt-1 font-medium">
                          <span>{(file.size / 1024).toFixed(0)} KB</span>
                          <span>&bull;</span>
                          <span className="text-emerald-700 font-bold flex items-center gap-1">
                            <Check className="w-3.5 h-3.5 text-emerald-600" /> Ready for Parsing
                          </span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={removeFile}
                        className="text-slate-400 hover:text-rose-600 hover:bg-rose-50 p-2 rounded-xl transition-all"
                        title="Remove file"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  ) : (
                    <div
                      onDrop={handleDrop}
                      onDragOver={(e) => {
                        e.preventDefault();
                        setDragging(true);
                      }}
                      onDragLeave={() => setDragging(false)}
                      onClick={() => fileInputRef.current?.click()}
                      className={`border-2 border-dashed rounded-2xl p-8 sm:p-10 text-center cursor-pointer transition-all duration-300 ${
                        dragging
                          ? 'border-indigo-500 bg-indigo-50/50 scale-[1.01]'
                          : 'border-slate-300 hover:border-indigo-400 hover:bg-slate-50/80 bg-slate-50/40'
                      }`}
                    >
                      <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-center mx-auto mb-4 group-hover:scale-105 transition-transform shadow-xs">
                        <CloudUpload className="w-8 h-8 text-indigo-600" />
                      </div>
                      <p className="text-slate-900 font-bold text-sm sm:text-base">Drag & drop your resume file here</p>
                      <p className="text-slate-500 text-xs mt-1.5 font-medium">
                        or <span className="text-indigo-600 font-bold underline underline-offset-4">browse files on your computer</span>
                      </p>

                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".pdf,.docx"
                        className="hidden"
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (f) {
                            setFile(f);
                            setError('');
                            showToast(`Selected ${f.name}`, 'success');
                          }
                        }}
                      />
                    </div>
                  )}
                </div>

                {/* Security note */}
                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-2.5 text-xs text-slate-500 font-medium">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Zero recruiter bias: Candidate phone numbers & emails are stripped by spaCy before comparison.</span>
                </div>
              </div>

              {/* Step 2: Target Job Requisition */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 flex flex-col justify-between border border-slate-200 shadow-sm">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2.5">
                      <span className="w-7 h-7 rounded-xl bg-violet-50 text-violet-700 border border-violet-200 text-xs font-extrabold flex items-center justify-center">
                        2
                      </span>
                      <h3 className="text-lg font-extrabold text-slate-900">Target Job Requisition</h3>
                    </div>
                  </div>
                  <p className="text-slate-500 text-xs mb-3 font-medium">
                    Paste the job posting description, requirements, and required skills
                  </p>

                  {/* 1-Click Sample Job Pills */}
                  <div className="mb-4">
                    <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <Sparkles className="w-3 h-3 text-violet-600" />
                      1-Click Sample Roles:
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {SAMPLE_JOBS.map((sample, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => loadSampleJob(sample)}
                          className="btn-chip bg-slate-50 text-slate-700 border-slate-200 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-200 font-bold"
                        >
                          <sample.icon className="w-3.5 h-3.5 text-violet-600" />
                          <span>{sample.role.split(' ')[0]} {sample.role.split(' ')[1]}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="relative">
                    <textarea
                      rows={8}
                      value={jobText}
                      onChange={(e) => setJobText(e.target.value)}
                      placeholder="Paste the target job description text here...&#10;&#10;E.g., Senior AI Engineer with Python, FastAPI, PyTorch, Docker, and SQL experience..."
                      className="w-full rounded-2xl p-4 text-sm leading-relaxed min-h-[170px] bg-slate-50/60 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                    />
                    {jobText && (
                      <div className="absolute bottom-3 right-3 text-[11px] text-slate-600 bg-white/95 border border-slate-200 px-2.5 py-1 rounded-lg shadow-2xs font-bold">
                        {jobText.split(/\s+/).filter(Boolean).length} words
                      </div>
                    )}
                  </div>

                  {/* Real-time skill keyword detector */}
                  {detectedSkills.length > 0 && (
                    <div className="mt-3.5 p-3 rounded-xl bg-slate-50 border border-slate-200">
                      <p className="text-[11px] text-slate-600 font-bold mb-1.5 flex items-center gap-1">
                        <Layers className="w-3 h-3 text-indigo-600" />
                        Detected Key Competencies ({detectedSkills.length}):
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {detectedSkills.map((s) => (
                          <span
                            key={s}
                            className="px-2 py-0.5 rounded-md bg-indigo-50 border border-indigo-200 text-[11px] font-bold text-indigo-700"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-4 border-t border-slate-100 text-xs text-slate-500 font-medium">
                  Vector matching accounts for synonyms (e.g. <em>ML</em> matches <em>Machine Learning</em>).
                </div>
              </div>
            </div>

            {/* Stepped Loading Box */}
            {isLoading && (
              <div className="bg-white rounded-2xl p-6 sm:p-7 border border-indigo-200 shadow-xl animate-slide-up">
                <div className="flex items-center gap-3.5 mb-4">
                  <Loader2 className="w-6 h-6 text-indigo-600 animate-spin flex-shrink-0" />
                  <div>
                    <h4 className="text-slate-900 font-extrabold text-base">{stepLabel}</h4>
                    <p className="text-slate-500 text-xs font-medium">Executing local transformer inference and mathematical cosine matching</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2.5 mt-4">
                  {[
                    { name: '1. Ingestion', active: step === 'uploading' || step === 'analyzing' },
                    { name: '2. Embedding (384-D)', active: step === 'analyzing' },
                    { name: '3. Hybrid Scorer', active: step === 'analyzing' },
                  ].map((s, i) => (
                    <div key={i} className="flex flex-col gap-1.5">
                      <div
                        className={`h-2.5 rounded-full transition-all duration-500 ${
                          s.active
                            ? 'bg-gradient-to-r from-indigo-600 via-violet-600 to-emerald-500 shadow-sm'
                            : 'bg-slate-100'
                        }`}
                      />
                      <span className="text-[11px] text-slate-600 font-bold">{s.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {step === 'done' && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 flex items-center gap-3 animate-slide-up shadow-xs">
                <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                <div>
                  <p className="text-emerald-900 font-extrabold text-sm">Evaluation completed successfully!</p>
                  <p className="text-emerald-700 text-xs font-medium">Generating your interactive dashboard and analytics...</p>
                </div>
              </div>
            )}

            {/* Submit CTA */}
            <button
              type="submit"
              disabled={isLoading || step === 'done'}
              className="btn-primary w-full py-4 sm:py-4.5 text-base font-extrabold bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-xl shadow-indigo-200 hover:shadow-2xl hover:shadow-indigo-300 transition-all flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Computing Local ML Compatibility...
                </>
              ) : step === 'done' ? (
                <>
                  <CheckCircle2 className="w-5 h-5" />
                  Results Ready!
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Run AI Compatibility & Skill Gap Analysis
                  <ArrowRight className="w-5 h-5 ml-1" />
                </>
              )}
            </button>
          </form>
        </div>
      )}

      {/* Recent Evaluations Drawer / History */}
      <RecentScans scans={recentScans} onClear={clearRecentScans} />

      {/* Architectural Capabilities */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mt-16">
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md hover:border-violet-300 transition-all group">
          <div className="w-12 h-12 rounded-xl bg-violet-50 border border-violet-200 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform shadow-xs">
            <Brain className="w-6 h-6 text-violet-600" />
          </div>
          <h4 className="text-slate-900 font-extrabold text-base mb-1.5">Dense Vector Cosine Similarity</h4>
          <p className="text-slate-600 text-xs leading-relaxed font-medium">
            Encodes documents into 384-dimensional dense vectors with HuggingFace's <code className="bg-slate-100 text-violet-700 px-1.5 py-0.5 rounded font-bold">all-MiniLM-L6-v2</code> for deep semantic similarity.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md hover:border-indigo-300 transition-all group">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform shadow-xs">
            <Zap className="w-6 h-6 text-indigo-600" />
          </div>
          <h4 className="text-slate-900 font-extrabold text-base mb-1.5">Tripartite Hybrid Scoring</h4>
          <p className="text-slate-600 text-xs leading-relaxed font-medium">
            Combines 40% dense semantic embeddings, 40% technical taxonomy overlap, and 20% experience seniority fit into a single composite score.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md hover:border-emerald-300 transition-all group">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform shadow-xs">
            <ShieldCheck className="w-6 h-6 text-emerald-600" />
          </div>
          <h4 className="text-slate-900 font-extrabold text-base mb-1.5">Generative AI Gap Advisory</h4>
          <p className="text-slate-600 text-xs leading-relaxed font-medium">
            Powered by Google Gemini 3.8 Flash to extract specific missing tools, severity ratings, and estimated learning hours.
          </p>
        </div>
      </div>
    </div>
  );
}
