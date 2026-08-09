import { describe, it } from "vitest";
import { caseInsensitiveEnv } from "../../config/case-insensitive-env";

describe("caseInsensitiveEnv()", () => {
	it("reads back a value under any casing", ({ expect }) => {
		const env = caseInsensitiveEnv();
		env.Path = "a";

		expect(env.Path).toBe("a");
		expect(env.PATH).toBe("a");
		expect(env.path).toBe("a");
		expect("PATH" in env).toBe(true);
	});

	it("keeps a single entry when a variable is re-set under a different casing", ({
		expect,
	}) => {
		const env = caseInsensitiveEnv();
		env.Path = "a";
		env.PATH = "b";

		// The proxy has no `ownKeys` trap, so a key left on the target stays
		// enumerable. Both keys would then survive, each resolving to "b", and the
		// object returned by `loadDotEnv()` would carry the variable twice.
		expect(Object.keys(env)).toEqual(["PATH"]);
		expect({ ...env }).toEqual({ PATH: "b" });
		expect(env.Path).toBe("b");
	});

	it("removes the stored entry when deleted under a different casing", ({
		expect,
	}) => {
		const env = caseInsensitiveEnv();
		env.Path = "a";
		delete env.PATH;

		expect("Path" in env).toBe(false);
		expect(env.Path).toBeUndefined();
		expect(Object.keys(env)).toEqual([]);
		expect({ ...env }).toEqual({});
	});
});
