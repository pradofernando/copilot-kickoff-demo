# Presenter prompt sheet

Use the mode and context stated below. Do not paste every prompt into one long
conversation. For the model comparison, start fresh chats with identical files.

## Slide 9 - out of the box

**Ask / whole repository**

```text
/explain what this repo does and how it's structured
```

If `/explain` is not offered, use the same sentence without the slash command.
Use workspace context in the supported form, then attach
[the triage file](../src/domain/triage.ts) for the next prompt.

```text
Explain getSlaStatus. What happens exactly at the SLA deadline?
Don't edit any files.
```

**Plan / triage and types files**

```text
Plan an optional SLA-deadline sort for this request queue.
Keep existing sort options. List the affected files and important edge cases.
Do not implement the plan.
```

**Inline exercise / playground**

Type the following signature in [the playground](../demo/inline-playground.ts),
then pause for a suggestion. Finish or undo the exercise before moving on.

```typescript
export function countResolvedRequests(requests: readonly DemoRequest[]): number {
```

**GitHub Chat / hosted repo**

```text
Explain what this repository does and point me to its business rules and tests.
```

**Copilot CLI / repo directory**

```text
Explain what npm run check does in this repository. Do not execute anything.
```

## Slide 10 - same question, two models

**Fresh Ask chats / attach triage and types to each**

```text
Compare sorting active service requests by priority versus SLA deadline in
this repo. Recommend an approach, explain the trade-offs, and specify how
to handle resolved requests and ties. Don't edit files.
Keep your answer under 150 words.
```

**Optional Agent implementation / rehearse, don't depend on live completion**

```text
Add an optional "SLA deadline first" sort to this app.
Keep newest and priority sorting and keep the default unchanged.
Put active requests before resolved requests, earlier SLA deadlines first.
Break deadline ties by higher priority, older creation time, then ID.
Use the existing shared sort options and pure domain helpers.
Add focused tests, including non-mutation and empty input.
Do not add dependencies, a backend, or external services.
Run npm run check and report the files changed and actual results.
```

## Slide 11 - pull requests

**GitHub Chat / prepared SLA-sort PR**

```text
Explain this pull request and call out anything risky.
Check the sort tie-breaks, resolved-request behavior, and test coverage.
```

**Comment / PR actually created by Copilot cloud agent**

```text
@copilot add tests for the edge cases in this change and update the PR description
```

Do not represent the local prepared feature as a cloud-agent result. This comment
requires the supported hosted workflow and repository/account enablement.

## Slide 12 - code review

**IDE review / after `npm run demo:bug`**

```text
Review my uncommitted changes for bugs, missing tests and security issues.
Do not change any files. Explain each finding and how to reproduce it.
```

**Selected code / getSlaStatus**

```text
Review the selected function against the repository's SLA boundary rule.
Suggest the smallest correction and point to a test that verifies it.
Do not edit files yet.
```

Then make the human-reviewed fix and run the test. The expected concrete finding
is documented in [the review notes](../demo/REVIEW-NOTES.md).

## Slide 13 - custom agent

**Pick test-writer / attach triage and its tests**

```text
Add four focused tests for getSlaStatus:
one millisecond before and after the SLA deadline, and one millisecond
before and after the one-hour warning threshold.
Use explicit UTC timestamps and our existing test conventions.
Do not change production code or duplicate existing cases.
Run the domain tests and report the result and files changed.
```

## Slide 13 - skill

**Agent / invoke the triage-test-matrix skill**

```text
Use the triage-test-matrix skill to check our SLA boundary coverage.
Show a compact matrix of behavior, expected result, and existing tests.
Run the skill's verification script and report its actual result.
Do not modify production code or duplicate the tests we just added.
```

Check Chat's activity for skill loading. If automatic discovery does not trigger,
use its slash entry if available or attach the skill file explicitly.

## Slide 14 - take-home prompts

```text
Compare two approaches to this real problem and recommend one with trade-offs.
```

```text
Review my uncommitted changes before I open a pull request.
```

```text
Help me create one focused agent or skill for a repetitive task on my team.
First clarify its boundaries, tools, and how we will verify the result.
```
