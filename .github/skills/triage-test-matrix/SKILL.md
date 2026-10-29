---
name: triage-test-matrix
description: "Build and verify a focused edge-case matrix for ServiceDesk Lite. Use when testing SLA boundaries, request priority, deterministic sorting, resolved requests, or the triage test matrix."
---

# Triage test matrix

## Procedure

1. Read `src/domain/triage.ts`, `src/domain/types.ts`, and the existing domain tests.
2. Read [the edge-case checklist](./references/edge-cases.md).
3. Produce a small table: behavior, input, expected result, existing coverage.
   Distinguish requirements from assumptions.
4. When asked to implement tests, add only missing cases to
   `src/domain/triage.test.ts`. Do not change production code or install packages.
5. Run [the verification script](./scripts/verify.mjs) with Node from the repo.
   Report the actual exit code. A failing assertion is a finding, not permission
   to relax the expected behavior.
6. Summarize what still needs human review. Do not claim that tests prove
   production readiness.
