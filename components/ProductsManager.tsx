// components/ProductsManager.tsx
"use client";
import { useState } from "react";
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
    if (!form.title || !form.price) return;
    setError("");
    setSaving(true);

    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title,
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
      setError("Network error — please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="text-sm text-gray-500 mt-0.5">Sell digital products and accept INR payments via Razorpay.</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 active:scale-95 transition-all text-sm shadow-sm shadow-indigo-200"
        >
          <span>➕</span> Create Product
        </button>
      </div>

      {/* Create form */}
      {showForm && (
        <div className="bg-white rounded-2xl border border-indigo-100 shadow-lg shadow-indigo-50 p-6 space-y-5 animate-fade-in-up">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 bg-indigo-100 rounded-xl flex items-center justify-center text-base">🛒</span>
            <h2 className="text-base font-semibold text-gray-900">New Product</h2>
          </div>

          <form onSubmit={handleCreate} className="space-y-4">
            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
                <span>⚠️</span> {error}
              </div>
            )}

            {/* Delivery type picker — first */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">What are you selling?</label>
              <div className="grid grid-cols-2 gap-3">
                {([
                  { type: "file", icon: "📄", title: "Digital File", desc: "Presets, templates, PDFs, courses" },
                  { type: "booking", icon: "📅", title: "Session / Booking", desc: "1:1 calls, consultations, coaching" },
                ] as { type: DeliveryType; icon: string; title: string; desc: string }[]).map(({ type, icon, title, desc }) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setForm({ ...form, deliveryType: type })}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${
                      form.deliveryType === type
                        ? "border-indigo-500 bg-indigo-50"
                        : "border-gray-200 hover:border-gray-300 bg-white"
                    }`}
                  >
                    <div className="text-2xl mb-2">{icon}</div>
                    <div className={`text-sm font-semibold mb-0.5 ${form.deliveryType === type ? "text-indigo-700" : "text-gray-900"}`}>
                      {title}
                    </div>
                    <div className="text-xs text-gray-500">{desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Product Name</label>
              <input
                type="text"
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder={form.deliveryType === "file" ? "e.g. Lightroom Presets Bundle" : "e.g. 1:1 Instagram Growth Call"}
                className="w-full px-4 py-3.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm bg-gray-50 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Price (₹)</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-semibold text-sm">₹</span>
                <input
                  type="number"
                  required
                  min={1}
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  placeholder="499"
                  className="w-full pl-8 pr-4 py-3.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm bg-gray-50 focus:bg-white"
                />
              </div>
              {form.price && !isNaN(Number(form.price)) && (
                <p className="text-xs text-gray-400 mt-1">
                  Buyers pay ₹{Number(form.price).toLocaleString("en-IN")} via Razorpay (test mode)
                </p>
              )}
            </div>

            <div className="flex gap-3 pt-1">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 disabled:opacity-60 active:scale-[0.98] transition-all text-sm"
              >
                {saving ? "Creating..." : "✓ Create Product"}
              </button>
              <button
                type="button"
                onClick={() => { setShowForm(false); setError(""); }}
                className="px-4 py-3 border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 transition-colors text-sm"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Empty state */}
      {products.length === 0 && !showForm && (
        <div className="text-center py-16 bg-white rounded-2xl border-2 border-dashed border-gray-200">
          <div className="text-5xl mb-4">💰</div>
          <h3 className="text-base font-semibold text-gray-900 mb-1">Start earning directly</h3>
          <p className="text-sm text-gray-500 mb-6 max-w-xs mx-auto">
            Create a digital product or booking and let your audience pay you via Razorpay — no website needed.
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors text-sm"
          >
            ➕ Create First Product
          </button>
        </div>
      )}

      {/* Products list */}
      {products.length > 0 && (
        <div className="space-y-3">
          {products.map((product) => (
            <div key={product.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm card-hover overflow-hidden">
              <div className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    {/* Icon */}
                    <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-2xl flex-shrink-0">
                      {product.deliveryType === "file" ? "📄" : "📅"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full capitalize">
                          {product.deliveryType === "file" ? "Digital File" : "Booking"}
                        </span>
                        {product.saleCount > 0 && (
                          <span className="text-xs font-semibold bg-green-50 text-green-600 px-2 py-0.5 rounded-full">
                            🔥 {product.saleCount} sale{product.saleCount !== 1 ? "s" : ""}
                          </span>
                        )}
                      </div>
                      <h3 className="font-semibold text-gray-900 text-sm">{product.title}</h3>
                      <p className="text-indigo-600 font-bold mt-1">₹{product.price.toLocaleString("en-IN")}</p>
                    </div>
                  </div>

                  <a
                    href={`/${creatorHandle}/buy/${product.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-shrink-0 px-3 py-1.5 bg-green-50 text-green-700 border border-green-200 rounded-lg text-xs font-semibold hover:bg-green-100 transition-colors"
                  >
                    Test Buy ↗
                  </a>
                </div>
              </div>

              {/* Status bar */}
              <div className="px-5 py-2.5 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <div className={`w-2 h-2 rounded-full ${product.razorpayPaymentLinkId ? "bg-green-400" : "bg-amber-400"}`} />
                  <span className="text-xs text-gray-500">
                    {product.razorpayPaymentLinkId ? "Razorpay link active" : "Payment link pending (buy to generate)"}
                  </span>
                </div>
                <span className="text-xs text-gray-400">{product.saleCount} sold</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Razorpay notice */}
      <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-100 rounded-xl">
        <span className="text-lg flex-shrink-0">💡</span>
        <div className="text-xs text-amber-800">
          <p className="font-semibold mb-0.5">Test Mode Active</p>
          <p>Payment links use Razorpay test mode. Add{" "}
            <code className="bg-amber-100 px-1 rounded font-mono">RAZORPAY_KEY_ID</code> and{" "}
            <code className="bg-amber-100 px-1 rounded font-mono">RAZORPAY_KEY_SECRET</code>{" "}
            to <code className="bg-amber-100 px-1 rounded font-mono">.env.local</code> to activate live payments.
          </p>
        </div>
      </div>
    </div>
  );
}
