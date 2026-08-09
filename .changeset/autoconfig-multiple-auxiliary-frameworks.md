---
"@cloudflare/autoconfig": patch
---

Discard auxiliary frameworks even when more than one of them is detected

Vite and Hono are treated as auxiliary tooling for a primary framework, and framework detection dropped them so the primary one could be returned. That only happened when exactly two known frameworks were detected, so a project that pulls in *both* — a Waku app is Vite-based and serves with Hono, and is detected as Waku + Vite + Hono — skipped the filtering entirely.

In an interactive session the result was an arbitrary pick; in CI, `wrangler setup` failed outright with `multiple frameworks were found: Waku, Vite, Hono` even though exactly one non-auxiliary framework was present.

Auxiliary frameworks are now discarded one at a time in priority order, for as long as doing so leaves at least one framework behind — so a Hono + Vite project with no primary framework still resolves to Hono.
