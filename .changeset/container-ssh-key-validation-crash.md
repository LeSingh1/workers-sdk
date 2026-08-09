---
"@cloudflare/workers-utils": patch
---

Report malformed container SSH key entries as config errors instead of crashing

`containers[].authorized_keys` and `containers[].trusted_user_ca_keys` were validated by pushing a diagnostic when `public_key` was missing or not a string, and then unconditionally calling `key.public_key.toLowerCase()` on that same entry. Every shape the code had just diagnosed threw a `TypeError` out of `normalizeAndValidateConfig()` before the diagnostics could be rendered — and `readConfig()` does not catch it, so it surfaced as an internal error with a "please report this bug" banner rather than as a config error.

Entries that are not objects at all (a bare key string, `null`, a number) additionally threw `TypeError: Cannot use 'in' operator to search for 'name' in ...` from the `name` check.

Both lists now skip non-object entries with an error, and only run the ED25519 key-type check once `public_key` is known to be a string.
