"use client";

import * as React from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Expand } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export function ProductGallery({
  images,
  name,
  sold,
}: {
  images: string[];
  name: string;
  sold?: boolean;
}) {
  const reduce = useReducedMotion();
  const [active, setActive] = React.useState(0);
  const [lightbox, setLightbox] = React.useState(false);
  const safe = images.length ? images : ["/demo/iphone-13.svg"];
  const current = Math.min(active, safe.length - 1);

  const go = React.useCallback(
    (dir: 1 | -1) => setActive((i) => (i + dir + safe.length) % safe.length),
    [safe.length],
  );

  React.useEffect(() => {
    if (!lightbox) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(false);
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [lightbox, go]);

  return (
    <div>
      {/* Main image */}
      <div className="relative rounded-4xl border border-haze-200 bg-gradient-to-b from-haze to-white p-6 sm:p-10">
        {sold && (
          <div className="absolute right-5 top-5 z-10">
            <Badge tone="neutral">Sold</Badge>
          </div>
        )}
        <button
          type="button"
          onClick={() => setLightbox(true)}
          aria-label="Expand image"
          className="group relative block w-full"
        >
          <div className="relative mx-auto aspect-[4/5] max-w-xs overflow-hidden sm:max-w-sm">
            <AnimatePresence mode="wait">
              <motion.div
                key={current}
                initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-0"
              >
                <Image
                  src={safe[current]!}
                  alt={`${name} - image ${current + 1}`}
                  fill
                  priority
                  sizes="(max-width: 1024px) 90vw, 45vw"
                  className="object-contain drop-shadow-[0_30px_45px_rgba(16,16,24,0.18)] transition-transform duration-500 ease-out group-hover:scale-105"
                />
              </motion.div>
            </AnimatePresence>
          </div>
          <span className="absolute bottom-2 right-2 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/80 text-ink opacity-0 shadow-soft backdrop-blur transition-opacity group-hover:opacity-100">
            <Expand className="h-4 w-4" />
          </span>
        </button>
      </div>

      {/* Thumbnails */}
      {safe.length > 1 && (
        <div className="mt-4 flex flex-wrap gap-2.5">
          {safe.map((url, i) => (
            <button
              key={`${url}-${i}`}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`View image ${i + 1}`}
              aria-current={i === current}
              className={cn(
                "relative h-16 w-16 overflow-hidden rounded-2xl border bg-gradient-to-b from-haze to-white transition-all sm:h-20 sm:w-20",
                i === current
                  ? "border-ink ring-2 ring-ink/15"
                  : "border-haze-200 opacity-70 hover:opacity-100",
              )}
            >
              <Image src={url} alt="" fill className="object-contain p-1.5" sizes="80px" />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[95] flex items-center justify-center bg-ink/80 p-4 backdrop-blur-md"
            onClick={() => setLightbox(false)}
          >
            <button
              onClick={() => setLightbox(false)}
              aria-label="Close"
              className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
            >
              <X className="h-5 w-5" />
            </button>

            {safe.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    go(-1);
                  }}
                  aria-label="Previous image"
                  className="absolute left-3 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 sm:left-6"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    go(1);
                  }}
                  aria-label="Next image"
                  className="absolute right-3 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 sm:right-6"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              </>
            )}

            <motion.div
              key={current}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.25 }}
              className="relative h-[70vh] w-[90vw] max-w-3xl"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={safe[current]!}
                alt={`${name} - image ${current + 1}`}
                fill
                sizes="90vw"
                className="object-contain"
              />
            </motion.div>

            {safe.length > 1 && (
              <div className="absolute bottom-5 left-1/2 -translate-x-1/2 rounded-full bg-white/10 px-3 py-1 text-sm text-white">
                {current + 1} / {safe.length}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
