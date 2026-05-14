/**
 * Binding option types - TypeScript interfaces for each binding's configuration options.
 */

interface AiBindingOptions {
	remote?: boolean;
}

interface AiSearchBindingOptions {
	name: string;
	remote?: boolean;
}

interface AiSearchNamespaceBindingOptions {
	namespace: string;
	remote?: boolean;
}

interface AnalyticsEngineDatasetBindingOptions {
	name?: string;
}

interface ArtifactsBindingOptions {
	namespace: string;
	remote?: boolean;
}

interface BrowserBindingOptions {
	remote?: boolean;
}

interface D1BindingOptions {
	id?: string;
	name?: string;
	remote?: boolean;
}

interface DispatchNamespaceBindingOptions {
	namespace: string;
	outbound?: {
		workerName: string;
		parameters?: string[];
	};
	remote?: boolean;
}

interface DurableObjectBindingOptions {
	workerName: string;
	exportName: string;
}

interface FlagshipBindingOptions {
	id: string;
	remote?: boolean;
}

interface HyperdriveBindingOptions {
	id: string;
	localConnectionString?: string;
}

interface ImagesBindingOptions {
	remote?: boolean;
}

interface KvBindingOptions {
	id?: string;
	name?: string;
	remote?: boolean;
}

interface LogfwdrBindingOptions {
	destination: string;
}

interface MediaBindingOptions {
	remote?: boolean;
}

interface MtlsCertificateBindingOptions {
	id: string;
	remote?: boolean;
}

interface PipelineBindingOptions {
	name: string;
	remote?: boolean;
}

interface QueueBindingOptions {
	name: string;
	deliveryDelay?: number;
	remote?: boolean;
}

interface RateLimitBindingOptions {
	namespace: string;
	simple: {
		limit: number;
		period: 10 | 60;
	};
}

interface R2BindingOptions {
	name?: string;
	jurisdiction?: string;
	remote?: boolean;
}

interface SecretsStoreSecretBindingOptions {
	storeId: string;
	name: string;
}

interface SendEmailBindingOptions {
	destinationAddress?: string;
	allowedDestinationAddresses?: string[];
	allowedSenderAddresses?: string[];
	remote?: boolean;
}

interface StreamBindingOptions {
	remote?: boolean;
}

interface VectorizeBindingOptions {
	name: string;
	remote?: boolean;
}

interface VpcServiceBindingOptions {
	id: string;
	remote?: boolean;
}

type VpcNetworkBindingOptions =
	| { tunnelId: string; remote?: boolean }
	| { networkId: string; remote?: boolean };

interface WorkerBindingOptions {
	workerName: string;
	exportName?: string;
	props?: Record<string, unknown>;
	remote?: boolean;
}

interface WorkflowBindingOptions {
	workerName: string;
	exportName: string;
	remote?: boolean;
}

/**
 * Binding return types - What each builder method returns (includes the type discriminator).
 */

interface AiBinding extends AiBindingOptions {
	type: "ai";
}

interface AiSearchBinding extends AiSearchBindingOptions {
	type: "ai-search";
}

interface AiSearchNamespaceBinding extends AiSearchNamespaceBindingOptions {
	type: "ai-search-namespace";
}

interface AnalyticsEngineDatasetBinding extends AnalyticsEngineDatasetBindingOptions {
	type: "analytics-engine-dataset";
}

interface ArtifactsBinding extends ArtifactsBindingOptions {
	type: "artifacts";
}

interface AssetsBinding {
	type: "assets";
}

interface BrowserBinding extends BrowserBindingOptions {
	type: "browser";
}

interface D1Binding extends D1BindingOptions {
	type: "d1";
}

interface DispatchNamespaceBinding extends DispatchNamespaceBindingOptions {
	type: "dispatch-namespace";
}

interface DurableObjectBinding extends DurableObjectBindingOptions {
	type: "durable-object";
}

interface FlagshipBinding extends FlagshipBindingOptions {
	type: "flagship";
}

interface HyperdriveBinding extends HyperdriveBindingOptions {
	type: "hyperdrive";
}

interface ImagesBinding extends ImagesBindingOptions {
	type: "images";
}

interface JsonBinding<T> {
	type: "json";
	value: T;
}

interface KvBinding extends KvBindingOptions {
	type: "kv";
}

interface LogfwdrBinding extends LogfwdrBindingOptions {
	type: "logfwdr";
}

interface MediaBinding extends MediaBindingOptions {
	type: "media";
}

interface MtlsCertificateBinding extends MtlsCertificateBindingOptions {
	type: "mtls-certificate";
}

interface PipelineBinding extends PipelineBindingOptions {
	type: "pipeline";
}

interface QueueBinding extends QueueBindingOptions {
	type: "queue";
}

interface RateLimitBinding extends RateLimitBindingOptions {
	type: "rate-limit";
}

interface R2Binding extends R2BindingOptions {
	type: "r2";
}

interface SecretBinding {
	type: "secret";
}

interface SecretsStoreSecretBinding extends SecretsStoreSecretBindingOptions {
	type: "secrets-store-secret";
}

interface SendEmailBinding extends SendEmailBindingOptions {
	type: "send-email";
}

interface StreamBinding extends StreamBindingOptions {
	type: "stream";
}

interface TextBinding<T extends string> {
	type: "text";
	value: T;
}

interface UnsafeBinding<T extends `unsafe-${string}`> {
	type: T;
}

interface VectorizeBinding extends VectorizeBindingOptions {
	type: "vectorize";
}

interface VersionMetadataBinding {
	type: "version-metadata";
}

interface VpcServiceBinding extends VpcServiceBindingOptions {
	type: "vpc-service";
}

type VpcNetworkBinding = VpcNetworkBindingOptions & {
	type: "vpc-network";
};

interface WorkerBinding extends WorkerBindingOptions {
	type: "worker";
}

interface WorkerLoaderBinding {
	type: "worker-loader";
}

interface WorkflowBinding extends WorkflowBindingOptions {
	type: "workflow";
}

/**
 * Base bindings interface - provides typed builder methods for non-cross-worker binding types.
 * This is used internally and extended by Bindings<TConfigs>.
 */
interface BaseBindings {
	// Value-first bindings
	text<T extends string>(value: T): TextBinding<T>;
	json<T>(value: T): JsonBinding<T>;

	// No-argument or optional-argument bindings
	ai(options?: AiBindingOptions): AiBinding;
	aiSearch(options: AiSearchBindingOptions): AiSearchBinding;
	aiSearchNamespace(
		options: AiSearchNamespaceBindingOptions
	): AiSearchNamespaceBinding;
	analyticsEngineDataset(
		options?: AnalyticsEngineDatasetBindingOptions
	): AnalyticsEngineDatasetBinding;
	artifacts(options: ArtifactsBindingOptions): ArtifactsBinding;
	assets(): AssetsBinding;
	browser(options?: BrowserBindingOptions): BrowserBinding;
	d1(options?: D1BindingOptions): D1Binding;
	dispatchNamespace(
		options: DispatchNamespaceBindingOptions
	): DispatchNamespaceBinding;
	flagship(options: FlagshipBindingOptions): FlagshipBinding;
	hyperdrive(options: HyperdriveBindingOptions): HyperdriveBinding;
	images(options?: ImagesBindingOptions): ImagesBinding;
	kv(options?: KvBindingOptions): KvBinding;
	logfwdr(options: LogfwdrBindingOptions): LogfwdrBinding;
	media(options?: MediaBindingOptions): MediaBinding;
	mtlsCertificate(
		options: MtlsCertificateBindingOptions
	): MtlsCertificateBinding;
	pipeline(options: PipelineBindingOptions): PipelineBinding;
	queue(options: QueueBindingOptions): QueueBinding;
	rateLimit(options: RateLimitBindingOptions): RateLimitBinding;
	r2(options?: R2BindingOptions): R2Binding;
	secret(): SecretBinding;
	secretsStoreSecret(
		options: SecretsStoreSecretBindingOptions
	): SecretsStoreSecretBinding;
	sendEmail(options?: SendEmailBindingOptions): SendEmailBinding;
	stream(options?: StreamBindingOptions): StreamBinding;
	unsafe<T extends `unsafe-${string}`>(type: T): UnsafeBinding<T>;
	vectorize(options: VectorizeBindingOptions): VectorizeBinding;
	versionMetadata(): VersionMetadataBinding;
	vpcService(options: VpcServiceBindingOptions): VpcServiceBinding;
	vpcNetwork(options: VpcNetworkBindingOptions): VpcNetworkBinding;
	workerLoader(): WorkerLoaderBinding;
}

/**
 * Typed binding return types for cross-worker bindings.
 * These include a `__typed` marker and `__config` to carry type information
 * for InferBindingType to extract the correct runtime types.
 */

interface TypedWorkerBinding<
	TConfig,
	TName extends string,
	TExport extends string,
> {
	type: "worker";
	workerName: TName;
	exportName?: TExport;
	props?: Record<string, unknown>;
	remote?: boolean;
	/** @internal Type marker for typed bindings */
	__typed: true;
	/** @internal Carries the config type for inference */
	__config: TConfig;
}

interface TypedDurableObjectBinding<
	TConfig,
	TName extends string,
	TExport extends string,
> {
	type: "durable-object";
	workerName: TName;
	exportName: TExport;
	/** @internal Type marker for typed bindings */
	__typed: true;
	/** @internal Carries the config type for inference */
	__config: TConfig;
}

interface TypedWorkflowBinding<
	TConfig,
	TName extends string,
	TExport extends string,
> {
	type: "workflow";
	workerName: TName;
	exportName: TExport;
	remote?: boolean;
	/** @internal Type marker for typed bindings */
	__typed: true;
	/** @internal Carries the config type for inference */
	__config: TConfig;
}

/**
 * Import type utilities from env.ts for use in Bindings.
 */
import type {
	DefaultConfig,
	InferWorkerName,
	InferDurableObjectExports,
	InferWorkflowExports,
	InferEntrypointExports,
} from "./env";

/**
 * Helper to unwrap config (mirrors the one in env.ts).
 */
type UnwrapConfig<TConfig> = TConfig extends (...args: any[]) => infer TReturn
	? UnwrapConfig<TReturn>
	: TConfig extends Promise<infer TCompletion>
		? TCompletion
		: TConfig;

/**
 * TypedBindings interface for cross-worker bindings with type safety.
 *
 * When you annotate the bindings parameter with `TypedBindings<WorkerConfig>`,
 * the `worker`, `durableObject`, and `workflow` methods become type-safe:
 * - `workerName` is constrained to the `name` from the config(s)
 * - `exportName` is constrained to valid exports for that worker
 * - The resulting binding types are fully parameterized
 *
 * Unknown worker names (not matching any config) fall back to loosely-typed bindings.
 *
 * @example
 * ```typescript
 * import type WorkerAConfig from "../worker-a/worker.config";
 * import { defineConfig, type TypedBindings } from "@cloudflare/worker-config";
 *
 * export default defineConfig({
 *   env: (bindings: TypedBindings<WorkerAConfig>) => ({
 *     // Type-safe: workerName must be "worker-a"
 *     WORKER_A: bindings.worker({ workerName: "worker-a" }),
 *     // Type-safe: exportName must be a valid durable object export
 *     MY_DO: bindings.durableObject({ workerName: "worker-a", exportName: "MyDurableObject" }),
 *     // Loosely typed: unknown worker
 *     EXTERNAL: bindings.worker({ workerName: "external-service" }),
 *   }),
 * });
 * ```
 */
/**
 * Helper type to compute valid exports for a worker binding.
 * For known workers, returns the constrained union. For unknown workers, returns string.
 */
type WorkerExportName<TConfigs, TName extends string> =
	TName extends InferWorkerName<TConfigs>
		? InferEntrypointExports<Extract<UnwrapConfig<TConfigs>, { name: TName }>>
		: string;

/**
 * Helper type to compute valid exports for a durable object binding.
 * For known workers, returns the constrained union. For unknown workers, returns string.
 */
type DurableObjectExportName<TConfigs, TName extends string> =
	TName extends InferWorkerName<TConfigs>
		? InferDurableObjectExports<
				Extract<UnwrapConfig<TConfigs>, { name: TName }>
			>
		: string;

/**
 * Helper type to compute valid exports for a workflow binding.
 * For known workers, returns the constrained union. For unknown workers, returns string.
 */
type WorkflowExportName<TConfigs, TName extends string> =
	TName extends InferWorkerName<TConfigs>
		? InferWorkflowExports<Extract<UnwrapConfig<TConfigs>, { name: TName }>>
		: string;

/**
 * Return type for typed worker bindings - typed if known, untyped if unknown.
 */
type WorkerBindingResult<
	TConfigs,
	TName extends string,
	TExport extends string,
> =
	TName extends InferWorkerName<TConfigs>
		? TypedWorkerBinding<
				Extract<UnwrapConfig<TConfigs>, { name: TName }>,
				TName,
				TExport
			>
		: WorkerBinding;

/**
 * Return type for typed durable object bindings.
 */
type DurableObjectBindingResult<
	TConfigs,
	TName extends string,
	TExport extends string,
> =
	TName extends InferWorkerName<TConfigs>
		? TypedDurableObjectBinding<
				Extract<UnwrapConfig<TConfigs>, { name: TName }>,
				TName,
				TExport
			>
		: DurableObjectBinding;

/**
 * Return type for typed workflow bindings.
 */
type WorkflowBindingResult<
	TConfigs,
	TName extends string,
	TExport extends string,
> =
	TName extends InferWorkerName<TConfigs>
		? TypedWorkflowBinding<
				Extract<UnwrapConfig<TConfigs>, { name: TName }>,
				TName,
				TExport
			>
		: WorkflowBinding;

/**
 * Loose autocomplete type - allows any string but suggests specific literals.
 * The `& {}` prevents TypeScript from collapsing the union.
 */
type Autocomplete<T extends string> = T | (string & {});

/**
 * Bindings interface for defining Worker bindings in config.
 *
 * When used without a type parameter (or with `DefaultConfig`), all cross-worker
 * bindings (`worker`, `durableObject`, `workflow`) allow any `workerName` and `exportName`.
 *
 * When parameterized with specific config types, cross-worker bindings become type-safe:
 * - `workerName` is constrained to the `name` from the config(s)
 * - `exportName` is constrained to valid exports for that worker
 * - The resulting binding types are fully parameterized
 *
 * @example
 * ```typescript
 * import type WorkerAConfig from "../worker-a/worker.config";
 * import { defineConfig, type Bindings } from "@cloudflare/worker-config";
 *
 * export default defineConfig({
 *   env: (bindings: Bindings<typeof WorkerAConfig>) => ({
 *     // Type-safe: workerName must be "worker-a"
 *     WORKER_A: bindings.worker({ workerName: "worker-a" }),
 *     // Type-safe: exportName must be a valid durable object export
 *     MY_DO: bindings.durableObject({ workerName: "worker-a", exportName: "MyDurableObject" }),
 *     // Loosely typed: unknown worker (when using DefaultConfig or union of configs)
 *     EXTERNAL: bindings.worker({ workerName: "external-service" }),
 *   }),
 * });
 * ```
 */
export interface Bindings<TConfigs = DefaultConfig> extends BaseBindings {
	/**
	 * Create a worker (Service) binding.
	 * When workerName matches a known config, exportName is constrained to valid entrypoints.
	 * Unknown workers allow any exportName string.
	 */
	worker<
		TName extends Autocomplete<InferWorkerName<TConfigs>>,
		TExport extends Autocomplete<WorkerExportName<TConfigs, TName>>,
	>(options: {
		workerName: TName;
		exportName?: TExport;
		props?: Record<string, unknown>;
		remote?: boolean;
	}): WorkerBindingResult<TConfigs, TName, TExport>;

	/**
	 * Create a durable object binding.
	 * When workerName matches a known config, exportName is constrained to valid DO exports.
	 * Unknown workers allow any exportName string.
	 */
	durableObject<
		TName extends Autocomplete<InferWorkerName<TConfigs>>,
		TExport extends Autocomplete<DurableObjectExportName<TConfigs, TName>>,
	>(options: {
		workerName: TName;
		exportName: TExport;
	}): DurableObjectBindingResult<TConfigs, TName, TExport>;

	/**
	 * Create a workflow binding.
	 * When workerName matches a known config, exportName is constrained to valid workflow exports.
	 * Unknown workers allow any exportName string.
	 */
	workflow<
		TName extends Autocomplete<InferWorkerName<TConfigs>>,
		TExport extends Autocomplete<WorkflowExportName<TConfigs, TName>>,
	>(options: {
		workerName: TName;
		exportName: TExport;
		remote?: boolean;
	}): WorkflowBindingResult<TConfigs, TName, TExport>;
}

/**
 * Runtime bindings implementation object.
 * This is the actual implementation that produces binding configuration objects.
 */
const bindingsImpl = {
	// Value-first bindings
	text: <T extends string>(value: T) => ({ type: "text" as const, value }),
	json: <T>(value: T) => ({ type: "json" as const, value }),

	// Standard bindings
	ai: (options = {}) => ({ type: "ai" as const, ...options }),
	aiSearch: (options: AiSearchBindingOptions) => ({
		type: "ai-search" as const,
		...options,
	}),
	aiSearchNamespace: (options: AiSearchNamespaceBindingOptions) => ({
		type: "ai-search-namespace" as const,
		...options,
	}),
	analyticsEngineDataset: (options = {}) => ({
		type: "analytics-engine-dataset" as const,
		...options,
	}),
	artifacts: (options: ArtifactsBindingOptions) => ({
		type: "artifacts" as const,
		...options,
	}),
	assets: () => ({ type: "assets" as const }),
	browser: (options = {}) => ({ type: "browser" as const, ...options }),
	d1: (options = {}) => ({ type: "d1" as const, ...options }),
	dispatchNamespace: (options: DispatchNamespaceBindingOptions) => ({
		type: "dispatch-namespace" as const,
		...options,
	}),
	durableObject: (options: DurableObjectBindingOptions) => ({
		type: "durable-object" as const,
		...options,
	}),
	flagship: (options: FlagshipBindingOptions) => ({
		type: "flagship" as const,
		...options,
	}),
	hyperdrive: (options: HyperdriveBindingOptions) => ({
		type: "hyperdrive" as const,
		...options,
	}),
	images: (options = {}) => ({ type: "images" as const, ...options }),
	kv: (options = {}) => ({ type: "kv" as const, ...options }),
	logfwdr: (options: LogfwdrBindingOptions) => ({
		type: "logfwdr" as const,
		...options,
	}),
	media: (options = {}) => ({ type: "media" as const, ...options }),
	mtlsCertificate: (options: MtlsCertificateBindingOptions) => ({
		type: "mtls-certificate" as const,
		...options,
	}),
	pipeline: (options: PipelineBindingOptions) => ({
		type: "pipeline" as const,
		...options,
	}),
	queue: (options: QueueBindingOptions) => ({
		type: "queue" as const,
		...options,
	}),
	rateLimit: (options: RateLimitBindingOptions) => ({
		type: "rate-limit" as const,
		...options,
	}),
	r2: (options = {}) => ({ type: "r2" as const, ...options }),
	secret: () => ({ type: "secret" as const }),
	secretsStoreSecret: (options: SecretsStoreSecretBindingOptions) => ({
		type: "secrets-store-secret" as const,
		...options,
	}),
	sendEmail: (options = {}) => ({ type: "send-email" as const, ...options }),
	stream: (options = {}) => ({ type: "stream" as const, ...options }),
	unsafe: <T extends `unsafe-${string}`>(type: T) => ({ type }),
	vectorize: (options: VectorizeBindingOptions) => ({
		type: "vectorize" as const,
		...options,
	}),
	versionMetadata: () => ({ type: "version-metadata" as const }),
	vpcService: (options: VpcServiceBindingOptions) => ({
		type: "vpc-service" as const,
		...options,
	}),
	vpcNetwork: (options: VpcNetworkBindingOptions) => ({
		type: "vpc-network" as const,
		...options,
	}),
	worker: (options: WorkerBindingOptions) => ({
		type: "worker" as const,
		...options,
	}),
	workerLoader: () => ({ type: "worker-loader" as const }),
	workflow: (options: WorkflowBindingOptions) => ({
		type: "workflow" as const,
		...options,
	}),
};

/**
 * Runtime bindings object - the actual implementation that can be passed to env functions.
 * Cast to Bindings to allow use with any config type parameter.
 */
export const bindings = bindingsImpl as Bindings;
