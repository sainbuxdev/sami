"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

interface DialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children?: React.ReactNode;
}

/** Accessible modal dialog: focus trap-lite, ESC to close, backdrop click. */
export function Dialog({ open, onClose, title, description, children }: DialogProps) {
  const titleId = React.useId();
  const descId = React.useId();

  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-ink/40 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            aria-describedby={description ? descId : undefined}
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 8 }}
            transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 w-full max-w-md rounded-3xl border border-haze-200 bg-white p-6 shadow-lift sm:p-7"
          >
            <button
              onClick={onClose}
              className="absolute right-4 top-4 text-muted transition-colors hover:text-ink"
              aria-label="Close dialog"
            >
              <X className="h-5 w-5" />
            </button>
            <h2 id={titleId} className="text-xl font-semibold tracking-tight text-ink">
              {title}
            </h2>
            {description && (
              <p id={descId} className="mt-2 text-sm leading-relaxed text-muted">
                {description}
              </p>
            )}
            {children && <div className="mt-6">{children}</div>}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
