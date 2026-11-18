# ResumeLens AI - REST API Specification

### Complete OpenAPI / REST Documentation
**Base URL**: `http://localhost:8000` | **Interactive Swagger**: `http://localhost:8000/docs`

---

## 1. Authentication & Identity (`/auth`)

### 1.1 Register Account
- **Endpoint**: `POST /auth/register`
- **Auth**: None
- **Request Body**:
```json
{
  "email": "candidate@thapar.edu",
  "password": "Password123!",
  "role": "user"
}
```
- **Response** (`201 Created`):
```json
{
  "id": "48695fbd-75b6-4738-99cc-8adf1a34d23d",
  "email": "candidate@thapar.edu",
  "role": "user",
  "created_at": "2026-11-15T10:00:00Z"
}
```

### 1.2 User Login
- **Endpoint**: `POST /auth/login`
- **Auth**: None
- **Request Body**:
```json
{
  "email": "candidate@thapar.edu",
  "password": "Password123!",
  "portal": "candidate"
}
```
- **Response** (`200 OK`):
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsIn...",
  "token_type": "bearer",
  "role": "user"
}
```

### 1.3 Verify Recruiter Enterprise Key
- **Endpoint**: `POST /auth/verify-recruiter`
- **Auth**: Bearer Token
- **Request Body**:
```json
{
  "access_key": "RECRUITER2026"
}
```
- **Response** (`200 OK`):
```json
{
  "status": "verified",
  "role": "recruiter",
  "message": "Recruiter authorization granted successfully."
}
```

---

## 2. Resumes & Document Processing (`/resumes`)

### 2.1 Upload Resume
- **Endpoint**: `POST /resumes/upload`
- **Auth**: Bearer Token
- **Content-Type**: `multipart/form-data`
- **Parameters**: `file` (PDF or DOCX, max 10MB)
- **Response** (`200 OK`):
```json
{
  "id": "31b0e11a-98c5-4f2b-9f8b-1bef63a7917a",
  "filename": "Damanpreet_Singh_Resume.pdf",
  "redacted_preview": "Summary: Results-driven Software Engineer...",
  "detected_sections": ["work_experience", "skills", "education", "projects"],
  "ats_score": 96
}
```

### 2.2 List Candidate Resumes
- **Endpoint**: `GET /resumes`
- **Auth**: Bearer Token
- **Response** (`200 OK`):
```json
[
  {
    "id": "31b0e11a-98c5-4f2b-9f8b-1bef63a7917a",
    "original_filename": "Damanpreet_Singh_Resume.pdf",
    "uploaded_at": "2026-11-15T10:15:00Z"
  }
]
```

### 2.3 AI Resume Tailor (Google XYZ Formula)
- **Endpoint**: `POST /resumes/tailor`
- **Auth**: Bearer Token
- **Request Body**:
```json
{
  "resume_id": "31b0e11a-98c5-4f2b-9f8b-1bef63a7917a",
  "job_id": "f2efd74a-ea77-4169-aa2e-84e192ad3ba8"
}
```
- **Response** (`200 OK`):
```json
{
  "tailored_summary": "Results-driven Computer Engineering undergraduate at Thapar Institute...",
  "bullet_improvements": [
    {
      "original": "Designed and deployed a relational database schema...",
      "tailored": "Architected and deployed scalable PostgreSQL schemas with B-tree indexing, reducing database query latency by 34%.",
      "added_keywords": ["PostgreSQL", "Query Optimization", "High Concurrency"],
      "rationale": "Applies Google XYZ metric formula to demonstrate production performance impact."
    }
  ],
  "ats_keywords_injected": ["PostgreSQL", "Docker", "RESTful APIs", "FastAPI"],
  "model_used": "gemini-3.5-flash-lite (Active)"
}
```

### 2.4 Executive Cover Letter Generator
- **Endpoint**: `POST /resumes/cover-letter`
- **Auth**: Bearer Token
- **Request Body**:
```json
{
  "resume_id": "31b0e11a-98c5-4f2b-9f8b-1bef63a7917a",
  "job_id": "f2efd74a-ea77-4169-aa2e-84e192ad3ba8"
}
```
- **Response** (`200 OK`):
```json
{
  "cover_letter": "Dear Hiring Team at Tech Innovations Inc.,\n\nI am writing to express my strong interest in the Senior AI Engineer role...",
  "company": "Tech Innovations Inc.",
  "job_title": "Senior AI Engineer"
}
```

### 2.5 AI Resume Revamp Studio
- **Endpoint**: `POST /resumes/revamp`
- **Auth**: Bearer Token
- **Request Body**:
```json
{
  "resume_id": "31b0e11a-98c5-4f2b-9f8b-1bef63a7917a",
  "raw_text": "Optional raw text if not using resume_id",
  "target_role": "Full Stack Software Engineer"
}
```
- **Response** (`200 OK`):
```json
{
  "candidate_name": "Damanpreet Singh",
  "target_role": "Full Stack Software Engineer",
  "contact_info": {
    "email": "damanpreet.singh@thapar.edu",
    "phone": "+91 98765 43210",
    "location": "Patiala, Punjab, India",
    "github": "github.com/10damanpreet",
    "linkedin": "linkedin.com/in/damanpreet-singh"
  },
  "professional_summary": "Results-driven Computer Engineering undergraduate specializing in Full Stack architectures...",
  "technical_skills": {
    "Languages": ["Python", "TypeScript", "SQL"],
    "Frameworks & Libraries": ["FastAPI", "React 18", "Docker"],
    "Cloud & Databases": ["PostgreSQL", "AWS"],
    "Developer Tools": ["Git", "Linux", "Pytest"]
  },
  "work_experience": [
    {
      "role": "Full Stack Engineering Intern",
      "company": "IIT Ropar",
      "dates": "Jun 2025 – Aug 2025",
      "bullets": [
        "Engineered modular full-stack web features using MERN stack, delivering 100% of coursework modules.",
        "Architected asynchronous REST microservices, reducing query latency by 34%."
      ]
    }
  ],
  "projects": [
    {
      "name": "ResumeLens AI",
      "tech_stack": ["FastAPI", "React", "TypeScript"],
      "link": "github.com/10damanpreet/ResumeLens-AI",
      "bullets": [
        "Architected tri-factor hybrid matching engine combining 384-D dense embeddings."
      ]
    }
  ],
  "education": [
    {
      "institution": "Thapar Institute of Engineering & Technology",
      "degree": "Bachelor of Engineering in Computer Engineering",
      "dates": "2022 – 2026",
      "gpa": "9.25 / 10.0"
    }
  ],
  "ats_keywords_highlighted": ["FastAPI", "React 18", "PostgreSQL", "Docker", "REST Microservices"],
  "ats_score_before": 46,
  "ats_score_after": 98,
  "detected_weaknesses_fixed": [
    "Replaced generic passive bullet points with quantified Google XYZ metrics",
    "Injected 11 high-priority ATS industry keywords",
    "Organized skills into 4 clean ATS taxonomy categories"
  ]
}
```

### 2.6 Clean ATS PDF Resume Download
- **Endpoint**: `POST /resumes/download-pdf`
- **Auth**: Bearer Token
- **Request Body**: Complete revamped resume JSON object (as returned by `POST /resumes/revamp`)
- **Response** (`200 OK`):
- **Content-Type**: `application/pdf`
- **Headers**: `Content-Disposition: attachment; filename="Candidate_Name_ATS_Resume.pdf"`
- **Payload**: Raw binary vector PDF stream compiled via ReportLab.

---

## 3. Job Requisitions (`/jobs`)

### 3.1 List Job Requisitions
- **Endpoint**: `GET /jobs`
- **Auth**: Bearer Token
- **Response** (`200 OK`):
```json
[
  {
    "id": "f2efd74a-ea77-4169-aa2e-84e192ad3ba8",
    "title": "Software Development Engineer II",
    "company": "Google",
    "required_years": 2.0,
    "required_skills": ["Python", "Distributed Systems", "Cloud", "Kubernetes"]
  }
]
```

### 3.2 AI Job Description Generator
- **Endpoint**: `POST /jobs/generate`
- **Auth**: Bearer Token (Recruiter)
- **Request Body**:
```json
{
  "title": "Senior Backend SDE",
  "company": "Google",
  "experience_years": 3,
  "key_skills": ["Go", "Distributed Systems", "gRPC", "PostgreSQL"]
}
```
- **Response** (`200 OK`):
```json
{
  "id": "e4a5d8b2-10f3-4a1b-9876-cba543210fed",
  "title": "Senior Backend SDE",
  "company": "Google",
  "generated_jd": "### About the Role...\n### Key Responsibilities...",
  "extracted_skills": ["Go", "Distributed Systems", "gRPC", "PostgreSQL"]
}
```

---

## 4. Matching, Screening & Leaderboards (`/matches`)

### 4.1 Compute Tri-Factor Compatibility
- **Endpoint**: `POST /matches`
- **Auth**: Bearer Token
- **Query / Body**: `resume_id={uuid}&job_id={uuid}`
- **Response** (`200 OK`):
```json
{
  "id": "6c6690a1-d716-429f-ad7a-1dbeb354867e",
  "resume_id": "31b0e11a-98c5-4f2b-9f8b-1bef63a7917a",
  "job_id": "f2efd74a-ea77-4169-aa2e-84e192ad3ba8",
  "final_match_score": 0.5136,
  "dense_score": 0.359,
  "skill_overlap_score": 0.50,
  "experience_score": 0.85,
  "status": "shortlisted",
  "evaluated_at": "2026-11-15T10:45:00Z",
  "job_title": "Senior AI Engineer",
  "company": "Tech Innovations Inc.",
  "resume_filename": "Damanpreet_Singh_Resume.pdf"
}
```

### 4.2 Recruiter Applicant Leaderboard
- **Endpoint**: `GET /matches/leaderboard/{job_id}`
- **Auth**: Bearer Token (Recruiter Required)
- **Response** (`200 OK`):
```json
[
  {
    "rank": 1,
    "match_id": "6c6690a1-d716-429f-ad7a-1dbeb354867e",
    "resume_id": "31b0e11a-98c5-4f2b-9f8b-1bef63a7917a",
    "candidate_name": "Damanpreet Singh",
    "candidate_email": "damanpreet.singh@thapar.edu",
    "filename": "Damanpreet_Singh_Backend_SDE.pdf",
    "final_match_score": 0.945,
    "dense_score": 0.92,
    "skill_overlap_score": 0.96,
    "experience_score": 0.98,
    "status": "interview",
    "evaluated_at": "2026-11-15T12:00:00Z"
  }
]
```

### 4.3 Pipeline Status Update
- **Endpoint**: `PATCH /matches/{match_id}/status`
- **Auth**: Bearer Token (Recruiter Required)
- **Request Body**:
```json
{
  "status": "interview"
}
```
- **Response** (`200 OK`):
```json
{
  "status": "ok",
  "match_id": "6c6690a1-d716-429f-ad7a-1dbeb354867e",
  "new_status": "interview"
}
```

### 4.4 Bulk Candidate Screening
- **Endpoint**: `POST /matches/bulk`
- **Auth**: Bearer Token (Recruiter Required)
- **Request Body**:
```json
{
  "job_id": "f2efd74a-ea77-4169-aa2e-84e192ad3ba8",
  "resume_ids": []
}
```
- **Response** (`200 OK`): Ranked leaderboard array for the entire applicant pool.

### 4.5 6-Platform Enterprise ATS Simulation Engine
- **Endpoint**: `GET /matches/{match_id}/ats-screener`
- **Auth**: Bearer Token
- **Response** (`200 OK`):
```json
{
  "overall_readiness_score": 78,
  "required_requirements_evidenced": "14 / 16",
  "risks_flagged_count": 2,
  "granular_bars": {
    "parsed_parsing": 98,
    "parsed_structure": 100,
    "required_terminology": 82,
    "required_skill_evidence": 75,
    "preferred_skill_coverage": 70,
    "requirement_coverage": 88,
    "evidence_quality": 85
  },
  "platforms": [
    {
      "name": "Workday",
      "vendor": "Workday, Inc.",
      "market_share": "28%",
      "description": "Standard corporate enterprise ATS. Penalizes creative layouts and headers.",
      "overall_score": 76,
      "passing_score": 70,
      "passes_filter": true,
      "keyword_strategy": "Exact token match + section normalization",
      "quirk_tips": [
        "Avoid multi-column tables or non-standard fonts.",
        "Ensure standard headers: Work Experience, Education, Skills."
      ]
    },
    {
      "name": "Taleo (Oracle)",
      "vendor": "Oracle Corporation",
      "market_share": "18%",
      "description": "Legacy relational parser. Extremely rigid literal keyword lookup with zero semantic leeway.",
      "overall_score": 71,
      "passing_score": 75,
      "passes_filter": false,
      "keyword_strategy": "Strict literal dictionary matching",
      "quirk_tips": [
        "Spell out both acronyms and full forms (e.g. AWS & Amazon Web Services).",
        "Place technical keywords directly under Job Titles."
      ]
    }
  ],
  "risks_to_address": [
    {
      "severity": "high",
      "title": "Strict literal ATS cutoff risk (Taleo)",
      "recommendation": "Taleo enforces a 75% keyword quota. Spell out acronyms and include explicit keywords verbatim."
    }
  ],
  "score_calculation_notes": [
    "Readiness score is an algorithmic composite across 6 enterprise parsers weighted by market share.",
    "Scores model parsing strictness, terminology coverage, and structural compliance."
  ]
}
```

### 4.6 Interactive What-If Scenario Sandbox
- **Endpoint**: `POST /matches/{match_id}/what-if`
- **Auth**: Bearer Token
- **Request Body**:
```json
{
  "added_skills": ["Docker & Containers", "Kubernetes Orchestration", "AWS Cloud (S3/EC2)"],
  "experience_boost_years": 1
}
```
- **Response** (`200 OK`):
```json
{
  "original_overall_score": 55,
  "simulated_overall_score": 83,
  "total_lift": 28,
  "added_skills": ["Docker & Containers", "Kubernetes Orchestration", "AWS Cloud (S3/EC2)"],
  "platforms": [
    { "name": "Workday", "vendor": "Workday, Inc.", "original_score": 55, "simulated_score": 83, "lift": 28, "passing_score": 70, "now_passes": true },
    { "name": "Taleo (Oracle)", "vendor": "Oracle Corporation", "original_score": 50, "simulated_score": 78, "lift": 28, "passing_score": 75, "now_passes": true }
  ],
  "predicted_interview_probability_lift": "+48%"
}
```

### 4.7 Traceable Requirement-to-Evidence Matrix
- **Endpoint**: `GET /matches/{match_id}/requirements`
- **Auth**: Bearer Token
- **Response** (`200 OK`):
```json
{
  "job_title": "Full Stack Engineer",
  "total_requirements": 12,
  "evidenced_count": 9,
  "partial_count": 2,
  "missing_count": 1,
  "overall_coverage_pct": 75.0,
  "requirements": [
    {
      "id": "req-1",
      "name": "FastAPI & Python Services",
      "category": "technical",
      "jd_sentence": "Must have hands-on experience building asynchronous REST services with Python and FastAPI.",
      "status": "evidenced",
      "evidence_snippet": "Engineered asynchronous FastAPI microservices with JWT authentication handling 1,000+ requests/minute.",
      "confidence": 94,
      "is_mandatory": true,
      "importance": "Mandatory",
      "matched_keywords": ["FastAPI", "Python", "REST", "asynchronous"],
      "suggestion": null
    }
  ]
}
```

### 4.8 HackerRank-Grade GitHub Engineering Signals & Anti-Cheat Audit
- **Endpoint**: `GET /matches/{match_id}/github-audit`
- **Auth**: Bearer Token
- **Response** (`200 OK`):
```json
{
  "github": {
    "username": "10damanpreet",
    "profile_url": "https://github.com/10damanpreet",
    "avatar_url": "https://avatars.githubusercontent.com/u/10damanpreet",
    "name": "Damanpreet Singh",
    "bio": "Software Engineering Student | Backend & AI Systems",
    "public_repos_count": 12,
    "total_stars": 34,
    "followers": 19,
    "top_languages": [
      { "name": "Python", "percentage": 52 },
      { "name": "TypeScript", "percentage": 30 },
      { "name": "C++", "percentage": 18 }
    ],
    "verified_repos": [
      {
        "name": "ResumeLens-AI",
        "description": "Enterprise-Grade Career Intelligence & Generative AI Matching Platform",
        "language": "Python / TypeScript",
        "stars": 24,
        "forks": 5,
        "html_url": "https://github.com/10damanpreet/ResumeLens-AI",
        "updated_at": "2026-11-18"
      }
    ]
  },
  "anti_cheat": {
    "is_flagged": false,
    "risk_level": "CLEAN",
    "white_text_detected": false,
    "prompt_injection_detected": false,
    "keyword_stuffing_detected": false,
    "security_log": [
      "Passed CSS font-size & RGBA invisible-text check.",
      "Zero prompt-injection markers detected (e.g. 'Ignore previous instructions').",
      "Keyword repetition frequency is within standard natural language thresholds."
    ]
  }
}
```
