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
 * The Bindings interface - provides typed builder methods for each binding type.
 */
export interface Bindings {
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
	durableObject(options: DurableObjectBindingOptions): DurableObjectBinding;
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
	worker(options: WorkerBindingOptions): WorkerBinding;
	workerLoader(): WorkerLoaderBinding;
	workflow(options: WorkflowBindingOptions): WorkflowBinding;
}

/**
 * Runtime bindings object - the actual implementation that can be passed to env functions.
 */
export const bindings: Bindings = {
	// Value-first bindings
	text: (value) => ({ type: "text", value }),
	json: (value) => ({ type: "json", value }),

	// Standard bindings
	ai: (options = {}) => ({ type: "ai", ...options }),
	aiSearch: (options) => ({ type: "ai-search", ...options }),
	aiSearchNamespace: (options) => ({ type: "ai-search-namespace", ...options }),
	analyticsEngineDataset: (options = {}) => ({
		type: "analytics-engine-dataset",
		...options,
	}),
	artifacts: (options) => ({ type: "artifacts", ...options }),
	assets: () => ({ type: "assets" }),
	browser: (options = {}) => ({ type: "browser", ...options }),
	d1: (options = {}) => ({ type: "d1", ...options }),
	dispatchNamespace: (options) => ({ type: "dispatch-namespace", ...options }),
	durableObject: (options) => ({ type: "durable-object", ...options }),
	flagship: (options) => ({ type: "flagship", ...options }),
	hyperdrive: (options) => ({ type: "hyperdrive", ...options }),
	images: (options = {}) => ({ type: "images", ...options }),
	kv: (options = {}) => ({ type: "kv", ...options }),
	logfwdr: (options) => ({ type: "logfwdr", ...options }),
	media: (options = {}) => ({ type: "media", ...options }),
	mtlsCertificate: (options) => ({ type: "mtls-certificate", ...options }),
	pipeline: (options) => ({ type: "pipeline", ...options }),
	queue: (options) => ({ type: "queue", ...options }),
	rateLimit: (options) => ({ type: "rate-limit", ...options }),
	r2: (options = {}) => ({ type: "r2", ...options }),
	secret: () => ({ type: "secret" }),
	secretsStoreSecret: (options) => ({
		type: "secrets-store-secret",
		...options,
	}),
	sendEmail: (options = {}) => ({ type: "send-email", ...options }),
	stream: (options = {}) => ({ type: "stream", ...options }),
	unsafe: (type) => ({ type }),
	vectorize: (options) => ({ type: "vectorize", ...options }),
	versionMetadata: () => ({ type: "version-metadata" }),
	vpcService: (options) => ({ type: "vpc-service", ...options }),
	vpcNetwork: (options) => ({ type: "vpc-network", ...options }),
	worker: (options) => ({ type: "worker", ...options }),
	workerLoader: () => ({ type: "worker-loader" }),
	workflow: (options) => ({ type: "workflow", ...options }),
};
