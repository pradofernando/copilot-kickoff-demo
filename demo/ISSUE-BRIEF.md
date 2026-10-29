## Goal

Help the team prioritize its synthetic service queue by SLA deadline.
Add an optional "SLA deadline first" sort on a new branch from `main`.

## Acceptance criteria

- Preserve the existing newest and priority sort options and default.
- Read the UI options from the existing shared definitions.
- In the SLA sort, place active work before resolved requests.
- Sort by deadline ascending, then higher priority, older creation time, and ID.
- Keep input arrays immutable.
- Use the existing SLA helper and fixed-clock test conventions.
- Add focused tests and run `npm run check`.
- Do not add a backend, cloud resources, dependencies, or real user data.

## Reviewer notes

Explain the trade-off and identify important edge cases in the PR description.
Keep the PR draft for human review; do not merge automatically.
