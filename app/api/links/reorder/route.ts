// app/api/links/reorder/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getLinkById, updateLink } from "@/lib/db";

// Body: { order: string[] } — array of link IDs in new order
export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { order } = await req.json() as { order: string[] };
  if (!Array.isArray(order)) {
    return NextResponse.json({ error: "order must be an array of IDs" }, { status: 400 });
  }

  // Verify all links belong to this creator
  for (const id of order) {
    const link = await getLinkById(id);
    if (!link || link.creatorId !== session.creatorId) {
      return NextResponse.json({ error: "Unauthorized link" }, { status: 403 });
    }
  }

  await Promise.all(order.map((id, i) => updateLink(id, { position: i })));
  return NextResponse.json({ ok: true });
}
