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
        viewBox="0 0 48 48"
        className="h-7 w-7 flex-shrink-0 overflow-visible"
        role="img"
        aria-label="Nexora Tech"
      >
        <defs>
          <linearGradient id="nx-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#1b2a5e" />
            <stop offset="1" stopColor="#3b5bdb" />
          </linearGradient>
        </defs>
        {/* left leg */}
        <polygon points="9,40 9,8 18,8 18,40" fill="#1b2a5e" />
        {/* diagonal ribbon (top-left to bottom-right) */}
        <polygon points="18,8 27,8 39,40 30,40" fill="url(#nx-grad)" />
        {/* right leg */}
        <polygon points="30,40 30,8 39,8 39,40" fill="#3b5bdb" />
        {/* teal accent facet at the top of the right leg */}
        <polygon points="30,8 39,8 39,17" fill="#7fe3d0" />
      </svg>
      {showText && (
        <span className="text-sm font-semibold leading-none tracking-tight text-[#1b2a5e]">
          Nexora <span className="text-[#3b5bdb]">Tech</span>
        </span>
      )}
    </span>
  );
}
