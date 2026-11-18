import re
from typing import Any


def extract_jd_requirements(job_text: str, job_title: str = "Software Engineer") -> list[dict[str, Any]]:
    """Extract granular requirements with source sentences from a Job Description."""
    if not job_text.strip():
        # Curated standard requisition requirements
        return [
            {
                "id": "req-1",
                "name": "Full-Stack Web & RESTful Microservices Architecture",
                "category": "Core Architecture",
                "jd_sentence": "Design, build, and maintain scalable RESTful microservices and reactive Single Page Applications with clean APIs.",
                "keywords": ["rest", "microservices", "api", "scalable", "fastapi", "architecture"],
                "is_mandatory": True,
                "importance": "Critical",
            },
            {
                "id": "req-2",
                "name": "Relational Database Design & Query Optimization",
                "category": "Data & Storage",
                "jd_sentence": "Deep knowledge of relational database modeling in PostgreSQL or MySQL, indexing strategies, and query performance tuning.",
                "keywords": ["postgresql", "sql", "database", "indexing", "queries", "pl/sql", "schema"],
                "is_mandatory": True,
                "importance": "Critical",
            },
            {
                "id": "req-3",
                "name": "Modern Frontend Engineering (React 18 & TypeScript)",
                "category": "Frontend Systems",
                "jd_sentence": "Proficiency in modern TypeScript, React, state management, and building responsive user-friendly interfaces.",
                "keywords": ["react", "typescript", "javascript", "tailwind", "frontend", "ui"],
                "is_mandatory": True,
                "importance": "Critical",
            },
            {
                "id": "req-4",
                "name": "Containerization & Multi-Stage Docker Builds",
                "category": "DevOps & Cloud",
                "jd_sentence": "Experience packaging applications into Docker containers and orchestrating cloud deployments.",
                "keywords": ["docker", "container", "kubernetes", "cloud", "deployment", "aws"],
                "is_mandatory": False,
                "importance": "Important",
            },
            {
                "id": "req-5",
                "name": "Automated Testing, Pytest, and CI/CD Quality Gates",
                "category": "Code Quality",
                "jd_sentence": "Commitment to test-driven engineering, automated unit tests, and continuous integration pipelines.",
                "keywords": ["pytest", "testing", "unit test", "ci/cd", "github actions", "coverage"],
                "is_mandatory": False,
                "importance": "Important",
            },
            {
                "id": "req-6",
                "name": "Machine Learning & Dense Vector Representations",
                "category": "AI / ML Engineering",
                "jd_sentence": "Familiarity with transformer embeddings, semantic similarity search, or machine learning pipelines is a strong plus.",
                "keywords": ["machine learning", "embeddings", "vector", "pytorch", "transformers", "gemini", "ai"],
                "is_mandatory": False,
                "importance": "Preferred",
            },
            {
                "id": "req-7",
                "name": "Computer Engineering / CS Degree & Academic Fundamentals",
                "category": "Eligibility & Foundation",
                "jd_sentence": "Bachelor's degree in Computer Science, Computer Engineering, or related technical field with strong foundational knowledge of DSA.",
                "keywords": ["computer engineering", "bachelor", "degree", "dsa", "algorithms", "data structures"],
                "is_mandatory": True,
                "importance": "Critical",
            },
        ]

    # Dynamically extract sentence-level requirements from JD text
    sentences = re.split(r"(?<=[.!?])\s+|\n+", job_text)
    clean_sentences = [s.strip() for s in sentences if len(s.strip()) > 25 and not s.strip().startswith("#")]

    requirements = []
    category_map = {
        "backend": "Backend Systems",
        "api": "Backend Systems",
        "database": "Data & Storage",
        "sql": "Data & Storage",
        "react": "Frontend Systems",
        "frontend": "Frontend Systems",
        "docker": "DevOps & Cloud",
        "cloud": "DevOps & Cloud",
        "test": "Code Quality",
        "degree": "Eligibility & Foundation",
        "experience": "Professional Experience",
    }

    req_idx = 1
    for s in clean_sentences[:12]:
        lower_s = s.lower()
        if any(w in lower_s for w in ["require", "must", "experience", "proficien", "knowledge", "design", "build", "responsible", "qualification", "bachelor"]):
            matched_cat = "Technical Skills"
            for kw, cat in category_map.items():
                if kw in lower_s:
                    matched_cat = cat
                    break

            is_mand = any(m in lower_s for m in ["require", "must", "bachelor", "degree", "essential"])
            title = s[:60].strip() + ("..." if len(s) > 60 else "")
            kws = [w for w in re.findall(r"\b[a-zA-Z]{3,15}\b", lower_s) if w not in {"the", "and", "for", "with", "must", "have", "that", "this", "from"}]

            requirements.append({
                "id": f"req-{req_idx}",
                "name": title,
                "category": matched_cat,
                "jd_sentence": s,
                "keywords": kws[:8],
                "is_mandatory": is_mand,
                "importance": "Critical" if is_mand else "Important",
            })
            req_idx += 1

    if not requirements:
        return extract_jd_requirements("", job_title)

    return requirements


def build_requirement_evidence_matrix(resume_text: str, job_text: str, job_title: str = "") -> dict[str, Any]:
    """Evaluate every JD requirement against resume evidence with traceable quotes."""
    requirements = extract_jd_requirements(job_text, job_title)
    resume_lower = resume_text.lower()
    resume_sentences = re.split(r"(?<=[.!?])\s+|\n+", resume_text)
    resume_sentences = [s.strip() for s in resume_sentences if len(s.strip()) > 15]

    matrix_rows = []
    evidenced_count = 0
    partial_count = 0
    missing_count = 0

    for req in requirements:
        req_kws = req.get("keywords", [])
        matched_kws = [kw for kw in req_kws if kw in resume_lower]
        match_ratio = len(matched_kws) / max(1, len(req_kws))

        # Find best evidence sentence in candidate's resume
        best_sentence = None
        best_score = 0
        for r_sent in resume_sentences:
            r_lower = r_sent.lower()
            overlap = sum(1 for kw in req_kws if kw in r_lower)
            if overlap > best_score:
                best_score = overlap
                best_sentence = r_sent

        if match_ratio >= 0.45 or best_score >= 2:
            status = "evidenced"
            evidenced_count += 1
            confidence = round(min(0.98, 0.70 + match_ratio * 0.28), 2)
            evidence_snippet = best_sentence or "Demonstrated across technical accomplishments and verified project sections."
            suggestion = None
        elif match_ratio >= 0.20 or best_score >= 1:
            status = "partial"
            partial_count += 1
            confidence = round(0.55 + match_ratio * 0.2, 2)
            evidence_snippet = best_sentence or "Partially referenced in skills list without deep quantitative accomplishment bullet."
            suggestion = f"Highlight direct project impact using {req['name']} with Google XYZ metrics."
        else:
            status = "missing"
            missing_count += 1
            confidence = 0.15
            evidence_snippet = "Not detected in candidate resume."
            suggestion = f"Add explicit coverage of {', '.join(req_kws[:3])} to pass ATS requirement filter."

        matrix_rows.append({
            "id": req["id"],
            "name": req["name"],
            "category": req["category"],
            "jd_sentence": req["jd_sentence"],
            "status": status,
            "evidence_snippet": evidence_snippet,
            "confidence": confidence,
            "is_mandatory": req["is_mandatory"],
            "importance": req["importance"],
            "matched_keywords": matched_kws,
            "suggestion": suggestion,
        })

    total = len(requirements)
    coverage_pct = round((evidenced_count + partial_count * 0.5) / max(1, total) * 100, 1)

    return {
        "job_title": job_title or "Software Development Engineer",
        "total_requirements": total,
        "evidenced_count": evidenced_count,
        "partial_count": partial_count,
        "missing_count": missing_count,
        "coverage_percentage": coverage_pct,
        "ratio_label": f"{evidenced_count} / {total} Evidenced",
        "requirements": matrix_rows,
    }
