# ServiceDesk Lite edge cases

| Area | Required behavior |
|---|---|
| Deadline | `now >= deadline` is overdue. |
| Warning | Positive time remaining up to and including one hour is due soon. |
| Resolution | Resolved work is excluded from active, overdue, and critical totals. |
| Priority | Sample targets are critical 1h, high 4h, normal 24h, low 72h. |
| Clock | Pass a fixed UTC timestamp; do not depend on the machine clock. |
| Priority sort | Higher priority first; equal priority uses oldest creation time, then ID. |
| Newest sort | Newer creation time first, then ID. |
| SLA sort, if added | Active work before resolved; earlier deadlines first; ties use priority, then creation time and ID. |
| Input arrays | Filtering and sorting must not mutate them. |
| Empty data | An empty queue has zero totals and no sorting/filtering errors. |
| Search | Match title, ID, and category; trim whitespace and ignore case. |

Useful additions during the demo: one millisecond before and after the deadline
and warning threshold. The baseline already covers exact equality.

These are synthetic teaching rules, not a real service-level agreement.
