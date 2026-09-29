// app/api/links/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getLinkById, updateLink, deleteLink, getLinksByCreator } from "@/lib/db";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const link = await getLinkById(id);
  if (!link || link.creatorId !== session.creatorId) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const body = await req.json();
  const allowed = ["title", "price", "position", "image"];
  const update: Record<string, unknown> = {};
  for (const key of allowed) {
    if (key in body) update[key] = body[key];
  }

  await updateLink(id, update);
  return NextResponse.json({ ok: true });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const link = await getLinkById(id);
  if (!link || link.creatorId !== session.creatorId) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await deleteLink(id);

  // Re-sort remaining links
  const remaining = await getLinksByCreator(session.creatorId);
  await Promise.all(
    remaining.map((l, i) => updateLink(l.id, { position: i }))
  );

  return NextResponse.json({ ok: true });
}
