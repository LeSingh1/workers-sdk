// import { env } from "cloudflare:workers";

export default {
	async fetch(request, env): Promise<Response> {
		// TypeScript knows the exact types of all bindings
		const secret = env.MY_SECRET
		const text = env.MY_TEXT;

		return new Response(text);
	},
} satisfies ExportedHandler<Cloudflare.Env>;
