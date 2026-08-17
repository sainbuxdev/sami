"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, ArrowUpDown, SlidersHorizontal, X } from "lucide-react";
import { cn } from "@/lib/utils";

const SORTS = [
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "battery", label: "Battery Health" },
] as const;

const MODELS = ["Pro Max", "Pro", "Plus", "Mini"] as const;

const CONDITIONS = [
  { value: "", label: "Any condition" },
  { value: "9", label: "9/10 and above" },
  { value: "8", label: "8/10 and above" },
  { value: "7", label: "7/10 and above" },
  { value: "6", label: "6/10 and above" },
] as const;

interface Props {
  initialSearch: string;
  initialSort: string;
  initialModel: string;
  initialMinPrice: string;
  initialMaxPrice: string;
  initialMinCondition: string;
}

export function ProductFilters({
  initialSearch,
  initialSort,
  initialModel,
  initialMinPrice,
  initialMaxPrice,
  initialMinCondition,
}: Props) {
  const router = useRouter();
  const params = useSearchParams();

  const [term, setTerm] = React.useState(initialSearch);
  const [minPrice, setMinPrice] = React.useState(initialMinPrice);
  const [maxPrice, setMaxPrice] = React.useState(initialMaxPrice);
  const [open, setOpen] = React.useState(false);

  const update = React.useCallback(
    (patch: Record<string, string>) => {
      const next = new URLSearchParams(params.toString());
      for (const [key, value] of Object.entries(patch)) {
        if (value) next.set(key, value);
        else next.delete(key);
      }
      router.replace(`/products?${next.toString()}`, { scroll: false });
    },
    [params, router],
  );

  // Debounce free-text search.
  React.useEffect(() => {
    const id = setTimeout(() => update({ q: term.trim() }), 300);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [term]);

  // Debounce price range.
  React.useEffect(() => {
    const id = setTimeout(
      () => update({ min: minPrice.trim(), max: maxPrice.trim() }),
      400,
    );
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [minPrice, maxPrice]);

  const activeCount =
    (initialModel ? 1 : 0) +
    (initialMinCondition ? 1 : 0) +
    (initialMinPrice ? 1 : 0) +
    (initialMaxPrice ? 1 : 0);

  function clearAll() {
    setTerm("");
    setMinPrice("");
    setMaxPrice("");
    const next = new URLSearchParams();
    if (initialSort && initialSort !== "newest") next.set("sort", initialSort);
    router.replace(`/products?${next.toString()}`, { scroll: false });
  }

  return (
    <div className="rounded-3xl border border-haze-200 bg-white p-4 shadow-soft sm:p-5">
      {/* Top row: search + sort + filters toggle */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input
            type="search"
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            placeholder="Search iPhone 11, 13, 15"
            aria-label="Search iPhones"
            className="h-11 w-full rounded-full border border-haze-200 bg-white pl-11 pr-4 text-sm text-ink placeholder:text-muted/70 focus:border-ink/30 focus:outline-none focus:ring-2 focus:ring-ink/10"
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            className={cn(
              "inline-flex h-11 items-center gap-2 rounded-full border px-4 text-sm font-medium transition-colors",
              open || activeCount > 0
                ? "border-ink bg-ink text-white"
                : "border-haze-200 bg-white text-ink hover:bg-haze",
            )}
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filters
            {activeCount > 0 && (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-white px-1 text-xs font-semibold text-ink">
                {activeCount}
              </span>
            )}
          </button>

          <div className="relative">
            <ArrowUpDown className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <select
              value={initialSort}
              onChange={(e) =>
                update({ sort: e.target.value === "newest" ? "" : e.target.value })
              }
              aria-label="Sort products"
              className="h-11 appearance-none rounded-full border border-haze-200 bg-white pl-11 pr-9 text-sm font-medium text-ink focus:border-ink/30 focus:outline-none focus:ring-2 focus:ring-ink/10"
            >
              {SORTS.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Expandable filter panel */}
      {open && (
        <div className="mt-4 grid gap-5 border-t border-haze-200 pt-4 sm:grid-cols-3">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">
              Model
            </p>
            <div className="flex flex-wrap gap-1.5">
              {MODELS.map((m) => {
                const active = initialModel === m;
                return (
                  <button
                    key={m}
                    type="button"
                    onClick={() => update({ model: active ? "" : m })}
                    className={cn(
                      "rounded-full border px-3 py-1.5 text-sm font-medium transition-colors",
                      active
                        ? "border-ink bg-ink text-white"
                        : "border-haze-200 bg-white text-muted hover:border-ink/30 hover:text-ink",
                    )}
                  >
                    {m}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">
              Price (PKR)
            </p>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={0}
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                placeholder="Min"
                aria-label="Minimum price"
                className="h-10 w-full rounded-xl border border-haze-200 bg-white px-3 text-sm focus:border-ink/30 focus:outline-none focus:ring-2 focus:ring-ink/10"
              />
              <span className="text-muted">to</span>
              <input
                type="number"
                min={0}
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                placeholder="Max"
                aria-label="Maximum price"
                className="h-10 w-full rounded-xl border border-haze-200 bg-white px-3 text-sm focus:border-ink/30 focus:outline-none focus:ring-2 focus:ring-ink/10"
              />
            </div>
          </div>

          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">
              Condition
            </p>
            <select
              value={initialMinCondition}
              onChange={(e) => update({ cond: e.target.value })}
              aria-label="Minimum condition"
              className="h-10 w-full rounded-xl border border-haze-200 bg-white px-3 text-sm font-medium text-ink focus:border-ink/30 focus:outline-none focus:ring-2 focus:ring-ink/10"
            >
              {CONDITIONS.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>

          {activeCount > 0 && (
            <div className="sm:col-span-3">
              <button
                type="button"
                onClick={clearAll}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-muted transition-colors hover:text-ink"
              >
                <X className="h-4 w-4" /> Clear all filters
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
