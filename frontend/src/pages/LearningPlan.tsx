import { useState } from 'react';
import {
  GraduationCap,
  ExternalLink,
  CheckCircle2,
  Clock,
} from 'lucide-react';

interface LearningModule {
  week: string;
  topic: string;
  category: 'DSA' | 'Backend' | 'System Design' | 'Databases' | 'Cloud';
  estimatedHours: string;
  description: string;
  keyConcepts: string[];
  practiceLinks: { title: string; url: string; platform: string }[];
}

const MODULES: LearningModule[] = [
  {
    week: 'Week 1–2',
    topic: 'Data Structures & Algorithms Mastery',
    category: 'DSA',
    estimatedHours: '15 hrs',
    description: 'Core patterns tested in Google, Microsoft, and Amazon technical screen rounds. Focus on 2-Pointers, Sliding Window, Trees, and Dynamic Programming.',
    keyConcepts: ['Two Pointers & Sliding Window', 'Binary Search Variants', 'Graph BFS/DFS & Topo Sort', 'Memoization & 1D DP'],
    practiceLinks: [
      { title: 'LeetCode Problemset & Top Interview 150', url: 'https://leetcode.com/problemset/all/', platform: 'LeetCode' },
      { title: 'NeetCode 150 Practice Roadmap', url: 'https://neetcode.io/practice', platform: 'NeetCode' },
      { title: 'HackerRank Algorithms & Data Structures', url: 'https://www.hackerrank.com/domains/algorithms', platform: 'HackerRank' },
      { title: 'Striver A2Z DSA Course & Sheet', url: 'https://takeuforward.org/strivers-a2z-dsa-course/strivers-a2z-dsa-course-sheet-2/', platform: 'TakeUForward' },
    ],
  },
  {
    week: 'Week 3',
    topic: 'Relational Database Optimization & SQL',
    category: 'Databases',
    estimatedHours: '10 hrs',
    description: 'Master advanced SQL joins, indexing internals (B-Tree vs Hash), normalization forms, and transaction isolation levels.',
    keyConcepts: ['B-Tree Indexing & Query EXPLAIN', 'ACID Isolation Levels', 'Window Functions (ROW_NUMBER, RANK)', 'Connection Pooling'],
    practiceLinks: [
      { title: 'SQLBolt: Interactive SQL Tutorials & Exercises', url: 'https://sqlbolt.com/', platform: 'SQLBolt' },
      { title: 'LeetCode 50 SQL Study Plan', url: 'https://leetcode.com/studyplan/top-sql-50/', platform: 'LeetCode' },
      { title: 'PostgreSQL 16 Official Manual & Indexing Guide', url: 'https://www.postgresql.org/docs/current/indexes.html', platform: 'PostgreSQL' },
    ],
  },
  {
    week: 'Week 4–5',
    topic: 'Asynchronous Backend Engineering & Microservices',
    category: 'Backend',
    estimatedHours: '14 hrs',
    description: 'Build enterprise-grade REST APIs, asynchronous background task queues, and clean hexagonal/layered architectures in Python and TypeScript.',
    keyConcepts: ['AsyncIO Event Loop Concurrency', 'FastAPI Dependency Injection & Pydantic V2', 'JWT Role-Based Access Control', 'Rate Limiting & Caching'],
    practiceLinks: [
      { title: 'FastAPI Interactive Documentation & Tutorial', url: 'https://fastapi.tiangolo.com/tutorial/', platform: 'FastAPI' },
      { title: 'Python AsyncIO Official Guide', url: 'https://docs.python.org/3/library/asyncio.html', platform: 'Python Docs' },
      { title: 'Redis University: Caching & Data Structures', url: 'https://university.redis.io/', platform: 'Redis' },
    ],
  },
  {
    week: 'Week 6',
    topic: 'Containerization, CI/CD & Cloud Orchestration',
    category: 'Cloud',
    estimatedHours: '12 hrs',
    description: 'Dockerize multi-container architectures, author automated GitHub Actions CI/CD workflows, and deploy with Kubernetes pods and services.',
    keyConcepts: ['Multi-Stage Dockerfile Optimization', 'GitHub Actions Test & Lint Pipelines', 'Kubernetes Pods, Deployments & Ingress', 'Environment Variables & Secrets'],
    practiceLinks: [
      { title: 'Docker Official Getting Started Guide', url: 'https://docs.docker.com/get-started/', platform: 'Docker' },
      { title: 'KillerCoda: Free Interactive Kubernetes Playground', url: 'https://killercoda.com/playgrounds/scenario/kubernetes', platform: 'KillerCoda' },
      { title: 'GitHub Actions Documentation & Starter Workflows', url: 'https://docs.github.com/en/actions', platform: 'GitHub' },
    ],
  },
  {
    week: 'Week 7–8',
    topic: 'High-Level & Low-Level System Design',
    category: 'System Design',
    estimatedHours: '16 hrs',
    description: 'Architect scalable web systems handling 100K+ QPS. Master load balancing, database sharding, CAP theorem, and asynchronous event streams.',
    keyConcepts: ['Load Balancing & Reverse Proxies', 'Database Sharding & Replication', 'Event-Driven Message Queues (Kafka/RabbitMQ)', 'Consistent Hashing & CDN'],
    practiceLinks: [
      { title: 'The System Design Primer (Donne Martin)', url: 'https://github.com/donnemartin/system-design-primer', platform: 'GitHub (250k+ Stars)' },
      { title: 'High Scalability Real Architecture Case Studies', url: 'http://highscalability.com/', platform: 'HighScalability' },
      { title: 'ByteByteGo System Design Newsletter (Alex Xu)', url: 'https://bytebytego.com/', platform: 'ByteByteGo' },
    ],
  },
];

export default function LearningPlan() {
  const [completed, setCompleted] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem('resumelens_learning_completed');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const toggleComplete = (id: string) => {
    const updated = { ...completed, [id]: !completed[id] };
    setCompleted(updated);
    localStorage.setItem('resumelens_learning_completed', JSON.stringify(updated));
  };

  const completedCount = Object.values(completed).filter(Boolean).length;
  const progressPct = Math.round((completedCount / MODULES.length) * 100);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 sm:py-12 space-y-8 animate-fade-in text-slate-800">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-100">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-sky-700 text-xs font-bold uppercase tracking-wider mb-2">
              <GraduationCap className="w-3.5 h-3.5 text-sky-600" />
              Targeted Candidate Study Roadmap
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Personalized Learning Plan & Online Practice Tests
            </h1>
            <p className="text-slate-500 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
              Curated week-by-week curriculum directly linked to real LeetCode problems, SQL study plans, official manuals, and high-yield interview practice tests.
            </p>
          </div>

          {/* Progress Card */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex-shrink-0 flex items-center gap-4 min-w-[220px]">
            <div className="flex-1">
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                Roadmap Progress
              </span>
              <span className="text-2xl font-black text-slate-900 tabular-nums">
                {completedCount} <span className="text-sm font-semibold text-slate-400">/ {MODULES.length} Done</span>
              </span>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden mt-1.5">
                <div
                  className="bg-indigo-600 h-full rounded-full transition-all duration-500"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
            </div>
            <span className="text-lg font-black text-indigo-600">{progressPct}%</span>
          </div>
        </div>
      </div>

      {/* Modules List */}
      <div className="space-y-4">
        {MODULES.map((module) => {
          const isDone = completed[module.week];
          return (
            <div
              key={module.week}
              className={`bg-white rounded-2xl p-6 border transition-all ${
                isDone ? 'border-emerald-200 bg-emerald-50/20 shadow-sm' : 'border-slate-200 shadow-sm'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                <div className="flex items-start gap-3.5">
                  <button
                    type="button"
                    onClick={() => toggleComplete(module.week)}
                    className={`mt-0.5 w-6 h-6 rounded-lg flex items-center justify-center transition-all ${
                      isDone
                        ? 'bg-emerald-600 text-white'
                        : 'border-2 border-slate-300 hover:border-slate-400 text-transparent'
                    }`}
                    title={isDone ? 'Mark as incomplete' : 'Mark as completed'}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                  </button>

                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-black uppercase px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                        {module.week}
                      </span>
                      <span className="text-xs font-extrabold text-indigo-600">{module.category}</span>
                      <span className="text-slate-300">&bull;</span>
                      <span className="text-[11px] text-slate-400 flex items-center gap-1 font-semibold">
                        <Clock className="w-3 h-3" />
                        {module.estimatedHours}
                      </span>
                    </div>

                    <h3 className={`text-base font-bold ${isDone ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                      {module.topic}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed max-w-3xl">
                      {module.description}
                    </p>
                  </div>
                </div>
              </div>

              {/* Key Concepts Pills */}
              <div className="flex flex-wrap gap-1.5 mb-4 pl-9">
                {module.keyConcepts.map((concept) => (
                  <span
                    key={concept}
                    className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-slate-50 text-slate-600 border border-slate-200"
                  >
                    {concept}
                  </span>
                ))}
              </div>

              {/* Direct Practice Links */}
              <div className="pl-9 pt-3 border-t border-slate-100">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                  Direct Online Test & Practice Links:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                  {module.practiceLinks.map((link) => (
                    <a
                      key={link.title}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 rounded-xl bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 transition-all flex items-center justify-between group"
                    >
                      <div className="overflow-hidden pr-2">
                        <span className="text-[10px] font-extrabold uppercase text-indigo-600 block">
                          {link.platform}
                        </span>
                        <span className="text-xs font-semibold text-slate-800 group-hover:text-indigo-900 truncate block">
                          {link.title}
                        </span>
                      </div>
                      <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 flex-shrink-0" />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
