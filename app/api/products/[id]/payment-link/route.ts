// app/api/products/[id]/payment-link/route.ts
// Generate a Razorpay payment link for a product
import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getProductById, updateProduct } from "@/lib/db";
import Razorpay from "razorpay";

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Auth guard — only the owning creator can generate payment links
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const product = await getProductById(id);
  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  // Ensure the product belongs to the authenticated creator
  if (product.creatorId !== session.creatorId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // If already has a payment link, return it
  if (product.razorpayPaymentLinkId) {
    return NextResponse.json({ paymentLinkId: product.razorpayPaymentLinkId });
  }

  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret || keyId.startsWith("rzp_test_XXXX")) {
    // Return a friendly stub if keys aren't set
    return NextResponse.json(
      {
        error: "Razorpay keys not configured. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in .env.local",
        stub: true,
      },
      { status: 503 }
    );
  }

  try {
    const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const paymentLink = await (razorpay as any).paymentLink.create({
      amount: product.price * 100, // paise
      currency: "INR",
      accept_partial: false,
      description: product.title,
      notify: { sms: false, email: false },
      reminder_enable: false,
      callback_url: `${appUrl}/api/razorpay/webhook`,
      callback_method: "get",
      notes: { productId: product.id, creatorId: product.creatorId },
    });

    await updateProduct(id, { razorpayPaymentLinkId: paymentLink.id });
    return NextResponse.json({
      paymentLinkUrl: paymentLink.short_url,
      paymentLinkId: paymentLink.id,
    });
  } catch (err) {
    console.error("[payment-link]", err);
    return NextResponse.json({ error: "Failed to create payment link" }, { status: 500 });
  }
}
