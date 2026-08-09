---
"wrangler": patch
---

Stop `.env` loading on Windows producing two entries for one variable

`caseInsensitiveEnv()` tracks the casing each variable was stored under so it can be read back under any casing. Writing the same variable under a *different* casing re-pointed that tracking at the new key but left the old key on the target object. The proxy has no `ownKeys` trap, so the stale key stayed enumerable: `Object.keys()`, `Object.entries()` and spreading all reported the variable twice, both copies resolving to the newer value.

`loadDotEnv()` returns exactly such an object on Windows, after `Object.assign`-ing `process.env` and then expanding the `.env` files over it. A variable present in the environment as `Path` and in a `.env` file as `PATH` therefore came back as two separate entries.

`delete` had the mirror problem: deleting under a casing other than the stored one dropped the tracking but left the key on the target, still enumerable, while every other trap reported it as absent.
