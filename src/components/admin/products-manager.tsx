"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Search, Pencil, Trash2, Star, Tag, RotateCcw, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/layout/empty-state";
import { useToast } from "@/components/ui/toast";
import { cn, formatPrice, formatBattery, formatCondition } from "@/lib/utils";

export interface AdminProduct {
  id: string;
  name: string;
  imageUrl: string;
  batteryHealth: number;
  condition: number;
  price: number;
  withBox: boolean;
  isAvailable: boolean;
  featured: boolean;
}

interface EmptyStateProps {
  title: string;
  message: string;
  actionHref?: string;
  actionLabel?: string;
}

export function ProductsManager({
  products,
  emptyState,
  showAddButton = true,
}: {
  products: AdminProduct[];
  emptyState?: EmptyStateProps;
  showAddButton?: boolean;
}) {
  const router = useRouter();
  const { toast } = useToast();
  const [query, setQuery] = React.useState("");
  const [busy, setBusy] = React.useState<string | null>(null);
  const [toDelete, setToDelete] = React.useState<AdminProduct | null>(null);
  const [deleting, setDeleting] = React.useState(false);

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return products;
    return products.filter((p) => p.name.toLowerCase().includes(q));
  }, [products, query]);

  async function patch(id: string, body: Record<string, unknown>, ok: string) {
    setBusy(id);
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        toast(data.error ?? "Something went wrong.", "error");
      } else {
        toast(ok, "success");
        router.refresh();
      }
    } catch {
      toast("Something went wrong.", "error");
    } finally {
      setBusy(null);
    }
  }

  async function confirmDelete() {
    if (!toDelete) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/products/${toDelete.id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        toast(data.error ?? "Unable to delete product.", "error");
      } else {
        toast("Product deleted", "success");
        router.refresh();
      }
    } catch {
      toast("Unable to delete product.", "error");
    } finally {
      setDeleting(false);
      setToDelete(null);
    }
  }

  if (products.length === 0) {
    return (
      <EmptyState
        title={emptyState?.title ?? "Your inventory is empty."}
        message={emptyState?.message ?? "Add your first iPhone to start building the store."}
        actionHref={emptyState?.actionHref ?? "/admin/products/new"}
        actionLabel={emptyState?.actionLabel ?? "Add Your First iPhone"}
      />
    );
  }

  return (
    <div>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products..."
            aria-label="Search products"
            className="h-11 w-full rounded-full border border-haze-200 bg-white pl-11 pr-4 text-sm focus:border-ink/30 focus:outline-none focus:ring-2 focus:ring-ink/10"
          />
        </div>
        {showAddButton && (
          <Link
            href="/admin/products/new"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-white transition-all hover:bg-ink-soft active:scale-[0.98]"
          >
            <Plus className="h-4 w-4" /> Add iPhone
          </Link>
        )}
      </div>

      {filtered.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-haze-200 bg-haze/30 px-4 py-10 text-center text-sm text-muted">
          No products match that search.
        </p>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden overflow-hidden rounded-3xl border border-haze-200 bg-white lg:block">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-haze-200 text-left text-xs uppercase tracking-wide text-muted">
                  <th className="px-5 py-3.5 font-medium">Product</th>
                  <th className="px-3 py-3.5 font-medium">Battery</th>
                  <th className="px-3 py-3.5 font-medium">Cond.</th>
                  <th className="px-3 py-3.5 font-medium">Price</th>
                  <th className="px-3 py-3.5 font-medium">Box</th>
                  <th className="px-3 py-3.5 font-medium">Status</th>
                  <th className="px-5 py-3.5 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-haze-200">
                {filtered.map((p) => (
                  <tr key={p.id} className={cn("transition-colors hover:bg-haze/40", busy === p.id && "opacity-60")}>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="relative h-11 w-11 flex-shrink-0 overflow-hidden rounded-xl bg-haze">
                          <Image src={p.imageUrl} alt={p.name} fill className="object-contain p-1" sizes="44px" />
                        </div>
                        <div className="flex items-center gap-1.5 font-medium text-ink">
                          {p.name}
                          {p.featured && <Star className="h-3.5 w-3.5 fill-accent text-accent" />}
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-muted">{formatBattery(p.batteryHealth)}</td>
                    <td className="px-3 py-3 text-muted">{formatCondition(p.condition)}</td>
                    <td className="px-3 py-3 font-medium text-ink">{formatPrice(p.price)}</td>
                    <td className="px-3 py-3 text-muted">{p.withBox ? "Yes" : "No"}</td>
                    <td className="px-3 py-3">
                      {p.isAvailable ? (
                        <Badge tone="success">Active</Badge>
                      ) : (
                        <Badge tone="muted">Sold</Badge>
                      )}
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <RowAction
                          title={p.featured ? "Unfeature" : "Feature"}
                          onClick={() => patch(p.id, { featured: !p.featured }, p.featured ? "Removed from featured" : "Marked as featured")}
                          disabled={busy === p.id}
                        >
                          <Star className={cn("h-4 w-4", p.featured && "fill-accent text-accent")} />
                        </RowAction>
                        <RowAction
                          title={p.isAvailable ? "Mark Sold" : "Mark Available"}
                          onClick={() => patch(p.id, { isAvailable: !p.isAvailable }, p.isAvailable ? "Marked as sold" : "Marked as available")}
                          disabled={busy === p.id}
                        >
                          {p.isAvailable ? <Tag className="h-4 w-4" /> : <RotateCcw className="h-4 w-4" />}
                        </RowAction>
                        <RowAction title="Edit" asLink href={`/admin/products/${p.id}/edit`}>
                          <Pencil className="h-4 w-4" />
                        </RowAction>
                        <RowAction title="Delete" danger onClick={() => setToDelete(p)} disabled={busy === p.id}>
                          <Trash2 className="h-4 w-4" />
                        </RowAction>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="space-y-3 lg:hidden">
            {filtered.map((p) => (
              <div key={p.id} className={cn("rounded-3xl border border-haze-200 bg-white p-4", busy === p.id && "opacity-60")}>
                <div className="flex gap-3">
                  <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-2xl bg-haze">
                    <Image src={p.imageUrl} alt={p.name} fill className="object-contain p-1.5" sizes="64px" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <p className="truncate font-semibold text-ink">{p.name}</p>
                      {p.featured && <Star className="h-3.5 w-3.5 flex-shrink-0 fill-accent text-accent" />}
                    </div>
                    <p className="mt-0.5 text-sm font-medium text-ink">{formatPrice(p.price)}</p>
                    <p className="text-xs text-muted">
                      {formatBattery(p.batteryHealth)} · {formatCondition(p.condition)} · Box {p.withBox ? "Yes" : "No"}
                    </p>
                    <div className="mt-2">
                      {p.isAvailable ? <Badge tone="success">Active</Badge> : <Badge tone="muted">Sold</Badge>}
                    </div>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  <Link
                    href={`/admin/products/${p.id}/edit`}
                    className="inline-flex items-center justify-center gap-1.5 rounded-full border border-haze-200 py-2 text-sm font-medium text-ink"
                  >
                    <Pencil className="h-4 w-4" /> Edit
                  </Link>
                  <button
                    onClick={() => patch(p.id, { isAvailable: !p.isAvailable }, p.isAvailable ? "Marked as sold" : "Marked as available")}
                    disabled={busy === p.id}
                    className="inline-flex items-center justify-center gap-1.5 rounded-full border border-haze-200 py-2 text-sm font-medium text-ink disabled:opacity-50"
                  >
                    {p.isAvailable ? <Tag className="h-4 w-4" /> : <RotateCcw className="h-4 w-4" />}
                    {p.isAvailable ? "Mark Sold" : "Available"}
                  </button>
                  <button
                    onClick={() => patch(p.id, { featured: !p.featured }, p.featured ? "Removed from featured" : "Marked as featured")}
                    disabled={busy === p.id}
                    className="inline-flex items-center justify-center gap-1.5 rounded-full border border-haze-200 py-2 text-sm font-medium text-ink disabled:opacity-50"
                  >
                    <Star className={cn("h-4 w-4", p.featured && "fill-accent text-accent")} />
                    {p.featured ? "Unfeature" : "Feature"}
                  </button>
                  <button
                    onClick={() => setToDelete(p)}
                    disabled={busy === p.id}
                    className="inline-flex items-center justify-center gap-1.5 rounded-full border border-red-200 py-2 text-sm font-medium text-red-600 disabled:opacity-50"
                  >
                    <Trash2 className="h-4 w-4" /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      <Dialog
        open={!!toDelete}
        onClose={() => !deleting && setToDelete(null)}
        title={toDelete ? `Delete ${toDelete.name}?` : "Delete product?"}
        description="This product will be permanently removed. This action cannot be undone."
      >
        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={() => setToDelete(null)} disabled={deleting}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={confirmDelete} loading={deleting}>
            Delete Product
          </Button>
        </div>
      </Dialog>
    </div>
  );
}

function RowAction({
  title,
  children,
  onClick,
  disabled,
  danger,
  asLink,
  href,
}: {
  title: string;
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  danger?: boolean;
  asLink?: boolean;
  href?: string;
}) {
  const cls = cn(
    "flex h-9 w-9 items-center justify-center rounded-xl transition-colors disabled:opacity-40",
    danger ? "text-red-600 hover:bg-red-50" : "text-muted hover:bg-haze hover:text-ink",
  );
  if (asLink && href) {
    return (
      <Link href={href} title={title} aria-label={title} className={cls}>
        {children}
      </Link>
    );
  }
  return (
    <button type="button" title={title} aria-label={title} onClick={onClick} disabled={disabled} className={cls}>
      {children}
    </button>
  );
}
