import { prisma } from "@/lib/db";
import type { DashboardStats, SortOption } from "@/types";
import type { Prisma } from "@prisma/client";
import { slugify, randomSuffix } from "@/lib/utils";

/**
 * Build a unique slug from a product name. Duplicate names get a short random
 * suffix (e.g. "iphone-13-a1b2c") so URLs stay clean but collision-free.
 */
export async function generateUniqueSlug(
  name: string,
  excludeId?: string,
): Promise<string> {
  const base = slugify(name) || "iphone";
  for (let attempt = 0; attempt < 6; attempt++) {
    const slug = attempt === 0 ? base : `${base}-${randomSuffix()}`;
    const existing = await prisma.product.findUnique({ where: { slug } });
    if (!existing || existing.id === excludeId) return slug;
  }
  return `${base}-${randomSuffix(8)}`;
}

const ORDER_BY: Record<SortOption, Prisma.ProductOrderByWithRelationInput> = {
  newest: { createdAt: "desc" },
  "price-asc": { price: "asc" },
  "price-desc": { price: "desc" },
  battery: { batteryHealth: "desc" },
};

export function normalizeSort(value: string | undefined | null): SortOption {
  if (value === "price-asc" || value === "price-desc" || value === "battery") {
    return value;
  }
  return "newest";
}

export interface ProductFilterOptions {
  search?: string;
  sort?: SortOption;
  /** Substring match on name, e.g. "Pro Max", "Pro", "Plus". */
  model?: string;
  minPrice?: number;
  maxPrice?: number;
  /** Minimum condition (1-10). */
  minCondition?: number;
}

/** Public listing: only available products, with optional search, filters + sort. */
export async function getAvailableProducts(opts?: ProductFilterOptions) {
  const search = opts?.search?.trim();
  const model = opts?.model?.trim();
  const sort = opts?.sort ?? "newest";

  const priceFilter: Record<string, number> = {};
  if (typeof opts?.minPrice === "number" && !Number.isNaN(opts.minPrice)) {
    priceFilter.gte = opts.minPrice;
  }
  if (typeof opts?.maxPrice === "number" && !Number.isNaN(opts.maxPrice)) {
    priceFilter.lte = opts.maxPrice;
  }

  const nameConditions = [search, model].filter(Boolean) as string[];

  return prisma.product.findMany({
    where: {
      isAvailable: true,
      ...(nameConditions.length
        ? {
            AND: nameConditions.map((term) => ({
              name: { contains: term, mode: "insensitive" as const },
            })),
          }
        : {}),
      ...(Object.keys(priceFilter).length ? { price: priceFilter } : {}),
      ...(opts?.minCondition ? { condition: { gte: opts.minCondition } } : {}),
    },
    orderBy: ORDER_BY[sort],
  });
}

export async function getFeaturedProducts(limit = 4) {
  // The home page is statically generated, so guard against the database being
  // unreachable at build time (e.g. first deploy before migrations run).
  try {
    return await prisma.product.findMany({
      where: { isAvailable: true, featured: true },
      orderBy: { createdAt: "desc" },
      take: limit,
    });
  } catch {
    return [];
  }
}

export async function getProductBySlug(slug: string) {
  return prisma.product.findUnique({ where: { slug } });
}

/** Admin listing: everything, newest first, optional search. */
export async function getAllProducts(search?: string) {
  const q = search?.trim();
  return prisma.product.findMany({
    where: q ? { name: { contains: q, mode: "insensitive" } } : undefined,
    orderBy: { createdAt: "desc" },
  });
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const [total, available, featured] = await Promise.all([
    prisma.product.count(),
    prisma.product.count({ where: { isAvailable: true } }),
    prisma.product.count({ where: { featured: true } }),
  ]);
  return { total, available, sold: total - available, featured };
}
