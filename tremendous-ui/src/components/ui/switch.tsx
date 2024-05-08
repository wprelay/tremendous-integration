import * as React from "react"
import * as SwitchPrimitives from "@radix-ui/react-switch"

import { cn } from "@/src/lib/utils"

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitives.Root
    className={cn(
      "wrt-peer wrt-inline-flex wrt-h-6 wrt-w-11 wrt-shrink-0 wrt-cursor-pointer wrt-items-center wrt-rounded-full wrt-border-2 wrt-border-transparent wrt-transition-colors focus-visible:wrt-outline-none focus-visible:wrt-ring-2 focus-visible:wrt-ring-ring focus-visible:wrt-ring-offset-2 focus-visible:wrt-ring-offset-background disabled:wrt-cursor-not-allowed disabled:wrt-opacity-50 data-[state=checked]:wrt-bg-primary data-[state=unchecked]:wrt-bg-input",
      className
    )}
    {...props}
    ref={ref}
  >
    <SwitchPrimitives.Thumb
      className={cn(
        "wrt-pointer-events-none wrt-block wrt-h-5 wrt-w-5 wrt-rounded-full wrt-bg-background wrt-shadow-lg wrt-ring-0 wrt-transition-transform data-[state=checked]:wrt-translate-x-5 data-[state=unchecked]:wrt-translate-x-0"
      )}
    />
  </SwitchPrimitives.Root>
))
Switch.displayName = SwitchPrimitives.Root.displayName

export { Switch }
