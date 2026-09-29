// lib/db/mongo.ts
// MongoDB connection with singleton pattern
import { MongoClient, Db } from "mongodb";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/creatorlink";

let client: MongoClient | null = null;
let db: Db | null = null;

export async function getMongoDb(): Promise<Db | null> {
  try {
    if (!client) {
      client = new MongoClient(MONGODB_URI, { serverSelectionTimeoutMS: 3000 });
      await client.connect();
    }
    if (!db) {
      db = client.db();
    }
    return db;
  } catch {
    client = null;
    db = null;
    return null;
  }
}
