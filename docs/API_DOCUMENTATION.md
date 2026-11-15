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
