import * as React from "react";
import { cn } from "@/lib/utils";

export const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, type = "text", ...props }, ref) => {
  return (
    <input
      ref={ref}
      type={type}
      className={cn(
        "h-11 w-full rounded-2xl border border-haze-200 bg-white px-4 text-sm text-ink",
        "placeholder:text-muted/60 transition-colors",
        "focus:border-ink/30 focus:outline-none focus:ring-2 focus:ring-ink/10",
        "disabled:cursor-not-allowed disabled:opacity-60",
        className,
      )}
      {...props}
    />
  );
});
Input.displayName = "Input";
