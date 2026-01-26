import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        // Base structure
        "flex h-10 w-full rounded-md border px-3 py-2 text-base transition-all duration-200 outline-none md:text-sm",
        "file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground",
        "placeholder:text-zinc-500 dark:placeholder:text-neutral-500 selection:bg-primary selection:text-primary-foreground",
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        
        // Light Mode: Solid white background to pop against zinc-50
        "bg-white border-zinc-200 shadow-sm text-zinc-900",
        "focus-visible:border-zinc-500 focus-visible:ring-4 focus-visible:ring-zinc-900/5",
        
        // Dark Mode: Deep neutral background to contrast neutral-900
        // Using neutral-950 or zinc-950 makes the input look like a "cutout"
        "dark:bg-neutral-950 dark:border-neutral-800 dark:text-neutral-100",
        "dark:focus-visible:border-neutral-700 dark:focus-visible:ring-neutral-400/10",
        
        // Error states
        "aria-invalid:border-destructive aria-invalid:ring-destructive/20",
        
        className
      )}
      {...props}
    />
  )
}

export { Input }