import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
	server: {
		DATABASE_URL: z.string().url(),
		EMAIL_FROM: z.string().email(),
		GOOGLE_CLIENT_ID: z.string(),
		GOOGLE_CLIENT_SECRET: z.string(),
		SMTP_KEY: z.string(),
		SMTP_SERVER_HOST: z.string(),
		SMTP_SERVER_USER: z.string(),
		SANITY_API_DATASET: z.string(),
		SANITY_API_PROJECT_ID: z.string(),
		SANITY_API_READ_TOKEN: z.string(),
		SANITY_API_WRITE_TOKEN: z.string(),
		SANITY_STUDIO_DATASET: z.string(),
		SANITY_STUDIO_PROJECT_ID: z.string(),
	},
	client: {
		NEXT_PUBLIC_SANITY_DATASET: z.string(),
		NEXT_PUBLIC_SANITY_PROJECT_ID: z.string(),
	},
	runtimeEnv: {
		DATABASE_URL: process.env.DATABASE_URL,
		EMAIL_FROM: process.env.EMAIL_FROM,
		GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
		GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
		SMTP_KEY: process.env.SMTP_KEY,
		SMTP_SERVER_HOST: process.env.SMTP_SERVER_HOST,
		SMTP_SERVER_USER: process.env.SMTP_SERVER_USER,
		NEXT_PUBLIC_SANITY_DATASET: process.env.NEXT_PUBLIC_SANITY_DATASET,
		NEXT_PUBLIC_SANITY_PROJECT_ID: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
		SANITY_API_DATASET: process.env.SANITY_API_DATASET,
		SANITY_API_PROJECT_ID: process.env.SANITY_API_PROJECT_ID,
		SANITY_API_READ_TOKEN: process.env.SANITY_API_READ_TOKEN,
		SANITY_API_WRITE_TOKEN: process.env.SANITY_API_WRITE_TOKEN,
		SANITY_STUDIO_DATASET: process.env.SANITY_STUDIO_DATASET,
		SANITY_STUDIO_PROJECT_ID: process.env.SANITY_STUDIO_PROJECT_ID,
	},
});
