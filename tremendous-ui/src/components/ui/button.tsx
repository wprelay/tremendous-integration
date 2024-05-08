import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/src/lib/utils"

const buttonVariants = cva(
  "wrt-inline-flex wrt-items-center wrt-justify-center wrt-whitespace-nowrap wrt-rounded-md wrt-text-sm wrt-font-medium wrt-ring-offset-background wrt-transition-colors focus-visible:wrt-outline-none focus-visible:wrt-ring-2 focus-visible:wrt-ring-ring focus-visible:wrt-ring-offset-2 disabled:wrt-pointer-events-none disabled:wrt-opacity-50",
  {
    variants: {
      variant: {
        default: "wrt-bg-primary wrt-text-primary-foreground hover:wrt-bg-primary/90",
        destructive:
          "wrt-bg-destructive wrt-text-destructive-foreground hover:wrt-bg-destructive/90",
        outline:
          "wrt-border wrt-border-input wrt-bg-background hover:wrt-bg-accent hover:wrt-text-accent-foreground",
        secondary:
          "wrt-bg-secondary wrt-text-secondary-foreground hover:wrt-bg-secondary/80",
        ghost: "hover:wrt-bg-accent hover:wrt-text-accent-foreground",
        link: "wrt-text-primary wrt-underline-offset-4 hover:wrt-underline",
      },
      size: {
        default: "wrt-h-10 wrt-px-4 wrt-py-2",
        sm: "wrt-h-9 wrt-rounded-md wrt-px-3",
        lg: "wrt-h-11 wrt-rounded-md wrt-px-8",
        icon: "wrt-h-10 wrt-w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
