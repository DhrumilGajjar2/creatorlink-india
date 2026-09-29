// lib/db/index.ts
// Unified DB adapter — tries MongoDB first, falls back to LowDB
import { getMongoDb } from "./mongo";
import { getLowDB } from "./lowdb";
import { Creator, Link, ClickEvent, Product, Network } from "./types";
import { v4 as uuid } from "uuid";
import { ObjectId } from "mongodb";

// ─── helpers ──────────────────────────────────────────────────────────────────

function newId() {
  return uuid();
}

// ─── Creator ──────────────────────────────────────────────────────────────────

export async function getCreatorByHandle(handle: string): Promise<Creator | null> {
  const mongo = await getMongoDb();
  if (mongo) {
    const doc = await mongo.collection("creators").findOne({ handle });
    if (!doc) return null;
    return mongoToCreator(doc);
  }
  const db = await getLowDB();
  return db.data.creators.find((c) => c.handle === handle) ?? null;
}

export async function getCreatorByEmail(email: string): Promise<Creator | null> {
  const mongo = await getMongoDb();
  if (mongo) {
    const doc = await mongo.collection("creators").findOne({ email });
    if (!doc) return null;
    return mongoToCreator(doc);
  }
  const db = await getLowDB();
  return db.data.creators.find((c) => c.email === email) ?? null;
}

export async function getCreatorById(id: string): Promise<Creator | null> {
  const mongo = await getMongoDb();
  if (mongo) {
    const doc = await mongo.collection("creators").findOne({ id });
    if (!doc) return null;
    return mongoToCreator(doc);
  }
  const db = await getLowDB();
  return db.data.creators.find((c) => c.id === id) ?? null;
}

export async function createCreator(data: Omit<Creator, "id" | "createdAt">): Promise<Creator> {
  const creator: Creator = { ...data, id: newId(), createdAt: new Date().toISOString() };
  const mongo = await getMongoDb();
  if (mongo) {
    await mongo.collection("creators").insertOne({ ...creator });
  } else {
    const db = await getLowDB();
    db.data.creators.push(creator);
    await db.write();
  }
  return creator;
}

export async function updateCreator(id: string, data: Partial<Creator>): Promise<void> {
  const mongo = await getMongoDb();
  if (mongo) {
    await mongo.collection("creators").updateOne({ id }, { $set: data });
  } else {
    const db = await getLowDB();
    const idx = db.data.creators.findIndex((c) => c.id === id);
    if (idx !== -1) db.data.creators[idx] = { ...db.data.creators[idx], ...data };
    await db.write();
  }
}

// ─── Link ─────────────────────────────────────────────────────────────────────

export async function getLinksByCreator(creatorId: string): Promise<Link[]> {
  const mongo = await getMongoDb();
  if (mongo) {
    const docs = await mongo.collection("links").find({ creatorId }).sort({ position: 1 }).toArray();
    return docs.map(mongoToLink);
  }
  const db = await getLowDB();
  return db.data.links
    .filter((l) => l.creatorId === creatorId)
    .sort((a, b) => a.position - b.position);
}

export async function getLinkById(id: string): Promise<Link | null> {
  const mongo = await getMongoDb();
  if (mongo) {
    const doc = await mongo.collection("links").findOne({ id });
    if (!doc) return null;
    return mongoToLink(doc);
  }
  const db = await getLowDB();
  return db.data.links.find((l) => l.id === id) ?? null;
}

export async function createLink(data: Omit<Link, "id" | "clickCount" | "createdAt">): Promise<Link> {
  const link: Link = { ...data, id: newId(), clickCount: 0, createdAt: new Date().toISOString() };
  const mongo = await getMongoDb();
  if (mongo) {
    await mongo.collection("links").insertOne({ ...link });
  } else {
    const db = await getLowDB();
    db.data.links.push(link);
    await db.write();
  }
  return link;
}

export async function updateLink(id: string, data: Partial<Link>): Promise<void> {
  const mongo = await getMongoDb();
  if (mongo) {
    await mongo.collection("links").updateOne({ id }, { $set: data });
  } else {
    const db = await getLowDB();
    const idx = db.data.links.findIndex((l) => l.id === id);
    if (idx !== -1) db.data.links[idx] = { ...db.data.links[idx], ...data };
    await db.write();
  }
}

export async function deleteLink(id: string): Promise<void> {
  const mongo = await getMongoDb();
  if (mongo) {
    await mongo.collection("links").deleteOne({ id });
  } else {
    const db = await getLowDB();
    db.data.links = db.data.links.filter((l) => l.id !== id);
    await db.write();
  }
}

export async function incrementLinkClick(id: string): Promise<void> {
  const mongo = await getMongoDb();
  if (mongo) {
    await mongo.collection("links").updateOne({ id }, { $inc: { clickCount: 1 } });
  } else {
    const db = await getLowDB();
    const idx = db.data.links.findIndex((l) => l.id === id);
    if (idx !== -1) db.data.links[idx].clickCount++;
    await db.write();
  }
}

// ─── ClickEvent ───────────────────────────────────────────────────────────────

export async function createClickEvent(data: Omit<ClickEvent, "id">): Promise<ClickEvent> {
  const event: ClickEvent = { ...data, id: newId() };
  const mongo = await getMongoDb();
  if (mongo) {
    await mongo.collection("clickEvents").insertOne({ ...event });
  } else {
    const db = await getLowDB();
    db.data.clickEvents.push(event);
    await db.write();
  }
  return event;
}

export async function getClickEventsByLink(linkId: string): Promise<ClickEvent[]> {
  const mongo = await getMongoDb();
  if (mongo) {
    const docs = await mongo.collection("clickEvents").find({ linkId }).toArray();
    return docs.map(mongoToClickEvent);
  }
  const db = await getLowDB();
  return db.data.clickEvents.filter((e) => e.linkId === linkId);
}

export async function getClickEventsByCreator(creatorId: string): Promise<ClickEvent[]> {
  const links = await getLinksByCreator(creatorId);
  const linkIds = new Set(links.map((l) => l.id));
  const mongo = await getMongoDb();
  if (mongo) {
    const docs = await mongo
      .collection("clickEvents")
      .find({ linkId: { $in: [...linkIds] } })
      .toArray();
    return docs.map(mongoToClickEvent);
  }
  const db = await getLowDB();
  return db.data.clickEvents.filter((e) => linkIds.has(e.linkId));
}

// ─── Product ──────────────────────────────────────────────────────────────────

export async function getProductsByCreator(creatorId: string): Promise<Product[]> {
  const mongo = await getMongoDb();
  if (mongo) {
    const docs = await mongo.collection("products").find({ creatorId }).toArray();
    return docs.map(mongoToProduct);
  }
  const db = await getLowDB();
  return db.data.products.filter((p) => p.creatorId === creatorId);
}

export async function getProductById(id: string): Promise<Product | null> {
  const mongo = await getMongoDb();
  if (mongo) {
    const doc = await mongo.collection("products").findOne({ id });
    if (!doc) return null;
    return mongoToProduct(doc);
  }
  const db = await getLowDB();
  return db.data.products.find((p) => p.id === id) ?? null;
}

export async function createProduct(data: Omit<Product, "id" | "saleCount" | "createdAt">): Promise<Product> {
  const product: Product = { ...data, id: newId(), saleCount: 0, createdAt: new Date().toISOString() };
  const mongo = await getMongoDb();
  if (mongo) {
    await mongo.collection("products").insertOne({ ...product });
  } else {
    const db = await getLowDB();
    db.data.products.push(product);
    await db.write();
  }
  return product;
}

export async function updateProduct(id: string, data: Partial<Product>): Promise<void> {
  const mongo = await getMongoDb();
  if (mongo) {
    await mongo.collection("products").updateOne({ id }, { $set: data });
  } else {
    const db = await getLowDB();
    const idx = db.data.products.findIndex((p) => p.id === id);
    if (idx !== -1) db.data.products[idx] = { ...db.data.products[idx], ...data };
    await db.write();
  }
}

export async function incrementProductSale(id: string): Promise<void> {
  const mongo = await getMongoDb();
  if (mongo) {
    await mongo.collection("products").updateOne({ id }, { $inc: { saleCount: 1 } });
  } else {
    const db = await getLowDB();
    const idx = db.data.products.findIndex((p) => p.id === id);
    if (idx !== -1) db.data.products[idx].saleCount++;
    await db.write();
  }
}

// ─── Mongo doc → typed object helpers ────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mongoToCreator(doc: any): Creator {
  const { _id, ...rest } = doc;
  return rest as Creator;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mongoToLink(doc: any): Link {
  const { _id, ...rest } = doc;
  return rest as Link;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mongoToClickEvent(doc: any): ClickEvent {
  const { _id, ...rest } = doc;
  return rest as ClickEvent;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mongoToProduct(doc: any): Product {
  const { _id, ...rest } = doc;
  return rest as Product;
}
