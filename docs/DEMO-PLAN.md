# Demo plan: ServiceDesk Lite

## The recommendation

Use one approachable application throughout the segment: an internal service
request queue with eight synthetic requests. The audience can understand the
problem in ten seconds: **which request should the team work on next?**

The story is not "watch AI generate an app." It is:

> Understand unfamiliar code, choose a trade-off, propose a small improvement,
> review it, and encode the team's expectations for the next change.

The selected stack is React, TypeScript, Vite, and Node's built-in test runner.
There is deliberately no backend, authentication, deployment, or live data
integration competing with the Copilot demonstration.

## Why this repo fits slides 9-14

- A recognizable UI makes code changes visible without teaching a framework.
- A short pure domain file gives Ask, models, reviews, and tests shared context.
- Priority versus SLA-deadline sorting is a real trade-off with no magic answer.
- The prepared feature touches types, domain logic, and tests; the existing UI
  consumes the updated sort options automatically.
- An exact-deadline bug is understandable, reproducible, and harmless outside
  this synthetic lab.
- Instructions, one focused agent, and one focused skill form the slide 13 ladder.
- A fixed clock, local data, and prepared Git refs minimize live-demo risk.

## Time budget

Slide 8 already uses two minutes. Your slides 9-14 total **23 minutes**, ending
at minute 25 of the deck's demo block.

| Slide | Your elapsed time | Deck clock | Show | Land this point |
|---|---|---|---|---|
| 9 - Out of the box | 00:00-04:00 | 02:00-06:00 | Inline/next edit, Ask/Plan/Agent, file context, GitHub Chat, CLI | Start useful work without custom setup. |
| 10 - Models | 04:00-08:00 | 06:00-10:00 | The same prioritization question with two models, then Auto if available | Match the model to the job; compare evidence, not branding. |
| 11 - Pull requests | 08:00-12:00 | 10:00-14:00 | SLA-sort PR summary, diff explanation, real cloud-agent follow-up | Copilot reduces coordination work; humans still own the change. |
| 12 - Reviews | 12:00-16:00 | 14:00-18:00 | Hosted review and a local exact-deadline regression | Review before you push; validate findings with a test. |
| 13 - Customization | 16:00-21:00 | 18:00-23:00 | Repo instructions, test-writer, triage skill | Team know-how can be versioned with the code. |
| 14 - Go-dos | 21:00-23:00 | 23:00-25:00 | Three takeaways, no more tool switching | Try one of these on real work this week. |

The deck's notes mention handing back after slide 13. Coordinate who voices
slide 14 and who shares it before the event; its two minutes are included here.

## Screen setup

Use two windows, not a tour of every tool:

1. **VS Code:** this repo opened directly, readable editor/terminal zoom,
   Copilot Chat docked, browser app available beside it.
2. **Browser:** the hosted repo, a prepared PR, and a completed real cloud-agent
   follow-up in separate tabs.

Keep [the prompt sheet](PROMPTS.md) on a second monitor. Pre-open the
[triage implementation](../src/domain/triage.ts),
[tests](../src/domain/triage.test.ts), and customization files.
Do not put the slide deck, personal downloads, or unrelated repos in this repo.

The default app URL now opens the detailed home page. It explains what requests
track and why, the workflow, SLA rules, and the lab's limits. Use it as take-home
orientation, not an extra live tour: start the timed segment at
<http://127.0.0.1:5173/#overview> to keep the 23-minute budget.

## Slide 9: capabilities without setup - 4 minutes

**0:00-0:20 - Establish the application.**
Show the browser: six active, two past SLA. Point out that all records are
synthetic and the clock is frozen. "We'll improve how this queue is prioritized."

**0:20-1:10 - Inline and next-edit suggestions.**
Open [the playground](../demo/inline-playground.ts). Type a signature for
`countResolvedRequests`, pause, and accept a useful suggestion with Tab.
Rename the local `label` variable in `formatRequestLabel` to `summary`; look for
a next-edit suggestion on the return statement. Do not leave this exercise in
production files.

Inline/next-edit suggestions are probabilistic. If nothing useful appears in
ten seconds, show a normal Rename Symbol operation and explain the intended
prediction. Never claim the fallback was a Copilot suggestion.

**1:10-2:30 - Chat modes and context.**
Show Ask, Plan, and Agent in the picker. In Ask, explain the repo. Attach the
triage file and ask what happens at the exact SLA deadline. Briefly show the
planning prompt; do not start a long implementation here.

**2:30-3:15 - Same repo on GitHub.com.**
Ask for the repo's purpose and structure in GitHub Chat. If policy or connectivity
blocks it, say so and keep the explanation in the IDE.

**3:15-4:00 - CLI.**
Start the already-authenticated `copilot` CLI in the repo and ask it to explain
`npm run check` without executing it. Exit the session when done.

**Transition:** "These surfaces run on models. Let's compare how they handle
the same decision."

## Slide 10: choosing a model - 4 minutes

1. Open a fresh chat with the triage and types files attached.
2. Pick an available fast model. Use the exact comparison prompt from
   [the prompt sheet](PROMPTS.md#slide-10---same-question-two-models).
3. Use a second fresh chat, the same files, and the same prompt with a model
   suitable for reasoning.
4. Compare the recommendation, resolved-request handling, deterministic
   tie-breaks, and response time. A longer answer is not automatically better.
5. Show Auto if available under the audience's account/policy.

**Decision to carry forward:** add an *optional* SLA-deadline sort, preserving
newest and priority sort. Resolved requests come last; ties remain deterministic.
Do not claim a fast/reasoning comparison is a benchmark, and do not hard-code
model names that may not be enabled for the audience.

Optional rehearsal-only extension: let Agent implement the feature using the
bounded prompt in the prompt sheet. Review and test its changes. The live
25-minute session does not depend on completing this implementation.

**Transition:** "We've agreed on a small change. Now let's make it reviewable."

## Slide 11: pull requests - 4 minutes

Use the prepared `demo/sla-first` branch, not untested live code.
[GitHub setup](GITHUB-SETUP.md) explains how to prepare the hosted PR and an
independent real cloud-agent example beforehand.

1. Generate a PR summary in the description box. Start with a blank description
   for best results, review the output, and add the *why* before saving.
   Editing the prepared draft PR is the time-safe path; creating it live is optional.
2. Ask GitHub Chat to explain the diff and flag risks.
3. Show the three-file feature: sort option, comparator, and edge-case tests.
   The UI reads the shared options, so no duplicated dropdown code is needed.
4. On a **PR actually created by the cloud agent**, post the slide's `@copilot`
   follow-up. Show a completed earlier response if the live run is still queued.

Do not imply that commenting on an arbitrary human-created PR invokes the same
cloud-agent workflow. Organization policy, account access, and repository
enablement determine availability.

**Transition:** "A clear PR helps reviewers. Let's ask Copilot to be one."

## Slide 12: reviews - 4 minutes

**First minute: hosted review.**
Request Copilot under Reviewers on the prepared PR. Walk through a real comment
that you reviewed during rehearsal. Accept or dismiss it with a reason; do not
rely on a fresh review finishing during the talk.

**Next two minutes: deterministic local example.**
On a clean `main`:

```powershell
npm run demo:bug
```

This changes `deadline <= now` to `deadline < now`. Ask Copilot to review the
uncommitted change, then run `npm test`. At the exact deadline a request becomes
"due soon" instead of overdue, and the fixed dashboard's past-SLA count drops
from two to one.

Show the exact-deadline test and select `getSlaStatus` for a selected-code review
if that action is exposed by your installed VS Code version.

**Last minute: human decision and verification.**
Restore `<=` after reviewing the finding and rerun the tests. Alternatively,
`npm run demo:baseline` reverses only the known prepared snippet.
Do not proceed to slide 13 with an intentional failing baseline.

Use [the clearly labeled expected finding](../demo/REVIEW-NOTES.md) if the live
model misses the bug. It is a human-prepared explanation, not a fabricated
Copilot review or a guarantee about model output.

**Transition:** "Now let's make our expectations reusable for the whole team."

## Slide 13: instructions, agent, skill - 5 minutes

**0:00-1:00 - Instructions.**
Open [repository instructions](../.github/copilot-instructions.md). Highlight
two memorable rules: fixed time and "at or after deadline." Explain that these
apply broadly, rather than only when a specialist is selected.

**1:00-3:00 - Agent.**
Open [test-writer](../.github/agents/test-writer.agent.md), show its description,
tool list, and test-only boundary. Select it in Chat and request the four
millisecond-boundary tests from the prompt sheet.
The model is deliberately not pinned; the presenter can use an available model.

Inspect the diff and test result together. Production code must be unchanged.
These are behavioral instructions, **not an operating-system sandbox**; tool
permissions and human review still matter.

**3:00-4:30 - Skill.**
Open [the triage skill](../.github/skills/triage-test-matrix/SKILL.md).
Show its trigger-rich description, checklist reference, and small bundled
verification script. Ask for the edge-case matrix and actual test result.
Confirm the skill appeared in Chat's tool/context activity rather than assuming
automatic loading. Use its slash entry if available, or attach the skill file.

If agent output takes more than 45 seconds, inspect the existing tests and run:

```powershell
node .github\skills\triage-test-matrix\scripts\verify.mjs
```

**4:30-5:00 - Recap.**
Instructions = shared standards. Agent = specialist role. Skill = reusable
procedure loaded when relevant. All are plain, reviewable files.
Mention the [awesome-copilot collection](https://github.com/github/awesome-copilot)
as a source of examples, not something needed to run this demo.

## Slide 14: close - 2 minutes

Return to the slide, not the terminal:

1. Try a second model on one real question.
2. Review uncommitted changes before the next PR.
3. Add one small agent profile or skill.

Offer this repo and prompt sheet as the take-home lab. Finish with:
**"Copilot assists; you review and approve."**
Hand back according to the agreed deck handoff.

## Preflight: do this before the audience joins

- [ ] `main` is checked out, `npm run demo:status` reports baseline, and the worktree is clean.
- [ ] `npm ci` was done beforehand; `npm run check` passes.
- [ ] Browser is on the Workspace page, showing the initial six active requests and two past SLA.
- [ ] Rehearse search, sorting, creation, resolution, and reset.
- [ ] Confirm Copilot sign-in, two usable models, modes, and file attachments.
- [ ] Confirm the CLI is installed **and authenticated**; installation alone is not enough.
- [ ] Confirm the agent appears in the picker and the skill can be invoked.
- [ ] Confirm hosted repo permissions, summary action, reviewer, and cloud-agent eligibility.
- [ ] Open the prepared PR and a genuinely completed agent follow-up.
- [ ] Keep a screenshot or recording of hosted-only steps if permitted.
- [ ] Check current menu labels. Slash commands, context mentions, models, and
      hosted capabilities vary by version, plan, and policy.
- [ ] Rehearse once with a 23-minute timer. Do not install, log in, or provision
      anything during the live segment.

## Recovery rules

| Problem | Recovery |
|---|---|
| Inline/next edit does not appear | Timebox ten seconds; explain and continue. |
| Model comparison runs long | Use a real saved rehearsal answer, labeled as recorded. |
| Agent still working | Show completed real activity; never wait on a long queue. |
| No hosted feature access | Show local three-file diff and tests, explicitly label as the local fallback. |
| Review misses the bug | Use the failing test and human-prepared expected finding. |
| Customization not discovered | Open its file and show the procedure; verify discovery before the next run. |
| Scenario script refuses edits | Stop; preserve the edits. Use a clean rehearsal copy, never a hard reset. |
| Dev port already occupied | Stop only a server you own, or explicitly run Vite on a different free port. |

Local application use is independent of GitHub hosting. Copilot itself still
needs its supported service access; "offline fallback" means a code/test walkthrough,
not an offline Copilot model.
