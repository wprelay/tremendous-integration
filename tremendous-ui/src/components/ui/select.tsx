import * as React from "react"
import * as SelectPrimitive from "@radix-ui/react-select"
import { Check, ChevronDown, ChevronUp } from "lucide-react"

import { cn } from "@/src/lib/utils"

const Select = SelectPrimitive.Root

const SelectGroup = SelectPrimitive.Group

const SelectValue = SelectPrimitive.Value

const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={cn(
      "wrt-flex wrt-h-10 wrt-w-full wrt-items-center wrt-justify-between wrt-rounded-md wrt-border wrt-border-input wrt-bg-background wrt-px-3 wrt-py-2 wrt-text-sm wrt-ring-offset-background placeholder:wrt-text-muted-foreground focus:wrt-outline-none focus:wrt-ring-2 focus:wrt-ring-ring focus:wrt-ring-offset-2 disabled:wrt-cursor-not-allowed disabled:wrt-opacity-50 [&>span]:wrt-line-clamp-1",
      className
    )}
    {...props}
  >
    {children}
    <SelectPrimitive.Icon asChild>
      <ChevronDown className="wrt-h-4 wrt-w-4 wrt-opacity-50" />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
))
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName

const SelectScrollUpButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollUpButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollUpButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollUpButton
    ref={ref}
    className={cn(
      "wrt-flex wrt-cursor-default wrt-items-center wrt-justify-center wrt-py-1",
      className
    )}
    {...props}
  >
    <ChevronUp className="wrt-h-4 wrt-w-4" />
  </SelectPrimitive.ScrollUpButton>
))
SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName

const SelectScrollDownButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollDownButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollDownButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollDownButton
    ref={ref}
    className={cn(
      "wrt-flex wrt-cursor-default wrt-items-center wrt-justify-center wrt-py-1",
      className
    )}
    {...props}
  >
    <ChevronDown className="wrt-h-4 wrt-w-4" />
  </SelectPrimitive.ScrollDownButton>
))
SelectScrollDownButton.displayName =
  SelectPrimitive.ScrollDownButton.displayName

const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, position = "popper", ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      className={cn(
        "wrt-relative wrt-z-50 wrt-max-h-96 wrt-min-w-[8rem] wrt-overflow-hidden wrt-rounded-md wrt-border wrt-bg-popover wrt-text-popover-foreground wrt-shadow-md data-[state=open]:wrt-animate-in data-[state=closed]:wrt-animate-out data-[state=closed]:wrt-fade-out-0 data-[state=open]:wrt-fade-in-0 data-[state=closed]:wrt-zoom-out-95 data-[state=open]:wrt-zoom-in-95 data-[side=bottom]:wrt-slide-in-from-top-2 data-[side=left]:wrt-slide-in-from-right-2 data-[side=right]:wrt-slide-in-from-left-2 data-[side=top]:wrt-slide-in-from-bottom-2",
        position === "popper" &&
          "data-[side=bottom]:wrt-translate-y-1 data-[side=left]:wrt--translate-x-1 data-[side=right]:wrt-translate-x-1 data-[side=top]:wrt--translate-y-1",
        className
      )}
      position={position}
      {...props}
    >
      <SelectScrollUpButton />
      <SelectPrimitive.Viewport
        className={cn(
          "wrt-p-1",
          position === "popper" &&
            "wrt-h-[var(--radix-select-trigger-height)] wrt-w-full wrt-min-w-[var(--radix-select-trigger-width)]"
        )}
      >
        {children}
      </SelectPrimitive.Viewport>
      <SelectScrollDownButton />
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
))
SelectContent.displayName = SelectPrimitive.Content.displayName

const SelectLabel = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Label
    ref={ref}
    className={cn("wrt-py-1.5 wrt-pl-8 wrt-pr-2 wrt-text-sm wrt-font-semibold", className)}
    {...props}
  />
))
SelectLabel.displayName = SelectPrimitive.Label.displayName

const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      "wrt-relative wrt-flex wrt-w-full wrt-cursor-default wrt-select-none wrt-items-center wrt-rounded-sm wrt-py-1.5 wrt-pl-8 wrt-pr-2 wrt-text-sm wrt-outline-none focus:wrt-bg-accent focus:wrt-text-accent-foreground data-[disabled]:wrt-pointer-events-none data-[disabled]:wrt-opacity-50",
      className
    )}
    {...props}
  >
    <span className="wrt-absolute wrt-left-2 wrt-flex wrt-h-3.5 wrt-w-3.5 wrt-items-center wrt-justify-center">
      <SelectPrimitive.ItemIndicator>
        <Check className="wrt-h-4 wrt-w-4" />
      </SelectPrimitive.ItemIndicator>
    </span>

    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
))
SelectItem.displayName = SelectPrimitive.Item.displayName

const SelectSeparator = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Separator
    ref={ref}
    className={cn("wrt--mx-1 wrt-my-1 wrt-h-px wrt-bg-muted", className)}
    {...props}
  />
))
SelectSeparator.displayName = SelectPrimitive.Separator.displayName

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
}
