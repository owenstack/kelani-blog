import { drizzle } from "drizzle-orm/d1";
import * as schema from "./schema";
import { cfContext } from "@/lib/constants";

export const cloudflareDb = cfContext.env.DATABASE;

export const db = drizzle(cloudflareDb, { schema });
