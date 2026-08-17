import type { Metadata } from "next";
import { Suspense } from "react";
import { ProductCard } from "@/components/product/product-card";
import { ProductFilters } from "@/components/product/product-filters";
import { ProductGridSkeleton } from "@/components/product/product-card-skeleton";
import { EmptyState } from "@/components/layout/empty-state";
import { getAvailableProducts, normalizeSort } from "@/lib/products";

export const metadata: Metadata = {
  title: "Browse iPhones",
  description:
    "Browse new and used iPhones with battery health, condition ratings and transparent pricing. Buy directly via WhatsApp.",
};

type SearchParams = Promise<{
  q?: string;
  sort?: string;
  model?: string;
  min?: string;
  max?: string;
  cond?: string;
}>;

function toNumber(value?: string): number | undefined {
  if (!value) return undefined;
  const n = Number(value);
  return Number.isFinite(n) ? n : undefined;
}

async function ProductResults({ searchParams }: { searchParams: SearchParams }) {
  const sp = await searchParams;
  const products = await getAvailableProducts({
    search: sp.q,
    sort: normalizeSort(sp.sort),
    model: sp.model,
    minPrice: toNumber(sp.min),
    maxPrice: toNumber(sp.max),
    minCondition: toNumber(sp.cond),
  });

  const hasFilters = !!(sp.q || sp.model || sp.min || sp.max || sp.cond);

  if (products.length === 0) {
    return hasFilters ? (
      <EmptyState
        title="No matching iPhones"
        message="Try widening your filters or clearing the search to see everything available."
        actionHref="/products"
        actionLabel="Clear filters"
      />
    ) : (
      <EmptyState
        title="No iPhones available right now."
        message="Check back soon, new devices are added regularly."
      />
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
      {products.map((p, i) => (
        <ProductCard key={p.id} product={p} index={i} />
      ))}
    </div>
  );
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const sp = await searchParams;

  return (
    <div className="container py-10 sm:py-14">
      <header className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
          Available iPhones
        </h1>
        <p className="mt-2 text-muted">
          Quality new and used iPhones. Every device inspected, rated and
          transparently priced.
        </p>
      </header>

      <div className="mb-8">
        <ProductFilters
          initialSearch={sp.q ?? ""}
          initialSort={sp.sort ?? "newest"}
          initialModel={sp.model ?? ""}
          initialMinPrice={sp.min ?? ""}
          initialMaxPrice={sp.max ?? ""}
          initialMinCondition={sp.cond ?? ""}
        />
      </div>

      <Suspense
        key={`${sp.q ?? ""}-${sp.sort ?? ""}-${sp.model ?? ""}-${sp.min ?? ""}-${sp.max ?? ""}-${sp.cond ?? ""}`}
        fallback={<ProductGridSkeleton count={8} />}
      >
        <ProductResults searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
