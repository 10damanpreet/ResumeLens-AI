# ADR-001: Agile/Scrum as SDLC Methodology

## Status
Accepted

## Date
2026-08-30

## Context

We need to choose a Software Development Lifecycle (SDLC) methodology for building the Resume-Job Matching System. The project must satisfy both:
1. Academic coursework requirements (formal SDLC documentation, SRS, UML diagrams)
2. Production-grade engineering standards for interview portfolio demonstration

The system involves several components with evolving requirements:
- Resume parsing with unpredictable format edge cases
- Skills taxonomy that requires iterative refinement as real resumes are tested
- Scoring weights that need calibration against validation data
- ML pipeline integration where accuracy improvements are discovered during development

## Decision

We will use **Agile/Scrum** with 7 weekly sprints (7 weeks total), adapted for a solo/small-team academic project.

### Ceremonies (adapted)
- **Sprint Planning**: Define sprint goal + backlog items at start of each week
- **Daily Standup**: Written 3-bullet log (done/doing/blocked) in the repo
- **Sprint Review**: Working demo recorded as video/screenshot set each week
- **Sprint Retrospective**: Written note on what worked/what to change

### Definition of Done
1. Code merged to main via pull request
2. Unit tests written and passing
3. No linter errors (ruff)
4. Feature manually verified against real resume/JD sample
5. Documentation updated if requirements change

## Alternatives Considered

### Waterfall
- **Rejected because**: Resume parsing and scoring weight calibration cannot be fully specified upfront without hands-on experimentation with real documents. A fixed-specification model would either force premature design commitments or require expensive late-stage rework.

### Kanban
- **Rejected because**: While suitable for continuous delivery, Kanban lacks the sprint-bounded structure that maps well to weekly academic submission checkpoints. Scrum's time-boxed sprints provide natural demo milestones.

### Spiral
- **Rejected because**: The formal risk-analysis overhead at each cycle is disproportionate for a project of this scope. Agile's lightweight retrospectives capture the same risk-awareness benefits with less ceremony.

## Consequences

### Positive
- Iterative refinement allows discovering parsing edge cases and tuning scoring weights incrementally
- Sprint reviews create natural demo checkpoints for both academic evaluation and portfolio
- Lightweight ceremonies avoid process overhead on a small team
- Each sprint produces a working, independently demoable increment

### Negative
- Risk of scope creep without strict backlog discipline
- Solo project means "self-review" on PRs (mitigated by CI/CD enforcement)
- Sprint velocity estimation is less meaningful without team-scale data

### Mitigations
- A/B/C priority on backlog items: A (must-have for demo), B (should-have), C (nice-to-have)
- CI pipeline enforces Definition of Done automatically (lint + test gates)
- Build order front-loads highest-value items so partial completion still produces a strong demo
