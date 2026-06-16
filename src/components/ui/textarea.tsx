import * as React from "react";

import { cn } from "@/lib/utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex min-h-16 w-full rounded-[8px] border border-primary-800/15 bg-neutral-100 px-3 py-[9px] text-base transition-colors outline-none placeholder:text-primary-800/50 focus-visible:border-accent-300 focus-visible:ring-3 focus-visible:ring-accent-300/20 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-neutral-100 disabled:text-primary-800 disabled:opacity-50 disabled:border-primary-800/15 aria-invalid:border-red-600 aria-invalid:bg-[#FFF5F5] aria-invalid:focus-visible:ring-red-600/20 data-[success=true]:border-green-600 data-[success=true]:bg-[#F0FDF4] data-[success=true]:focus-visible:ring-green-600/20 md:text-sm dark:bg-input/30 dark:disabled:bg-input/80 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };
