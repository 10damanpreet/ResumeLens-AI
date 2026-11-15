# ResumeLens AI - Dual Portal Evaluation Guide

### Comprehensive Manual for Evaluators, Faculty & Recruiter Demos
**Thapar Institute of Engineering & Technology (TIET) | Capstone 3C62**

---

## 1. Quick Access & Credentials

The system provides separate authenticated environments with role isolation:

| Portal | Demo Email | Password | Role | Primary URL |
| :--- | :--- | :--- | :--- | :--- |
| **Student Career Hub** | `student@resumelens.ai` *(or test@example.com)* | `Password123!` | Candidate (`user`) | [http://localhost:5173/](http://localhost:5173/) |
| **Enterprise Recruiter Suite** | `recruiter@resumelens.ai` | `Password123!` | Recruiter (`recruiter`) | [http://localhost:5173/recruiter](http://localhost:5173/recruiter) |

> **Enterprise Access Verification Keys**:
> If logging in as a new user or elevating from student to recruiter in the Recruiter Portal:
> - `RECRUITER2026`
> - `TIET-HR-2026`
> - `CAPSTONE-PRO`

---

## 2. Student Portal Walkthrough (B2C Career Intelligence)

1. **Sign In**: Navigate to `http://localhost:5173/login`, choose the **Candidate Portal** tab, and enter `student@resumelens.ai` / `Password123!`.
2. **Resume Upload & PII Audit**:
   - Upload any technical PDF/DOCX resume.
   - The platform redacts phone numbers, emails, and physical addresses in real-time, displays the ATS hygiene health score (e.g., 96/100 Grade A+), and generates 384-D vector embeddings.
3. **Tri-Factor Compatibility Evaluation**:
   - Select an open requisition (e.g. *Google SDE II*, *Microsoft Distributed Systems Engineer*, *Amazon AWS Cloud Architect*).
   - Click **Run Match Evaluation**.
   - Review the Compatibility Meter, Tri-Factor Breakdown (Dense Semantic Fit 40%, Technical Skill Overlap 40%, Experience Fit 20%), and the interactive 5-axis Competency Radar.
4. **AI Resume Tailor (Google XYZ Engine)**:
   - Click **Tailor Resume (XYZ)**.
   - View bullet points rewritten under Google's formula: *“Accomplished [X] as measured by [Y] by doing [Z]”*.
   - Inspect injected high-impact ATS keywords and predicted compatibility lift (+14%).
   - Export via 1-click **Download Resume Text** or **Print**.
5. **1-Click Executive Cover Letter**:
   - Click **Cover Letter** to preview and copy a structured, 3-paragraph executive cover letter mapped to the target employer.
6. **Application Kanban Tracker (`/tracker`)**:
   - Organize applications across 5 pipeline stages: `Wishlist`, `Applied`, `Interviewing`, `Offer`, `Archived`.

---

## 3. Recruiter Suite Walkthrough (B2B SaaS Talent Acquisition)

1. **Sign In**: Navigate to `http://localhost:5173/login`, switch to the **Recruiter Suite** tab, and enter `recruiter@resumelens.ai` / `Password123!`.
2. **Requisition Management**:
   - Access pre-seeded Tier-1 enterprise requisitions:
     - 🏢 **Google** — *Software Development Engineer II*
     - 🏢 **Microsoft** — *Full Stack Software Engineer*
     - 🏢 **Amazon AWS** — *Cloud Solutions & Backend Architect*
     - 🏢 **Atlassian** — *Distributed Systems Infrastructure Engineer*
     - 🏢 **Uber** — *Site Reliability & Core Platform SDE*
3. **AI Job Description Generator**:
   - Click **AI Generator**, specify a target role (e.g., *Lead Machine Learning Engineer*) and target skills (*PyTorch, Triton, CUDA, MLOps*).
   - Generates a fully formatted job description with required qualifications and automatic skill taxonomy extraction in seconds.
4. **Ranked Applicant Leaderboard**:
   - Select any corporate requisition to view candidate applicants ranked by the Tri-Factor Hybrid Compatibility score.
   - Inspect dense semantic similarity, lexical overlap, tenure, and recruitment stage badges.
5. **Live Pipeline State Toggling**:
   - Update candidate status directly from the table dropdown: `Review` $\rightarrow$ `Shortlisted` $\rightarrow$ `Interview` $\rightarrow$ `Rejected`.
   - Updates persist immediately to the backend database via `PATCH /matches/{id}/status`.
6. **Head-to-Head Candidate Matrix**:
   - Select up to 3 candidates from the leaderboard and click **Compare Candidates**.
   - Compare applicants side-by-side across overall match, technical overlap, semantic alignment, and detected strengths.
7. **1-Click Executive CSV Export**:
   - Click **Export Roster (CSV)** to download applicant rosters formatted for enterprise HRIS systems (Workday, Greenhouse, Lever).

---

## 4. Role Separation & Security Guardrails

- **Strict Route Protection**: If a student candidate navigates to `/recruiter`, the system intercepts the request and presents an enterprise key challenge modal.
- **Data Scoping**: Students cannot access candidate pools or other applicants' resumes. When calling `GET /resumes`, the API filters by `candidate_id == current_user.id`.
- **Zero-Downtime Guarantee**: If the external Gemini API is unreachable, the system automatically falls back to secondary models and deterministic heuristics, ensuring a seamless live presentation.
