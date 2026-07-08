import * as React from "react";
import { cn } from "@/lib/util";

type BadgeVariant = "success" | "warning" | "danger" | "info" | "neutral";

const variants: Record<BadgeVariant, string> = {
    success: "bg-success/10 text-success",
    warning: "bg-warning/10 text-warning-dark",
    danger: "bg-danger/10 text-danger",
    info: "bg-secondary/10 text-secondary",
    neutral: "bg-neutral/10 text-neutral",
};

const dotColors: Record<BadgeVariant, string> = {
    success: "bg-success",
    warning: "bg-warning-dark",
    danger: "bg-danger",
    info: "bg-secondary",
    neutral: "bg-neutral",
};

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
    variant?: BadgeVariant;
    dot?: boolean;
}

function Badge({
    className,
    variant = "neutral",
    dot,
    children,
    ...props
}: BadgeProps) {
    return (
        <span
            className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 font-body text-xs font-medium",
                variants[variant],
                className,
            )}
            {...props}
        >
            {dot && (
                <span
                    className={cn(
                        "h-1.5 w-1.5 rounded-full",
                        dotColors[variant],
                    )}
                />
            )}
            {children}
        </span>
    );
}

export { Badge };
