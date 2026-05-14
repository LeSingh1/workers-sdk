import { bindings } from "./bindings";
import type { Bindings } from "./bindings";
import type { Config } from "./schema";

export { bindings };
export type { Bindings };
export type { InferEnv, InferDurableNamespaces, InferMainModule } from "./env";
export type { Config } from "./schema";
export { generateTypes } from "./generate";

interface ConfigContext {}

/**
 * The env function type - receives a bindings helper and returns a record of bindings.
 * Uses `Bindings<any>` to allow any config type annotation by the user.
 */
type EnvFn = (b: Bindings<any>) => Record<string, { type: string }>;

/**
 * Represents a Worker module namespace (from `import * as Module from '...'`).
 */
type WorkerModule = Record<string, unknown>;

/**
 * Config with function-based env and module-based entrypoint (for user-facing API).
 */
type ConfigWithEnvFn = Omit<Config, "env" | "entrypoint"> & {
	env?: EnvFn;
	entrypoint?: string | WorkerModule;
};

type ConfigFnObject = (ctx: ConfigContext) => ConfigWithEnvFn;
type ConfigFnPromise = (ctx: ConfigContext) => Promise<ConfigWithEnvFn>;
type ConfigFn = (
	ctx: ConfigContext
) => ConfigWithEnvFn | Promise<ConfigWithEnvFn>;
type ConfigExport =
	| ConfigWithEnvFn
	| Promise<ConfigWithEnvFn>
	| ConfigFnObject
	| ConfigFnPromise
	| ConfigFn;

export function defineConfig<const T extends ConfigExport>(config: T): T {
	return config;
}
