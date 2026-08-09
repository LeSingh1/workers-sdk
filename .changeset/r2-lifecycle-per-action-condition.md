---
"wrangler": patch
---

Use each action's own condition in `r2 bucket lifecycle add`

When a rule combined more than one action, every action's condition was read from the same fixed priority chain — `--expire-days`, then `--ia-transition-days`, then `--expire-date`, then `--ia-transition-date` — regardless of which action was being built.

So `--expire-days 90 --ia-transition-days 30` produced a rule that transitioned objects to Infrequent Access at 90 days and deleted them at 90 days: the transition landed on the deletion day and never saved anything. Mixing units was worse — `--expire-date 2026-12-31 --ia-transition-days 30` expired objects after 30 days, because the expiry action fell through to the transition's day count.

Each action now reads its own `--*-days` / `--*-date` pair.
