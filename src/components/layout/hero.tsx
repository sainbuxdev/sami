"use client";

import * as React from "react";
import Link from "next/link";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { AnimatedProductImage } from "@/components/product/animated-product-image";

const easeOut = [0.22, 1, 0.36, 1] as const;

export function Hero({
  heroImage,
  heroAlt,
}: {
  heroImage: string;
  heroAlt: string;
}) {
  const reduce = useReducedMotion();
  const sectionRef = React.useRef<HTMLElement>(null);

  // Apple-style scroll choreography: as the hero scrolls away, the device
  // drifts up and scales down slightly while the copy parallaxes. Springs keep
  // it smooth. All disabled under prefers-reduced-motion.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const smooth = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 });
  const imageY = useTransform(smooth, [0, 1], [0, -70]);
  const imageScale = useTransform(smooth, [0, 1], [1, 0.86]);
  const imageOpacity = useTransform(smooth, [0, 0.85], [1, 0.35]);
  const copyY = useTransform(smooth, [0, 1], [0, 40]);

  const rise = (delay: number) => ({
    initial: reduce ? { opacity: 0 } : { opacity: 0, y: 18 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.7, ease: easeOut, delay },
  });

  return (
    <section ref={sectionRef} className="wash relative overflow-hidden">
      <motion.div
        style={reduce ? undefined : { y: copyY }}
        className="container grid items-center gap-8 pb-10 pt-10 sm:pt-16 lg:grid-cols-2 lg:gap-6 lg:pb-20"
      >
        <div className="order-2 lg:order-1">
          <motion.p
            {...rise(0)}
            className="text-xs font-semibold uppercase tracking-[0.2em] text-muted"
          >
            Sami&apos;s iPhone
          </motion.p>
          <motion.h1
            {...rise(0.08)}
            className="mt-4 text-4xl font-semibold leading-[1.05] tracking-tight text-ink sm:text-5xl lg:text-6xl"
          >
            Premium iPhones.
            <br />
            <span className="text-muted">Trusted by people.</span>
          </motion.h1>
          <motion.p
            {...rise(0.16)}
            className="mt-5 max-w-md text-base leading-relaxed text-muted sm:text-lg"
          >
            Quality new and used iPhones, with honest condition ratings, real
            battery health, and transparent pricing. Find your next iPhone.
          </motion.p>
          <motion.div {...rise(0.24)} className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3.5 text-sm font-medium text-white shadow-soft transition-all hover:bg-ink-soft hover:shadow-lift active:scale-[0.98]"
            >
              Explore iPhones
              <ArrowRight className="h-4 w-4" />
            </Link>
            <span className="inline-flex items-center gap-2 text-sm text-muted">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              Direct WhatsApp support
            </span>
          </motion.div>
        </div>

        <motion.div
          style={reduce ? undefined : { y: imageY, scale: imageScale, opacity: imageOpacity }}
          className="order-1 lg:order-2"
        >
          <AnimatedProductImage
            src={heroImage}
            alt={heroAlt}
            priority
            float
            tilt
            sizes="(max-width: 1024px) 70vw, 40vw"
            className="mx-auto max-w-[280px] sm:max-w-sm lg:max-w-md"
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
