import * as React from "react"

import { cn } from "@/src/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "wrt-flex wrt-h-10 wrt-w-full wrt-rounded-md wrt-border wrt-border-input wrt-bg-background wrt-px-3 wrt-py-2 wrt-text-sm wrt-ring-offset-background file:wrt-border-0 file:wrt-bg-transparent file:wrt-text-sm file:wrt-font-medium placeholder:wrt-text-muted-foreground focus-visible:wrt-outline-none focus-visible:wrt-ring-2 focus-visible:wrt-ring-ring focus-visible:wrt-ring-offset-2 disabled:wrt-cursor-not-allowed disabled:wrt-opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
