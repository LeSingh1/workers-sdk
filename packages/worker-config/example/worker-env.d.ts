import type { InferEnv } from "@cloudflare/worker-config";
import type Config from "./worker.config";

declare global {
	namespace Cloudflare {
		// eslint-disable-next-line @typescript-eslint/no-empty-object-type -- Declaration merging with InferEnv
		interface Env extends InferEnv<typeof Config> {}
	}
}
