// app/api/links/reorder/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getLinksByCreator, updateLink } from "@/lib/db";

// Body: { order: string[] } — array of link IDs in new desired order
export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json() as { order?: string[] };
  const { order } = body;

  if (!Array.isArray(order) || order.length === 0) {
    return NextResponse.json({ error: "order must be a non-empty array of link IDs" }, { status: 400 });
  }

  // Single DB call — fetch all creator links, then verify all IDs belong to them
  const creatorLinks = await getLinksByCreator(session.creatorId);
  const ownedIds = new Set(creatorLinks.map((l) => l.id));

  for (const id of order) {
    if (!ownedIds.has(id)) {
      return NextResponse.json({ error: `Link not found or access denied: ${id}` }, { status: 403 });
    }
  }

  // Batch update positions
  await Promise.all(order.map((id, i) => updateLink(id, { position: i })));
  return NextResponse.json({ ok: true });
}
