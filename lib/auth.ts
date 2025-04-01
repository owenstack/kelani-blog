import prisma from "@/prisma";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { admin, captcha, username } from "better-auth/plugins";
import { env } from "./env";

export const auth = betterAuth({
	database: prismaAdapter(prisma, {
		provider: "postgresql",
	}),
	emailAndPassword: {
		enabled: true,
	},
	socialProviders: {
		google: {
			clientId: env.GOOGLE_CLIENT_ID,
			clientSecret: env.GOOGLE_CLIENT_SECRET,
		},
	},
	plugins: [
		username(),
		admin(),
		nextCookies(),
		captcha({
			provider: "cloudflare-turnstile",
			secretKey: env.CLOUDFLARE_TURNSTILE_SECRET_KEY,
		}),
	],
});
