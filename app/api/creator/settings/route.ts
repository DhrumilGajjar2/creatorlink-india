// app/api/creator/settings/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { updateCreator, getCreatorById } from "@/lib/db";

export async function PATCH(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const allowed = ["name", "bio", "avatarUrl", "languages", "affiliateIds", "razorpayAccountId"];
  const update: Record<string, unknown> = {};
  for (const key of allowed) {
    if (key in body) update[key] = body[key];
  }

  await updateCreator(session.creatorId, update);

  const creator = await getCreatorById(session.creatorId);
  if (!creator) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const { passwordHash, ...safe } = creator;
  return NextResponse.json(safe);
}
