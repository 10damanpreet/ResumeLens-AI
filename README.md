# ResumeLens AI 🚀

### Enterprise-Grade Career Intelligence, Recruiter Talent Acquisition & Generative AI Matching Platform

[![CI](https://github.com/10damanpreet/ResumeLens-AI/actions/workflows/ci.yml/badge.svg)](https://github.com/10damanpreet/ResumeLens-AI/actions)
[![Tests](https://img.shields.io/badge/Tests-27%2F27%20Passing-success.svg)](tests/)
[![Python 3.12+](https://img.shields.io/badge/python-3.12%20%7C%203.14-blue.svg)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115+-009688.svg?logo=fastapi)](https://fastapi.tiangolo.com)
[![React 18](https://img.shields.io/badge/React-18.2-61DAFB.svg?logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.2-3178C6.svg?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC.svg?logo=tailwind-css)](https://tailwindcss.com/)
[![Database](https://img.shields.io/badge/Database-SQLite%20(Default)%20%7C%20Postgres%2016%20pgvector-003B57.svg?logo=postgresql)](https://sqlite.org)
[![Generative AI](https://img.shields.io/badge/GenAI-Gemini%203.6%20Flash%20%7C%20Flash%20Lite-8E75C2.svg?logo=google)](https://deepmind.google/technologies/gemini/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## ⚡ Quick Evaluation & Demo Access

For course instructors, academic evaluators, and recruitment demonstrations, pre-configured roles are available out of the box:

| Role / Portal | Demo Email | Password | Access Capabilities |
| :--- | :--- | :--- | :--- |
| **Candidate Portal** (`/`) | `student@resumelens.ai` *(or test@example.com)* | `Password123!` | PII redaction, Tri-factor match, AI Resume Studio (PDF), What-If Simulator, Learning Plan, Opportunities |
| **Recruiter Suite** (`/recruiter`) | `recruiter@resumelens.ai` | `Password123!` | Tier-1 requisitions (Google, Microsoft, Amazon), Bulk screening, Ranked Leaderboards, Status Workflow |

> **Enterprise Recruiter Keys**: `RECRUITER2026` &nbsp;|&nbsp; `TIET-HR-2026` &nbsp;|&nbsp; `ENTERPRISE-PRO`

---

## 🌟 Executive Summary

**ResumeLens AI** is an enterprise-grade, end-to-end career intelligence and talent acquisition platform designed and built over a 6-month software engineering development lifecycle. The platform bridges the gap between candidates seeking career progression and technical recruiters screening hundreds of applicants per requisition.

Built with a high-performance **FastAPI (Python 3.12/3.14)** asynchronous backend and a modern **React 18 + TypeScript** clean single-page application with a crisp light theme, ResumeLens AI combines local dense vector embeddings (`all-MiniLM-L6-v2`), lexical fuzzy matching, multi-platform ATS compliance auditing, and dual-model generative AI (**Google Gemini 3.6 Flash / Flash Lite**) to deliver real-time career analytics.

---

## 💎 Dual-Role Platform Architecture

The system serves two primary enterprise personas through tailored workspaces:

```text
                                  +-----------------------+
                                  |    ResumeLens AI      |
                                  | Platform Architecture |
                                  +-----------+-----------+
                                              |
                   +--------------------------+--------------------------+
                   |                                                     |
+------------------v-------------------+             +-------------------v------------------+
|      Candidate Workspace (B2C)       |             |   Recruiter Talent Suite (B2B SaaS)  |
+--------------------------------------+             +--------------------------------------+
| 1. Privacy-First PII Redaction       |             | 1. Multi-Requisition Overview        |
| 2. Tri-Factor Hybrid Compatibility   |             | 2. AI Job Description Generator      |
| 3. Interactive Competency Radar      |             | 3. Bulk Multi-Resume Screening       |
| 4. 6-Platform ATS Engine & Screener  |             | 4. Ranked Applicant Leaderboard      |
| 5. What-If Strategy & Score Delta    |             | 5. Pipeline Kanban Status Workflow   |
| 6. Traceable Evidence Matrix         |             | 6. Head-to-Head Candidate Matrix     |
| 7. HackerRank GitHub & Anti-Cheat    |             | 7. 1-Click CSV Roster Export         |
| 8. AI Resume Studio (XYZ PDF Builder)|             +--------------------------------------+
| 9. Learning Plan (LeetCode Links)    |
| 10. Opportunities & Hackathon Feed   |
| 11. Application Kanban Job Tracker   |
| 12. Model Methodology Transparency   |
+--------------------------------------+
```

### 1. Candidate Workspace Super-Tools
- **Privacy-First PII Filter**: Automatic regex masking of sensitive personally identifiable information (phone numbers, physical addresses, emails) prior to LLM transmission.
- **Tri-Factor Hybrid Matching Algorithm**:
  $$\text{Final Score} = 0.40 \times \text{Dense Semantic Cosine} + 0.40 \times \text{Skill Overlap} + 0.20 \times \text{Experience Fit}$$
  - **Dense Vector Embeddings**: 384-dimensional dense semantic vectors computed via `all-MiniLM-L6-v2` (Sentence-Transformers).
  - **Lexical Overlap**: Set-theoretic taxonomy intersection across 60+ curated software engineering domains via `RapidFuzz`.
  - **Experience & Seniority Fit**: Automated tenure and project depth heuristic extractor.
- **Competency Radar Breakdown**: 5-axis interactive visualizer rendered with Recharts (Semantic Fit, Technical Skills, Role Readiness, ATS Structure, Experience Fit).
- **6-Platform Enterprise ATS Simulation Engine**: Real-time simulation across **Workday, Taleo (Oracle), iCIMS, Greenhouse, Lever, and SAP SuccessFactors** with platform-specific keyword parsing strictness, pass/fail screening thresholds, and quirk mitigation strategies.
- **Interactive What-If Scenario & ATS Score Difference Simulator**: Real-time recalculation sandbox empowering candidates to simulate the exact **difference in ATS score** (`Baseline ATS` &rarr; `Simulated ATS` &bull; `ATS Score Delta`) with a dual-layer progress bar mapped against corporate cutoffs.
- **Traceable Requirement-to-Evidence Matrix**: Sentence-level JD requirement decomposition mapped to verbatim resume evidence snippets with multi-level confidence scoring (`evidenced`, `partial`, `missing`) and actionable ATS advisory tips.
- **HackerRank-Grade GitHub Verification & Anti-Cheat LLM Injection Defense**: Live GitHub repository verification, commit/star telemetry, primary language stack extraction, and anti-tamper security scanning detecting invisible white-text, prompt injections, and keyword-stuffing exploits.
- **AI Resume Revamp Studio & Clean PDF Generator (`/studio`)**: Takes weak or unformatted resumes, rewrites the entire document using Google's XYZ formula (*Accomplished [X] as measured by [Y] by doing [Z]*), injects missing keywords, and compiles a clean vector PDF via ReportLab for instant 1-click download.
- **Interactive Learning Plan & Practice Arena (`/learning-plan`)**: Targeted technical curriculum with direct problem links to LeetCode, NeetCode, and official documentation to bridge identified skill gaps.
- **Curated Technical Resources Hub (`/resources`)**: Official library documentation links (Pandas, PyTorch, Docker, FastAPI, React) and verified video masterclasses.
- **Architectural Project Gap Blueprints (`/projects`)**: Production project templates and step-by-step architectural blueprints to eliminate employer reservations.
- **Opportunity Engine (`/opportunities`)**: Aggregates live software engineering internships, active corporate jobs, and Google / Unstop hackathons with 1-click application saving.
- **Job Application Kanban Tracker (`/tracker`)**: Persistent multi-stage tracking board (`Wishlist`, `Applied`, `Interviewing`, `Offer`, `Archived`) with salary, match score, and notes tracking.
- **Settings & Methodology Transparency (`/settings`, `/methodology`)**: Candidate profile configuration, target seniority settings, and detailed tri-factor algorithm weight inspection.

### 2. Recruiter / HR Talent Intelligence Suite (`/recruiter`)
- **Automated Requisition Pipeline**: Instant selection and inspection of active corporate requisitions (Google, Microsoft, Amazon, Atlassian, Uber).
- **AI Job Description Generator**: Generates structured, high-conversion job descriptions with roles, responsibilities, required/nice-to-have skills, and qualifications using Gemini AI.
- **Bulk Candidate Screening & Leaderboard**: Batch-evaluates candidate resumes simultaneously against a target job requisition and ranks applicants in an interactive leaderboard.
- **Pipeline Workflow Management**: In-line status toggling (`review`, `shortlisted`, `interview`, `rejected`) with immediate backend database synchronization (`PATCH /matches/{id}/status`).
- **Head-to-Head Candidate Comparison Matrix**: Side-by-side multi-candidate modal comparing up to 3 applicants across overall compatibility, semantic fit, technical overlap, and detected strengths.
- **1-Click Executive CSV Export**: Instant export of applicant leaderboards and scoring metrics for integration into enterprise HRIS/ATS systems (Workday, Greenhouse, Lever).

---

## ⚡ High-Availability AI Engine Architecture

To ensure zero downtime and resilience against API rate-limits and network latency, ResumeLens AI employs an enterprise **dual-model failover gateway**:

```text
               +-------------------------------------------+
               |         Incoming AI Analysis Task         |
               +---------------------+---------------------+
                                     |
                                     v
               +-------------------------------------------+
               |         Primary: Google Gemini 3.6        |
               |          gemini-3.6-flash (REST)          |
               |     Guardrail Timeout: 4.5s (AsyncIO)     |
               +---------------------+---------------------+
                                     |
                    +----------------+----------------+
                    | (Success)                       | (Timeout / Rate Limit)
                    v                                 v
        +-----------------------+         +-----------------------+
        | Return Live Synthesis |         |  Secondary: Gemini    |
        +-----------------------+         |  3.5-flash-lite       |
                                          +-----------+-----------+
                                                      |
                                     +----------------+----------------+
                                     | (Success)                       | (Failure)
                                     v                                 v
                         +-----------------------+         +-----------------------+
                         | Return Lite Synthesis |         | Rule-Based Heuristic  |
                         |                       |         | Zero-Downtime Fallback|
                         +-----------------------+         +-----------------------+
```

---

## 🛠️ Complete Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend Framework** | React 18.2, TypeScript 5.2, Vite 5.4, React Router DOM v6 |
| **Styling & Design System** | Tailwind CSS 3.4, Lucide React Icons, Modern Crisp Light Theme (`#f8fafc`), High-Contrast Typography |
| **Data Visualizations** | Recharts (Radar, Area, Bar charts), Custom Animated SVG Dial Components |
| **Backend Framework** | FastAPI 0.115+, Uvicorn (ASGI), Pydantic v2, Python 3.12 / 3.14 |
| **Database & ORM** | SQLite + `aiosqlite` (Default local) / PostgreSQL 16 + `asyncpg` + `pgvector`, SQLAlchemy 2.0 Async |
| **NLP & Local Machine Learning**| Sentence-Transformers (`all-MiniLM-L6-v2` 384-D), RapidFuzz 3.14+, spaCy 3.7+ |
| **Document Processing & PDF** | ReportLab (Vector PDF Generation), PDFPlumber, python-docx, Custom Regex Redactor |
| **Generative AI Suite** | Google Generative AI (`gemini-3.6-flash`, `gemini-3.5-flash-lite`, REST Transport) |
| **Code Quality & CI/CD** | PyTest (27/27 Tests), PyTest-Asyncio, Ruff (Linter & Formatter), GitHub Actions CI |

---

## 📂 Project Structure

```text
ResumeLens-AI/
├── .github/
│   └── workflows/
│       └── ci.yml                 # Automated GitHub Actions CI workflow
├── alembic/                       # Alembic schema migrations
├── app/
│   ├── api/                       # REST API Route Controllers
│   │   ├── auth.py                # JWT authentication, portal isolation & recruiter keys
│   │   ├── gaps.py                # Gemini skill gap advisory & interview predictions
│   │   ├── health.py              # System health & database probes
│   │   ├── jobs.py                # Requisition retrieval & AI JD generation
│   │   ├── matches.py             # Match computation, bulk screening, what-if & leaderboards
│   │   ├── resumes.py             # Document upload, bullet tailoring, revamp & PDF download
│   │   └── tasks.py               # Asynchronous task logging
│   ├── core/                      # Security (bcrypt, JWT) & dependency injection
│   ├── models/                    # SQLAlchemy async models (Candidate, Resume, Match, etc.)
│   ├── schemas/                   # Pydantic v2 request/response schemas
│   ├── services/                  # Business logic engines
│   │   ├── ats_engine.py          # 6-platform ATS simulation & what-if delta engine
│   │   ├── gap_analyzer.py        # Skill gap extraction & study plan generator
│   │   ├── github_verifier.py     # Live GitHub commit verification & anti-cheat auditor
│   │   ├── llm_gateway.py         # Dual-model Gemini gateway with automatic failover
│   │   ├── matcher.py             # Tri-factor hybrid vector matching algorithm
│   │   ├── pdf_generator.py       # ReportLab ATS-compliant vector PDF compiler
│   │   ├── pii_redactor.py        # Privacy-first regex PII mask
│   │   ├── requirement_matrix.py  # Sentence-level JD requirement to evidence mapper
│   │   ├── revamp_service.py      # Google XYZ resume revamp & keyword optimizer
│   │   ├── segmenter.py           # Resume section boundary detector
│   │   └── tailor_service.py      # Google XYZ bullet rewriter & cover letter generator
│   ├── config.py                  # Pydantic BaseSettings environment loader
│   ├── database.py                # SQLAlchemy async engine & sessionmaker (SQLite / Postgres)
│   └── main.py                    # FastAPI application initialization & CORS config
├── docs/                          # Engineering Documentation & Architecture Records
│   ├── SYSTEM_ARCHITECTURE.md     # High-level architecture, formulas, ER diagram & security
│   ├── API_DOCUMENTATION.md       # OpenAPI endpoint specs with request/response schemas
│   ├── RECRUITER_STUDENT_PORTAL_GUIDE.md # Evaluator manual & user walkthrough
│   └── adr/                       # Architecture Decision Records
│       ├── 001-why-agile.md       # ADR 001: Agile/Scrum SDLC methodology
│       ├── 002-dual-model-ai-failover.md # ADR 002: Dual-model LLM gateway & timeouts
│       ├── 003-portal-isolation-and-rbac.md # ADR 003: Portal RBAC & credential isolation
│       └── 004-tri-factor-hybrid-matching.md # ADR 004: Tri-factor compatibility algorithm
├── frontend/                      # React 18 + TypeScript Application
│   ├── src/
│   │   ├── api/client.ts          # Axios client with JWT auto-injection & error interceptors
│   │   ├── components/            # Reusable UI component library
│   │   │   ├── ATSScreenerCard.tsx        # 6-platform ATS pass/fail screener
│   │   │   ├── ATSHealthCard.tsx          # ATS section hygiene and metrics inspector
│   │   │   ├── CompetencyRadar.tsx        # Interactive multi-axis Recharts radar chart
│   │   │   ├── CoverLetterModal.tsx       # 1-Click tailored executive cover letter modal
│   │   │   ├── GitHubAuditCard.tsx        # GitHub signals & anti-cheat transparency card
│   │   │   ├── LiveProgressConsole.tsx    # Terminal-style real-time progress stream
│   │   │   ├── RecentScans.tsx            # Evaluation history widget
│   │   │   ├── RequirementMatrixView.tsx  # Traceable requirement evidence matrix table
│   │   │   ├── Sidebar.tsx                # Responsive multi-tier sidebar navigation
│   │   │   ├── StudyRoadmap.tsx           # Interactive task checklist with localStorage
│   │   │   ├── Toast.tsx                  # Floating toast notification system
│   │   │   └── WhatIfSimulator.tsx        # Interactive what-if ATS score delta simulator
│   │   ├── pages/                 # Full-page application views
│   │   │   ├── Dashboard.tsx      # Candidate landing, upload & match execution
│   │   │   ├── JobTracker.tsx     # 5-stage application Kanban board
│   │   │   ├── LearningPlan.tsx   # Study plan with direct LeetCode / NeetCode practice
│   │   │   ├── Login.tsx          # Dual-portal authentication view
│   │   │   ├── MatchResults.tsx   # Tri-factor report, score ring & multi-feature tabs
│   │   │   ├── Opportunities.tsx  # Live internships, jobs, hackathons & saved items
│   │   │   ├── ProjectsCatalog.tsx# Recommended projects to close resume skill gaps
│   │   │   ├── RecruiterPortal.tsx# HR suite: bulk screening, leaderboard, matrix
│   │   │   ├── Register.tsx       # Account creation view
│   │   │   ├── Resources.tsx      # Curated tech documentation & video lecture hub
│   │   │   ├── ResumeStudio.tsx   # 1-click ATS resume revamp & clean PDF download
│   │   │   ├── ResumeTailor.tsx   # Side-by-side XYZ bullet optimizer & selector ribbon
│   │   │   ├── SettingsPage.tsx   # User profile, seniority, and model methodology
│   │   │   └── SkillGaps.tsx      # Generative AI advisory & learning curriculum
│   │   ├── App.tsx                # Dual-role navigation bar, sidebar layout & router
│   │   └── index.css              # Modern crisp light theme & global selection styling
│   ├── package.json               # Node.js dependencies & scripts
│   ├── tailwind.config.js         # Custom animations, gradients & shadows
│   └── vite.config.ts             # Vite configuration with chunk splitting
├── scripts/                       # Database seeding & taxonomy initialization
│   └── seed_taxonomy.py           # Core software engineering technology taxonomy
├── tests/                         # Automated Unit & Integration Test Suite (27 Tests)
│   ├── conftest.py                # Pytest async SQLite fixtures & auto-schema setup
│   ├── test_ats_and_verifier.py   # Multi-platform ATS engine & GitHub anti-cheat tests
│   ├── test_auth.py               # Authentication, JWT, and authorization tests
│   ├── test_embedding.py          # Sentence-Transformers vector generation tests
│   ├── test_health.py             # System probe tests
│   ├── test_llm.py                # Gemini gateway resilience & failover tests
│   ├── test_matcher.py            # Cosine similarity & tri-factor formula tests
│   ├── test_pdf_and_revamp.py     # PDF generation & resume revamp tests
│   ├── test_pii_redactor.py       # PII masking tests
│   ├── test_segmenter.py          # Section segmentation tests
│   └── test_worker.py             # Background task fallback tests
├── seed_recruiter_demo.py         # Seeds Tier-1 SDE company requisitions & candidates
├── seed_resume_sections.py        # Seeds structured resume sections for tailoring
├── .env.example                   # Environment configuration template
├── docker-compose.yml             # PostgreSQL 16 + Redis + pgvector container specification
├── Dockerfile                     # Multi-stage production container build
├── pyproject.toml                 # Ruff linting & PyTest configurations
├── requirements.txt               # Locked backend dependencies
├── start.bat                      # 1-Click Native Windows Launcher (Zero-config)
└── README.md                      # Complete system documentation
```

---

## 🚀 Quick Start (Zero-Config Local Run)

### Option 1: 1-Click Native Launcher (Windows)

The fastest way to run both backend and frontend without installing Docker or external databases:

1. Double-click **`start.bat`** in the project root.
2. The launcher automatically verifies Python, Node.js, installs dependencies, initializes the local SQLite database (`resumematcher.db`), and launches:
   - **Backend API**: [http://localhost:8000](http://localhost:8000)
   - **Interactive Swagger Docs**: [http://localhost:8000/docs](http://localhost:8000/docs)
   - **Frontend UI**: [http://localhost:5173](http://localhost:5173)

---

### Option 2: Manual Terminal Setup

#### 1. Backend Setup
```bash
# Create and activate virtual environment
python -m venv .venv

# Windows (PowerShell):
.venv\Scripts\Activate.ps1
# Linux / macOS:
source .venv/bin/activate

# Install dependencies
python -m pip install -r requirements.txt

# Configure environment variables
cp .env.example .env

# Start FastAPI server
python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

#### 2. Frontend Setup
```bash
cd frontend

# Install npm packages
npm install

# Start Vite dev server
npm run dev
```

Visit [http://localhost:5173](http://localhost:5173).

---

### Option 3: Production Docker Compose (PostgreSQL 16 + pgvector)

```bash
# Start all containers
docker-compose up --build

# Run database migrations
docker-compose exec api alembic upgrade head
```

---

## 📡 REST API Route Specifications

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/auth/register` | Register new candidate account | No |
| `POST` | `/auth/login` | Authenticate and obtain JWT bearer token (portal-scoped) | No |
| `GET` | `/auth/me` | Fetch currently authenticated user profile | Yes (Bearer) |
| `POST` | `/auth/verify-recruiter` | Verify enterprise key (`RECRUITER2026`) and elevate role | Yes (Bearer) |
| `POST` | `/resumes/upload` | Upload resume (PDF/DOCX), parse & redact PII | Yes (Bearer) |
| `GET` | `/resumes` | List candidate-scoped resumes | Yes (Bearer) |
| `POST` | `/resumes/tailor` | AI Resume bullet optimizer (Google XYZ formula) | Yes (Bearer) |
| `POST` | `/resumes/cover-letter` | Generate tailored 3-paragraph executive cover letter | Yes (Bearer) |
| `POST` | `/resumes/revamp` | Complete resume makeover with Google XYZ bullets & keywords | Yes (Bearer) |
| `POST` | `/resumes/download-pdf` | Generate and download clean, ATS-compliant vector PDF | Yes (Bearer) |
| `GET` | `/jobs` | List active job requisitions (Google, Microsoft, Amazon, etc.) | Yes (Bearer) |
| `POST` | `/jobs` | Ingest job description & extract required skills | Yes (Bearer) |
| `POST` | `/jobs/generate` | AI Job Description generator from title & skills | Yes (Recruiter) |
| `POST` | `/matches` | Compute tri-factor hybrid compatibility score | Yes (Bearer) |
| `GET` | `/matches/{id}` | Retrieve match score, sub-metrics, and target metadata | Yes (Bearer) |
| `GET` | `/matches/{id}/ats-screener` | 6-Platform enterprise ATS pass/fail scores & diagnostics | Yes (Bearer) |
| `POST` | `/matches/{id}/what-if` | Dynamically simulate score lift across ATS platforms | Yes (Bearer) |
| `GET` | `/matches/{id}/requirements` | Sentence-level requirement-to-evidence matrix | Yes (Bearer) |
| `GET` | `/matches/{id}/github-audit` | Verified GitHub signals & anti-cheat transparency | Yes (Bearer) |
| `GET` | `/matches/leaderboard/{job_id}` | Retrieve ranked applicant leaderboard for recruiter | Yes (Recruiter) |
| `POST` | `/matches/bulk` | Batch-screen candidate pool against requisition | Yes (Recruiter) |
| `PATCH`| `/matches/{id}/status` | Update candidate pipeline status (`review`, `shortlisted`, etc.) | Yes (Recruiter) |
| `GET` | `/matches/{id}/gaps` | Generate Gemini 3.6 Flash skill gap advisory | Yes (Bearer) |
| `GET` | `/health` | System health, database connectivity probe | No |

---

## 📚 Deep-Dive Documentation Index

For in-depth architectural and developer documentation, explore the `docs/` repository:

- 🏛️ **[System Architecture Specification](docs/SYSTEM_ARCHITECTURE.md)**: Tri-Factor Hybrid Compatibility algorithm, dense vector embeddings, database ER diagrams, and LLM dual failover design.
- 📡 **[REST API Specification](docs/API_DOCUMENTATION.md)**: Complete OpenAPI request and response JSON schemas with status code documentation.
- 👥 **[Dual Portal Evaluation Guide](docs/RECRUITER_STUDENT_PORTAL_GUIDE.md)**: Step-by-step evaluator manual for testing the Candidate Career Hub and Enterprise Recruiter Suite.
- 📋 **Architecture Decision Records (ADRs)**:
  - **[ADR-001: Agile/Scrum SDLC Methodology](docs/adr/001-why-agile.md)**
  - **[ADR-002: Dual-Model LLM Gateway & Latency Guardrails](docs/adr/002-dual-model-ai-failover.md)**
  - **[ADR-003: Portal Separation & Role-Based Access Control](docs/adr/003-portal-isolation-and-rbac.md)**
  - **[ADR-004: Tri-Factor Hybrid Compatibility Algorithm](docs/adr/004-tri-factor-hybrid-matching.md)**

---

## 🧪 Testing & Verification Suite

The project includes comprehensive automated tests covering unit logic, integration flows, and generative AI resilience:

```bash
# Run the complete PyTest test suite (27/27 tests passing)
python -m pytest

# Run code style & static analysis with Ruff
python -m ruff check .

# Verify frontend TypeScript compilation & Vite bundle
cd frontend
npm run build
```

---

## 🎓 Academic Project Context

Developed as a 6-month **UCS503P Software Engineering Project** (3rd Year) at **Thapar Institute of Engineering & Technology (TIET)**.

- **Course**: UCS503P — Software Engineering
- **Project Group**: 3C62
- **Academic Year**: 2026
- **Repository**: [https://github.com/10damanpreet/ResumeLens-AI](https://github.com/10damanpreet/ResumeLens-AI)
- **Team Members**:
  - **Damanpreet Singh** (Roll No: 1024030847)
  - **Dhruv Mittal**
  - **Praneet Singh**
  - **Shreyas Singh**
- **Course Instructor**: Ms. Reaya Grewal

---

## 📄 License

This project is open-source and distributed under the [MIT License](LICENSE).
