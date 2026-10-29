## Why

Priority alone does not tell a team which request is closest to missing its SLA.
Offer an optional deadline-based sort without changing the existing default.

## What changed

- A shared "SLA deadline first" option, consumed by the existing UI.
- Active requests before resolved requests.
- Earlier deadlines first, with priority, creation time, and ID tie-breaks.
- Focused coverage for ordering, resolved requests, ties, empty input, and input immutability.

## Verification

Run `npm run check` and record its actual result before publishing.
The prepared feature has 45 tests. Choose SLA deadline first in the UI;
the first active request should be SR-1042.

This is a human-prepared demo checkpoint, not a generated Copilot summary.
