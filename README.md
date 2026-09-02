# Resume Matcher

[![CI](https://github.com/your-username/resume-matcher/actions/workflows/ci.yml/badge.svg)](https://github.com/your-username/resume-matcher/actions)
[![Python 3.12](https://img.shields.io/badge/python-3.12-blue.svg)](https://www.python.org/downloads/release/python-3120/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115.0-009688.svg?logo=fastapi)](https://fastapi.tiangolo.com)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16%20%2B%20pgvector-336791.svg?logo=postgresql)](https://github.com/pgvector/pgvector)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

An intelligent, production-ready Resume <-> Job Matching & Skill Gap Advisory System built with FastAPI, PostgreSQL + pgvector, Celery, and modern NLP/LLM hybrid retrieval pipelines. It provides automated parsing of diverse resume and job formats (PDF, DOCX, OCR), semantic vector search combined with BM25 lexical ranking (Reciprocal Rank Fusion), detailed skill gap analysis, personalized upskilling roadmaps, and real-time processing updates via WebSockets.

---

## Architecture Overview

```text
+-------------------------------------------------------------------------------+
|                                Client Layer                                   |
|               (Web / Mobile / Next.js / React / API Clients)                  |
+-----------------------+-------------------------------+-----------------------+
                        |                               |
                   HTTP / REST                      WebSocket
                        |                               |
+-----------------------v-------------------------------v-----------------------+
|                               API Gateway / FastAPI                           |
|  - JWT Authentication & RBAC        - Rate Limiting & Validation             |
|  - Resume & Job Upload Endpoints     - WebSocket Notification Server          |
|  - Matching & Gap Analysis Endpoints - Async Route Handlers                   |
+-------------------+-------------------------------+---------------------------+
                    |                               |
           Enqueue Async Tasks                 Sync Queries
                    |                               |
+-------------------v-----------+       +-----------v---------------------------+
|         Celery Workers        |       |        Database / Storage             |
|  - PDF / DOCX / OCR Parsing   |       |  - PostgreSQL 16 + pgvector           |
|  - spaCy NER & Entity Extr.   | <---> |    * Structured User & Job Data       |
|  - Sentence-Transformer Embed |       |    * High-dim Vector Embeddings       |
|  - Hybrid Rank Fusion (BM25)  |       |  - Redis 7                            |
|  - LLM Advisory (Gemini/Mini) |       |    * Celery Broker / Result Backend   |
+-------------------------------+       |    * Cache & PubSub Channels          |
                                        +---------------------------------------+
```

---

## Tech Stack

- **Backend Framework:** FastAPI 0.115+, Uvicorn, Pydantic v2
- **Database & Vectors:** PostgreSQL 16 with `pgvector`, SQLAlchemy 2.0 (asyncio + asyncpg), Alembic
- **Async Task Queue:** Celery 5.4+, Redis 7
- **Document Parsing:** PDFPlumber, python-docx, PyTesseract (OCR), pdf2image
- **NLP & Hybrid Retrieval:**
  - Sentence-Transformers (`all-MiniLM-L6-v2` / dense semantic search)
  - Rank-BM25 (sparse lexical search)
  - Reciprocal Rank Fusion (RRF) & RapidFuzz
  - spaCy 3.7+
- **LLM Integrations:** Google Generative AI (Gemini 1.5 Pro / Flash), MiniMax, Instructor
- **Testing & Code Quality:** PyTest, PyTest-Asyncio, PyTest-Cov, Locust, Ruff

---

## Project Structure

```text
resume-matcher/
├── .github/
│   └── workflows/
│       └── ci.yml                 # GitHub Actions CI pipeline
├── alembic/                       # Database migration scripts
│   ├── versions/
│   └── env.py
├── app/
│   ├── api/                       # API route endpoints
│   │   ├── v1/
│   │   └── router.py
│   ├── core/                      # Core configs, security, database sessions
│   │   ├── config.py
│   │   ├── database.py
│   │   └── security.py
│   ├── models/                    # SQLAlchemy async models
│   ├── schemas/                   # Pydantic v2 schemas
│   ├── services/                  # Business logic (matching, parsing, LLM)
│   ├── worker/                    # Celery app and asynchronous tasks
│   └── main.py                    # FastAPI application entrypoint
├── tests/                         # Unit, integration, and load tests
├── uploads/                       # Local document upload directory
├── .env.example                   # Environment configuration template
├── .gitignore                     # Git ignore file
├── alembic.ini                    # Alembic configuration
├── docker-compose.yml             # Local multi-service orchestration
├── Dockerfile                     # FastAPI API container image
├── Dockerfile.worker              # Celery worker container image
├── pyproject.toml                 # Ruff & PyTest configuration
├── requirements.txt               # Locked Python dependencies
└── README.md                      # Project documentation
```

---

## Quick Start with Docker

The fastest way to get all services up and running (FastAPI, Celery worker, PostgreSQL with pgvector, and Redis) is with Docker Compose:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/resume-matcher.git
   cd resume-matcher
   ```

2. **Configure environment variables:**
   ```bash
   cp .env.example .env
   ```

3. **Start all services:**
   ```bash
   docker-compose up --build
   ```

4. **Verify running services:**
   - **Interactive API Documentation (Swagger UI):** [http://localhost:8000/docs](http://localhost:8000/docs)
   - **Alternative API Documentation (ReDoc):** [http://localhost:8000/redoc](http://localhost:8000/redoc)
   - **Health Check Endpoint:** [http://localhost:8000/health](http://localhost:8000/health)

---

## Local Development Setup

If you prefer to run services natively without Docker:

### 1. Prerequisites
- Python 3.12+
- PostgreSQL 16 (with pgvector installed)
- Redis 7+
- Tesseract OCR & Poppler (for document parsing)

### 2. Setup Virtual Environment
```bash
python -m venv .venv
# On Linux/macOS:
source .venv/bin/activate
# On Windows (PowerShell):
.venv\Scripts\Activate.ps1
```

### 3. Install Dependencies
```bash
pip install --upgrade pip
pip install -r requirements.txt
```

### 4. Configure Environment
```bash
cp .env.example .env
# Edit .env with your local PostgreSQL and Redis credentials
```

### 5. Run Database Migrations
```bash
alembic upgrade head
```

### 6. Start Development Servers
Start the FastAPI server:
```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

Start the Celery worker (in a separate terminal):
```bash
celery -A app.worker.celery_app worker --loglevel=info
```

---

## Testing & Linting

### Running Automated Tests
```bash
pytest tests/ -v --cov=app --cov-report=term-missing
```

### Linting & Code Formatting
```bash
# Check code with Ruff
ruff check .

# Automatically apply Ruff fixes
ruff check --fix .

# Format code
ruff format .
```

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
