import * as React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/util";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";

const base =
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg font-heading font-semibold transition-color focus-visible:outline-none focus-visible:ring-offset-2 disabled:pointer-event-none disabled:opactity-50 ";

const variants: Record<ButtonVariant, string> = {
    primary:
        "bg-primary text-base-white hover:bg-primary-dark focus-visible:ring-primary",
    secondary:
        "bg-secondary text-base-white hover:bg-secondary/90 focus-visible:ring-secondary",
    outline:
        "border border-primary text-primary bg-transparent hover:bg-primary-tint focus-visible:ring-primary",
    ghost: "text-primary bg-transparent hover:bg-primary-tint focus-visible:ring-primary",
    danger: "bg-danger text-base-white hover:bg-danger/90 focus-visible:ring-danger",
};

const sizes: Record<ButtonSize, string> = {
    sm: "h-8 px-3 text-sm",
    md: "h-10 px-4 text-sm",
    lg: "h-12 px-6 text-base",
};

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    size?: ButtonSize;
    loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
            className,
            variant = "primary",
            size = "md",
            loading,
            disabled,
            children,
            ...props
        },
        ref,
    ) => {
        return (
            <button
                ref={ref}
                className={cn(base, variants[variant], sizes[size], className)}
                disabled={disabled || loading}
                aria-busy={loading}
                {...props}
            >
                {loading && (
                    <Loader2
                        className="h-4 w-4 animate-spin"
                        aria-hidden="true"
                    />
                )}
                {children}
            </button>
        );
    },
);

Button.displayName = "Button";

export { Button };
