# ServiceDesk Lite

This is a local-only React/TypeScript presentation lab, not a production service.
Use synthetic requests only. Do not add a backend, cloud service, credentials, or
real operational records. Keep new dependencies out unless the task needs them.

## Team conventions

- Keep pure business rules in `src/domain/triage.ts`; components handle interaction.
- Treat request arrays and records as immutable.
- Pass the reference clock explicitly. Preserve the fixed demo clock in
  `src/data/requests.ts`; do not replace it with the wall clock.
- A request is overdue at or after its deadline. Resolved requests never count
  toward active, critical, or overdue totals.
- Preserve existing sort choices and deterministic tie-breaks when adding a sort.
- Validate user input and surface errors visibly.

## Verification

- `npm test`: Node's built-in test runner, TypeScript supported by Node 22.18+.
- `npm run lint`: Oxlint. `npm run build`: strict TypeScript and Vite.
- Use `node:assert/strict` and `node:test` in `src/domain/triage.test.ts`.
  Import local TypeScript files with their `.ts` extensions. No test framework
  installation is needed.
- Run `npm run check` before proposing a completed application change.
- Demo scenario commands are presenter actions, not a way to fix application bugs.

See [the demo plan](../docs/DEMO-PLAN.md) for the presentation flow.
