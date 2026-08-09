---
"wrangler": patch
---

Make `wrangler rollback --yes` actually skip the prompts

`rollback` declared a `--yes` / `-y` option described as "Automatically accept defaults to prompts", but `args.yes` was never read. Both the rollback-message prompt and the "deploy this Worker Version to 100% of traffic?" confirmation were asked regardless, so the flag did nothing in an interactive terminal and `--message` was still overridable by hand at the prompt.

Both now take their default when `--yes` is passed, matching the option's description and the `acceptPromptDefaults` handling in `wrangler versions deploy`.

The separate confirmation shown when secrets have changed since the target version is deliberately left interactive.
