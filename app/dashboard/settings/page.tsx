// app/dashboard/settings/page.tsx
import { getSession } from "@/lib/auth";
import { getCreatorById } from "@/lib/db";
import { redirect } from "next/navigation";
import { SettingsForm } from "@/components/SettingsForm";

export default async function SettingsPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const creator = await getCreatorById(session.creatorId);
  if (!creator) redirect("/login");

  const { passwordHash, email, ...publicCreator } = creator;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500 text-sm mt-1">Update your profile and affiliate IDs.</p>
      </div>
      <SettingsForm creator={{ ...publicCreator, email }} />
    </div>
  );
}
