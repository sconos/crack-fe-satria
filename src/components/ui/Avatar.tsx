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
    src?: string | null;
    size?: AvatarSize;
}

function Avatar({ initials, src, size = "md", className, ...props }: AvatarProps) {
    if (src) {
        return (
            // eslint-disable-next-line @next/next/no-img-element
            <img
                src={src}
                alt={initials}
                className={cn(
                    "shrink-0 rounded-full object-cover ring-1 ring-inset ring-primary/10",
                    sizes[size].replace(/text-\S+/, ""), // strip the text-size class, irrelevant for an <img>
                    className,
                )}
                {...(props as React.ImgHTMLAttributes<HTMLImageElement>)}
            />
        );
    }
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
