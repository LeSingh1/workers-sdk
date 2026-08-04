---
"@cloudflare/workers-utils": patch
---

Validate `send_email` allowed address lists as arrays of strings

`send_email[].allowed_destination_addresses` and `send_email[].allowed_sender_addresses` were only checked with a `typeof === "object"` test, so `{ "a": 1 }`, `[1, 2, 3]` and `null` all passed validation and were forwarded to the API verbatim, producing a confusing upload failure instead of a config error.

They are now validated as arrays of strings, which is what the existing error message (`should, optionally, have a []string ... field`) already promised.
