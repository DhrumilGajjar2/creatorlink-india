// app/[handle]/buy/[productId]/page.tsx
// Apple Store Style Checkout / Payment Link Screen
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { getProductById, getCreatorByHandle } from "@/lib/db";

interface Props {
  params: Promise<{ handle: string; productId: string }>;
}

export default async function BuyPage({ params }: Props) {
  const { handle, productId } = await params;

  const creator = await getCreatorByHandle(handle);
  if (!creator) notFound();

  const product = await getProductById(productId);
  if (!product || product.creatorId !== creator.id) notFound();

  // Call internal API to get/create the Razorpay payment link
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const res = await fetch(`${appUrl}/api/products/${productId}/payment-link`, {
    method: "POST",
    cache: "no-store",
  });

  const data = await res.json().catch(() => ({}));

  if (data.paymentLinkUrl) {
    redirect(data.paymentLinkUrl);
  }

  // Fallback screen when Razorpay keys are not yet configured or in test mode
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fbfbfd] px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-3xl border border-black/[0.08] shadow-lg p-8 sm:p-10 space-y-6 text-center">
        {/* Creator Identity */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-neutral-100 text-neutral-700 text-xs font-medium">
          <span>✨</span>
          <span>Official Store of @{handle}</span>
        </div>

        {/* Product Details */}
        <div className="space-y-3">
          <div className="w-16 h-16 rounded-2xl bg-neutral-100 border border-neutral-200/80 flex items-center justify-center text-3xl mx-auto shadow-2xs">
            {product.deliveryType === "file" ? "📄" : "📅"}
          </div>

          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-950">
            {product.title}
          </h1>

          <p className="text-3xl font-extrabold text-neutral-950 tracking-tight">
            ₹{product.price.toLocaleString("en-IN")}
          </p>

          <span className="inline-block text-[11px] font-semibold text-neutral-500 bg-neutral-100 px-3 py-1 rounded-full uppercase tracking-wider">
            {product.deliveryType === "file" ? "Instant Digital Download" : "1:1 Live Consultation"}
          </span>
        </div>

        {/* Reassurance & Test Notice */}
        <div className="p-4 bg-neutral-50 border border-neutral-200/80 rounded-2xl text-left space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-neutral-800">
            <span>🛡️</span>
            <span>Razorpay Secure Test Mode</span>
          </div>
          <p className="text-[11px] text-neutral-500 leading-relaxed">
            Live INR payments will activate when the creator connects their Razorpay credentials in <code className="font-mono text-neutral-700 bg-neutral-200/60 px-1 py-0.5 rounded">.env.local</code>.
          </p>
        </div>

        {/* Action Button */}
        <div>
          <Link
            href={`/${handle}`}
            className="btn-primary w-full py-3.5 text-xs sm:text-sm font-semibold"
          >
            ← Return to Creator Profile
          </Link>
        </div>

        <p className="text-[11px] text-neutral-400">
          Powered by CreatorLink India · 256-bit SSL encrypted
        </p>
      </div>
    </div>
  );
}
