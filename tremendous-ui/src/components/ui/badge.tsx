import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/src/lib/utils"

const badgeVariants = cva(
  "wrt-inline-flex wrt-items-center wrt-rounded-full wrt-border wrt-px-2.5 wrt-py-0.5 wrt-text-xs wrt-font-semibold wrt-transition-colors focus:wrt-outline-none focus:wrt-ring-2 focus:wrt-ring-ring focus:wrt-ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "wrt-border-transparent wrt-bg-primary wrt-text-primary-foreground hover:wrt-bg-primary/80",
        secondary:
          "wrt-border-transparent wrt-bg-secondary wrt-text-secondary-foreground hover:wrt-bg-secondary/80",
        destructive:
          "wrt-border-transparent wrt-bg-destructive wrt-text-destructive-foreground hover:wrt-bg-destructive/80",
        outline: "wrt-text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
