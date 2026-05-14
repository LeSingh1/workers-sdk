import { bindings } from "./bindings";
import type { Bindings } from "./bindings";
import type { Config } from "./schema";

export { bindings };
export type { Bindings };
export type { InferEnv, InferDurableNamespaces } from "./env";
export type { Config } from "./schema";
export { generateTypes } from "./generate";

interface ConfigContext {}

/**
 * The env function type - receives a bindings helper and returns a record of bindings.
 */
type EnvFn = (b: Bindings) => Record<string, { type: string }>;

/**
 * Config with function-based env (for user-facing API).
 */
type ConfigWithEnvFn = Omit<Config, "env"> & {
	env?: EnvFn;
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
