# Prepared review finding

**This is a human-authored teaching note, not a Copilot review transcript.**

## Set up the harmless regression

On clean `main`:

```powershell
npm run demo:bug
git --no-pager diff -- src\domain\triage.ts
npm test
```

The prepared change replaces:

```typescript
if (deadline <= now.getTime()) return 'overdue'
```

with:

```typescript
if (deadline < now.getTime()) return 'overdue'
```

## Expected finding

At **exactly** the deadline the strict comparison is false. The next comparison
returns `due-soon`, violating the team's rule that a request is overdue *at or
after* its deadline. This also undercounts overdue work in the dashboard.

Use synthetic request **SR-1043**:

- Created: 2026-10-29 10:00 UTC.
- Priority: high; sample target is four hours.
- Deadline: 2026-10-29 14:00 UTC.
- Demo clock: exactly 2026-10-29 14:00 UTC.
- Correct status: overdue.
- Buggy status: due soon.

The baseline's exact-deadline assertion and fixed-dashboard-totals assertion fail.
The Past SLA card changes from **02** to **01**. The domain tests are the
deterministic evidence even if the live AI review misses the issue.

## Human-reviewed fix

Restore the inclusive `<=` comparison, then run `npm run check`.
Alternatively, use `npm run demo:baseline` to reverse the known prepared snippet.
The baseline should be fully green before switching to the customization demo.

Do not commit, push, or merge the intentionally broken scenario. It is a local
logic regression on fake records, not a deliberately exploitable security demo.
