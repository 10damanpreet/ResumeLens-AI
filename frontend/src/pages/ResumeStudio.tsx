import { useState, useEffect, useRef } from 'react';
import {
  Sparkles, Download, Printer, Copy, Check, ArrowRight,
  FileText, Upload, CheckCircle2,
  Zap, Eye, Briefcase
} from 'lucide-react';
import { api, getErrorMessage } from '../api/client';
import { useToast } from '../components/Toast';

interface ContactInfo {
  email?: string;
  phone?: string;
  location?: string;
  github?: string;
  linkedin?: string;
}

interface WorkExperience {
  role: string;
  company: string;
  location?: string;
  dates?: string;
  bullets: string[];
}

interface ProjectItem {
  name: string;
  tech_stack?: string[];
  link?: string;
  bullets: string[];
}

interface EducationItem {
  institution: string;
  degree: string;
  location?: string;
  dates?: string;
  gpa?: string;
  coursework?: string[];
}

interface RevampedResumeData {
  candidate_name: string;
  target_role: string;
  contact_info: ContactInfo;
  professional_summary: string;
  technical_skills: Record<string, string[]>;
  work_experience: WorkExperience[];
  projects: ProjectItem[];
  education: EducationItem[];
  certifications?: string[];
  ats_keywords_highlighted: string[];
  ats_score_before: number;
  ats_score_after: number;
  detected_weaknesses_fixed: string[];
  model_used?: string;
}

interface ResumeOption {
  id: string;
  original_filename: string;
}

const DEFAULT_ROLES = [
  'Software Development Engineer',
  'Full Stack Software Engineer',
  'Backend Systems Engineer',
  'AI / Machine Learning Engineer',
  'DevOps & Cloud Infrastructure Engineer',
];

export default function ResumeStudio() {
  const { showToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [inputTab, setInputTab] = useState<'existing' | 'upload' | 'paste'>('existing');
  const [resumes, setResumes] = useState<ResumeOption[]>([]);
  const [selectedResumeId, setSelectedResumeId] = useState<string>('');
  const [rawText, setRawText] = useState<string>('');
  const [targetRole, setTargetRole] = useState<string>('Full Stack Software Engineer');
  const [uploadedFileName, setUploadedFileName] = useState<string>('');

  const [loading, setLoading] = useState<boolean>(false);
  const [stageText, setStageText] = useState<string>('Stage 1/3: Parsing weak resume & identifying defects...');
  const [downloadingPdf, setDownloadingPdf] = useState<boolean>(false);
  const [data, setData] = useState<RevampedResumeData | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'paper' | 'dark'>('paper');

  useEffect(() => {
    fetchResumes();
  }, []);

  const fetchResumes = async () => {
    try {
      const res = await api.get('/resumes');
      const list = res.data || [];
      setResumes(list);
      if (list.length > 0) {
        setSelectedResumeId(list[0].id);
      }
    } catch {
      // Fallback
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    setLoading(true);
    setUploadedFileName(file.name);

    try {
      const res = await api.post('/resumes', formData);
      const newResumeId = res.data.resume_id;
      setSelectedResumeId(newResumeId);
      showToast(`Uploaded ${file.name} successfully!`, 'success');
      await fetchResumes();
      // Auto-trigger revamp
      await handleRevamp(newResumeId);
    } catch (err: any) {
      showToast(getErrorMessage(err) || 'Failed to upload resume file', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleRevamp = async (overrideResumeId?: string) => {
    setLoading(true);
    setData(null);
    setStageText('Stage 1/3: Analyzing resume structure & identifying weaknesses...');

    const t1 = setTimeout(() => {
      setStageText('Stage 2/3: Rewriting bullets with Google XYZ formula & injecting keywords...');
    }, 2500);

    const t2 = setTimeout(() => {
      setStageText('Stage 3/3: Assembling clean ATS typography & calculating score lift...');
    }, 5500);

    try {
      const payload: Record<string, any> = {
        target_role: targetRole,
      };

      if (inputTab === 'paste' && rawText.trim()) {
        payload.raw_text = rawText.trim();
      } else {
        payload.resume_id = overrideResumeId || selectedResumeId;
      }

      const res = await api.post('/resumes/revamp', payload);
      clearTimeout(t1);
      clearTimeout(t2);

      if (res.data && res.data.candidate_name) {
        setData(res.data);
        showToast('Resume revamped with Gemini AI successfully!', 'success');
      } else {
        throw new Error('Invalid resume data returned');
      }
    } catch (err: any) {
      clearTimeout(t1);
      clearTimeout(t2);
      showToast(getErrorMessage(err) || 'Revamp service timeout. Loaded optimized ATS profile.', 'info');
    } finally {
      setLoading(false);
    }
  };

  const downloadPdf = async (customData?: RevampedResumeData) => {
    setDownloadingPdf(true);

    try {
      const payload = customData || data || {
        target_role: targetRole,
        candidate_name: 'Damanpreet Singh',
      };

      const response = await api.post('/resumes/download-pdf', payload, {
        responseType: 'blob',
      });

      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      const safeName = ((payload as any).candidate_name || 'Cleaned').replace(/\s+/g, '_');
      link.setAttribute('download', `${safeName}_ATS_Resume.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      showToast('Cleaned ATS PDF resume downloaded successfully!', 'success');
    } catch (err: any) {
      showToast(getErrorMessage(err) || 'Failed to download PDF', 'error');
    } finally {
      setDownloadingPdf(false);
    }
  };

  const copyCleanText = () => {
    if (!data) return;

    let full = `${data.candidate_name.toUpperCase()}\n`;
    full += `${data.target_role.toUpperCase()}\n`;
    const c = data.contact_info || {};
    full += `${c.email || ''} | ${c.phone || ''} | ${c.location || ''} | ${c.github || ''} | ${c.linkedin || ''}\n\n`;

    full += `PROFESSIONAL SUMMARY:\n${data.professional_summary}\n\n`;

    full += `TECHNICAL SKILLS:\n`;
    for (const [cat, skills] of Object.entries(data.technical_skills || {})) {
      full += `• ${cat}: ${skills.join(', ')}\n`;
    }
    full += `\n`;

    full += `WORK EXPERIENCE:\n`;
    for (const exp of data.work_experience || []) {
      full += `${exp.role} - ${exp.company} (${exp.dates || ''})\n`;
      for (const b of exp.bullets || []) {
        full += `  • ${b}\n`;
      }
    }
    full += `\n`;

    full += `TECHNICAL PROJECTS:\n`;
    for (const p of data.projects || []) {
      full += `${p.name} [${(p.tech_stack || []).join(', ')}]\n`;
      for (const b of p.bullets || []) {
        full += `  • ${b}\n`;
      }
    }
    full += `\n`;

    full += `EDUCATION:\n`;
    for (const edu of data.education || []) {
      full += `${edu.institution} - ${edu.degree} (${edu.dates || ''}) | GPA: ${edu.gpa || ''}\n`;
    }

    navigator.clipboard.writeText(full);
    setCopied(true);
    showToast('Cleaned resume text copied to clipboard!', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              AI Resume Revamp Studio
            </h1>
            <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold px-3 py-1 rounded-full shadow-xs">
              Gemini ATS Optimizer Active
            </span>
          </div>
          <p className="text-slate-600 text-xs sm:text-sm mt-1 font-medium">
            Transform weak or poorly-formatted resumes into gold-standard ATS documents with Google XYZ metrics & 1-click clean PDF download.
          </p>
        </div>

        {/* Action Buttons */}
        {data && !loading && (
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => downloadPdf()}
              disabled={downloadingPdf}
              className="btn-primary py-2.5 px-4 text-xs sm:text-sm flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-md font-bold"
            >
              {downloadingPdf ? (
                <div className="w-4 h-4 rounded-full border-2 border-white/20 border-t-white animate-spin" />
              ) : (
                <Download className="w-4 h-4" />
              )}
              {downloadingPdf ? 'Generating PDF...' : 'Download Clean PDF'}
            </button>

            <button
              onClick={() => window.print()}
              className="btn-secondary py-2.5 px-3.5 text-xs font-semibold flex items-center gap-1.5"
            >
              <Printer className="w-4 h-4 text-slate-500" />
              Print
            </button>

            <button
              onClick={copyCleanText}
              className="btn-secondary py-2.5 px-3.5 text-xs font-semibold flex items-center gap-1.5"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-slate-500" />}
              {copied ? 'Copied' : 'Copy Text'}
            </button>
          </div>
        )}
      </div>

      {/* Input Selection Card */}
      <div className="bg-white rounded-3xl p-6 mb-8 border border-slate-200 shadow-xs">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-6 pb-6 border-b border-slate-100">
          {/* Input Method Tabs */}
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
              Step 1: Select Resume Source
            </span>
            <div className="flex items-center gap-2 p-1 rounded-2xl bg-slate-100 border border-slate-200">
              <button
                onClick={() => setInputTab('existing')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  inputTab === 'existing'
                    ? 'bg-white text-indigo-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Existing Uploads
              </button>
              <button
                onClick={() => setInputTab('upload')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  inputTab === 'upload'
                    ? 'bg-white text-indigo-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Upload Raw / "Bad" Resume
              </button>
              <button
                onClick={() => setInputTab('paste')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  inputTab === 'paste'
                    ? 'bg-white text-indigo-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Paste Resume Text
              </button>
            </div>
          </div>

          {/* Target Role Selector */}
          <div className="flex-1 max-w-md">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
              Step 2: Target Engineering Role
            </span>
            <div className="flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-indigo-600 flex-shrink-0" />
              <input
                type="text"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                placeholder="e.g. Full Stack Software Engineer"
                className="bg-slate-50 text-slate-900 text-xs font-semibold rounded-xl px-3 py-2 border border-slate-200 focus:outline-none focus:border-indigo-500 w-full shadow-xs"
                list="role-suggestions"
              />
              <datalist id="role-suggestions">
                {DEFAULT_ROLES.map((r) => (
                  <option key={r} value={r} />
                ))}
              </datalist>
            </div>
          </div>

          {/* Action Buttons: Revamp & Direct PDF */}
          <div className="flex flex-col sm:flex-row items-center gap-2 self-end lg:self-center">
            <button
              onClick={() => handleRevamp()}
              disabled={loading || downloadingPdf}
              className="btn-primary py-3 px-5 text-xs sm:text-sm font-bold flex items-center gap-2 shadow-md whitespace-nowrap"
            >
              {loading ? (
                <div className="w-4 h-4 rounded-full border-2 border-white/20 border-t-white animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4" />
              )}
              {loading ? 'Rebuilding Resume...' : '✨ Revamp with Gemini AI'}
            </button>

            <button
              type="button"
              onClick={() => downloadPdf()}
              disabled={loading || downloadingPdf}
              className="btn-secondary py-3 px-4 text-xs sm:text-sm font-bold flex items-center gap-2 border border-emerald-500 text-emerald-700 hover:bg-emerald-50 shadow-xs whitespace-nowrap"
              title="Download clean vector PDF directly in sub-seconds"
            >
              {downloadingPdf ? (
                <div className="w-4 h-4 rounded-full border-2 border-emerald-600 border-t-transparent animate-spin" />
              ) : (
                <Download className="w-4 h-4 text-emerald-600" />
              )}
              <span>⚡ Fast Clean PDF</span>
            </button>
          </div>
        </div>

        {/* Input Details Body */}
        <div className="pt-4">
          {inputTab === 'existing' && (
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-indigo-600 flex-shrink-0" />
              <select
                value={selectedResumeId}
                onChange={(e) => setSelectedResumeId(e.target.value)}
                className="bg-slate-50 text-slate-900 text-xs font-semibold rounded-xl px-3 py-2.5 border border-slate-200 focus:outline-none focus:border-indigo-500 max-w-lg w-full shadow-xs"
              >
                {resumes.length === 0 ? (
                  <option value="">No previous resumes found. Switch to upload tab.</option>
                ) : (
                  resumes.map((r) => (
                    <option key={r.id} value={r.id} className="bg-white text-slate-900">
                      📄 {r.original_filename}
                    </option>
                  ))
                )}
              </select>
            </div>
          )}

          {inputTab === 'upload' && (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-300 hover:border-indigo-500 rounded-2xl p-6 text-center cursor-pointer transition-colors bg-slate-50 hover:bg-indigo-50/30"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.docx"
                onChange={handleFileUpload}
                className="hidden"
              />
              <Upload className="w-8 h-8 text-indigo-600 mx-auto mb-2" />
              <p className="text-xs font-bold text-slate-900">
                {uploadedFileName ? `Selected: ${uploadedFileName}` : 'Click or drop any weak/raw resume (PDF or DOCX)'}
              </p>
              <p className="text-[11px] text-slate-500 mt-1 font-medium">
                Gemini will scan, restructure, and convert it into a polished ATS standard.
              </p>
            </div>
          )}

          {inputTab === 'paste' && (
            <div>
              <textarea
                value={rawText}
                onChange={(e) => setRawText(e.target.value)}
                placeholder="Paste raw resume text, bullet points, or unstructured candidate notes here..."
                rows={4}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 resize-y shadow-xs"
              />
            </div>
          )}
        </div>
      </div>

      {/* Multi-Stage Loading Indicator */}
      {loading && (
        <div className="bg-white rounded-3xl p-10 text-center max-w-lg mx-auto border border-emerald-200 animate-fade-in shadow-sm">
          <div className="w-12 h-12 rounded-full border-2 border-emerald-200 border-t-emerald-600 animate-spin mx-auto mb-4" />
          <h3 className="text-base font-bold text-slate-900 mb-2">
            Transforming Weak Resume with Gemini...
          </h3>
          <p className="text-xs text-emerald-800 font-bold bg-emerald-50 border border-emerald-200 rounded-xl py-2 px-3 inline-block mb-3">
            {stageText}
          </p>
          <p className="text-[11px] text-slate-500 leading-relaxed max-w-sm mx-auto font-medium">
            Breaking execution into micro-tasks: structural formatting, XYZ metric formulation, keyword enrichment, and clean PDF compilation.
          </p>
        </div>
      )}

      {/* Revamped Output */}
      {data && !loading && (
        <div className="space-y-8 animate-fade-in">
          {/* Transformation Impact Card */}
          <div className="bg-white rounded-3xl p-6 border border-emerald-200 shadow-xs">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              {/* Score Lift Gauge */}
              <div className="flex items-center gap-4 border-b md:border-b-0 md:border-r border-slate-100 pb-4 md:pb-0 md:pr-4">
                <div className="text-center">
                  <span className="text-[10px] uppercase font-bold text-rose-500 block mb-0.5">
                    Before ATS Score
                  </span>
                  <div className="text-2xl font-black text-rose-500 line-through">
                    {data.ats_score_before}%
                  </div>
                  <span className="text-[10px] text-slate-400 font-medium">Raw / Weak</span>
                </div>

                <ArrowRight className="w-5 h-5 text-emerald-600 flex-shrink-0" />

                <div className="text-center">
                  <span className="text-[10px] uppercase font-bold text-emerald-600 block mb-0.5">
                    After ATS Score
                  </span>
                  <div className="text-3xl font-black text-emerald-600">
                    {data.ats_score_after}%
                  </div>
                  <span className="text-[10px] text-emerald-700 font-bold">Grade A+ (Elite)</span>
                </div>
              </div>

              {/* Weaknesses Resolved */}
              <div className="md:col-span-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
                  Key Deficiencies Automatically Corrected:
                </span>
                <div className="space-y-1.5">
                  {data.detected_weaknesses_fixed.map((fix, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-slate-700 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <span>{fix}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Injected ATS Keywords Banner */}
            {data.ats_keywords_highlighted && data.ats_keywords_highlighted.length > 0 && (
              <div className="mt-5 pt-4 border-t border-slate-100">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-500" />
                  Highlighted High-Impact Keywords Injected:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {data.ats_keywords_highlighted.map((kw, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-200 text-xs font-semibold"
                    >
                      +{kw}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Cleaned Resume Paper View Card */}
          <div className="relative">
            {/* View Mode Toggle Ribbon */}
            <div className="flex items-center justify-between mb-3 px-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-indigo-600" />
                ATS Preview Mode
              </span>
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
                <button
                  onClick={() => setViewMode('paper')}
                  className={`px-3 py-1 rounded-lg font-bold transition-all ${
                    viewMode === 'paper' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  📄 Classic Paper View
                </button>
                <button
                  onClick={() => setViewMode('dark')}
                  className={`px-3 py-1 rounded-lg font-bold transition-all ${
                    viewMode === 'dark' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  🌙 Dark Studio View
                </button>
              </div>
            </div>

            {/* Resume Sheet */}
            <div
              className={`rounded-3xl p-8 sm:p-12 shadow-2xl transition-all duration-300 font-sans ${
                viewMode === 'paper'
                  ? 'bg-white text-slate-900 border border-slate-200'
                  : 'glass-card border border-white/15 text-white'
              }`}
            >
              {/* Header */}
              <div className="text-center pb-4 border-b border-slate-300">
                <h2 className="text-2xl sm:text-3xl font-black tracking-tight uppercase">
                  {data.candidate_name}
                </h2>
                <div className="text-xs font-bold text-indigo-600 uppercase tracking-wider mt-1">
                  {data.target_role}
                </div>
                <div className="text-[11px] text-slate-600 mt-2 flex flex-wrap items-center justify-center gap-2">
                  {data.contact_info.email && <span>{data.contact_info.email}</span>}
                  {data.contact_info.phone && <span>&bull; {data.contact_info.phone}</span>}
                  {data.contact_info.location && <span>&bull; {data.contact_info.location}</span>}
                  {data.contact_info.github && <span>&bull; {data.contact_info.github}</span>}
                  {data.contact_info.linkedin && <span>&bull; {data.contact_info.linkedin}</span>}
                </div>
              </div>

              {/* Professional Summary */}
              {data.professional_summary && (
                <div className="mt-5">
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 pb-1 border-b border-slate-200 mb-2">
                    Professional Summary
                  </h3>
                  <p className="text-xs leading-relaxed text-slate-800">
                    {data.professional_summary}
                  </p>
                </div>
              )}

              {/* Technical Skills */}
              {data.technical_skills && (
                <div className="mt-5">
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 pb-1 border-b border-slate-200 mb-2">
                    Technical Skills
                  </h3>
                  <div className="text-xs space-y-1">
                    {Object.entries(data.technical_skills).map(([cat, skills], i) => (
                      <div key={i} className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2">
                        <span className="font-bold text-slate-900 min-w-[140px]">{cat}:</span>
                        <span className="text-slate-800">{skills.join(', ')}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Work Experience */}
              {data.work_experience && data.work_experience.length > 0 && (
                <div className="mt-5">
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 pb-1 border-b border-slate-200 mb-2">
                    Work Experience
                  </h3>
                  <div className="space-y-4">
                    {data.work_experience.map((exp, i) => (
                      <div key={i}>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs font-bold text-slate-900">
                          <div>
                            <span>{exp.role}</span>
                            <span className="text-slate-600 font-normal"> &mdash; {exp.company}</span>
                          </div>
                          <span className="text-[11px] text-slate-500 font-normal">{exp.dates}</span>
                        </div>
                        <ul className="mt-1.5 space-y-1 text-xs text-slate-800 pl-4 list-disc">
                          {exp.bullets.map((b, bIdx) => (
                            <li key={bIdx} className="leading-relaxed">
                              {b}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Technical Projects */}
              {data.projects && data.projects.length > 0 && (
                <div className="mt-5">
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 pb-1 border-b border-slate-200 mb-2">
                    Technical Projects
                  </h3>
                  <div className="space-y-4">
                    {data.projects.map((proj, i) => (
                      <div key={i}>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs font-bold text-slate-900">
                          <div>
                            <span>{proj.name}</span>
                            {proj.tech_stack && (
                              <span className="text-slate-600 font-normal italic">
                                {' '}
                                | {proj.tech_stack.join(', ')}
                              </span>
                            )}
                          </div>
                          {proj.link && (
                            <span className="text-[11px] text-indigo-600 font-medium">{proj.link}</span>
                          )}
                        </div>
                        <ul className="mt-1.5 space-y-1 text-xs text-slate-800 pl-4 list-disc">
                          {proj.bullets.map((b, bIdx) => (
                            <li key={bIdx} className="leading-relaxed">
                              {b}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Education */}
              {data.education && data.education.length > 0 && (
                <div className="mt-5">
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 pb-1 border-b border-slate-200 mb-2">
                    Education
                  </h3>
                  <div className="space-y-3">
                    {data.education.map((edu, i) => (
                      <div key={i} className="text-xs">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 font-bold text-slate-900">
                          <span>{edu.institution}</span>
                          <span className="text-[11px] text-slate-500 font-normal">{edu.dates}</span>
                        </div>
                        <div className="text-slate-700 italic">
                          {edu.degree}
                          {edu.gpa && <span className="font-semibold text-slate-900"> &bull; CGPA/GPA: {edu.gpa}</span>}
                        </div>
                        {edu.coursework && (
                          <div className="text-[11px] text-slate-600 mt-0.5">
                            <span className="font-semibold">Coursework:</span> {edu.coursework.join(', ')}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Certifications */}
              {data.certifications && data.certifications.length > 0 && (
                <div className="mt-5">
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 pb-1 border-b border-slate-200 mb-2">
                    Certifications & Honors
                  </h3>
                  <ul className="space-y-1 text-xs text-slate-800 pl-4 list-disc">
                    {data.certifications.map((c, i) => (
                      <li key={i}>{c}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
