---
"miniflare": patch
---

Make `Miniflare#dispose()` idempotent

A second `dispose()` rejected with `ERR_SERVER_NOT_RUNNING` ("Server is not running.") because two of its cleanup steps close an HTTP server that the first call had already closed: the loopback server, and the inspector proxy server when one is running.

Both rejections escape `dispose()` part-way through, so the steps after them are skipped. Stopping the loopback server happens early, which abandons the inspector proxy server, the dev registry watcher and its registration files, the Hyperdrive proxy servers, and the instance registry entry.

Closing an already-closed server is not a failure to close it, so both call sites now treat `ERR_SERVER_NOT_RUNNING` as success.
