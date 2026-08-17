"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  LayoutDashboard,
  Smartphone,
  Star,
  Settings,
  LogOut,
  Menu,
  X,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Smartphone },
  { href: "/admin/featured", label: "Featured", icon: Star },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export function AdminShell({
  adminName,
  children,
}: {
  adminName: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => setOpen(false), [pathname]);

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/admin/login");
    router.refresh();
  }

  const NavLinks = () => (
    <nav className="flex flex-1 flex-col gap-1">
      {nav.map((item) => {
        const active = pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-2xl px-3.5 py-2.5 text-sm font-medium transition-colors",
              active ? "bg-ink text-white" : "text-muted hover:bg-haze hover:text-ink",
            )}
          >
            <item.icon className="h-[18px] w-[18px]" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );

  const SidebarBody = () => (
    <>
      <div>
        <Link href="/admin/dashboard" className="flex items-center gap-2 px-1 font-semibold tracking-tight">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-ink text-white">
            <Smartphone className="h-4 w-4" />
          </span>
          Sami&apos;s iPhone
        </Link>
        <p className="mt-1 px-1 text-xs text-muted">Admin Portal</p>
      </div>

      <div className="mt-8 flex flex-1 flex-col">
        <NavLinks />
        <div className="mt-4 space-y-1 border-t border-haze-200 pt-4">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-3 rounded-2xl px-3.5 py-2.5 text-sm font-medium text-muted transition-colors hover:bg-haze hover:text-ink"
          >
            <ExternalLink className="h-[18px] w-[18px]" />
            View store
          </Link>
          <button
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-2xl px-3.5 py-2.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
          >
            <LogOut className="h-[18px] w-[18px]" />
            Logout
          </button>
        </div>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-haze/40">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-haze-200 bg-white p-5 lg:flex">
        <SidebarBody />
      </aside>

      {/* Mobile top bar */}
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-haze-200 bg-white/80 px-4 backdrop-blur-xl lg:hidden">
        <Link href="/admin/dashboard" className="flex items-center gap-2 font-semibold tracking-tight">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-ink text-white">
            <Smartphone className="h-4 w-4" />
          </span>
          Admin
        </Link>
        <button
          onClick={() => setOpen(true)}
          className="flex h-10 w-10 items-center justify-center rounded-xl text-ink"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>
      </header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <div className="lg:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-ink/40 backdrop-blur-sm"
              onClick={() => setOpen(false)}
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 34 }}
              className="fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-white p-5"
            >
              <button
                onClick={() => setOpen(false)}
                className="absolute right-4 top-4 text-muted hover:text-ink"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </button>
              <SidebarBody />
            </motion.aside>
          </div>
        )}
      </AnimatePresence>

      {/* Content */}
      <div className="lg:pl-64">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
          <div className="mb-1 hidden text-right text-xs text-muted lg:block">
            Signed in as {adminName}
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
