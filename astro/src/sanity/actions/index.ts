import { SANITY_API_TOKEN } from "astro:env/server";
import { createClient } from "@sanity/client";

export const sanityServerClient = createClient({
	projectId: "kzhzgcbq",
	dataset: "production",
	apiVersion: "2025-10-12", // use a fixed or recent date
	useCdn: false,
	token: SANITY_API_TOKEN, // must have 'Editor' or higher role
});
