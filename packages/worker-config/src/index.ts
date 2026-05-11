import type { Config } from "./schema";

export type { InferEnv } from "./env";

interface ConfigContext {}

type ConfigFnObject = (ctx: ConfigContext) => Config;
type ConfigFnPromise = (ctx: ConfigContext) => Promise<Config>;
type ConfigFn = (ctx: ConfigContext) => Config | Promise<Config>;
type ConfigExport =
  | Config
  | Promise<Config>
  | ConfigFnObject
  | ConfigFnPromise
  | ConfigFn;

export function defineConfig<const T extends ConfigExport>(config: T): T {
	return config;
}