// app/api/auth/me/route.ts
import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getCreatorById } from "@/lib/db";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const creator = await getCreatorById(session.creatorId);
  if (!creator) return NextResponse.json({ error: "Creator not found" }, { status: 404 });

  const { passwordHash, ...safeCreator } = creator;
  return NextResponse.json(safeCreator);
}
