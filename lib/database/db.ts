import { Kysely, PostgresDialect } from "kysely";
import { Pool } from "pg";
import type { DB } from "./db.d";

// Ensure DATABASE_URL is available
if (!process.env.DATABASE_URL) {
	console.warn("DATABASE_URL is not set. Database connection may fail.");
}

// RLS scoping (see scoped-db.ts) relies on session-level SET ROLE / set_config,
// which a transaction-mode pooler (e.g. Neon's "-pooler" host) does not keep
// between statements. Prefer the direct connection when the host provides one.
const connectionString =
	process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL;

// Create a new Kysely instance with Postgres dialect
export const db = new Kysely<DB>({
	dialect: new PostgresDialect({
		pool: new Pool({
			connectionString,
			ssl: connectionString?.includes("sslmode=disable")
				? false
				: process.env.NODE_ENV === "production"
					? { rejectUnauthorized: false }
					: false,
		}),
	}),
});
