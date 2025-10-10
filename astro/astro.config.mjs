// @ts-check

import cloudflare from "@astrojs/cloudflare";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import sanity from "@sanity/astro";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, envField } from "astro/config";

// https://astro.build/config
export default defineConfig({
	site: "https://beyonddogma.blog",
	vite: {
		plugins: [tailwindcss()],
	},
	adapter: cloudflare({
		imageService: "cloudflare",
	}),
	output: "server",
	integrations: [
		react(),
		sanity({
			projectId: "kzhzgcbq",
			dataset: "production",
			useCdn: import.meta.env.MODE === "production",
		}),
		sitemap(),
	],
	env: {
		schema: {
			BETTER_AUTH_SECRET: envField.string({
				context: "server",
				access: "secret",
			}),
			GOOGLE_CLIENT_ID: envField.string({
				context: "server",
				access: "secret",
			}),
			GOOGLE_CLIENT_SECRET: envField.string({
				context: "server",
				access: "secret",
			}),
			CLOUDFLARE_D1_API_TOKEN: envField.string({
				context: "server",
				access: "secret",
			}),
			CLOUDFLARE_D1_ACCOUNT_ID: envField.string({
				context: "server",
				access: "secret",
			}),
		},
	},
});
