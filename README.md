# ServiceDesk Lite

**A small repo. One story. The whole Copilot workflow.**

A runnable, local-first request-triage dashboard and presenter kit for slides
**9-14** of the GitHub Copilot kickoff presentation. Explore a codebase, compare
models, improve prioritization, shape a PR, catch a boundary bug, then demonstrate
repository instructions, a custom test-writing agent, and an on-demand skill.

## Start here

- [Run the app locally](#run)
- [Understand repository instructions, agents, and skills](#how-copilot-is-customized-here)
- [Use the test-writer agent](#use-the-test-writer-agent)
- [Use the triage-test-matrix skill](#use-the-triage-test-matrix-skill)
- [Take a GitHub issue through a cloud-agent PR](#use-github-copilot-cloud-agent)
- [Troubleshoot the demo](#troubleshooting)
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

Open <http://127.0.0.1:5173> for the detailed home page: what a service request is,
the six recorded fields and two calculated SLA signals, why they matter, the
workflow, and the demo's boundaries.

Choose **Workspace** or open <http://127.0.0.1:5173/#overview> to use the app;
<http://127.0.0.1:5173/#requests> opens the queue directly. Home's section links
are bookmarkable, and browser Back/Forward works between pages. Navigating
between Home and Workspace preserves requests, filters, and unfinished form
input; reloading or resetting the data restores the seed records.

The dev server binds only to loopback and fails
explicitly if that port is occupied; it will not silently choose another port.

The app needs **no backend, database, API keys, cloud subscription, external fonts,
or external runtime requests**. Installing dependencies and using Copilot/GitHub
still require their respective network access.

### What works

- Explore the detailed home page, including what is tracked and why.
- Search requests by ID, title, or category.
- Switch between active, all, and resolved views.
- Sort by newest or priority.
- Create synthetic requests with visible title validation.
- Start work, resolve requests, and watch totals update.
- Reset demo data with one button.

Changes live in memory only. Reloading restores the eight seed requests. The SLA
clock is fixed at **2026-10-29 14:00 UTC**, so rehearsals do not drift over time.
Baseline totals: **6 active / 2 past SLA / 2 critical / 2 resolved**.

## How Copilot is customized here

There are two different meanings of "agent" in this demo:

- **A local agent session** works in your checkout through VS Code or Copilot CLI.
  The built-in implementation agent can change application code; this repo's
  custom **test-writer** has a much narrower assignment.
- **GitHub Copilot cloud agent** works against the hosted repository in a remote
  development environment. Give it an issue or bounded task, inspect its work,
  and ask it to open a draft PR. It cannot see uncommitted local changes.

Neither is the application itself. ServiceDesk Lite remains a local-only app;
using a hosted development agent does not add a backend or deploy the dashboard.

The repository includes three complementary customization layers:

| Layer | Definition in this repo | When it applies | What it provides |
|---|---|---|---|
| Repository instructions | [copilot-instructions.md](.github/copilot-instructions.md) | Automatically in supported Copilot experiences | Team-wide rules for synthetic data, immutable inputs, the fixed clock, and verification |
| Custom agent | [test-writer.agent.md](.github/agents/test-writer.agent.md) | Select it explicitly, or request it by name where delegation is supported | A test-writing role with selected tools and a test-only editing boundary |
| Agent skill | [triage-test-matrix/SKILL.md](.github/skills/triage-test-matrix/SKILL.md) | Loaded on demand for matching work, or explicitly requested | A repeatable coverage workflow, an edge-case checklist, and a verification script |

**Instructions are the rules; an agent is a role; a skill is a procedure.**
A skill does not replace the selected agent or grant additional tools. An agent
can use a skill while still following its own editing boundaries.

### Repository instructions: the shared rules

Open [the repository instructions](.github/copilot-instructions.md) before the
demo. They tell Copilot to:

- Keep pure business rules in [the triage module](src/domain/triage.ts), separate
  from UI interaction.
- Preserve immutable request arrays and records.
- Pass the reference clock explicitly and keep
  [the demo timestamp](src/data/requests.ts), rather than using the wall clock.
- Treat a request as overdue **at or after** its deadline.
- Exclude resolved requests from active, overdue, and critical totals.
- Preserve existing sort options, defaults, and deterministic tie-breaks.
- Use the existing test tools and run `npm run check` for application changes.

To demonstrate these rules without changing anything, attach
[the triage module](src/domain/triage.ts) in an Ask conversation:

```text
Explain getSlaStatus against this repository's instructions.
What happens exactly at the deadline, and how are resolved requests handled?
Point to the relevant implementation and tests. Do not edit files.
```

Check the conversation's context or activity to confirm that the instructions
were included. Do not assume that every Copilot surface supports the same
customizations or exposes the same UI.

## Use the test-writer agent

The [test-writer profile](.github/agents/test-writer.agent.md) defines a focused
TypeScript test specialist. It can read, search, edit, and execute commands, but
its instructions permit edits **only** to
[the domain test file](src/domain/triage.test.ts).

It must not edit production code, manifests, scripts, or configuration; install
dependencies; commit or push; or run the demo scenario commands. If a new test
exposes an application bug, it must report the bug and leave the assertion
failing rather than weakening it.

The profile's tool list limits available capabilities, not editable paths.
The test-only boundary is an instruction, **not a filesystem sandbox**. Review
the actual diff and requested commands before accepting the result.

### Step-by-step in VS Code

1. Open this repository's root folder and sign in to GitHub Copilot.
2. Open Copilot Chat and select **test-writer** in the agent picker. Depending on
   your VS Code version, use **Chat: Open Customizations** to inspect available
   agents and confirm that the repository profile was discovered.
3. Attach [the triage implementation](src/domain/triage.ts),
   [its types](src/domain/types.ts), and
   [the existing tests](src/domain/triage.test.ts).
4. Send this bounded request:

   ```text
   Add four focused tests for getSlaStatus:
   one millisecond before and after the SLA deadline, and one millisecond
   before and after the one-hour warning threshold.
   Inspect existing coverage first and add only missing cases.
   Use explicit UTC timestamps, synthetic requests, node:test, and
   node:assert/strict. Import local TypeScript files with .ts extensions.
   Edit only src/domain/triage.test.ts. Do not change production code,
   install dependencies, commit, push, or run demo scenario commands.
   Run the domain tests and report the cases added, actual result,
   files changed, and whether production files were changed.
   ```

5. Inspect the diff. The only agent-authored edits should be in
   [the domain test file](src/domain/triage.test.ts). Existing local edits are
   not evidence that the agent changed those files, so record your starting
   worktree state before the exercise.
6. Confirm that the reported command actually ran:

   ```powershell
   node --test src/domain/triage.test.ts
   ```

If these cases already exist, a correct outcome can be **no additional tests**,
with an explanation of the existing coverage. Do not manufacture duplicate
tests just to make the demo produce a diff.

### Use the same agent in Copilot CLI

Install and authenticate the standalone Copilot CLI separately; `npm ci` only
installs this application's dependencies. From the repository directory, run:

```powershell
copilot
```

Enter `/agent`, choose **test-writer**, and paste the same bounded request.
Alternatively, select the profile directly:

```powershell
copilot --agent=test-writer --prompt "Find missing SLA boundary tests. Edit only src/domain/triage.test.ts, use fixed UTC timestamps, run the domain tests, and report actual results."
```

Review permission requests rather than granting blanket access. Selecting this
profile does not authorize implementation changes. Switch back to the built-in
implementation agent for an approved production-code fix.

## Use the triage-test-matrix skill

This skill turns "check the edge cases" into a repeatable procedure. Its bundled
resources are:

| Resource | Purpose |
|---|---|
| [SKILL.md](.github/skills/triage-test-matrix/SKILL.md) | Discovery metadata and the coverage-review procedure |
| [edge-cases.md](.github/skills/triage-test-matrix/references/edge-cases.md) | The actual SLA, priority, sorting, resolution, search, and immutability rules |
| [verify.mjs](.github/skills/triage-test-matrix/scripts/verify.mjs) | Runs the domain tests with the current Node executable and propagates their exit code |

Discovery starts with the skill's name and description. When the task matches,
the agent can load the procedure and then read its supporting resources. This
keeps task-specific detail out of every unrelated conversation. Discovery makes
the skill available; it does not guarantee that the model invokes it.

### Review coverage without editing

1. Start an agent-capable Copilot conversation in this repository.
2. Request the skill explicitly:

   ```text
   Use the triage-test-matrix skill to audit our current domain test coverage.
   Read the skill's edge-case checklist and existing implementation and tests.
   Show a compact table with behavior, input, expected result, and existing
   coverage. Distinguish requirements from assumptions.
   Do not edit files or duplicate existing tests.
   Run the skill's verification script and report its actual exit code.
   Summarize any gaps and what still needs human review.
   ```

3. Check tool activity for loading
   [the skill](.github/skills/triage-test-matrix/SKILL.md) and
   [its checklist](.github/skills/triage-test-matrix/references/edge-cases.md).
   Where supported, type `/` and choose **triage-test-matrix** to invoke it
   directly. If discovery is unavailable, attach those two files explicitly
   and describe this as a manual fallback, not automatic skill loading.
4. Inspect the matrix and the real verification output.

Important boundaries to look for include:

| Input or condition | Expected behavior |
|---|---|
| One millisecond before the SLA deadline | Due soon |
| Exactly at or after the deadline | Overdue |
| Exactly one positive hour remaining | Due soon |
| One hour plus one millisecond remaining | On track |
| Resolved request | Excluded from active, overdue, and critical totals |
| Equal sort keys | Deterministic documented tie-breaks |
| Filtering or sorting | Original request arrays remain unchanged |
| Empty queue | Zero totals and no filtering or sorting errors |

The checklist also covers trimmed, case-insensitive search and the SLA sort
**if that feature has been added**. Do not claim that the baseline already has
the optional SLA-deadline sort.

### Add only the missing tests

After reviewing the matrix, select **test-writer** and request:

```text
Use the triage-test-matrix skill to add only the missing cases identified
in the coverage review. Recheck current coverage before editing.
Edit only src/domain/triage.test.ts and keep production code unchanged.
Use fixed UTC timestamps and existing test conventions.
Run the skill's verification script and report the actual exit code,
cases added, remaining gaps, and files changed.
If a test exposes a production bug, report it without weakening the assertion.
```

This combines the **agent's role** with the **skill's procedure**, under the
**repository's rules**. If the review happened in another conversation, attach
or paste the relevant matrix rather than assuming that chat history is shared.

You can run the skill's verification independently from the repository root:

```powershell
node .github\skills\triage-test-matrix\scripts\verify.mjs
$LASTEXITCODE
```

Exit code `0` means the domain test process passed; a nonzero exit is a failure
to investigate. The script runs only domain tests, not lint, the build, or the
scenario-safety tests. It does not generate a coverage report or prove that
every checklist item has an assertion. Use `npm run check` for the complete
application verification.

## Use GitHub Copilot cloud agent

Use the hosted agent to demonstrate **issue -> implementation -> draft PR ->
human review**. This is separate from running the dashboard locally or asking
GitHub Chat to explain a file.

### 1. Prepare an approved hosted repository

- Publish intentionally under an approved account or organization; private is
  the documented default. Follow [GitHub setup](docs/GITHUB-SETUP.md).
- Review local edits before committing or publishing. The hosted agent can only
  work with files that are committed and pushed to its selected base branch.
- Ensure that the hosted base includes
  [the instructions](.github/copilot-instructions.md),
  [the agent profile](.github/agents/test-writer.agent.md), and
  [the skill resources](.github/skills/triage-test-matrix/).
- Confirm account access, repository enablement, organization policies, and
  required permissions for the cloud agent, Actions where applicable, and
  Copilot review. Availability and labels vary by client and policy.

Do not make the repository public or change organization policy simply to
unblock a presentation. No Azure account, application credentials, backend, or
deployment is required.

### 2. Create the implementation issue

Use [the issue brief](demo/ISSUE-BRIEF.md) as the task description. It asks for an
optional **SLA deadline first** sort while preserving the newest and priority
sorts and the existing default. Active requests must come before resolved work;
deadline ties use priority, older creation time, then ID.

After publishing and authenticating GitHub CLI, create the issue from the
repository directory:

```powershell
gh issue create --title "Add optional SLA-first request sorting" --body-file demo\ISSUE-BRIEF.md
```

Alternatively, create the issue in GitHub's UI and paste the brief. Do not do
both and accidentally create duplicate demo issues.

### 3. Start the real cloud-agent implementation

Open the issue and assign it to **Copilot** where that workflow is available.
Alternatively, start a cloud session from the repository's **Agents** tab and
reference the issue. Choose **main** as the base for this exercise, not the
already-implemented feature branch.

Use the default implementation agent, **not test-writer**, for the feature.
The test-writer profile deliberately forbids production edits, commits, and
pushes, so its boundaries do not match an end-to-end implementation task.

Use this task or additional instruction:

```text
Implement the optional SLA-deadline sort described in this issue.
Follow .github/copilot-instructions.md and all issue acceptance criteria.
Use the existing shared sort definitions and SLA helper.
Preserve the current defaults, resolved-request handling, deterministic
tie-breaks, immutable inputs, synthetic data, and fixed clock.
Use the triage-test-matrix skill to inspect coverage and add missing tests.
Use a Node version supported by package.json and install locked dependencies
with npm ci if needed. Run npm run check and report the actual result.
Open a draft PR explaining the trade-off, files changed, edge cases tested,
and any checks that failed or could not run. Do not merge it.
Do not add dependencies, a backend, cloud resources, or real user data.
```

The repository skill can be used by supported cloud-agent experiences after
its files are published. A locally installed personal skill or editor-only
setting is not automatically available in the hosted environment.

### 4. Inspect execution and iterate on the agent's PR

Watch the actual session activity: which files it read, whether it loaded the
skill, what it changed, and which commands completed. Do not describe a proposed
command as a passed check or claim that a queued session has finished.

Once the agent has opened its own draft PR, inspect the diff and test results.
If a genuine coverage gap remains, post a specific follow-up such as:

```text
@copilot use the triage-test-matrix skill to check this change for missing
tie-break, resolved-request, empty-input, and non-mutation coverage.
Add only missing tests, run npm run check, and update the PR description
with the actual results. Keep this PR draft and do not merge it.
```

Use this on **the PR actually created by the cloud agent**, with the supported
workflow enabled. Do not assume that posting the same comment on an arbitrary
human-created PR demonstrates the same behavior. If coverage is already
complete, ask for a different real improvement rather than duplicate tests.

Wait for the follow-up to finish, review the new commit, and keep the PR draft
and unmerged. For a live presentation, bookmark a completed rehearsal run as
the fallback and clearly label it if the fresh run is still queued.

### 5. Show PR assistance and review separately

- Use the available PR-summary action, then review and improve the generated
  description with the rationale and real verification results.
- Ask GitHub Chat to explain the diff, sort tie-breaks, and remaining risks.
- Request **Copilot** under PR reviewers if enabled; inspect its actual findings
  and reproduce any reported bug before applying a fix.
- Re-run checks after accepted changes and retain human approval of the PR.

Cloud-agent implementation and Copilot code review are separate workflows.
Neither a generated summary nor a passing test run is permission to merge
automatically.

### Prepared branch versus real agent work

The included **demo/sla-first** branch is a human-prepared checkpoint for a
predictable PR demo. It is not evidence that the cloud agent executed anything.
Its suggested PR description is [the PR brief](demo/PR-BRIEF.md).

Keep that prepared PR and the real agent-created PR separate. They intentionally
implement the same feature for different presentation purposes; **do not merge
both**. See [the hosting guide](docs/GITHUB-SETUP.md) for the draft-PR commands.

## Adapt the agents and skills for your team

Keep the distinction between rules, roles, and procedures when extending this
example:

1. Put shared coding expectations in
   [repository instructions](.github/copilot-instructions.md), not in every
   prompt. Keep instructions short enough to apply to routine work.
2. For a new specialist, use a separate profile in
   [the agents folder](.github/agents/). Give it a clear name, a description
   stating when to use it, minimal tools, explicit allowed edits, and a required
   result format. Use [test-writer](.github/agents/test-writer.agent.md) as the
   focused example, rather than broadening its existing boundaries.
3. For a repeatable procedure, add a separate folder under
   [skills](.github/skills/) with a `SKILL.md`. Its frontmatter needs a `name`
   matching the folder and a `description` explaining both what it does and
   when to load it. Keep detailed checklists and scripts in linked resources,
   following [the existing skill](.github/skills/triage-test-matrix/).
4. Try a small synthetic task in a fresh conversation. Verify discovery, tool
   activity, edited paths, and actual command results. Test explicit invocation
   separately from automatic selection, then review the customization like code.

There is no need to add an MCP server, backend, or package just to use the
included agent and skill. Keep approval and review proportional to the tools
you make available.

## Troubleshooting

| Symptom | What to check |
|---|---|
| The app will not start | Use a supported Node version, install locked dependencies with `npm ci`, and read the actual error. If port 5173 is occupied, check whether this demo is already running; do not kill an unrelated process. |
| test-writer is missing | Open the repository root, confirm the profile is saved in the agents folder, and inspect the agent picker or **Chat: Open Customizations**. Check client support and policies before retrying in a fresh chat. |
| The skill did not load | Request **triage-test-matrix** by name, use its slash entry where available, and inspect activity. Check the folder name and YAML metadata. Attach the skill and checklist only as a clearly labeled manual fallback. |
| The agent refuses a production edit | That is expected for test-writer. Review the finding, then switch to an implementation agent with an explicitly approved scope. |
| The skill script passes but lint or build fails | Its scope is domain tests only. Run `npm run check` and investigate the failing stage instead of treating the skill result as full verification. |
| GitHub cannot see local changes or customizations | Review, commit, and push the intended files to the selected base branch. Do not publish unrelated edits or secrets. |
| Cloud agent, PR summaries, or Copilot review are unavailable | Check account access and repository or organization policy. Use the documented local fallback; do not claim that hosted work ran. |
| A new test fails | Preserve the assertion and report the observed behavior. Do not weaken the test, change the fixed clock, or use a demo scenario command to hide an application bug. |

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
| [App](src/App.tsx) | Page navigation, retained dashboard state, creating and resolving requests |
| [Home page](src/components/HomePage.tsx) | Detailed app guide, tracked fields, rationale, SLA rules, and FAQs |
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

The [CI workflow](.github/workflows/ci.yml) installs locked dependencies on
Node 22 and runs `npm run check` for PRs and pushes to main. Inspect the actual
workflow result before presenting a hosted PR as verified.

## Official Copilot references

Client support and UI labels evolve. Check the documentation for your installed
version and enabled GitHub features:

- [Custom agents in VS Code](https://code.visualstudio.com/docs/agent-customization/custom-agents)
- [Agent skills in VS Code](https://code.visualstudio.com/docs/agent-customization/agent-skills)
- [GitHub custom-agent configuration and tool aliases](https://docs.github.com/en/copilot/reference/custom-agents-configuration)
- [Custom agents in Copilot CLI](https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli/invoke-custom-agents)
- [GitHub agent skills and supported experiences](https://docs.github.com/en/copilot/concepts/customizations/agent-skills)
- [Starting Copilot cloud sessions on GitHub](https://docs.github.com/en/copilot/how-tos/use-copilot-agents/cloud-agent/use-cloud-agent-on-github)

This is a teaching starter, not a production service desk or a real SLA policy.
**Copilot assists; you review and approve.**
