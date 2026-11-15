# ResumeLens AI 🚀

### Enterprise-Grade Career Intelligence, Recruiter Talent Acquisition & Generative AI Matching Platform

[![CI](https://github.com/10damanpreet/ResumeLens-AI/actions/workflows/ci.yml/badge.svg)](https://github.com/10damanpreet/ResumeLens-AI/actions)
[![Python 3.12+](https://img.shields.io/badge/python-3.12%20%7C%203.14-blue.svg)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115+-009688.svg?logo=fastapi)](https://fastapi.tiangolo.com)
[![React 18](https://img.shields.io/badge/React-18.2-61DAFB.svg?logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.2-3178C6.svg?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC.svg?logo=tailwind-css)](https://tailwindcss.com/)
[![Database](https://img.shields.io/badge/Database-SQLite%20(Default)%20%7C%20Postgres%2016%20pgvector-003B57.svg?logo=postgresql)](https://sqlite.org)
[![Generative AI](https://img.shields.io/badge/GenAI-Gemini%203.6%20Flash%20%7C%20Flash%20Lite-8E75C2.svg?logo=google)](https://deepmind.google/technologies/gemini/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## 🌟 Executive Summary

**ResumeLens AI** is an enterprise-grade, end-to-end career intelligence and talent acquisition platform designed and built over a 6-month software engineering development lifecycle. The platform bridges the gap between candidates seeking career progression and technical recruiters screening hundreds of applicants per requisition.

Built with a high-performance **FastAPI (Python 3.12/3.14)** asynchronous backend and a modern **React 18 + TypeScript** dark glassmorphic single-page application, ResumeLens AI combines local dense vector embeddings (`all-MiniLM-L6-v2`), lexical fuzzy matching, ATS compliance auditing, and dual-model generative AI (**Google Gemini 3.6 Flash / Flash Lite**) to deliver real-time career analytics.

---

## 💎 Dual-Role Platform Architecture

The system serves two primary enterprise personas through tailored workspaces:

```
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
| 4. ATS Health & Section Hygiene Card |             | 4. Ranked Applicant Leaderboard      |
| 5. Gemini 3.6 Deep Gap Advisory      |             | 5. Pipeline Kanban Status Workflow   |
| 6. AI Resume Tailor (XYZ Formula)    |             | 6. Head-to-Head Candidate Matrix     |
| 7. 1-Click Executive Cover Letter    |             | 7. 1-Click CSV Roster Export         |
| 8. Job Application Kanban Tracker    |             +--------------------------------------+
+--------------------------------------+
```

### 1. Candidate Workspace Super-Tools
- **Privacy-First PII Filter**: Automatic regex masking of sensitive personally identifiable information (phone numbers, physical addresses, emails) prior to LLM transmission.
- **Tri-Factor Hybrid Matching Algorithm**:
  $$\text{Final Score} = 0.40 \times \text{Dense Semantic Cosine} + 0.40 \times \text{Skill Overlap} + 0.20 \times \text{Experience Fit}$$
  - **Dense Vector Embeddings**: 384-dimensional dense semantic vectors computed via `all-MiniLM-L6-v2` (Sentence-Transformers).
  - **Lexical Overlap**: Set-theoretic taxonomy intersection across 60+ curated software engineering domains via `RapidFuzz`.
  - **Experience & Seniority Fit**: Automated tenure and project depth heuristic extractor.
- **Competency Radar Breakdown**: 5-axis interactive visualizer rendered with Recharts.
- **ATS Health & Section Hygiene**: Evaluates action verbs, quantifiable metric density, formatting compliance, and contact section validity.
- **Generative AI Skill Gap Advisory**: Powered by Google Gemini 3.6 Flash, identifying candidate strengths with resume citations, critical blind spots with risk justifications, estimated learning curves, and predicted technical interview questions.
- **AI Resume Bullet Tailor (Google XYZ Formula)**: Side-by-side Before/After resume rewriter following *“Accomplished [X] as measured by [Y] by doing [Z]”* with ATS keyword injection badges and 1-click text/PDF export.
- **1-Click Executive Cover Letter Generator**: Generates targeted, 3-paragraph executive cover letters highlighting resume accomplishments mapped directly to job requirements.
- **Job Application Kanban Tracker (`/tracker`)**: Persistent multi-stage tracking board (`Wishlist`, `Applied`, `Interviewing`, `Offer`, `Archived`) with salary, match score, and notes tracking.

### 2. Recruiter / HR Talent Intelligence Suite (`/recruiter`)
- **Automated Requisition Pipeline**: Instant selection and inspection of active corporate requisitions.
- **AI Job Description Generator**: Generates structured, high-conversion job descriptions with roles, responsibilities, required/nice-to-have skills, and qualifications using Gemini AI.
- **Bulk Candidate Screening & Leaderboard**: Batch-evaluates 10–100+ candidate resumes simultaneously against a target job requisition and ranks applicants in an interactive leaderboard.
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
| **Styling & Design System** | Tailwind CSS 3.4, Lucide React Icons, Glassmorphic Design System |
| **Data Visualizations** | Recharts (Radar, Area, Bar charts), Custom Animated SVG Dial Components |
| **Backend Framework** | FastAPI 0.115+, Uvicorn (ASGI), Pydantic v2, Python 3.12 / 3.14 |
| **Database & ORM** | SQLite + `aiosqlite` (Default local) / PostgreSQL 16 + `asyncpg` + `pgvector`, SQLAlchemy 2.0 Async |
| **NLP & Local Machine Learning**| Sentence-Transformers (`all-MiniLM-L6-v2` 384-D), RapidFuzz 3.14+, spaCy 3.7+ |
| **Document Processing** | PDFPlumber, python-docx, Custom Regular Expression Redactor |
| **Generative AI Suite** | Google Generative AI (`gemini-3.6-flash`, `gemini-3.5-flash-lite`, REST Transport) |
| **Code Quality & CI/CD** | PyTest, PyTest-Asyncio, Ruff (Linter & Formatter), GitHub Actions CI |

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
│   │   ├── auth.py                # JWT authentication & user accounts
│   │   ├── gaps.py                # Gemini skill gap advisory & interview predictions
│   │   ├── health.py              # System health & database probes
│   │   ├── jobs.py                # Requisition retrieval & AI JD generation
│   │   ├── matches.py             # Match computation, bulk screening & leaderboard
│   │   ├── resumes.py             # Document upload, bullet tailoring & cover letters
│   │   └── tasks.py               # Asynchronous task logging
│   ├── core/                      # Security (bcrypt, JWT) & dependency injection
│   ├── models/                    # SQLAlchemy async models (Candidate, Resume, Match, etc.)
│   ├── schemas/                   # Pydantic v2 request/response schemas
│   ├── services/                  # Business logic engines
│   │   ├── gap_analyzer.py        # Skill gap extraction & study plan generator
│   │   ├── llm_gateway.py         # Dual-model Gemini gateway with automatic failover
│   │   ├── matcher.py             # Tri-factor hybrid vector matching algorithm
│   │   ├── pii_redactor.py        # Privacy-first regex PII mask
│   │   ├── segmenter.py           # Resume section boundary detector
│   │   └── tailor_service.py      # Google XYZ bullet rewriter & cover letter generator
│   ├── config.py                  # Pydantic BaseSettings environment loader
│   ├── database.py                # SQLAlchemy async engine & sessionmaker (SQLite / Postgres)
│   └── main.py                    # FastAPI application initialization & CORS config
├── frontend/                      # React 18 + TypeScript Application
│   ├── src/
│   │   ├── api/client.ts          # Axios client with JWT auto-injection & error interceptors
│   │   ├── components/            # Reusable UI component library
│   │   │   ├── ATSHealthCard.tsx   # ATS section hygiene and metrics inspector
│   │   │   ├── CompetencyRadar.tsx # Interactive multi-axis Recharts radar chart
│   │   │   ├── CoverLetterModal.tsx# 1-Click tailored executive cover letter modal
│   │   │   ├── LiveProgressConsole.tsx# Terminal-style real-time progress stream
│   │   │   ├── RecentScans.tsx    # Evaluation history widget
│   │   │   ├── StudyRoadmap.tsx   # Interactive task checklist with localStorage
│   │   │   └── Toast.tsx          # Floating toast notification system
│   │   ├── pages/                 # Full-page application views
│   │   │   ├── Dashboard.tsx      # Candidate landing, upload & match execution
│   │   │   ├── JobTracker.tsx     # 5-stage application Kanban board
│   │   │   ├── Login.tsx          # Candidate authentication view
│   │   │   ├── MatchResults.tsx   # Tri-factor report, score ring & action ribbon
│   │   │   ├── RecruiterPortal.tsx# HR suite: bulk screening, leaderboard, matrix
│   │   │   ├── Register.tsx       # Account creation view
│   │   │   ├── ResumeTailor.tsx   # Side-by-side XYZ bullet optimizer
│   │   │   └── SkillGaps.tsx      # Generative AI advisory & learning curriculum
│   │   ├── App.tsx                # Dual-role navigation bar & route configuration
│   │   └── index.css              # Dark glassmorphic design system
│   ├── package.json               # Node.js dependencies & scripts
│   ├── tailwind.config.js         # Custom animations, gradients & shadows
│   └── vite.config.ts             # Vite configuration with chunk splitting
├── tests/                         # Automated Unit & Integration Test Suite (17 Tests)
│   ├── conftest.py                # Pytest async SQLite fixtures & auto-schema setup
│   ├── test_auth.py               # Authentication, JWT, and authorization tests
│   ├── test_embedding.py          # Sentence-Transformers vector generation tests
│   ├── test_health.py             # System probe tests
│   ├── test_llm.py                # Gemini gateway resilience & failover tests
│   ├── test_matcher.py            # Cosine similarity & tri-factor formula tests
│   ├── test_pii_redactor.py       # PII masking tests
│   ├── test_segmenter.py          # Section segmentation tests
│   └── test_worker.py             # Background task fallback tests
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
| `POST` | `/auth/login` | Authenticate and obtain JWT bearer token | No |
| `GET` | `/auth/me` | Fetch currently authenticated user profile | Yes (Bearer) |
| `POST` | `/resumes/upload` | Upload resume (PDF/DOCX), parse & redact PII | Yes (Bearer) |
| `GET` | `/resumes` | List all candidate resumes | Yes (Bearer) |
| `POST` | `/resumes/tailor` | AI Resume bullet optimizer (Google XYZ formula) | Yes (Bearer) |
| `POST` | `/resumes/cover-letter` | Generate tailored 3-paragraph executive cover letter | Yes (Bearer) |
| `GET` | `/jobs` | List active job requisitions | Yes (Bearer) |
| `POST` | `/jobs` | Ingest job description & extract required skills | Yes (Bearer) |
| `POST` | `/jobs/generate` | AI Job Description generator from title & skills | Yes (Bearer) |
| `POST` | `/matches` | Compute tri-factor hybrid compatibility score | Yes (Bearer) |
| `GET` | `/matches/{id}` | Retrieve match score and sub-metric breakdown | Yes (Bearer) |
| `GET` | `/matches/leaderboard/{job_id}` | Retrieve ranked applicant leaderboard for recruiter | Yes (Bearer) |
| `POST` | `/matches/bulk` | Batch-screen candidate pool against requisition | Yes (Bearer) |
| `PATCH`| `/matches/{id}/status` | Update candidate pipeline status (`review`, `shortlisted`, etc.) | Yes (Bearer) |
| `GET` | `/matches/{id}/gaps` | Generate Gemini 3.6 Flash skill gap advisory | Yes (Bearer) |
| `GET` | `/health` | System health, database connectivity probe | No |

---

## 🧪 Testing & Verification Suite

The project includes comprehensive automated tests covering unit logic, integration flows, and generative AI resilience:

```bash
# Run the complete PyTest test suite (17/17 tests passing)
python -m pytest

# Run code style & static analysis with Ruff
python -m ruff check .

# Verify frontend TypeScript compilation & Vite bundle
cd frontend
npm run build
```

---

## 🎓 Academic Capstone Context

Developed as a final-year **UCS503P Software Engineering Capstone Project** at **Thapar Institute of Engineering & Technology (TIET)**.

- **Course**: UCS503P — Software Engineering
- **Project Group**: 3C62
- **Academic Year**: 2026
- **Repository**: [https://github.com/10damanpreet/ResumeLens-AI](https://github.com/10damanpreet/ResumeLens-AI)
- **Team Members**:
  - **Damanpreet Singh** (Roll No: 102203024)
  - **Dhruv Mittal** (Roll No: 102203014)
  - **Praneet Singh** (Roll No: 102203025)
  - **Shreyas Singh** (Roll No: 102203031)
- **Course Instructor**: Ms. Reaya Grewal

---

## 📄 License

This project is open-source and distributed under the [MIT License](LICENSE).
