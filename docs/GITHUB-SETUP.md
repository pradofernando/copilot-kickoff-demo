# Prepare the hosted parts before the event

The delivered repo is **local only**. No GitHub repository, issue, pull request,
Copilot review, or cloud-agent session is fabricated or created for you.
The local baseline and feature branch are ready; publishing is a separate,
intentional action under an approved account or organization.

## 1. Confirm eligibility

- Confirm Copilot access in VS Code, GitHub.com Chat, and the standalone CLI.
- Confirm PR summaries and Copilot review are available for the chosen account
  and repository under its organization policies.
- Confirm Copilot cloud agent is enabled for the selected GitHub-hosted repo,
  with required access and Actions/workflow permissions.
- For an Enterprise Server audience, keep the local IDE examples. Do not imply
  that every GitHub.com hosted-agent capability is available on their server.
- Keep human approval in the demo workflow even where review policies vary.

Use current labels in your installed versions rather than relying on an exact
menu label or a model name from the slides.

## 2. Publish intentionally

Replace `OWNER` below. Use an account/organization approved for presentation
material. Do not run these commands against an existing unrelated repository.

```powershell
Set-Location 'C:\Users\feprado\Repos\copilot-kickoff-demo'
git status --short --branch
gh auth status
gh repo create OWNER/copilot-kickoff-demo --private --source=. --remote=origin --push
git push origin demo/sla-first
```

The first push publishes `main`. The second publishes the already-created local
feature branch. The repo contains no copy of the presentation deck or real records.

If authentication or organization policy blocks this, stop and use the local
fallback. Do not change tenant settings or make the repo public just for the demo.

## 3. Prepare the human-created feature PR

```powershell
gh pr create --draft --base main --head demo/sla-first --title "Add SLA-first request sorting" --body-file demo\PR-BRIEF.md
```

Open it in the browser. Confirm the three-file diff and green checks.
Request a Copilot review during rehearsal and inspect its actual comments.

For the live PR summary:

1. Edit the existing draft PR description.
2. Save its existing useful context elsewhere, then start with a blank field.
3. Use Copilot's Summary action.
4. Review the generated text, add the rationale and test evidence, then save.

The same action can be shown when creating a PR live if one is not already open.
Do not create a duplicate PR for the same branch just to match a scripted click.

## 4. Prepare a separate, real cloud-agent PR

Create an issue from [the issue brief](../demo/ISSUE-BRIEF.md):

```powershell
gh issue create --title "Add optional SLA-first request sorting" --body-file demo\ISSUE-BRIEF.md
```

From `main`, assign the issue to Copilot using the supported GitHub UI after
checking eligibility. Let the agent open **its own** draft PR on its own branch.
This intentionally parallels the prepared feature; do not merge both.

Before the presentation:

1. Inspect the agent's implementation and actual test result.
2. Comment with a specific, genuinely useful follow-up, such as missing tie,
   empty-input, or non-mutation coverage. Use the slide's `@copilot` prompt where
   appropriate; if those cases already exist, ask for a different real gap.
3. Wait for a completed response and commit, then review them.
4. Bookmark that completed activity as the slow-run fallback.
5. Keep the PR draft and unmerged for the demo.

During the talk, show the live follow-up only if time permits. If queued, show the
completed rehearsal example and label it as such. A prepared human-created branch
is not evidence that the cloud agent executed anything.

## 5. Verify the browser and CLI before going on stage

Open tabs for the repo, prepared PR, and completed real agent follow-up.
Confirm the PR Summary action and Copilot reviewer are visible.
Launch `copilot` in the repo once and finish sign-in before the event.
Do not spend the four-minute segment installing tools or authenticating.

## Local fallback without hosted features

```powershell
git --no-pager diff main...demo/sla-first -- src
npm run demo:pr
npm run check
npm run demo:baseline
```

Show the three-file diff, tests, and PR brief. Say explicitly that this is a
local walkthrough, not a live GitHub summary, review, or cloud-agent result.
Copilot service access is still required for live model/chat demonstrations.

## Official references

- [Generating a PR summary](https://docs.github.com/en/copilot/how-tos/copilot-on-github/copilot-for-github-tasks/create-a-pr-summary)
- [Using Copilot code review](https://docs.github.com/en/copilot/how-tos/use-copilot-agents/use-code-review)
- [GitHub Copilot documentation and current hosted-agent guidance](https://docs.github.com/en/copilot)
- [VS Code custom agents](https://code.visualstudio.com/docs/copilot/customization/custom-agents)
- [VS Code agent skills](https://code.visualstudio.com/docs/copilot/customization/agent-skills)
