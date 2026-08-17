"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, Smartphone } from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "Home" },
  { href: "/products", label: "iPhones" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function Navbar({ storeName }: { storeName: string }) {
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  React.useEffect(() => setOpen(false), [pathname]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        scrolled ? "glass border-b border-haze-200/70" : "bg-transparent",
      )}
    >
      <nav className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-ink text-white">
            <Smartphone className="h-4 w-4" />
          </span>
          <span className="text-[15px]">{storeName}</span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {links.map((l) => {
            const active = l.href === "/" ? pathname === "/" : pathname.startsWith(l.href);
            return (
              <Link
                key={l.href}
                href={l.href}
                className={cn(
                  "rounded-full px-3.5 py-2 text-sm font-medium transition-colors",
                  active ? "text-ink" : "text-muted hover:text-ink",
                )}
              >
                {l.label}
              </Link>
            );
          })}
        </div>

        <Link
          href="/products"
          className="hidden items-center rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-white shadow-soft transition-all hover:bg-ink-soft hover:shadow-lift active:scale-[0.98] md:inline-flex"
        >
          Browse iPhones
        </Link>

        <button
          className="md:hidden -mr-2 flex h-10 w-10 items-center justify-center rounded-xl text-ink"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="glass overflow-hidden border-b border-haze-200/70 md:hidden"
          >
            <div className="container flex flex-col gap-1 py-4">
              {links.map((l) => {
                const active = l.href === "/" ? pathname === "/" : pathname.startsWith(l.href);
                return (
                  <Link
                    key={l.href}
                    href={l.href}
                    className={cn(
                      "rounded-xl px-4 py-3 text-base font-medium transition-colors",
                      active ? "bg-haze text-ink" : "text-muted hover:bg-haze hover:text-ink",
                    )}
                  >
                    {l.label}
                  </Link>
                );
              })}
              <Link
                href="/products"
                className="mt-2 rounded-full bg-ink px-4 py-3 text-center text-base font-medium text-white"
              >
                Browse iPhones
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
