// app/api/products/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getProductsByCreator, createProduct } from "@/lib/db";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const products = await getProductsByCreator(session.creatorId);
  return NextResponse.json(products);
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { title, price, deliveryType } = await req.json();
  if (!title || price == null || !deliveryType) {
    return NextResponse.json({ error: "Missing required fields: title, price, deliveryType" }, { status: 400 });
  }
  if (Number(price) < 1) {
    return NextResponse.json({ error: "Price must be at least ₹1" }, { status: 400 });
  }

  const product = await createProduct({
    creatorId: session.creatorId,
    title,
    price: Number(price),
    deliveryType,
  });

  return NextResponse.json(product, { status: 201 });
}
