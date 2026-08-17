import Link from "next/link";
import { PackageOpen } from "lucide-react";

export function EmptyState({
  title,
  message,
  actionHref,
  actionLabel,
}: {
  title: string;
  message: string;
  actionHref?: string;
  actionLabel?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-haze-200 bg-haze/30 px-6 py-16 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-soft">
        <PackageOpen className="h-6 w-6 text-muted" />
      </span>
      <h3 className="mt-5 text-lg font-semibold tracking-tight text-ink">{title}</h3>
      <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted">{message}</p>
      {actionHref && actionLabel && (
        <Link
          href={actionHref}
          className="mt-6 inline-flex items-center rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-white transition-all hover:bg-ink-soft active:scale-[0.98]"
        >
          {actionLabel}
        </Link>
      )}
    </div>
  );
}
