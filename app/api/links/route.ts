// app/api/links/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getLinksByCreator, createLink, getCreatorById } from "@/lib/db";
import { scrapeUrl, detectNetwork, appendAffiliateTag } from "@/lib/scraper";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const links = await getLinksByCreator(session.creatorId);
  return NextResponse.json(links);
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { url } = await req.json();
  if (!url) return NextResponse.json({ error: "URL is required" }, { status: 400 });

  // Get creator to find affiliate IDs
  const creator = await getCreatorById(session.creatorId);
  if (!creator) return NextResponse.json({ error: "Creator not found" }, { status: 404 });

  // Detect network and append affiliate tag
  const network = detectNetwork(url);
  const taggedUrl = appendAffiliateTag(url, network, creator.affiliateIds);

  // Scrape metadata
  const scraped = await scrapeUrl(url);

  // Find next position
  const existing = await getLinksByCreator(session.creatorId);
  const position = existing.length;

  const link = await createLink({
    creatorId: session.creatorId,
    url: taggedUrl,
    network,
    title: scraped.title || url,
    image: scraped.image,
    price: scraped.price,
    position,
  });

  return NextResponse.json(link, { status: 201 });
}
