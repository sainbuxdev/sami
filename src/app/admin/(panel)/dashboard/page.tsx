import Link from "next/link";
import Image from "next/image";
import { Boxes, CheckCircle2, Tag, Star, Plus, ArrowRight } from "lucide-react";
import { StatCard } from "@/components/admin/stat-card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/layout/empty-state";
import { getCurrentAdmin } from "@/lib/auth";
import { getDashboardStats } from "@/lib/products";
import { prisma } from "@/lib/db";
import { greeting, formatPrice, formatBattery } from "@/lib/utils";

export default async function DashboardPage() {
  const [admin, stats, recent] = await Promise.all([
    getCurrentAdmin(),
    getDashboardStats(),
    prisma.product.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
  ]);

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
            {greeting()}, {admin?.name ?? "Sami"}
          </h1>
          <p className="mt-1 text-sm text-muted">Here&apos;s your inventory overview.</p>
        </div>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center gap-2 self-start rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-white transition-all hover:bg-ink-soft active:scale-[0.98]"
        >
          <Plus className="h-4 w-4" /> Add iPhone
        </Link>
      </div>

      <section className="mt-8">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-muted">
          Inventory Overview
        </h2>
        <div className="mt-3 grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard label="Total Products" value={stats.total} icon={Boxes} />
          <StatCard label="Available" value={stats.available} icon={CheckCircle2} />
          <StatCard label="Sold" value={stats.sold} icon={Tag} />
          <StatCard label="Featured" value={stats.featured} icon={Star} />
        </div>
      </section>

      <section className="mt-10">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-muted">
            Recent Products
          </h2>
          <Link
            href="/admin/products"
            className="inline-flex items-center gap-1 text-sm font-medium text-muted transition-colors hover:text-ink"
          >
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {recent.length === 0 ? (
          <EmptyState
            title="Your inventory is empty."
            message="Add your first iPhone to start building the store."
            actionHref="/admin/products/new"
            actionLabel="Add Your First iPhone"
          />
        ) : (
          <div className="divide-y divide-haze-200 overflow-hidden rounded-3xl border border-haze-200 bg-white">
            {recent.map((p) => (
              <Link
                key={p.id}
                href={`/admin/products/${p.id}/edit`}
                className="flex items-center gap-4 p-4 transition-colors hover:bg-haze/50"
              >
                <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-2xl bg-haze">
                  <Image src={p.imageUrl} alt={p.name} fill className="object-contain p-1.5" sizes="56px" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-ink">{p.name}</p>
                  <p className="text-sm text-muted">
                    {formatPrice(p.price)} · {formatBattery(p.batteryHealth)}
                  </p>
                </div>
                <div className="flex flex-shrink-0 items-center gap-2">
                  {p.featured && <Badge tone="accent">Featured</Badge>}
                  {p.isAvailable ? (
                    <Badge tone="success">Active</Badge>
                  ) : (
                    <Badge tone="muted">Sold</Badge>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
