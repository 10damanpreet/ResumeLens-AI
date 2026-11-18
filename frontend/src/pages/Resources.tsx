import { useState } from 'react';
import {
  BookOpen,
  Video,
  ExternalLink,
  Search,
  FileText,
  Play,
} from 'lucide-react';

interface OfficialDoc {
  name: string;
  category: string;
  summary: string;
  officialUrl: string;
  topFunctions: string[];
  badge: string;
}

const OFFICIAL_DOCS: OfficialDoc[] = [
  {
    name: 'Pandas API & Function Reference',
    category: 'Data Science & Python',
    summary: 'The complete official API reference explaining all DataFrame, Series, and aggregation functions with mathematical definitions and examples.',
    officialUrl: 'https://pandas.pydata.org/docs/reference/index.html',
    topFunctions: ['pd.read_csv() / read_sql()', 'df.groupby().agg()', 'df.merge() / join()', 'df.pivot_table()', 'df.apply() & map()', 'df.fillna() / dropna()'],
    badge: 'Official Docs',
  },
  {
    name: 'Python 3.12+ Standard Library Reference',
    category: 'Core Language',
    summary: 'Official documentation for Python core built-ins, asyncIO, collections, itertools, multiprocessing, and typing.',
    officialUrl: 'https://docs.python.org/3/library/index.html',
    topFunctions: ['asyncio.gather() / run()', 'collections.defaultdict', 'itertools.combinations', 'functools.lru_cache', 'typing.Annotated'],
    badge: 'Python.org',
  },
  {
    name: 'FastAPI High-Performance Web Framework',
    category: 'Backend Microservices',
    summary: 'Production REST API framework featuring auto-generated OpenAPI/Swagger schemas, async request handlers, and Pydantic validation.',
    officialUrl: 'https://fastapi.tiangolo.com/reference/',
    topFunctions: ['FastAPI() & APIRouter()', 'Depends() for DI', 'BackgroundTasks', 'HTTPException & status', 'OAuth2PasswordBearer'],
    badge: 'FastAPI Docs',
  },
  {
    name: 'PostgreSQL 16 Engine & SQL Manual',
    category: 'Relational Database',
    summary: 'Official guide to B-Tree indexing, execution plans (EXPLAIN ANALYZE), window functions, ACID concurrency, and JSONB queries.',
    officialUrl: 'https://www.postgresql.org/docs/current/index.html',
    topFunctions: ['CREATE INDEX CONCURRENTLY', 'EXPLAIN (ANALYZE, BUFFERS)', 'ROW_NUMBER() OVER (...)', 'WITH RECURSIVE (CTEs)', 'VACUUM & AUTOVACUUM'],
    badge: 'Postgres Core',
  },
  {
    name: 'Docker Engine & Compose Reference',
    category: 'Cloud & DevOps',
    summary: 'Official containerization manuals covering multi-stage Dockerfiles, volume mounts, bridge networks, and production Compose stacks.',
    officialUrl: 'https://docs.docker.com/reference/',
    topFunctions: ['docker build --target', 'docker-compose up -d', 'HEALTHCHECK instructions', 'docker network create', 'Multi-stage caching'],
    badge: 'Docker Docs',
  },
  {
    name: 'React 18 & TypeScript API Reference',
    category: 'Frontend Architecture',
    summary: 'Official guides for hooks, concurrent rendering, virtual DOM reconciliation, and strict TypeScript component typing.',
    officialUrl: 'https://react.dev/reference/react',
    topFunctions: ['useState & useEffect', 'useMemo & useCallback', 'useRef for DOM/cache', 'createContext & useContext', 'Suspense & ErrorBoundaries'],
    badge: 'React.dev',
  },
];

interface VideoLecture {
  title: string;
  instructor: string;
  platform: string;
  duration: string;
  description: string;
  url: string;
  tag: string;
}

const VIDEO_LECTURES: VideoLecture[] = [
  {
    title: 'Harvard CS50: Introduction to Computer Science',
    instructor: 'Prof. David J. Malan (Harvard University)',
    platform: 'Harvard University / YouTube',
    duration: '24 hrs (Full Course)',
    description: 'The golden standard introductory computer science curriculum covering memory management, C pointers, algorithms, Python, SQL, and web development.',
    url: 'https://cs50.harvard.edu/x/',
    tag: 'Foundations',
  },
  {
    title: 'MIT 6.006: Introduction to Algorithms',
    instructor: 'Prof. Erik Demaine & Prof. Srini Devadas (MIT)',
    platform: 'MIT OpenCourseWare',
    duration: '24 Lectures',
    description: 'Rigorous algorithmic proofs and implementations: sorting, binary search trees, hashing, shortest paths (Dijkstra, Bellman-Ford), and dynamic programming.',
    url: 'https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/',
    tag: 'Algorithms',
  },
  {
    title: 'Python & FastAPI Backend Engineering Masterclass',
    instructor: 'Sanjeev Thiyagarajan (freeCodeCamp)',
    platform: 'freeCodeCamp (19 Hours)',
    duration: '19 hrs Full Course',
    description: 'End-to-end backend masterclass: FastAPI REST APIs, SQLAlchemy ORM, Alembic migrations, PostgreSQL, JWT tokens, testing with PyTest, and Docker deployment.',
    url: 'https://www.youtube.com/watch?v=0sOvCWFmrtA',
    tag: 'Backend',
  },
  {
    title: 'Docker & Kubernetes Tutorial for Beginners',
    instructor: 'TechWorld with Nana',
    platform: 'freeCodeCamp / YouTube',
    duration: '4 hrs',
    description: 'Practical DevOps course explaining Docker containers, images, volumes, Kubernetes pods, deployments, services, ingress, and configmaps.',
    url: 'https://www.youtube.com/watch?v=X48VuDVv0do',
    tag: 'DevOps',
  },
  {
    title: 'Neural Networks: Zero to Hero',
    instructor: 'Andrej Karpathy (Former Director of AI at Tesla / OpenAI)',
    platform: 'YouTube (7 Masterclasses)',
    duration: '15 hrs',
    description: 'Build micrograd, backpropagation, language models, tokenizers, and a complete GPT from scratch in pure Python and PyTorch.',
    url: 'https://karpathy.ai/zero-to-hero.html',
    tag: 'Generative AI',
  },
  {
    title: 'System Design Interview – Step by Step Guide',
    instructor: 'Alex Xu (Author of System Design Interview)',
    platform: 'ByteByteGo / YouTube',
    duration: 'Interactive Playlist',
    description: 'Real-world architecture breakdowns: URL shortener, rate limiter, chat system, news feed, YouTube video streaming, and Google Drive.',
    url: 'https://www.youtube.com/@ByteByteGo',
    tag: 'System Design',
  },
];

export default function Resources() {
  const [activeTab, setActiveTab] = useState<'docs' | 'videos'>('docs');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredDocs = OFFICIAL_DOCS.filter(
    (d) =>
      d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.topFunctions.some((f) => f.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filteredVideos = VIDEO_LECTURES.filter(
    (v) =>
      v.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.instructor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.tag.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 sm:py-12 space-y-8 animate-fade-in text-slate-800">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-100">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-700 text-xs font-bold uppercase tracking-wider mb-2">
              <BookOpen className="w-3.5 h-3.5 text-teal-600" />
              Official Documentation & Video Masterclasses
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Engineering Resources & Official Function References
            </h1>
            <p className="text-slate-500 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
              Direct access to official library documentation (Pandas functions reference, Python standard library, FastAPI, Docker) alongside curated world-class lecture series from MIT, Harvard, and industry leaders.
            </p>
          </div>

          {/* Tab Selector */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-2xl flex-shrink-0 border border-slate-200">
            <button
              type="button"
              onClick={() => setActiveTab('docs')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'docs'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <FileText className="w-3.5 h-3.5 text-teal-600" />
              Official Docs & Functions
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('videos')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'videos'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Video className="w-3.5 h-3.5 text-rose-600" />
              Video Masterclasses
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="pt-6">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search functions (e.g. groupby, asyncio, B-Tree, microservices, algorithms)..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl text-xs bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
            />
          </div>
        </div>
      </div>

      {/* Docs Tab Content */}
      {activeTab === 'docs' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredDocs.map((doc) => (
            <div
              key={doc.name}
              className="bg-white rounded-2xl p-6 border border-slate-200 hover:border-teal-300 transition-all shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-md bg-teal-50 text-teal-700 border border-teal-200">
                    {doc.badge}
                  </span>
                  <span className="text-xs font-semibold text-slate-400">{doc.category}</span>
                </div>

                <h3 className="text-base font-bold text-slate-900 mb-1.5">{doc.name}</h3>
                <p className="text-xs text-slate-500 leading-relaxed mb-4">{doc.summary}</p>

                {/* Function Reference Highlights */}
                <div className="mb-4">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                    Essential Key Functions & APIs:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {doc.topFunctions.map((func) => (
                      <code
                        key={func}
                        className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-50 text-indigo-700 border border-slate-200 font-semibold"
                      >
                        {func}
                      </code>
                    ))}
                  </div>
                </div>
              </div>

              <a
                href={doc.officialUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-slate-50 hover:bg-teal-50 text-teal-700 border border-slate-200 hover:border-teal-200 flex items-center justify-center gap-1.5 transition-all group"
              >
                <span>Read Official Documentation & Function Guides</span>
                <ExternalLink className="w-3.5 h-3.5 text-teal-500 group-hover:translate-x-0.5 transition-transform" />
              </a>
            </div>
          ))}
        </div>
      )}

      {/* Video Masterclasses Tab Content */}
      {activeTab === 'videos' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredVideos.map((video) => (
            <div
              key={video.title}
              className="bg-white rounded-2xl p-6 border border-slate-200 hover:border-rose-300 transition-all shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 border border-rose-200">
                    {video.tag}
                  </span>
                  <span className="text-xs font-semibold text-slate-400">{video.duration}</span>
                </div>

                <h3 className="text-sm font-bold text-slate-900 leading-snug mb-1">{video.title}</h3>
                <span className="text-[11px] font-bold text-indigo-600 block mb-2">{video.instructor}</span>
                <p className="text-xs text-slate-500 leading-relaxed mb-4 line-clamp-3">{video.description}</p>
              </div>

              <a
                href={video.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-slate-50 hover:bg-rose-50 text-rose-700 border border-slate-200 hover:border-rose-200 flex items-center justify-center gap-1.5 transition-all group"
              >
                <Play className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                <span>Watch Lecture Series Free</span>
                <ExternalLink className="w-3 h-3 text-rose-400 group-hover:translate-x-0.5 transition-transform" />
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
