import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

// Buttons are chunky, Duolingo-style keys: a solid face sitting on a 4px ledge that squashes flat
// when pressed. Only the `glass` variant is Liquid Glass — glass is for things that float over
// content (toolbars, overlays), not for every button.
const buttonVariants = cva(
  "relative inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold transition-[transform,box-shadow,background-color,border-color,color,opacity,filter] duration-150 ease-[cubic-bezier(0.22,1,0.36,1)] disabled:pointer-events-none disabled:opacity-40 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-[3px] focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive select-none active:translate-y-px",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow-[inset_0_1px_0_rgb(255_255_255/0.18),0_1px_2px_rgb(0_0_0/0.35)] hover:brightness-110",
        destructive: "bg-destructive text-white shadow-[inset_0_1px_0_rgb(255_255_255/0.15),0_1px_2px_rgb(0_0_0/0.35)] hover:brightness-110 focus-visible:ring-destructive/30",
        outline: "border border-[var(--edge)] bg-card text-foreground hover:bg-accent",
        secondary: "border border-[var(--edge)] bg-secondary text-secondary-foreground hover:bg-accent",
        ghost: "hover:bg-accent hover:text-foreground active:bg-accent/70",
        glass: "liquid glass-interactive text-foreground overflow-hidden",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2 has-[>svg]:px-3.5",
        sm: "h-8 rounded-lg gap-1.5 px-3 text-[13px] has-[>svg]:px-2.5",
        lg: "h-12 rounded-xl px-6 text-[15px] has-[>svg]:px-5",
        // On touch screens an invisible 8px halo makes small icon buttons (bookmark stars etc.) a 44px target.
        icon: "size-10 rounded-xl [@media(pointer:coarse)]:after:absolute [@media(pointer:coarse)]:after:-inset-2 [@media(pointer:coarse)]:after:content-['']",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
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
