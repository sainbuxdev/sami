import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function StoreNotFound() {
  return (
    <div className="container flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted">404</p>
      <h1 className="mt-4 text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
        iPhone Not Found
      </h1>
      <p className="mt-4 max-w-md text-muted">
        This product may have been removed or sold. Browse the current collection
        to find your next iPhone.
      </p>
      <Link
        href="/products"
        className="mt-8 inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3.5 text-sm font-medium text-white transition-all hover:bg-ink-soft active:scale-[0.98]"
      >
        Browse Available iPhones <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}
