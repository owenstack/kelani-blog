import { defineConfig } from "drizzle-kit";
import { getLocalD1DB } from "./get-db";

export default defineConfig({
	dialect: "sqlite",
	schema: "./src/db/schema.ts",
	out: "./migrations",
	...(process.env.NODE_ENV === "production"
		? {
				driver: "d1-http",
				dbCredentials: {
					accountId: process.env.CLOUDFLARE_D1_ACCOUNT_ID,
					databaseId: process.env.DATABASE,
					token: process.env.CLOUDFLARE_D1_API_TOKEN,
				},
			}
		: {
				dbCredentials: {
					url: getLocalD1DB(),
				},
			}),
});
