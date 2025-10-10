import { createClient } from "@libsql/client";
import { drizzle as drizzleD1 } from "drizzle-orm/d1";
import { drizzle as drizzleLibSQL } from "drizzle-orm/libsql";
import { getLocalD1DB } from "../../get-db";
import * as schema from "./schema";

// @ts-expect-error
const getDb = async () => {
	if (import.meta.env.DEV) {
		const client = createClient({
			url: getLocalD1DB() as string,
		});
		return drizzleLibSQL(client, { schema });
	} else {
		const { env } = await import("cloudflare:workers");
		// @ts-expect-error
		return drizzleD1(env.beyond_dogma_db, { schema });
	}
};

export const db = await getDb();
