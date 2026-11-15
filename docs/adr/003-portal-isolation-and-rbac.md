# ADR-003: Portal Separation & Role-Based Access Control (RBAC)

## Status
Accepted

## Date
2026-11-04

## Context
ResumeLens AI supports two distinct user types:
1. **Students / Candidates**: Upload resumes, view compatibility scores, optimize bullets, track applications.
2. **Enterprise Recruiters**: Create corporate requisitions, run bulk applicant screenings, view candidate leaderboards, update recruitment stages.

Initially, single login sessions allowed candidates to inadvertently access recruiter administrative views without explicit authorization, compromising multi-tenant separation.

## Decision
1. **Portal-Specific Authentication**:
   - The login interface is partitioned into two distinct tabs: `Candidate Portal` and `Recruiter Suite`.
   - The request payload specifies the intended portal (`portal: 'candidate' | 'recruiter'`), locking the session to the intended role.
2. **Backend RBAC Enforcement**:
   - FastAPI dependency `require_recruiter` protects all recruiter routes (`/matches/leaderboard`, `/matches/bulk`, `/matches/{id}/status`, `/jobs/generate`).
   - Standard user tokens attempting to access recruiter endpoints receive `403 Forbidden`.
3. **Enterprise Access Key Elevation**:
   - Elevating a candidate account to recruiter status requires verifying a cryptographic pre-shared key (`RECRUITER2026`, `TIET-HR-2026`).

## Consequences

### Positive
- Strict isolation of student and enterprise workflows.
- Candidates cannot access or modify recruiter leaderboards or pipeline statuses.
- Clean audit trail and predictable token claims (`sub`, `role`).

### Negative
- Users with dual roles must authenticate through the appropriate portal tab or provide an enterprise access key.
