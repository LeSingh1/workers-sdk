import { defineConfig, type Bindings } from "@cloudflare/worker-config";
import * as WorkerB from "./src" with { type: "cf-worker" };
import type WorkerAConfig from "../worker-a/worker.config";

export default defineConfig({
	name: "worker-b",
	entrypoint: WorkerB,
	env: (bindings: Bindings<typeof WorkerAConfig>) => ({
		// Type-safe cross-worker bindings to worker-a
		// workerName is constrained to "worker-a"
		WORKER_A: bindings.worker({
			workerName: "worker-a",
			exportName: "MyEntrypoint",
		}),

		// Type-safe: exportName is constrained to WorkerEntrypoint exports
		WORKER_A_ENTRYPOINT: bindings.worker({
			workerName: "worker-a",
			exportName: "MyEntrypoint",
		}),

		// Type-safe: exportName is constrained to durable-object exports
		MY_DO: bindings.durableObject({
			workerName: "worker-a",
			exportName: "MyDurableObject",
			// exportName: "MyDurableObject",
		}),

		// Loosely typed: unknown worker (fallback)
		EXTERNAL_SERVICE: bindings.worker({ workerName: "external-service" }),

		// Regular bindings still work
		MY_KV: bindings.kv(),
		MY_DB: bindings.d1(),
	}),
});
