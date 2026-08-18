import { cn } from "@/lib/utils";

/**
 * Nexora Tech logo lockup: an angular "N" monogram (navy to blue with a teal
 * accent facet) beside the wordmark. Rendered as inline SVG + text so it stays
 * crisp at any size and needs no external asset.
 */
export function NexoraLogo({
  className,
  showText = true,
}: {
  className?: string;
  showText?: boolean;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <svg
        viewBox="0 0 40 40"
        className="h-7 w-7 flex-shrink-0"
        role="img"
        aria-label="Nexora Tech"
      >
        <defs>
          <linearGradient id="nx-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#1b2a5e" />
            <stop offset="1" stopColor="#3b5bdb" />
          </linearGradient>
        </defs>
        {/* Clean "N" drawn as one stroke: left up, diagonal down, right up. */}
        <path
          d="M9 31 V9 L31 31 V9"
          fill="none"
          stroke="url(#nx-grad)"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Teal accent on the top of the right leg. */}
        <path
          d="M31 9 V15"
          fill="none"
          stroke="#2dd4bf"
          strokeWidth="6"
          strokeLinecap="round"
        />
      </svg>
      {showText && (
        <span className="text-sm font-semibold leading-none tracking-tight text-[#1b2a5e]">
          Nexora <span className="text-[#3b5bdb]">Tech</span>
        </span>
      )}
    </span>
  );
}
