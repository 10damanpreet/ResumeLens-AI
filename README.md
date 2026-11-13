# ResumeLens AI

### Intelligent Career Intelligence, Resume-Job Matching & AI Skill Gap Advisory Platform

[![CI](https://github.com/10damanpreet/ResumeLens-AI/actions/workflows/ci.yml/badge.svg)](https://github.com/10damanpreet/ResumeLens-AI/actions)
[![Python 3.12+](https://img.shields.io/badge/python-3.12%20%7C%203.14-blue.svg)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115+-009688.svg?logo=fastapi)](https://fastapi.tiangolo.com)
[![React 18](https://img.shields.io/badge/React-18.2-61DAFB.svg?logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.2-3178C6.svg?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC.svg?logo=tailwind-css)](https://tailwindcss.com/)
[![SQLite](https://img.shields.io/badge/Database-SQLite%20(Default)%20%7C%20Postgres-003B57.svg?logo=sqlite)](https://sqlite.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**ResumeLens AI** is a production-grade career intelligence platform that bridges the gap between candidate resumes and modern job requirements. Built with a high-performance **FastAPI** backend and a responsive **React 18 + TypeScript** dark glassmorphic frontend, the system performs privacy-first PII redaction, multi-stage hybrid vector matching, ATS compliance scoring, and live AI-powered skill gap advisory powered by **Google Gemini 3.6 Flash / Flash Lite**.

---

## Key Highlights

- **Dual-Model AI Advisory Engine**: Powered by Google Gemini with primary routing to **Gemini 3.6 Flash** and automatic, ultra-low-latency failover to **Gemini 3.5 Flash Lite** for resilience against API rate limits.
- **Deep Strengths & Weaknesses Diagnosis**: Evaluates verified candidate strengths with resume evidence, identifies critical blind spots with risk justifications, estimates hours to bridge gaps, and suggests predicted interview questions.
- **Tri-Factor Hybrid Matching Algorithm**:
  $$\text{Final Score} = 0.40 \times \text{Dense Semantic Cosine} + 0.40 \times \text{Skill Overlap} + 0.20 \times \text{Experience Fit}$$
  - **Dense Vector Search**: 384-dimensional embeddings generated locally via `all-MiniLM-L6-v2` (SentenceTransformers).
  - **Lexical Overlap**: Fuzzy token matching via `RapidFuzz`.
  - **Experience Weighting**: Extracted years of relevant professional experience.
- **Modern Glassmorphic Frontend**:
  - **Competency Radar Chart**: Multidimensional visual breakdown of technical, architectural, and domain fit using Recharts.
  - **ATS Health Card**: Real-time evaluation of section hygiene, keyword density, and action verbs.
  - **Interactive Study Roadmap**: Interactive task checklist with persistent `localStorage` progress tracking.
  - **ATS-Optimized Bullet Upgrades**: 1-click copy before/after resume achievement bullets.
  - **1-Click Sample Previews & Demo Login**: Instantly load demo credentials and sample Tech Stack job descriptions (Full Stack, ML Engineer, DevOps).
- **Zero-Config Local Execution (`start.bat`)**: Runs out of the box with asynchronous SQLite (`aiosqlite`) — no Docker, PostgreSQL, or Redis installation required for development.

---

## Architecture Overview

```text
+-------------------------------------------------------------------------------+
|                            Client Layer (SPA)                                 |
|            React 18 + TypeScript + Vite + Tailwind CSS + Recharts             |
|   - Dark Glassmorphism   - Competency Radar Chart   - ATS Health Inspector    |
|   - Study Roadmap        - 1-Click Sample Jobs      - Live Toast System       |
+---------------------------------------+---------------------------------------+
                                        |
                                HTTP / REST (Axios)
                                        |
+---------------------------------------v---------------------------------------+
|                             FastAPI API Gateway                               |
|   - JWT Authentication & RBAC                 - Document Parsing & PII Filter |
|   - Asynchronous Route Handlers (AsyncIO)     - CORS & Error Handling Guard   |
+-------------------+-----------------------------------+-----------------------+
                    |                                   |
         Local ML & Embeddings                  Live Generative AI
                    |                                   |
+-------------------v---------------+   +---------------v-----------------------+
|     Local Matching Pipeline       |   |      Dual-Model Gemini Gateway        |
| - SentenceTransformer (384-D)     |   | - Primary: Gemini 3.6 Flash           |
| - RapidFuzz Taxonomy Matching     |   | - Fallback: Gemini 3.5 Flash Lite     |
| - Experience Level Estimator      |   | - Strengths, Weaknesses, Study Curve  |
+-------------------+---------------+   +---------------------------------------+
                    |
+-------------------v-----------------------------------------------------------+
|                              Data Persistence                                 |
| - Default: Asynchronous SQLite via aiosqlite (Zero-config, single local file) |
| - Enterprise / Production: PostgreSQL 16 + pgvector (Docker Compose)          |
+-------------------------------------------------------------------------------+
```

---

## Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, TypeScript, Vite, Tailwind CSS, Recharts, Lucide Icons, Axios |
| **Backend Framework** | FastAPI 0.115+, Uvicorn (ASGI), Pydantic v2, Python 3.12 / 3.14 |
| **Database & ORM** | SQLite + `aiosqlite` (Default) / PostgreSQL + `asyncpg` + `pgvector`, SQLAlchemy 2.0 Async |
| **NLP & Local ML** | Sentence-Transformers (`all-MiniLM-L6-v2`), RapidFuzz, spaCy 3.7+ |
| **Document Parsing** | PDFPlumber, python-docx, PII Regex Redactor |
| **Generative AI** | Google Generative AI (`gemini-3.6-flash`, `gemini-3.5-flash-lite`, `transport='rest'`) |
| **Quality & Testing** | PyTest, Ruff (linter & formatter), GitHub Actions CI |

---

## Project Structure

```text
ResumeLens-AI/
├── .github/
│   └── workflows/
│       └── ci.yml                 # GitHub Actions continuous integration pipeline
├── alembic/                       # Alembic database migration revisions
├── app/
│   ├── api/                       # API route controllers
│   │   ├── auth.py                # JWT authentication & candidate registration
│   │   ├── gaps.py                # AI analysis & skill gap recommendation endpoints
│   │   ├── health.py              # Health check & database probe
│   │   ├── jobs.py                # Job description ingestion & management
│   │   ├── matches.py             # Match computation & evaluation retrieval
│   │   ├── resumes.py             # Resume file upload, parsing, and PII redaction
│   │   └── tasks.py               # Asynchronous task status endpoints
│   ├── core/                      # Security (bcrypt, JWT) & dependency injection
│   ├── models/                    # SQLAlchemy async models (Candidate, Resume, Match, Gaps)
│   ├── schemas/                   # Pydantic v2 data validation schemas
│   ├── services/                  # Business logic (matcher, segmenter, pii, llm_gateway)
│   ├── worker/                    # Celery app stub with fallback support
│   ├── config.py                  # Pydantic BaseSettings environment loader
│   ├── database.py                # Async engine & session factory (SQLite / PostgreSQL)
│   └── main.py                    # FastAPI application initialization & middleware
├── frontend/                      # React 18 + TypeScript Single Page Application
│   ├── src/
│   │   ├── api/client.ts          # Axios client with auto-JWT & 30s timeout guard
│   │   ├── components/            # Reusable UI widgets
│   │   │   ├── ATSHealthCard.tsx   # ATS compliance evaluation card
│   │   │   ├── CompetencyRadar.tsx # Multi-axis candidate radar chart
│   │   │   ├── RecentScans.tsx    # Recent evaluation history
│   │   │   ├── StudyRoadmap.tsx   # Interactive study checklist with localStorage
│   │   │   └── Toast.tsx          # Floating notification provider
│   │   ├── pages/                 # Full-page views (Dashboard, MatchResults, SkillGaps, Login)
│   │   ├── App.tsx                # Layout wrapper, navigation bar, ambient backdrop
│   │   └── index.css              # Glassmorphic CSS design system
│   ├── index.html                 # Entry HTML with dark theme meta tags
│   ├── package.json               # Frontend dependencies & npm scripts
│   ├── tailwind.config.js         # Custom keyframes, glow animations & shadows
│   └── vite.config.ts             # Vite bundler configuration with manual code splitting
├── tests/                         # Automated unit & integration tests
│   ├── conftest.py                # Pytest async SQLite fixtures
│   ├── test_embedding.py          # SentenceTransformer vector tests
│   ├── test_llm.py                # Gemini gateway resilience tests
│   ├── test_matcher.py            # Cosine similarity & hybrid formula tests
│   ├── test_pii_redactor.py       # PII masking tests
│   ├── test_segmenter.py          # Section segmentation tests
│   └── test_worker.py             # Celery worker fallback tests
├── .env.example                   # Environment configuration template
├── docker-compose.yml             # PostgreSQL + Redis container specification
├── Dockerfile                     # API container build definition
├── pyproject.toml                 # Ruff linting & PyTest configurations
├── requirements.txt               # Locked backend dependencies
├── start.bat                      # 1-Click native Windows launcher (No Docker needed)
└── README.md                      # Complete project documentation
```

---

## Quick Start (Zero-Config Local Run)

### Method 1: 1-Click Launcher (Windows)

The simplest way to run both backend and frontend without installing Docker or PostgreSQL:

1. Double-click **`start.bat`** in the project root.
2. The launcher automatically verifies Python, Node.js, installs any missing packages, and spins up:
   - **Backend API**: [http://localhost:8000](http://localhost:8000) (Interactive Swagger Docs: [http://localhost:8000/docs](http://localhost:8000/docs))
   - **Frontend UI**: [http://localhost:5173](http://localhost:5173)

---

### Method 2: Manual Setup

#### 1. Backend Setup
```bash
# Create and activate Python virtual environment
python -m venv .venv

# Windows:
.venv\Scripts\Activate.ps1
# Linux / macOS:
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Copy environment configuration
cp .env.example .env

# Start FastAPI development server
python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

#### 2. Frontend Setup
```bash
cd frontend

# Install npm dependencies
npm install

# Start Vite development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

### Method 3: Docker Compose (PostgreSQL + pgvector)

To run with enterprise PostgreSQL 16 and pgvector:

```bash
# Build and start all services
docker-compose up --build

# Run database migrations
docker-compose exec api alembic upgrade head
```

---

## Configuration (`.env`)

Edit your `.env` file to customize settings:

```env
# Database (SQLite default for zero-config local run)
DATABASE_URL=sqlite+aiosqlite:///./resumematcher.db
DATABASE_URL_SYNC=sqlite:///./resumematcher.db

# For PostgreSQL + pgvector:
# DATABASE_URL=postgresql+asyncpg://postgres:postgres@localhost:5432/resume_matcher
# DATABASE_URL_SYNC=postgresql://postgres:postgres@localhost:5432/resume_matcher

# JWT Secret Key
JWT_SECRET_KEY=your-secure-jwt-secret-key-change-in-production
JWT_ALGORITHM=HS256
JWT_EXPIRY_MINUTES=60

# Google Gemini API Key (Enables live AI strengths, weaknesses, and roadmap advice)
GEMINI_API_KEY=your_gemini_api_key_here

# App settings
DEBUG=false
APP_NAME=ResumeLens AI
```

> **Note**: If `GEMINI_API_KEY` is omitted, the application automatically uses intelligent local fallback recommendations so all features remain functional.

---

## Testing & Quality Assurance

### Run Automated Unit Tests
```bash
python -m pytest tests/ -v
```

### Run Ruff Linter & Formatter
```bash
# Verify code quality
ruff check .

# Automatically apply recommended fixes
ruff check --fix .
```

### Verify Frontend TypeScript Build
```bash
cd frontend
npm run build
```

---

## Academic Context

Developed as part of the **UCS503P Software Engineering** coursework at **Thapar Institute of Engineering & Technology (TIET)**.

- **Group**: 3C62
- **Team Members**:
  - Damanpreet Singh (102203024)
  - Dhruv Mittal (102203014)
  - Praneet Singh (102203025)
  - Shreyas Singh (102203031)
- **Course Instructor**: Ms. Reaya Grewal

---

## License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.
