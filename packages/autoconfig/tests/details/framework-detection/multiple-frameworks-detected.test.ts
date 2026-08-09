import { runInTempDir, seed } from "@cloudflare/workers-utils/test-helpers";
import { afterEach, describe, it, vi } from "vitest";
import { detectFramework } from "../../../src/details/framework-detection";
import { createMockContext } from "../../helpers/mock-context";

describe("detectFramework() / multiple frameworks detected", () => {
	runInTempDir();
	const context = createMockContext();

	afterEach(() => {
		vi.unstubAllGlobals();
	});

	describe("non-CI environment", () => {
		it("returns the known framework when multiple are detected but only one is known", async ({
			expect,
		}) => {
			// gatsby is not in allKnownFrameworks, only astro is
			await seed({
				"package.json": JSON.stringify({
					dependencies: { astro: "5", gatsby: "5" },
				}),
				"package-lock.json": JSON.stringify({ lockfileVersion: 3 }),
			});

			const result = await detectFramework(process.cwd(), context);

			expect(result.detectedFramework?.framework.id).toBe("astro");
		});

		it("filters out Vite and returns the other known framework", async ({
			expect,
		}) => {
			await seed({
				"package.json": JSON.stringify({
					dependencies: { next: "14", vite: "5" },
				}),
				"package-lock.json": JSON.stringify({ lockfileVersion: 3 }),
			});

			const result = await detectFramework(process.cwd(), context);

			expect(result.detectedFramework?.framework.id).toBe("next");
		});

		it("returns Waku (not Hono) when both Waku and Hono are detected", async ({
			expect,
		}) => {
			await seed({
				"package.json": JSON.stringify({
					dependencies: { waku: "0.21", hono: "4" },
				}),
				"package-lock.json": JSON.stringify({ lockfileVersion: 3 }),
			});

			const result = await detectFramework(process.cwd(), context);

			expect(result.detectedFramework?.framework.id).toBe("waku");
		});

		it("returns Waku when Waku, Hono and Vite are all detected", async ({
			expect,
		}) => {
			// Waku is Vite-based and serves with Hono, so all three can be detected at
			// once. Two auxiliary frameworks still leave exactly one primary framework.
			await seed({
				"package.json": JSON.stringify({
					dependencies: { waku: "0.21", hono: "4", vite: "5" },
				}),
				"package-lock.json": JSON.stringify({ lockfileVersion: 3 }),
			});

			const result = await detectFramework(process.cwd(), context);

			expect(result.detectedFramework?.framework.id).toBe("waku");
		});

		it("returns Hono when only Hono and Vite are detected", async ({
			expect,
		}) => {
			// Both are auxiliary, so there is no primary framework to prefer. Discarding
			// Vite must not discard Hono as well.
			await seed({
				"package.json": JSON.stringify({
					dependencies: { hono: "4", vite: "5" },
				}),
				"package-lock.json": JSON.stringify({ lockfileVersion: 3 }),
			});

			const result = await detectFramework(process.cwd(), context);

			expect(result.detectedFramework?.framework.id).toBe("hono");
		});

		it("returns Hydrogen (not React Router) when both Hydrogen and React Router are detected", async ({
			expect,
		}) => {
			await seed({
				"package.json": JSON.stringify({
					dependencies: {
						"@shopify/hydrogen": "2024",
						"@react-router/dev": "7",
						"react-router": "7",
					},
				}),
				"package-lock.json": JSON.stringify({ lockfileVersion: 3 }),
			});

			const result = await detectFramework(process.cwd(), context);

			expect(result.detectedFramework?.framework.id).toBe("hydrogen");
		});

		it("returns first framework without throwing when multiple unknown frameworks are detected", async ({
			expect,
		}) => {
			// Both gatsby and gridsome are unknown to wrangler
			await seed({
				"package.json": JSON.stringify({
					dependencies: { gatsby: "5", gridsome: "1" },
				}),
				"package-lock.json": JSON.stringify({ lockfileVersion: 3 }),
			});

			// Should not throw even with multiple unknowns in non-CI mode
			await expect(
				detectFramework(process.cwd(), context)
			).resolves.toBeDefined();
		});
	});

	describe("CI environment", () => {
		const ciContext = createMockContext({
			isNonInteractiveOrCI: () => true,
		});

		it("throws MultipleFrameworksCIError when multiple known frameworks are detected", async ({
			expect,
		}) => {
			await seed({
				"package.json": JSON.stringify({
					dependencies: { astro: "5", nuxt: "3" },
				}),
				"package-lock.json": JSON.stringify({ lockfileVersion: 3 }),
			});

			await expect(
				detectFramework(process.cwd(), ciContext)
			).rejects.toThrowErrorMatchingInlineSnapshot(
				`
					[Error: Cloudflare's tooling was unable to automatically configure your project, since multiple frameworks were found: Astro, Nuxt.

					To fix this issue either:
					  - check your project's configuration to make sure that the target framework
					    is the only configured one and try again
					  - run \`wrangler setup\` locally to get an interactive user experience where
					    you can specify what framework you want to target
					]
				`
			);
		});

		it("does not throw when Waku, Hono and Vite are all detected", async ({
			expect,
		}) => {
			// Regression guard: a Waku project is detected as Waku + Vite + Hono, which
			// used to skip auxiliary-framework filtering entirely and hard-fail in CI.
			await seed({
				"package.json": JSON.stringify({
					dependencies: { waku: "0.21", hono: "4", vite: "5" },
				}),
				"package-lock.json": JSON.stringify({ lockfileVersion: 3 }),
			});

			const result = await detectFramework(process.cwd(), ciContext);

			expect(result.detectedFramework?.framework.id).toBe("waku");
		});

		it("throws MultipleFrameworksCIError when multiple unknown frameworks are detected", async ({
			expect,
		}) => {
			await seed({
				"package.json": JSON.stringify({
					dependencies: { gatsby: "5", gridsome: "1" },
				}),
				"package-lock.json": JSON.stringify({ lockfileVersion: 3 }),
			});

			await expect(detectFramework(process.cwd(), ciContext)).rejects.toThrow(
				/Cloudflare's tooling was unable to automatically configure your project, since multiple frameworks were found/
			);
		});

		it("does not throw when Hydrogen and React Router are detected (Hydrogen is selected)", async ({
			expect,
		}) => {
			await seed({
				"package.json": JSON.stringify({
					dependencies: {
						"@shopify/hydrogen": "2024",
						"@react-router/dev": "7",
						"react-router": "7",
					},
				}),
				"package-lock.json": JSON.stringify({ lockfileVersion: 3 }),
			});

			const result = await detectFramework(process.cwd(), ciContext);

			expect(result.detectedFramework?.framework.id).toBe("hydrogen");
		});

		it("does not throw when Vite and another known framework are detected (Vite is filtered out)", async ({
			expect,
		}) => {
			await seed({
				"package.json": JSON.stringify({
					dependencies: { astro: "5", vite: "5" },
				}),
				"package-lock.json": JSON.stringify({ lockfileVersion: 3 }),
			});

			const result = await detectFramework(process.cwd(), ciContext);

			expect(result.detectedFramework?.framework.id).toBe("astro");
		});

		it("does not throw when Hono and another known framework are detected (Hono is filtered out)", async ({
			expect,
		}) => {
			await seed({
				"package.json": JSON.stringify({
					dependencies: { "@tanstack/react-start": "1.132.0", hono: "4" },
				}),
				"package-lock.json": JSON.stringify({ lockfileVersion: 3 }),
			});

			const result = await detectFramework(process.cwd(), ciContext);

			expect(result.detectedFramework?.framework.id).toBe("tanstack-start");
		});
	});
});
