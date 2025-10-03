// @ts-check

import cloudflare from "@astrojs/cloudflare";
import react from "@astrojs/react";
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
	integrations: [
		react(),
		sanity({
			projectId: "s3ub5fy7",
			dataset: "production",
			useCdn: process.env.NODE_ENV === "production",
		}),
	],
});
