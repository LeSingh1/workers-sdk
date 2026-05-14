/**
 * Default module type representing an unknown worker's exports.
 * - default export can be ExportedHandler or a WorkerEntrypoint class
 * - named exports can be WorkerEntrypoint, DurableObject, or WorkflowEntrypoint classes
 */
interface DefaultModule {
	default: ExportedHandler | Rpc.WorkerEntrypointBranded;
	[key: string]:
		| Rpc.WorkerEntrypointBranded
		| Rpc.DurableObjectBranded
		| Rpc.WorkflowEntrypointBranded
		| unknown;
}

/**
 * Default config type representing an unknown worker.
 * Used as the fallback when no specific config is provided to Bindings.
 */
interface DefaultConfig {
	name: string;
	entrypoint: DefaultModule;
	exports?: Record<string, { type: string }>;
}

// Export DefaultConfig for internal use (Bindings default type parameter)
export type { DefaultConfig };

/**
 * Mapping from binding type literals to Cloudflare runtime types.
 * These types are assumed to be ambient.
 */
interface BindingTypeMap {
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
	pipeline: any; // TODO: Wrangler's type generation fetches the pipeline schema from the API
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
}

/**
 * Infer the runtime type for a single binding definition.
 */
/**
 * Helper to cast a type to satisfy Service's constraint.
 * This is needed because Service<T> has a constraint on T.
 */
type AsServiceType<T> = T extends
	| Rpc.WorkerEntrypointBranded
	| (new (...args: any[]) => Rpc.WorkerEntrypointBranded)
	| ExportedHandler
	| undefined
	? T
	: any;

/**
 * Helper to cast a type to satisfy DurableObjectNamespace's constraint.
 */
type AsDurableObjectType<T> = T extends Rpc.DurableObjectBranded | undefined
	? T
	: any;

type InferBindingType<TBinding> =
	// Typed worker binding (from TypedBindings)
	TBinding extends {
		type: "worker";
		__typed: true;
		__config: infer TConfig;
		exportName?: infer TExport extends string;
	}
		? InferMainModule<TConfig> extends infer TModule extends Record<
				string,
				unknown
			>
			? TExport extends keyof TModule
				? Service<AsServiceType<TModule[TExport]>>
				: TModule extends { default: infer TDefault }
					? Service<AsServiceType<TDefault>>
					: Fetcher
			: Fetcher
		: // Typed durable object binding (from TypedBindings)
			TBinding extends {
					type: "durable-object";
					__typed: true;
					__config: infer TConfig;
					exportName: infer TExport extends string;
				}
			? InferMainModule<TConfig> extends infer TModule extends Record<
					string,
					unknown
				>
				? TExport extends keyof TModule
					? DurableObjectNamespace<AsDurableObjectType<TModule[TExport]>>
					: DurableObjectNamespace
				: DurableObjectNamespace
			: // Typed workflow binding (from TypedBindings)
				TBinding extends {
						type: "workflow";
						__typed: true;
						__config: infer TConfig;
						exportName: infer TExport extends string;
					}
				? InferMainModule<TConfig> extends infer TModule extends Record<
						string,
						unknown
					>
					? TExport extends keyof TModule
						? TModule[TExport] extends {
								run(event: { payload: infer P }, step: any): any;
							}
							? Workflow<P>
							: Workflow
						: Workflow
					: Workflow
				: // JSON bindings: infer exact type from value
					TBinding extends { type: "json"; value: infer TValue }
					? TValue
					: // Text bindings: infer literal string type from value
						TBinding extends { type: "text"; value: infer TValue }
						? TValue
						: // Unsafe bindings: map to any
							// TODO: support more precise unsafe types
							TBinding extends { type: `unsafe-${string}` }
							? any
							: // Standard bindings: lookup in BindingTypeMap
								TBinding extends {
										type: infer K extends keyof BindingTypeMap;
									}
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
 *   env: (bindings) => ({
 *     MY_KV: bindings.kv(),
 *     MY_DB: bindings.d1(),
 *     CONFIG: bindings.json({ debug: true }),
 *   }),
 * });
 *
 * // Inferred as: { MY_KV: KVNamespace; MY_DB: D1Database; CONFIG: { debug: boolean } }
 * export type Env = InferEnv<typeof config>;
 * ```
 */
export type InferEnv<TConfig> =
	UnwrapConfig<TConfig> extends {
		env: (bindings: any) => infer TEnv extends Record<string, unknown>;
	}
		? { [K in keyof TEnv]: InferBindingType<TEnv[K]> }
		: {};

/**
 * Infer the durable namespace names from a Worker config's exports.
 * Returns a union of export names that have `type: "durable-object"`.
 *
 * @example
 * ```typescript
 * import { defineConfig } from "@cloudflare/worker-config";
 * import type { InferDurableNamespaces } from "@cloudflare/worker-config";
 *
 * const config = defineConfig({
 *   exports: {
 *     MyDurableObject: { type: "durable-object", storage: "sqlite" },
 *     MyWorkflow: { type: "workflow", name: "my-workflow" },
 *   },
 * });
 *
 * // Inferred as: "MyDurableObject"
 * type DurableNamespaces = InferDurableNamespaces<typeof config>;
 * ```
 */
export type InferDurableNamespaces<TConfig> =
	UnwrapConfig<TConfig> extends {
		exports: infer TExports extends Record<string, { type: string }>;
	}
		? {
				[K in keyof TExports]: TExports[K] extends { type: "durable-object" }
					? K
					: never;
			}[keyof TExports]
		: never;

/**
 * Infer the main module type from a Worker config's entrypoint.
 * If entrypoint is a module namespace object, returns that type.
 * If entrypoint is a string or not present, returns DefaultModule as fallback.
 *
 * @example
 * ```typescript
 * import * as Worker from './src' with { type: 'cf-worker' }
 * import { defineConfig } from "@cloudflare/worker-config";
 * import type { InferMainModule } from "@cloudflare/worker-config";
 *
 * const config = defineConfig({
 *   entrypoint: Worker,
 * });
 *
 * // Inferred as: typeof Worker (the module's exports)
 * type MainModule = InferMainModule<typeof config>;
 * ```
 */
export type InferMainModule<TConfig> =
	UnwrapConfig<TConfig> extends { entrypoint: infer TModule }
		? TModule extends string
			? DefaultModule
			: TModule extends Record<string, unknown>
				? TModule
				: DefaultModule
		: DefaultModule;

/**
 * Infer the worker name from a config.
 *
 * @example
 * ```typescript
 * const config = defineConfig({ name: "my-worker", ... });
 * type Name = InferWorkerName<typeof config>; // "my-worker"
 * ```
 */
export type InferWorkerName<TConfig> =
	UnwrapConfig<TConfig> extends { name: infer TName extends string }
		? TName
		: never;

/**
 * Infer durable object export names from a config's exports.
 * Returns a union of export names that have `type: "durable-object"`.
 */
export type InferDurableObjectExports<TConfig> =
	UnwrapConfig<TConfig> extends {
		exports: infer TExports extends Record<string, { type: string }>;
	}
		? {
				[K in keyof TExports]: TExports[K] extends { type: "durable-object" }
					? K & string
					: never;
			}[keyof TExports]
		: never;

/**
 * Infer workflow export names from a config's exports.
 * Returns a union of export names that have `type: "workflow"`.
 */
export type InferWorkflowExports<TConfig> =
	UnwrapConfig<TConfig> extends {
		exports: infer TExports extends Record<string, { type: string }>;
	}
		? {
				[K in keyof TExports]: TExports[K] extends { type: "workflow" }
					? K & string
					: never;
			}[keyof TExports]
		: never;

/**
 * Infer WorkerEntrypoint export names from a config.
 * Returns "default" plus module exports that are NOT declared in config.exports
 * (since config.exports contains DurableObjects and Workflows, not entrypoints).
 */
export type InferEntrypointExports<TConfig> =
	| "default"
	| Exclude<
			keyof InferMainModule<TConfig> & string,
			keyof (UnwrapConfig<TConfig> extends { exports: infer E } ? E : {})
	  >;
