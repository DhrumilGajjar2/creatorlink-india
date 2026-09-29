// components/ProductsManager.tsx
// Apple & Nike Tier Products Management UI
"use client";
import { useState } from "react";
import Link from "next/link";
import type { Product, DeliveryType } from "@/lib/db/types";

interface Props {
  initialProducts: Product[];
  creatorHandle: string;
}

export function ProductsManager({ initialProducts, creatorHandle }: Props) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [form, setForm] = useState({ title: "", price: "", deliveryType: "file" as DeliveryType });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim() || !form.price) return;
    setError("");
    setSaving(true);

    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title.trim(),
          price: Number(form.price),
          deliveryType: form.deliveryType,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to create product");
        return;
      }
      setProducts((prev) => [...prev, data]);
      setForm({ title: "", price: "", deliveryType: "file" });
      setShowForm(false);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-7 max-w-3xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-950">
            Digital Store
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            Sell digital downloads and bookings directly to your audience via Razorpay.
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn-primary py-2.5 px-5 text-xs sm:text-sm font-semibold self-start sm:self-auto"
        >
          <span>{showForm ? "✕ Close Form" : "+ Create Product"}</span>
        </button>
      </div>

      {/* Create Product Form */}
      {showForm && (
        <div className="bg-white rounded-2xl border border-black/[0.06] p-6 shadow-xs animate-fade-in-up space-y-5">
          <div className="flex items-center gap-2.5 pb-3 border-b border-neutral-100">
            <span className="w-8 h-8 rounded-xl bg-neutral-100 flex items-center justify-center text-sm">
              ✨
            </span>
            <h2 className="text-sm font-bold text-neutral-900">
              New Digital Offering
            </h2>
          </div>

          <form onSubmit={handleCreate} className="space-y-4">
            {error && (
              <div role="alert" className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-center gap-2">
                <span>⚠️</span>
                <span>{error}</span>
              </div>
            )}

            {/* Segmented Delivery Type Control */}
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-2">
                Product Type
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                {[
                  { type: "file" as DeliveryType, icon: "📄", title: "Digital File", desc: "Templates, Presets, PDFs, Guides" },
                  { type: "booking" as DeliveryType, icon: "📅", title: "1:1 Consultation", desc: "Calls, Mentorship, Strategy" },
                ].map(({ type, icon, title, desc }) => {
                  const selected = form.deliveryType === type;
                  return (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setForm({ ...form, deliveryType: type })}
                      className={`
                        p-3.5 rounded-xl border text-left transition-all
                        ${
                          selected
                            ? "bg-white border-neutral-900 ring-2 ring-neutral-900/10 shadow-xs"
                            : "bg-[#f5f5f7] border-neutral-200/80 hover:border-neutral-300"
                        }
                      `}
                    >
                      <div className="text-xl mb-1">{icon}</div>
                      <div className="text-xs font-bold text-neutral-900">{title}</div>
                      <div className="text-[11px] text-neutral-500 mt-0.5">{desc}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Product Title */}
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1.5" htmlFor="prod-title">
                Product Title
              </label>
              <input
                id="prod-title"
                type="text"
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder={form.deliveryType === "file" ? "e.g. Creator Growth Notion Template 2026" : "e.g. 1:1 Content Strategy Consultation"}
                className="input-field text-sm"
              />
            </div>

            {/* Price in INR */}
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1.5" htmlFor="prod-price">
                Price (INR)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 font-semibold text-sm">
                  ₹
                </span>
                <input
                  id="prod-price"
                  type="number"
                  required
                  min={1}
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  placeholder="499"
                  className="input-field text-sm pl-8"
                />
              </div>
              {form.price && !isNaN(Number(form.price)) && (
                <p className="text-[11px] text-neutral-500 mt-1">
                  Buyers will pay ₹{Number(form.price).toLocaleString("en-IN")} via Razorpay.
                </p>
              )}
            </div>

            <div className="flex gap-2.5 pt-2">
              <button
                type="submit"
                disabled={saving}
                className="btn-primary flex-1 py-3 text-xs sm:text-sm font-semibold"
              >
                {saving ? "Publishing…" : "Publish Product →"}
              </button>
              <button
                type="button"
                onClick={() => { setShowForm(false); setError(""); }}
                className="btn-ghost py-3 px-5 text-xs sm:text-sm font-medium"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Empty State */}
      {products.length === 0 && !showForm && (
        <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-neutral-300 p-8">
          <div className="text-4xl mb-3">💰</div>
          <h2 className="text-base font-bold text-neutral-900 mb-1">
            No digital products yet
          </h2>
          <p className="text-xs text-neutral-500 max-w-sm mx-auto mb-6 leading-relaxed">
            Sell downloadable files, courses, or 1:1 consultation sessions directly to your followers.
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="btn-primary py-2.5 px-5 text-xs font-semibold"
          >
            + Create First Product
          </button>
        </div>
      )}

      {/* Products List */}
      {products.length > 0 && (
        <div className="space-y-3">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-2xl border border-black/[0.06] shadow-2xs card-hover overflow-hidden"
            >
              <div className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3.5 flex-1 min-w-0">
                    <div className="w-12 h-12 rounded-xl bg-neutral-100 border border-neutral-200/80 flex items-center justify-center text-xl flex-shrink-0">
                      {product.deliveryType === "file" ? "📄" : "📅"}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-semibold bg-neutral-100 text-neutral-700 px-2 py-0.5 rounded-md capitalize">
                          {product.deliveryType === "file" ? "Digital File" : "Booking"}
                        </span>
                        {product.saleCount > 0 && (
                          <span className="text-[10px] font-semibold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-md">
                            🔥 {product.saleCount} sold
                          </span>
                        )}
                      </div>

                      <h3 className="font-semibold text-xs sm:text-sm text-neutral-900 line-clamp-2">
                        {product.title}
                      </h3>

                      <p className="text-neutral-950 font-bold text-sm mt-1">
                        ₹{product.price.toLocaleString("en-IN")}
                      </p>
                    </div>
                  </div>

                  <Link
                    href={`/${creatorHandle}/buy/${product.id}`}
                    target="_blank"
                    className="touch-target-44 flex-shrink-0 px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200/80 text-neutral-800 border border-neutral-200/60 rounded-xl text-xs font-semibold transition-colors"
                  >
                    View Buy Page ↗
                  </Link>
                </div>
              </div>

              {/* Status bar */}
              <div className="px-5 py-2.5 bg-[#fafafa] border-t border-neutral-100 flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${product.razorpayPaymentLinkId ? "bg-emerald-500" : "bg-amber-500"}`} />
                  <span className="text-neutral-500">
                    {product.razorpayPaymentLinkId ? "Razorpay link active" : "Razorpay test mode ready"}
                  </span>
                </div>
                <span className="text-neutral-400 font-mono">{product.saleCount} sales</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Razorpay Test Mode Banner */}
      <div className="flex items-start gap-3 p-4 bg-white border border-neutral-200/80 rounded-2xl shadow-2xs">
        <span className="text-base flex-shrink-0">💳</span>
        <div className="text-xs text-neutral-600 leading-relaxed">
          <p className="font-semibold text-neutral-900 mb-0.5">Test Payments Active</p>
          <p>
            Transactions run in Razorpay test mode. Add your live <code className="bg-neutral-100 px-1 py-0.5 rounded font-mono text-[11px]">RAZORPAY_KEY_ID</code> and <code className="bg-neutral-100 px-1 py-0.5 rounded font-mono text-[11px]">RAZORPAY_KEY_SECRET</code> to <code className="bg-neutral-100 px-1 py-0.5 rounded font-mono text-[11px]">.env.local</code> when you are ready to accept live INR payments.
          </p>
        </div>
      </div>
    </div>
  );
}
