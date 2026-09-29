// lib/db/types.ts
// Shared TypeScript types for all data models

export interface Creator {
  id: string;
  handle: string;
  name: string;
  bio: string;
  avatarUrl: string;
  languages: string[];
  affiliateIds: Record<string, string>; // { amazon: "tag-20", flipkart: "aff123" }
  razorpayAccountId?: string;
  email: string;
  passwordHash: string;
  createdAt: string;
}

export type Network = "amazon" | "flipkart" | "myntra" | "other";

export interface Link {
  id: string;
  creatorId: string;
  url: string;
  network: Network;
  title: string;
  image: string;
  price: string;
  position: number;
  clickCount: number;
  createdAt: string;
}

export interface ClickEvent {
  id: string;
  linkId: string;
  timestamp: string;
  referrer: string;
  device: string;
}

export type DeliveryType = "file" | "booking";

export interface Product {
  id: string;
  creatorId: string;
  title: string;
  price: number;
  deliveryType: DeliveryType;
  razorpayPaymentLinkId?: string;
  saleCount: number;
  createdAt: string;
}

export interface DB {
  creators: Creator[];
  links: Link[];
  clickEvents: ClickEvent[];
  products: Product[];
}
