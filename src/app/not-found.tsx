import Link from "next/link";

export default function RootNotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white px-6 text-center">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted">404</p>
      <h1 className="mt-4 text-4xl font-semibold tracking-tight text-ink">
        Page not found
      </h1>
      <p className="mt-4 max-w-md text-muted">
        The page you&apos;re looking for doesn&apos;t exist or has moved.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex items-center rounded-full bg-ink px-6 py-3.5 text-sm font-medium text-white transition-all hover:bg-ink-soft active:scale-[0.98]"
      >
        Back home
      </Link>
    </div>
  );
}
