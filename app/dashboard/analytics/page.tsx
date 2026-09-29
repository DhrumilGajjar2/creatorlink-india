// app/dashboard/analytics/page.tsx
import { getSession } from "@/lib/auth";
import { getLinksByCreator, getClickEventsByCreator } from "@/lib/db";
import { redirect } from "next/navigation";
import { AnalyticsClient } from "@/components/AnalyticsClient";

export default async function AnalyticsPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const [links, events] = await Promise.all([
    getLinksByCreator(session.creatorId),
    getClickEventsByCreator(session.creatorId),
  ]);

  const analytics = links.map((link) => {
    const linkEvents = events
      .filter((e) => e.linkId === link.id)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    return {
      id: link.id,
      title: link.title,
      network: link.network,
      clicks: link.clickCount,
      lastClicked: linkEvents[0]?.timestamp || null,
    };
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
        <p className="text-gray-500 text-sm mt-1">Track clicks across your links.</p>
      </div>
      <AnalyticsClient analytics={analytics} />
    </div>
  );
}
