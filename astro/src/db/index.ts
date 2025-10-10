import { drizzle as drizzleD1 } from "drizzle-orm/d1";
import { drizzle as drizzleLibSQL } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import * as schema from "./schema";
import { getLocalD1DB } from "../../get-db";

// @ts-ignore
const getDb = async () => {
  if (import.meta.env.DEV) {
    const client = createClient({
      url: getLocalD1DB() as string,
    });
    return drizzleLibSQL(client, { schema });
  } else {
    const { env } = await import("cloudflare:workers");
    // @ts-ignore
    return drizzleD1(env.beyond_dogma_db, { schema });
  }
};

export const db = await getDb();