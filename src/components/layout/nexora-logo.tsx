import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * Nexora Tech logo lockup, rendered from the brand asset
 * /public/nexora-logo.png (mark + wordmark, whitespace-trimmed).
 * Sized by height; width auto-scales to the logo's aspect ratio.
 */
export function NexoraLogo({ className }: { className?: string }) {
  return (
    <Image
      src="/nexora-logo.png"
      alt="Nexora Tech"
      width={584}
      height={422}
      className={cn("h-11 w-auto", className)}
    />
  );
}
