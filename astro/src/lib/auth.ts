import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } from "astro:env/server";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { admin } from "better-auth/plugins";
import { db } from "../db";

export const auth = betterAuth({
	appName: "Beyond Dogma",
	baseURL: "https://beyonddogma.blog",
	database: drizzleAdapter(db, {
		provider: "sqlite",
	}),
	socialProviders: {
		google: {
			clientId: GOOGLE_CLIENT_ID,
			clientSecret: GOOGLE_CLIENT_SECRET,
		},
	},
	advanced: {
		crossSubDomainCookies: {
			enabled: true,
			domain: import.meta.env.DEV ? undefined : "beyonddogma.blog",
		},
	},
	plugins: [admin()],
});
