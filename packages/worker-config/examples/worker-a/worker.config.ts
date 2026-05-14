import * as Worker from "./src" with { type: "cf-worker" };
import { defineConfig } from "@cloudflare/worker-config";

export default defineConfig({
	name: "worker-a",
	entrypoint: Worker,
	env: (bindings) => ({
		MY_AI: bindings.ai(),
		MY_BUCKET: bindings.r2(),
		MY_DB: bindings.d1(),
		MY_JSON: bindings.json({ foo: "bar" }),
		MY_KV: bindings.kv(),
		MY_QUEUE: bindings.queue({ name: "my-queue" }),
		MY_SECRET: bindings.secret(),
		MY_TEXT: bindings.text("hello world"),
	}),
	exports: {
		MyDurableObject: { type: "durable-object", storage: "sqlite" },
	},
});
