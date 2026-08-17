"use client";

import * as React from "react";
import Image from "next/image";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import { cn } from "@/lib/utils";

interface AnimatedProductImageProps {
  src: string;
  alt: string;
  priority?: boolean;
  sizes?: string;
  /** Gentle continuous float (use on hero / details, not on grid cards). */
  float?: boolean;
  /** Pointer-follow 3D tilt on hover-capable devices. */
  tilt?: boolean;
  className?: string;
  /** Rounded glow/gradient plate behind the device. */
  glow?: boolean;
}

/**
 * Premium, reusable product image with Apple-store-style motion:
 * smooth entrance reveal, optional floating, and a pointer-driven 3D tilt.
 * All motion is disabled under prefers-reduced-motion.
 */
export function AnimatedProductImage({
  src,
  alt,
  priority,
  sizes = "(max-width: 768px) 90vw, 40vw",
  float = false,
  tilt = false,
  className,
  glow = true,
}: AnimatedProductImageProps) {
  const reduce = useReducedMotion();

  // Pointer tilt (desktop only). Springs keep it silky.
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [8, -8]), {
    stiffness: 150,
    damping: 18,
  });
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-8, 8]), {
    stiffness: 150,
    damping: 18,
  });

  const canTilt = tilt && !reduce;

  function onMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!canTilt) return;
    const rect = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - rect.left) / rect.width - 0.5);
    my.set((e.clientY - rect.top) / rect.height - 0.5);
  }
  function onLeave() {
    mx.set(0);
    my.set(0);
  }

  return (
    <motion.div
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 24, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      style={canTilt ? { rotateX, rotateY, transformPerspective: 1000 } : undefined}
      className={cn("relative isolate [transform-style:preserve-3d]", className)}
    >
      {glow && (
        <div
          aria-hidden
          className="absolute inset-0 -z-10 mx-auto max-w-[85%] rounded-[3rem] bg-gradient-to-b from-accent-soft/15 to-accent/10 blur-3xl"
        />
      )}
      <motion.div
        animate={float && !reduce ? { y: [0, -14, 0] } : undefined}
        transition={
          float && !reduce
            ? { duration: 6, repeat: Infinity, ease: "easeInOut" }
            : undefined
        }
        className="relative aspect-[4/5] w-full"
      >
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          sizes={sizes}
          className="object-contain drop-shadow-[0_30px_45px_rgba(16,16,24,0.18)]"
        />
      </motion.div>
    </motion.div>
  );
}
