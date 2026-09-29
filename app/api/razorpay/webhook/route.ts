// app/api/razorpay/webhook/route.ts
// Razorpay webhook handler — increments saleCount on payment capture
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { getProductById, incrementProductSale } from "@/lib/db";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("x-razorpay-signature") || "";
  const secret = process.env.RAZORPAY_KEY_SECRET;

  // Verify webhook signature
  if (secret) {
    const expected = crypto
      .createHmac("sha256", secret)
      .update(body)
      .digest("hex");
    if (expected !== signature) {
      console.warn("[webhook] Invalid signature");
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }
  }

  const event = JSON.parse(body);
  console.log("[webhook] Received event:", event.event);

  if (event.event === "payment_link.paid" || event.event === "payment.captured") {
    const notes = event.payload?.payment?.entity?.notes || event.payload?.payment_link?.entity?.notes || {};
    const productId = notes?.productId;

    if (productId) {
      const product = await getProductById(productId);
      if (product) {
        await incrementProductSale(productId);
        console.log(`[webhook] ✅ Sale recorded for product "${product.title}" (${productId})`);
      }
    }
  }

  return NextResponse.json({ ok: true });
}
