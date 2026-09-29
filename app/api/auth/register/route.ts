// app/api/auth/register/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createCreator, getCreatorByEmail, getCreatorByHandle } from "@/lib/db";
import { hashPassword, signToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { email, password, name, handle, bio } = await req.json();

    if (!email || !password || !name || !handle) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (!/^[a-z0-9_]{3,30}$/.test(handle)) {
      return NextResponse.json(
        { error: "Handle must be 3-30 chars, lowercase letters, digits, underscores only" },
        { status: 400 }
      );
    }

    const existing = await getCreatorByEmail(email);
    if (existing) {
      return NextResponse.json({ error: "Email already registered" }, { status: 409 });
    }

    const existingHandle = await getCreatorByHandle(handle);
    if (existingHandle) {
      return NextResponse.json({ error: "Handle already taken" }, { status: 409 });
    }

    const passwordHash = await hashPassword(password);
    const creator = await createCreator({
      email,
      passwordHash,
      name,
      handle,
      bio: bio || "",
      avatarUrl: `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(name)}`,
      languages: ["en"],
      affiliateIds: {},
    });

    const token = await signToken({
      creatorId: creator.id,
      handle: creator.handle,
      email: creator.email,
    });

    const res = NextResponse.json({ ok: true, handle: creator.handle });
    res.cookies.set("cl_token", token, {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });
    return res;
  } catch (err) {
    console.error("[register]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
