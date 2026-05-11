import { defineConfig } from "@cloudflare/worker-config";

let mode = 'staging'

export default defineConfig({
	name: "my-worker",
	env: {
		MY_KV: { type: "kv" },
		MY_DB: { type: "d1" },
		MY_BUCKET: { type: "r2" },
		MY_QUEUE: { type: "queue", name: "my-queue" },
		...(mode === 'production' ? { MY_SECRET: { type: "secret" }} : {}),
		MY_JSON: { type: "json", value: { foo: 'bar' } },
		MY_TEXT: { type: "text", value: mode === 'production' ? 'production var' : 'staging var' },
		MY_AI: { type: "ai" },
	},
});
