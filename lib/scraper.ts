// lib/scraper.ts
// Server-side OG scraper using fetch + cheerio
import * as cheerio from "cheerio";
import { Network } from "./db/types";

export function detectNetwork(url: string): Network {
  try {
    const { hostname } = new URL(url);
    if (hostname.includes("amazon.in") || hostname.includes("amzn.in")) return "amazon";
    if (hostname.includes("flipkart.com")) return "flipkart";
    if (hostname.includes("myntra.com")) return "myntra";
  } catch {
    // ignore
  }
  return "other";
}

export function appendAffiliateTag(url: string, network: Network, affiliateIds: Record<string, string>): string {
  const tag = affiliateIds[network];
  if (!tag) return url;

  try {
    const parsed = new URL(url);
    if (network === "amazon") {
      parsed.searchParams.set("tag", tag);
    } else if (network === "flipkart") {
      parsed.searchParams.set("affid", tag);
    } else if (network === "myntra") {
      parsed.searchParams.set("utm_source", tag);
    } else {
      parsed.searchParams.set("ref", tag);
    }
    return parsed.toString();
  } catch {
    return url;
  }
}

interface ScrapedData {
  title: string;
  image: string;
  price: string;
}

export async function scrapeUrl(url: string): Promise<ScrapedData> {
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; CreatorLinkBot/1.0; +https://creatorlink.in)",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
      },
      signal: AbortSignal.timeout(10000),
    });

    const html = await res.text();
    const $ = cheerio.load(html);

    const title =
      $('meta[property="og:title"]').attr("content") ||
      $('meta[name="twitter:title"]').attr("content") ||
      $("title").text() ||
      "";

    const image =
      $('meta[property="og:image"]').attr("content") ||
      $('meta[name="twitter:image"]').attr("content") ||
      "";

    // Try to find price from common patterns
    const priceText =
      $('meta[property="product:price:amount"]').attr("content") ||
      $('[class*="price"]').first().text().trim() ||
      $('[id*="price"]').first().text().trim() ||
      "";

    const priceMatch = priceText.match(/[\d,]+(\.\d+)?/);
    const price = priceMatch ? `₹${priceMatch[0]}` : "";

    return {
      title: title.trim().slice(0, 200),
      image: image.trim(),
      price: price.trim().slice(0, 50),
    };
  } catch {
    return { title: "", image: "", price: "" };
  }
}
