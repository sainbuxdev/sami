import type { Product as PrismaProduct } from "@prisma/client";

export type Product = PrismaProduct;

/** The public-facing shape sent to client components (dates serialized). */
export type ProductDTO = Omit<Product, "createdAt" | "updatedAt"> & {
  createdAt: string;
  updatedAt: string;
};

export type SortOption = "newest" | "price-asc" | "price-desc" | "battery";

export interface StoreSettings {
  storeName: string;
  whatsappNumber: string;
  storeDescription: string;
}

export interface DashboardStats {
  total: number;
  available: number;
  sold: number;
  featured: number;
}
