import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { ArrowRight } from "lucide-react"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        // animated: "rounded-full group relative bg-gradient-to-r from-[#0A2260] to-[#0A4EF3] hover:from-[#0A2260]/90 hover:to-[#0A4EF3]/90 transition-all duration-300 overflow-hidden text-white",
        animated: "rounded-full group relative bg-gradient-to-br from-[#00a6ff] via-[#0A1E4E] via-[#0A2260] via-[#0A1E4E] to-[#00a6ff] hover:from-[#00a6ff]/90 hover:via-[#0A1E4E]/90 hover:via-[#0A2260]/90 hover:via-[#0A1E4E]/90 hover:to-[#00a6ff]/90 transition-all duration-300 overflow-hidden text-white",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
        animated: "px-10 py-3 text-md",
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
  showArrow?: boolean
  children?: React.ReactNode
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, showArrow = false, children, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"

    if (variant === 'animated') {
      return (
        <Comp
          className={cn(buttonVariants({ variant, size, className }))}
          ref={ref}
          {...props}
        >
          <span className="flex items-center gap-2 transition-all duration-300 group-hover:-translate-x-[150%] group-hover:scale-110">
            {children} {showArrow && <ArrowRight className="h-4 w-4" />}
          </span>
          <span className="absolute flex items-center inset-0 justify-center translate-x-[150%] group-hover:translate-x-0 group-hover:scale-150 transition-all duration-300">
            <ArrowRight className="h-5 w-5 animate-[wiggle_1s_ease-in-out_infinite]" />
          </span>
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div
              className="absolute h-[300%] w-[1px] bg-gradient-to-b from-transparent to-transparent -skew-x-12 opacity-10"
              style={{
                left: '50%',
                top: '-100%',
              }}
            />
          </div>
        </Comp>
      )
    }

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      >
        {children}
      </Comp>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
