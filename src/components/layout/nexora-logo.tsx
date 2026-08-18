import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * Nexora Tech logo lockup, rendered from the brand asset at
 * /public/nexora-tech.png (mark + wordmark). Sized by height; width auto-scales.
 */
export function NexoraLogo({ className }: { className?: string }) {
  return (
    <Image
      src="/nexora-tech.png"
      alt="Nexora Tech"
      width={1408}
      height={768}
      className={cn("h-10 w-auto", className)}
      priority={false}
    />
  );
}
