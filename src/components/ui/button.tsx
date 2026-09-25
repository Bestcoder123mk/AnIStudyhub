import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

// Every button gets the same tactile press response — a hair of lift and
// brightness on hover, a real compress on press — instead of relying on
// call sites to remember to add it. That single change is most of what
// makes buttons across the whole app feel "clicky" rather than flat.
const buttonVariants = cva(
  "relative inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold transition-[transform,box-shadow,background-color,border-color,color,opacity] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] disabled:pointer-events-none disabled:opacity-40 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 active:scale-[0.97] active:duration-75 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive select-none",
  {
    variants: {
      variant: {
        // Solely black & white, theme-adaptive: solid foreground-on-background
        // rather than the accent colour, so the one primary action reads as
        // true monochrome (white pill in dark themes, black pill in light
        // ones) regardless of the user's accent-colour pick. The pointer-
        // tracked specular highlight (glass-interactive, see globals.css +
        // theme-provider.tsx's RAF loop) still rides on top — that motion is
        // what carries the "glass" feel now that colour doesn't.
        default:
          "glass-interactive bg-foreground text-background shadow-[0_1px_1px_rgba(0,0,0,0.05),0_4px_10px_-2px_rgba(0,0,0,0.25)] hover:opacity-90 hover:-translate-y-px hover:shadow-[0_2px_4px_rgba(0,0,0,0.08),0_8px_18px_-4px_rgba(0,0,0,0.3)] overflow-hidden",
        destructive:
          "bg-destructive text-white shadow-xs hover:bg-destructive/90 hover:-translate-y-px focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "border-[1.5px] border-border bg-transparent hover:bg-accent hover:text-accent-foreground hover:border-foreground/25 active:bg-accent/80",
        secondary:
          "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/70 hover:-translate-y-px",
        ghost:
          "hover:bg-accent hover:text-accent-foreground active:bg-accent/70",
        glass:
          "glass glass-interactive text-foreground shadow-[0_1px_0_0_rgba(255,255,255,0.16)_inset,0_-1px_0_0_rgba(0,0,0,0.16)_inset,0_4px_14px_-4px_rgba(0,0,0,0.3)] hover:shadow-[0_1px_0_0_rgba(255,255,255,0.22)_inset,0_-1px_0_0_rgba(0,0,0,0.18)_inset,0_8px_20px_-4px_rgba(0,0,0,0.35)] overflow-hidden",
        link: "text-foreground underline-offset-4 hover:underline active:scale-100",
      },
      size: {
        default: "h-10 px-4 py-2 has-[>svg]:px-3.5",
        sm: "h-8 rounded-lg gap-1.5 px-3 text-[13px] has-[>svg]:px-2.5",
        lg: "h-12 rounded-2xl px-7 text-[15px] has-[>svg]:px-5",
        icon: "size-10 rounded-xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
