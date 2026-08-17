import * as React from "react";
import { cn } from "@/lib/utils";

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => {
  return (
    <textarea
      ref={ref}
      className={cn(
        "w-full rounded-2xl border border-haze-200 bg-white px-4 py-3 text-sm text-ink",
        "placeholder:text-muted/60 transition-colors resize-y min-h-[120px] leading-relaxed",
        "focus:border-ink/30 focus:outline-none focus:ring-2 focus:ring-ink/10",
        "disabled:cursor-not-allowed disabled:opacity-60",
        className,
      )}
      {...props}
    />
  );
});
Textarea.displayName = "Textarea";
