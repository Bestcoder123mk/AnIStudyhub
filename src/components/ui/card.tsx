import * as React from "react"

import { cn } from "@/lib/utils"

// Every card in the app is real Liquid Glass by default now: card-premium
// (translucent black glass + layered elevation + a cyan glow that reads
// against the true-black canvas — see globals.css) carries the material,
// glass-interactive layers the pointer-tracked specular hotspot + broad
// glow + a few degrees of pointer-driven tilt on top (per the
// liquid-glass-ui skill's motion model), and glass-refract-md adds real
// edge lensing on Chromium. Content-bearing cards (a quiz question, a
// stat block) and functional ones (a clickable subject tile) get the same
// material — only the glow's resting intensity separates "quiet" from
// "focal", tuned per call site with .glow-ring/.neon-frame, not by
// swapping materials.
function Card({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card"
      className={cn(
        "card-premium glass-interactive glass-refract-md text-card-foreground flex flex-col gap-6 rounded-2xl py-6 overflow-hidden",
        className
      )}
      {...props}
    />
  )
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6",
        className
      )}
      {...props}
    />
  )
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn("leading-none font-semibold tracking-tight", className)}
      {...props}
    />
  )
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  )
}

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className
      )}
      {...props}
    />
  )
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn("px-6", className)}
      {...props}
    />
  )
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn("flex items-center px-6 [.border-t]:pt-6", className)}
      {...props}
    />
  )
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
}
