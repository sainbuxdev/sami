"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { BatteryMedium, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatPrice, formatBattery, formatCondition } from "@/lib/utils";

export interface ProductCardData {
  slug: string;
  name: string;
  imageUrl: string;
  batteryHealth: number;
  condition: number;
  price: number;
  isAvailable: boolean;
}

export function ProductCard({
  product,
  index = 0,
}: {
  product: ProductCardData;
  index?: number;
}) {
  const reduce = useReducedMotion();
  const sold = !product.isAvailable;

  return (
    <motion.div
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: Math.min(index * 0.05, 0.3), ease: [0.22, 1, 0.36, 1] }}
    >
      <Link href={`/products/${product.slug}`} className="group block">
        <motion.article
          whileHover={reduce ? undefined : { y: -6 }}
          transition={{ type: "spring", stiffness: 300, damping: 22 }}
          className="relative overflow-hidden rounded-3xl border border-haze-200 bg-white shadow-soft transition-shadow duration-300 group-hover:shadow-lift"
        >
          <div className="relative aspect-[4/5] overflow-hidden bg-gradient-to-b from-haze to-white">
            <Image
              src={product.imageUrl}
              alt={`${product.name} - Sami's iPhone`}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-contain p-3 transition-transform duration-500 ease-out group-hover:scale-[1.05]"
            />
            <div className="absolute left-3 top-3 flex gap-1.5">
              {sold ? (
                <Badge tone="glass">Sold</Badge>
              ) : (
                <Badge tone="glass">{formatCondition(product.condition)}</Badge>
              )}
            </div>
          </div>

          <div className="space-y-3 p-5">
            <h3 className="text-lg font-semibold tracking-tight text-ink">
              {product.name}
            </h3>

            <div className="flex items-center gap-1.5 text-sm text-muted">
              <BatteryMedium className="h-4 w-4 text-emerald-600" aria-hidden />
              <span>{formatBattery(product.batteryHealth)} Battery</span>
            </div>

            <div className="flex items-center justify-between pt-1">
              <p className="text-xl font-semibold tracking-tight text-ink">
                {formatPrice(product.price)}
              </p>
              <span className="inline-flex items-center gap-1 text-sm font-medium text-muted transition-colors group-hover:text-ink">
                View
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </span>
            </div>
          </div>
        </motion.article>
      </Link>
    </motion.div>
  );
}
