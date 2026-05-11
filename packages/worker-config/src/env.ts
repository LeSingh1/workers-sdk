/**
 * Mapping from binding type literals to Cloudflare runtime types.
 * These types are assumed to be ambient from @cloudflare/workers-types.
 */
type BindingTypeMap = {
	ai: Ai;
	"ai-search": AiSearchInstance;
	"ai-search-namespace": AiSearchNamespace;
	"analytics-engine-dataset": AnalyticsEngineDataset;
	artifacts: Artifacts;
	assets: Fetcher;
	browser: Fetcher;
	d1: D1Database;
	"dispatch-namespace": DispatchNamespace;
	"durable-object": DurableObjectNamespace;
	flagship: Flagship;
	hyperdrive: Hyperdrive;
	images: ImagesBinding;
	kv: KVNamespace;
	logfwdr: any;
	media: MediaBinding;
	"mtls-certificate": Fetcher;
	pipeline: any; // Pipeline type is in cloudflare:pipelines module, not global
	queue: Queue;
	"rate-limit": RateLimit;
	r2: R2Bucket;
	secret: string;
	"secrets-store-secret": SecretsStoreSecret;
	"send-email": SendEmail;
	stream: StreamBinding;
	vectorize: VectorizeIndex;
	"version-metadata": WorkerVersionMetadata;
	"vpc-service": Fetcher;
	"vpc-network": Fetcher;
	worker: Fetcher;
	"worker-loader": WorkerLoader;
	workflow: Workflow;
};

/**
 * Infer the runtime type for a single binding definition.
 */
type InferBindingType<B> =
	// JSON bindings: infer exact type from value
	B extends { type: "json"; value: infer V }
		? V
		: // Text bindings: infer literal string type from value
			B extends { type: "text"; value: infer V }
			? V
			: // Unsafe bindings: map to any
				B extends { type: `unsafe-${string}` }
				? any
				: // Standard bindings: lookup in BindingTypeMap
					B extends { type: infer T extends keyof BindingTypeMap }
					? BindingTypeMap[T]
					: never;

/**
 * Unwrap function and promise types to get the underlying config.
 */
type UnwrapConfig<C> =
	// If it's a function, extract return type and recurse
	C extends (...args: any[]) => infer R
		? UnwrapConfig<R>
		: // If it's a promise, extract the resolved type
			C extends Promise<infer R>
			? R
			: // Otherwise, it's the config itself
				C;

/**
 * Infer the `Env` interface type from a worker config.
 *
 * This utility type transforms a config object's `env` bindings into their
 * corresponding Cloudflare runtime types.
 *
 * @example
 * ```typescript
 * import { defineConfig, type InferEnv } from "@cloudflare/worker-config";
 *
 * const config = defineConfig({
 *   env: {
 *     MY_KV: { type: "kv" },
 *     MY_DB: { type: "d1" },
 *     CONFIG: { type: "json", value: { debug: true } },
 *   },
 * });
 *
 * // Inferred as: { MY_KV: KVNamespace; MY_DB: D1Database; CONFIG: { debug: boolean } }
 * export type Env = InferEnv<typeof config>;
 * ```
 */
export type InferEnv<C> = UnwrapConfig<C> extends {
	env: infer E extends Record<string, unknown>;
}
	? { [K in keyof E]: InferBindingType<E[K]> }
	: {};
