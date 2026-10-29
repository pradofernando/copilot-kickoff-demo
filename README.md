# ServiceDesk Lite

**A small repo. One story. The whole Copilot workflow.**

A runnable, local-first request-triage dashboard and presenter kit for slides
**9-14** of the GitHub Copilot kickoff presentation. Explore a codebase, compare
models, improve prioritization, shape a PR, catch a boundary bug, then demonstrate
repository instructions, a custom test-writing agent, and an on-demand skill.

## Start here

- [Demo plan and timed presenter runbook](docs/DEMO-PLAN.md)
- [Copy/paste prompts](docs/PROMPTS.md)
- [GitHub.com and cloud-agent preparation](docs/GITHUB-SETUP.md)
- [Prepared review finding and offline fallback](demo/REVIEW-NOTES.md)

## Run

Requires **Node 22.18+ on the Node 22 line, or Node 24+**, and npm.
Node 22 is the CI target. Git and VS Code are recommended for the presentation.

```powershell
Set-Location 'C:\Users\feprado\Repos\copilot-kickoff-demo'
npm ci
npm run check
npm run dev
```

Open <http://127.0.0.1:5173>. The dev server binds only to loopback and fails
explicitly if that port is occupied; it will not silently choose another port.

The app needs **no backend, database, API keys, cloud subscription, external fonts,
or external runtime requests**. Installing dependencies and using Copilot/GitHub
still require their respective network access.

### What works

- Search requests by ID, title, or category.
- Switch between active, all, and resolved views.
- Sort by newest or priority.
- Create synthetic requests with visible title validation.
- Start work, resolve requests, and watch totals update.
- Reset demo data with one button.

Changes live in memory only. Reloading restores the eight seed requests. The SLA
clock is fixed at **2026-10-29 14:00 UTC**, so rehearsals do not drift over time.
Baseline totals: **6 active / 2 past SLA / 2 critical / 2 resolved**.

## Presentation checkpoints

The local Git repository includes:

| Ref | Purpose |
|---|---|
| `main` | Working baseline, 42 tests. Start the demo here. |
| `demo-start` | Tag marking the original baseline. |
| `demo/sla-first` | Ready-to-push feature branch: adds SLA-deadline sorting and three tests. |

No hosted repository, pull request, or cloud-agent history is created automatically.
See [GitHub setup](docs/GITHUB-SETUP.md) before the event.

For **uncommitted-change demonstrations on `main`**:

```powershell
npm run demo:status
npm run demo:pr         # Prepared three-file feature, not AI-generated output
npm run demo:baseline   # Reverse only the known demo snippets
npm run demo:bug        # Intentional <= to < deadline regression; tests SHOULD fail
npm run demo:baseline
npm run check
```

These commands do not call Git, switch branches, commit, push, or run a hard
reset. They recognize specific source snippets, plan all replacements before
writing, preserve unrelated text, and refuse unrecognized scenario anchors.
Do not use them to overwrite a live agent's implementation. Save that work and
use a clean rehearsal copy instead. Running `demo:baseline` on the committed
feature branch would intentionally reverse its feature as uncommitted edits;
switch back to a clean `main` first.

## Repo map

| File/folder | What to show |
|---|---|
| [App](src/App.tsx) | Dashboard state, creating and resolving requests |
| [Request board](src/components/RequestBoard.tsx) | Search, view controls, and sort picker |
| [Triage rules](src/domain/triage.ts) | Small, readable business rules; review target |
| [Types and sort options](src/domain/types.ts) | A change propagating from domain to UI |
| [Unit tests](src/domain/triage.test.ts) | Built-in Node test runner; explicit time boundaries |
| [Seed data](src/data/requests.ts) | Eight synthetic requests and a fixed clock |
| [Inline playground](demo/inline-playground.ts) | Low-risk inline/next-edit suggestion exercise |
| [Repository instructions](.github/copilot-instructions.md) | Always-on team conventions |
| [Test-writer agent](.github/agents/test-writer.agent.md) | Specialist restricted by instructions to test edits |
| [Triage skill](.github/skills/triage-test-matrix/SKILL.md) | On-demand workflow, checklist, and verification script |

The playground is outside the app build. Keep live typing exercises there so
an unfinished suggestion cannot break the dashboard.

## Verification commands

```powershell
npm test             # 42 baseline tests: 33 domain + 9 scenario-safety tests
npm run lint         # Oxlint, warnings fail
npm run build        # Strict TypeScript + production bundle
npm run check        # All three
node .github\skills\triage-test-matrix\scripts\verify.mjs
```

The prepared feature has 45 tests. The review-bug scenario deliberately fails
the exact-deadline and fixed-totals assertions; never publish it as a working fix.

This is a teaching starter, not a production service desk or a real SLA policy.
**Copilot assists; you review and approve.**
