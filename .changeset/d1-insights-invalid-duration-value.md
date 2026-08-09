---
"wrangler": patch
---

Report an invalid `d1 insights --time-period` value as a user error

`getDurationDates()` validated the duration *unit* and the per-unit maximum, but never checked that the numeric part was a positive number. `--time-period` is a plain string option with no `choices`, so a typo such as `--time-period=xd` parsed to `NaN`, passed every `> maximum` bounds check (`NaN > 31` is `false`), and only failed at `startDate.toISOString()` with a bare `RangeError: Invalid time value` — which wrangler surfaces as an internal error inviting the user to file a bug.

A negative value such as `-5d` passed the same checks and silently produced a start date *after* the end date.

Both now raise a `UserError` in the same voice as the neighbouring unit and maximum errors.
