// app/r/[linkId]/route.ts
// Redirect + click tracking
import { NextRequest, NextResponse } from "next/server";
import { getLinkById, createClickEvent, incrementLinkClick } from "@/lib/db";

function parseDevice(ua: string): string {
  if (/mobile|android|iphone|ipad/i.test(ua)) return "mobile";
  if (/tablet/i.test(ua)) return "tablet";
  return "desktop";
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ linkId: string }> }
) {
  const { linkId } = await params;

  const link = await getLinkById(linkId);
  if (!link) {
    return NextResponse.json({ error: "Link not found" }, { status: 404 });
  }

  const ua = req.headers.get("user-agent") || "";
  const referrer = req.headers.get("referer") || "";
  const device = parseDevice(ua);

  // Fire and forget — don't await to keep redirect fast
  Promise.all([
    createClickEvent({
      linkId,
      timestamp: new Date().toISOString(),
      referrer,
      device,
    }),
    incrementLinkClick(linkId),
  ]).catch(console.error);

  return NextResponse.redirect(link.url, { status: 302 });
}
