---
"wrangler": patch
---

Honour `--enable-containers` when resolving the container engine in `wrangler dev`

The container engine was resolved from `dev.enable_containers` in the config file alone, ignoring the `--enable-containers` flag. Enabling containers with `wrangler dev --enable-containers` over a config that sets `"enable_containers": false` still started the containers, but left the container engine unset — so `dev.container_engine`, `WRANGLER_DOCKER_HOST`, `DOCKER_HOST` and the active `docker context` were all skipped in favour of the hardcoded platform default socket. Conversely, `--enable-containers=false` still ran a `docker context ls` on every config load.

The flag now takes precedence over the config value, as it already did for the rest of the container options.
