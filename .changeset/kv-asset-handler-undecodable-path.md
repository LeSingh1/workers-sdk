---
"@cloudflare/kv-asset-handler": patch
---

Throw `NotFoundError`, not `URIError`, for a path with a malformed percent-escape

`getAssetFromKV()` calls `decodeURIComponent()` on the request path to look it up in the asset manifest. A lone `%` is a legal path character but a malformed escape sequence, so `decodeURIComponent` throws `URIError: URI malformed` — a type outside the package's documented error contract of `NotFoundError` / `MethodNotAllowedError` / `InternalError`.

A request for `/%not-in-my-manifest.html` therefore escaped the `catch (e) { if (e instanceof NotFoundError) ... }` that callers use to serve a 404, and became a 500.

An undecodable path cannot match a manifest entry, so all three decode sites now fall back to the raw value and let the normal lookup miss raise `NotFoundError`.
