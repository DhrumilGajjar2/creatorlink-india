// app/[handle]/buy/[productId]/page.tsx
// Redirects to Razorpay payment link
import { notFound, redirect } from "next/navigation";
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

  // Call our own API to get/create the payment link
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const res = await fetch(`${appUrl}/api/products/${productId}/payment-link`, {
    method: "POST",
    cache: "no-store",
  });

  const data = await res.json();

  if (data.paymentLinkUrl) {
    redirect(data.paymentLinkUrl);
  }

  // Fallback if Razorpay not configured
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center space-y-4">
        <div className="text-5xl">🛒</div>
        <h1 className="text-2xl font-bold text-gray-900">{product.title}</h1>
        <p className="text-3xl font-bold text-indigo-600">₹{product.price.toLocaleString("en-IN")}</p>
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-800">
          <strong>Razorpay not configured.</strong> Add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to .env.local to enable payments.
        </div>
        <a
          href={`/${handle}`}
          className="inline-block px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors"
        >
          ← Back to Profile
        </a>
      </div>
    </div>
  );
}
