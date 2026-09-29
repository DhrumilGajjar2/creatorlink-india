// app/dashboard/products/page.tsx
import { getSession } from "@/lib/auth";
import { getProductsByCreator, getCreatorById } from "@/lib/db";
import { redirect } from "next/navigation";
import { ProductsManager } from "@/components/ProductsManager";

export default async function ProductsPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const [products, creator] = await Promise.all([
    getProductsByCreator(session.creatorId),
    getCreatorById(session.creatorId),
  ]);

  if (!creator) redirect("/login");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Products</h1>
        <p className="text-gray-500 text-sm mt-1">
          Create digital products and accept payments via Razorpay.
        </p>
      </div>
      <ProductsManager initialProducts={products} creatorHandle={creator.handle} />
    </div>
  );
}
