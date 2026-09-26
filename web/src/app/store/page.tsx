import type { Metadata } from "next";
import StoreContent, { type Product } from "./StoreContent";
import { db } from "@/lib/db";

export const metadata: Metadata = {
  title: "Store",
  description: "Official Cyber Security Club merchandise — stickers, T-shirts, and more.",
};

const DEFAULT_PRODUCTS: Product[] = [
  { id: "sticker-pack", name: "CSC Sticker Pack", price: 150, image: "/images/store/Stickers/Club_Execlusive/sticker-official.png", category: "Stickers" },
  { id: "cybercon-tshirt", name: "CyberCon Exclusive T-Shirt", price: 500, image: "/images/store/merchandise/CyberCon-exclusive-edition.png", category: "Merchandise" },
  { id: "cybercon-sticker", name: "CyberCon Sticker", price: 100, image: "/images/store/Stickers/CyberCon_Execlusive/sticker-cybercon24.png", category: "Stickers" },
];

export default async function StorePage() {
  let products: Product[] = DEFAULT_PRODUCTS;

  try {
    const rows = await db.product.findMany({ orderBy: { createdAt: "asc" } });
    if (rows.length > 0) {
      products = rows.map((p) => ({
        id: String(p.id),
        name: p.name,
        price: p.price,
        image: p.imageUrl,
        category: p.category,
      }));
    }
  } catch {
    // fall back to defaults if the DB is unavailable
  }

  return <StoreContent products={products} />;
}
