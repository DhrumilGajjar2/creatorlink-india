// app/dashboard/page.tsx
// Main dashboard — link management
import { getSession } from "@/lib/auth";
import { getLinksByCreator, getCreatorById } from "@/lib/db";
import { redirect } from "next/navigation";
import { LinksManager } from "@/components/LinksManager";

export default async function DashboardPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const [links, creator] = await Promise.all([
    getLinksByCreator(session.creatorId),
    getCreatorById(session.creatorId),
  ]);

  if (!creator) redirect("/login");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Your Links</h1>
        <p className="text-gray-500 text-sm mt-1">
          Add product links and share them with your audience.
        </p>
      </div>
      <LinksManager initialLinks={links} creatorHandle={creator.handle} />
    </div>
  );
}
