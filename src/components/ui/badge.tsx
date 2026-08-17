import * as React from "react";
import { cn } from "@/lib/utils";

type Tone = "neutral" | "success" | "muted" | "accent" | "danger" | "glass";

const tones: Record<Tone, string> = {
  neutral: "bg-ink text-white",
  success: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  muted: "bg-haze text-muted border border-haze-200",
  accent: "bg-accent/10 text-accent border border-accent/20",
  danger: "bg-red-50 text-red-700 border border-red-200",
  glass: "glass-dark text-white",
};

export function Badge({
  tone = "muted",
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & { tone?: Tone }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
        tones[tone],
        className,
      )}
      {...props}
    />
  );
}
