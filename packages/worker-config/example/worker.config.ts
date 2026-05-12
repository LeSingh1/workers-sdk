import { defineConfig } from "@cloudflare/worker-config";

export default defineConfig({
	name: "my-worker",
	entrypoint: "./src/index.ts",
	env: {
		MY_KV: { type: "kv" },
		MY_DB: { type: "d1" },
		MY_BUCKET: { type: "r2" },
		MY_QUEUE: { type: "queue", name: "my-queue" },
		MY_SECRET: { type: "secret" },
		MY_JSON: { type: "json", value: { foo: "bar" } },
		MY_TEXT: { type: "text", value: "hello world" },
		MY_AI: { type: "ai" },
	},
	exports: {
		MyDurableObject: { type: 'durable-object', storage: 'sqlite'}
	}
});
