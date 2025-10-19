import { drizzle } from "drizzle-orm/bun-sqlite";
import { Database } from "bun:sqlite";
import * as schema from "@/db/schema";

const databaseFile = process.env.DATABASE_URL || "sqlite.db";
const sqlite = new Database(databaseFile);

export const db = drizzle(sqlite, { schema });
