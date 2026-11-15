# ADR-002: Dual-Model LLM Gateway with Latency Guardrails & Fallbacks

## Status
Accepted

## Date
2026-10-14

## Context
ResumeLens AI relies on Generative AI for two user-facing features:
1. **AI Resume Bullet Tailoring**: Rewriting resume bullets using Google's XYZ formula.
2. **Skill Gap Advisory & Interview Simulation**: Generating customized technical interview questions and study paths.

During early testing, cloud LLM providers experienced intermittent network latency spikes (>10s) and sporadic HTTP 429 rate limits. In a high-stakes presentation or live demo, an uncaught timeout results in a 500 error or hanging spinner.

## Decision
We implemented a multi-tier resilience architecture:
1. **Primary Model**: `gemini-3.6-flash` with an 8.0-second async timeout budget.
2. **Secondary Failover**: `gemini-3.5-flash-lite` with a 10.0-second async timeout budget, automatically invoked on primary timeout or API error.
3. **Deterministic Heuristic Fallback**: A local rule-based Google XYZ template engine that activates if all external network calls fail or time out.

## Consequences

### Positive
- Guaranteed 100% uptime for client UI; users never encounter a 500 error or blank view.
- Sub-second responses when switching to secondary models or fallbacks.
- Complete decoupled fault tolerance between LLM inference and the core relational database.

### Negative
- Fallback content is rule-derived and less customized than live model inference.
- Additional complexity in error handling and model fallback state management.
