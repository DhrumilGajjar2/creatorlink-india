// app/[handle]/page.tsx
// Public creator profile page — mobile-first, multilingual
import { notFound } from "next/navigation";
import { getCreatorByHandle, getLinksByCreator, getProductsByCreator } from "@/lib/db";
import CreatorPublicPage from "@/components/CreatorPublicPage";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ handle: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { handle } = await params;
  const creator = await getCreatorByHandle(handle);
  if (!creator) return { title: "Not Found" };
  return {
    title: `${creator.name} | CreatorLink India`,
    description: creator.bio,
    openGraph: {
      images: [creator.avatarUrl],
    },
  };
}

export default async function HandlePage({ params }: Props) {
  const { handle } = await params;
  const creator = await getCreatorByHandle(handle);
  if (!creator) notFound();

  const [links, products] = await Promise.all([
    getLinksByCreator(creator.id),
    getProductsByCreator(creator.id),
  ]);

  // Strip sensitive fields
  const { passwordHash, email, ...publicCreator } = creator;

  return (
    <CreatorPublicPage
      creator={publicCreator}
      links={links}
      products={products}
    />
  );
}
