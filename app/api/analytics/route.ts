// app/api/analytics/route.ts
import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getLinksByCreator, getClickEventsByCreator } from "@/lib/db";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const [links, events] = await Promise.all([
    getLinksByCreator(session.creatorId),
    getClickEventsByCreator(session.creatorId),
  ]);

  const analytics = links.map((link) => {
    const linkEvents = events.filter((e) => e.linkId === link.id);
    const lastEvent = linkEvents.sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    )[0];

    return {
      id: link.id,
      title: link.title,
      network: link.network,
      clicks: link.clickCount,
      lastClicked: lastEvent?.timestamp || null,
    };
  });

  return NextResponse.json(analytics);
}
