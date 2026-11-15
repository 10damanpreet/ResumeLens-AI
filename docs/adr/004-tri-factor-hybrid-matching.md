# ADR-004: Tri-Factor Hybrid Compatibility Algorithm

## Status
Accepted

## Date
2026-09-17

## Context
A central challenge in automated resume evaluation is scoring accuracy:
- **Pure Keyword Matching (Lexical)** fails when qualified candidates describe equivalent technologies with different terminology (e.g., *FastAPI* vs. *RESTful microservices*).
- **Pure Dense Semantic Search (Embeddings)** frequently suffers from high false-positive similarity when candidates describe adjacent fields (e.g., *Frontend Web UI* vs. *Firmware Systems*) because both share general software development vocabulary.
- **Experience Fit** is frequently omitted in simple matching engines, matching junior applicants with staff-level roles.

## Decision
We implemented a **Tri-Factor Hybrid Matching Algorithm**:

$$\text{Final Score} = 0.40 \cdot S_{\text{semantic}} + 0.40 \cdot S_{\text{lexical}} + 0.20 \cdot S_{\text{experience}}$$

1. **Dense Semantic Fit ($S_{\text{semantic}}$)**:
   - 384-dimensional dense vectors generated via `sentence-transformers/all-MiniLM-L6-v2`.
   - Cosine similarity captures semantic intent and project depth.
2. **Lexical Skill Overlap ($S_{\text{lexical}}$)**:
   - Evaluated against a curated 60+ technology taxonomy across core engineering domains.
   - RapidFuzz token-sort similarity ($\tau \ge 85\%$) bridges minor naming discrepancies.
3. **Experience Fit ($S_{\text{experience}}$)**:
   - Tenure extraction comparing detected work history against required years of experience.

## Consequences

### Positive
- Balances semantic breadth with strict domain competency requirements.
- Significantly reduces false positives compared to pure embedding search.
- Empirically validated across real student resumes and Tier-1 employer requisitions.

### Negative
- Requires maintaining a curated software engineering taxonomy.
- Computationally heavier than pure TF-IDF or regex searching.
