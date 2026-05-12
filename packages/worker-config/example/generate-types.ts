import { writeFileSync } from "node:fs";
import { generateTypes } from "@cloudflare/worker-config";
import config from "./worker.config.ts";

const content = generateTypes({
	config,
	configPath: "./worker.config",
});

writeFileSync("worker-configuration.d.ts", content);
console.log("Generated worker-configuration.d.ts");
