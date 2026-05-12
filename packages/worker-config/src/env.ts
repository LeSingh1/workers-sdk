/**
 * Mapping from binding type literals to Cloudflare runtime types.
 * These types are assumed to be ambient.
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
type InferBindingType<TBinding> =
	// JSON bindings: infer exact type from value
	TBinding extends { type: "json"; value: infer TValue }
		? TValue
		: // Text bindings: infer literal string type from value
			TBinding extends { type: "text"; value: infer TValue }
			? TValue
			: // Unsafe bindings: map to any
				TBinding extends { type: `unsafe-${string}` }
				? any
				: // Standard bindings: lookup in BindingTypeMap
					TBinding extends { type: infer K extends keyof BindingTypeMap }
					? BindingTypeMap[K]
					: never;

/**
 * Unwrap function and promise types to get the underlying config.
 */
type UnwrapConfig<TConfig> =
	// If it's a function, extract return type and recurse
	TConfig extends (...args: any[]) => infer TReturn
		? UnwrapConfig<TReturn>
		: // If it's a promise, extract the resolved type
			TConfig extends Promise<infer TCompletion>
			? TCompletion
			: // Otherwise, it's the config itself
				TConfig;

/**
 * Infer the `Env` interface type from a Worker config.
 *
 * This utility type transforms a config object's `env` bindings into their
 * corresponding Cloudflare runtime types.
 *
 * @example
 * ```typescript
 * import { defineConfig } from "@cloudflare/worker-config";
 * import type { InferEnv } from "@cloudflare/worker-config";
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
export type InferEnv<TConfig> = UnwrapConfig<TConfig> extends {
	env: infer TEnv extends Record<string, unknown>;
}
	? { [K in keyof TEnv]: InferBindingType<TEnv[K]> }
	: {};
