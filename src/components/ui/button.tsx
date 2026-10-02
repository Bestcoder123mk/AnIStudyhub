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
        // The signature surface: a solid neon-cyan pill (var(--primary)),
        // not monochrome — this is the one element on every screen that
        // should be unmistakably "this app's color". Dark, near-black text
        // (readableTextColor picks it per the user's chosen accent) keeps
        // it legible at any hue; the glow brightens on hover/press the same
        // way the rest of the glass system does, so a filled button still
        // reads as part of the same material family as the translucent
        // ones instead of a flat, disconnected "brand button".
        default:
          "glass-interactive bg-primary text-primary-foreground shadow-[0_1px_1px_rgba(0,0,0,0.15),0_4px_16px_-2px_color-mix(in_oklch,var(--primary)_55%,transparent)] hover:-translate-y-px hover:shadow-[0_2px_6px_rgba(0,0,0,0.2),0_10px_30px_-4px_color-mix(in_oklch,var(--primary)_70%,transparent)] overflow-hidden",
        destructive:
          "bg-destructive text-white shadow-xs hover:bg-destructive/90 hover:-translate-y-px focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "glass-interactive border-[1.5px] border-primary/35 bg-transparent text-foreground hover:border-primary/70 hover:text-primary hover:shadow-[0_0_20px_-6px_color-mix(in_oklch,var(--primary)_60%,transparent)] active:bg-primary/10 overflow-hidden",
        secondary:
          "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/70 hover:-translate-y-px",
        ghost:
          "hover:bg-accent hover:text-primary active:bg-accent/70",
        glass:
          "glass glass-interactive glass-refract-sm text-foreground shadow-[0_1px_0_0_rgba(255,255,255,0.16)_inset,0_-1px_0_0_rgba(0,0,0,0.16)_inset,0_4px_14px_-4px_rgba(0,0,0,0.3)] hover:text-primary hover:shadow-[0_1px_0_0_rgba(255,255,255,0.22)_inset,0_-1px_0_0_rgba(0,0,0,0.18)_inset,0_10px_26px_-4px_color-mix(in_oklch,var(--primary)_45%,transparent)] overflow-hidden",
        link: "text-primary underline-offset-4 hover:underline active:scale-100",
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
