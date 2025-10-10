// @ts-check

import cloudflare from "@astrojs/cloudflare";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import sanity from "@sanity/astro";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
	site: "https://beyonddogma.blog",
	vite: {
		plugins: [tailwindcss()],
	},

	adapter: cloudflare(),
		output: 'server',
	integrations: [
		react(),
		sanity({
			projectId: "kzhzgcbq",
			dataset: "production",
			useCdn: import.meta.env.MODE === "production",
		}),
		sitemap(),
	],
});
