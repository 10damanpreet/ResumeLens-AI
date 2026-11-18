import {
  FolderGit2,
  ExternalLink,
  CheckCircle2,
} from 'lucide-react';

interface RecommendedProject {
  id: string;
  title: string;
  targetRole: string;
  atsKeywordsAddressed: string[];
  difficulty: 'Intermediate' | 'Advanced' | 'Enterprise';
  description: string;
  architectureBlueprint: string[];
  techStack: string[];
  githubStarterUrl: string;
}

const PROJECTS: RecommendedProject[] = [
  {
    id: 'proj-1',
    title: 'High-Throughput Asynchronous RAG & Vector Embeddings Engine',
    targetRole: 'AI / Backend Engineer',
    atsKeywordsAddressed: ['Vector Search', 'Cosine Similarity', 'FastAPI', 'LangChain', 'Docker', 'AsyncIO'],
    difficulty: 'Advanced',
    description: 'Solves the #1 missing keyword gap in modern AI roles: builds a production asynchronous retrieval-augmented generation engine that chunks documents, generates dense 384-D embeddings, and serves multi-turn queries in <50ms.',
    architectureBlueprint: [
      'Document Ingestion & Chunking pipeline with PyPDF & RecursiveCharacterTextSplitter',
      'Dense vector embedding generation using sentence-transformers (all-MiniLM-L6-v2)',
      'Vector indexing and hybrid dense-sparse search with Qdrant / FAISS / pgvector',
      'Asynchronous FastAPI microservice backend with streaming SSE endpoints',
      'Docker Compose deployment with automated PyTest unit coverage',
    ],
    techStack: ['Python 3.12', 'FastAPI', 'PyTorch / Transformers', 'Qdrant / pgvector', 'Docker'],
    githubStarterUrl: 'https://github.com/10damanpreet/ResumeLens-AI',
  },
  {
    id: 'proj-2',
    title: 'Distributed Transaction Ledger & Financial Microservices',
    targetRole: 'Senior Backend SDE',
    atsKeywordsAddressed: ['PostgreSQL', 'Redis', 'Kafka / RabbitMQ', 'ACID Concurrency', 'REST APIs', 'CI/CD'],
    difficulty: 'Enterprise',
    description: 'Implements double-entry bookkeeping with strict ACID transaction guarantees, distributed locks in Redis to prevent race conditions, and event-driven ledger sync via Kafka.',
    architectureBlueprint: [
      'Normalized schema design with B-Tree indices and row-level locking (SELECT FOR UPDATE)',
      'Distributed idempotency keys & token-bucket rate limiter via Redis',
      'Message publisher & consumer worker with RabbitMQ / Kafka',
      'Automated integration test suite with testcontainers and GitHub Actions',
    ],
    techStack: ['Python / Go', 'PostgreSQL 16', 'Redis', 'Docker Compose', 'GitHub Actions'],
    githubStarterUrl: 'https://github.com/10damanpreet/ResumeLens-AI',
  },
  {
    id: 'proj-3',
    title: 'Real-Time Collaborative Analytics Dashboard (Dark/Light Modern)',
    targetRole: 'Full Stack Engineer',
    atsKeywordsAddressed: ['React 18', 'TypeScript', 'Tailwind CSS', 'WebSockets', 'Recharts', 'State Management'],
    difficulty: 'Intermediate',
    description: 'Builds an executive-grade glassmorphic and clean-light presentation analytics interface with live WebSocket telemetry streams, interactive Recharts graphs, and responsive dark/light mode.',
    architectureBlueprint: [
      'React 18 Single Page Architecture with TypeScript strict mode',
      'Full WebSocket listener with auto-reconnection and exponential backoff',
      'Responsive data tables with client-side sorting, fuzzy search, and pagination',
      'Automated accessibility (WCAG AA) and Lighthouse performance optimization (>95 score)',
    ],
    techStack: ['React 18', 'TypeScript', 'Tailwind CSS', 'Vite', 'Recharts'],
    githubStarterUrl: 'https://github.com/10damanpreet/ResumeLens-AI',
  },
  {
    id: 'proj-4',
    title: 'Automated CI/CD Kubernetes Cloud Deployment Pipeline',
    targetRole: 'Cloud & DevOps SDE',
    atsKeywordsAddressed: ['Kubernetes', 'Docker', 'Helm', 'Terraform', 'Prometheus', 'AWS'],
    difficulty: 'Advanced',
    description: 'Containerizes multi-service applications, defines Helm charts, provisions infrastructure as code using Terraform, and implements Prometheus & Grafana telemetry dashboards.',
    architectureBlueprint: [
      'Multi-stage Dockerfile cutting image size from 1.2GB to 85MB',
      'Kubernetes Deployment, Service, Ingress, and HorizontalPodAutoscaler (HPA)',
      'GitHub Actions workflow with semantic versioning and container registry push',
      'Prometheus metric scrapers and alerting thresholds for 5xx errors',
    ],
    techStack: ['Kubernetes', 'Docker', 'Helm', 'GitHub Actions', 'Prometheus'],
    githubStarterUrl: 'https://github.com/10damanpreet/ResumeLens-AI',
  },
];

export default function ProjectsCatalog() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8 sm:py-12 space-y-8 animate-fade-in text-slate-800">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-100">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 border border-purple-200 text-purple-700 text-xs font-bold uppercase tracking-wider mb-2">
              <FolderGit2 className="w-3.5 h-3.5 text-purple-600" />
              Strategic Portfolio Recommendations
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              High-Yield Projects to Eliminate Resume Skill Gaps
            </h1>
            <p className="text-slate-500 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
              If your resume is missing critical technical competencies (e.g. Docker, Vector Databases, or Async APIs), adding these enterprise-grade portfolio projects bridges the gap with verified code evidence.
            </p>
          </div>
        </div>
      </div>

      {/* Projects List */}
      <div className="space-y-6">
        {PROJECTS.map((project) => (
          <div
            key={project.id}
            className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 hover:border-purple-300 transition-all shadow-sm"
          >
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-3">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800">
                    {project.targetRole}
                  </span>
                  <span className="text-xs font-bold text-slate-400">&bull;</span>
                  <span className="text-xs font-bold text-slate-500">{project.difficulty} Level</span>
                </div>
                <h3 className="text-lg sm:text-xl font-extrabold text-slate-900">{project.title}</h3>
              </div>

              <a
                href={project.githubStarterUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-slate-900 text-white hover:bg-slate-800 transition-colors flex-shrink-0 shadow-sm"
              >
                <FolderGit2 className="w-3.5 h-3.5" />
                <span>View GitHub Template</span>
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </a>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed mb-4">{project.description}</p>

            {/* Targeted ATS Keywords Addressed */}
            <div className="mb-4 p-3 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                ATS Keywords Injected into Your Resume:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {project.atsKeywordsAddressed.map((kw) => (
                  <span
                    key={kw}
                    className="text-[11px] font-bold px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1"
                  >
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    {kw}
                  </span>
                ))}
              </div>
            </div>

            {/* Step-by-Step Architecture Blueprint */}
            <div className="pt-2">
              <span className="text-[11px] font-bold text-slate-900 uppercase tracking-wider block mb-2">
                Implementation Architecture Blueprint:
              </span>
              <ol className="space-y-1.5 list-decimal list-inside text-xs text-slate-600">
                {project.architectureBlueprint.map((step, idx) => (
                  <li key={idx} className="leading-relaxed">
                    <span className="font-medium text-slate-800">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
