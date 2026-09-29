// lib/db/lowdb.ts
// LowDB JSON-file fallback store (used when MongoDB is unavailable)
import { join } from "path";
import { DB } from "./types";

const DB_PATH = join(process.cwd(), "data", "db.json");

// Lazy-load so we don't break if someone doesn't have lowdb
async function getAdapter() {
  const { Low } = await import("lowdb");
  const { JSONFile } = await import("lowdb/node");

  const adapter = new JSONFile<DB>(DB_PATH);
  const db = new Low<DB>(adapter, {
    creators: [],
    links: [],
    clickEvents: [],
    products: [],
  });
  await db.read();
  return db;
}

let _db: Awaited<ReturnType<typeof getAdapter>> | null = null;

export async function getLowDB() {
  if (!_db) {
    _db = await getAdapter();
  }
  return _db;
}
