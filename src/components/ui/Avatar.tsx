import * as React from "react";
import { cn } from "@/lib/util";

type AvatarSize = "sm" | "md" | "lg" | "xl";

const sizes: Record<AvatarSize, string> = {
    sm: "h-8 w-8 text-xs",
    md: "h-9 w-9 text-xs",
    lg: "h-12 w-12 text-sm",
    xl: "h-16 w-16 text-base",
};

export interface AvatarProps extends React.HTMLAttributes<HTMLSpanElement> {
    initials: string;
    size?: AvatarSize;
}

function Avatar({ initials, size = "md", className, ...props }: AvatarProps) {
    return (
        <span
            className={cn(
                "flex shrink-0 items-center justify-center rounded-full bg-primary-tint font-heading font-semibold text-primary-dark ring-1 ring-inset ring-primary/10",
                sizes[size],
                className,
            )}
            {...props}
        >
            {initials}
        </span>
    );
}

export { Avatar };
