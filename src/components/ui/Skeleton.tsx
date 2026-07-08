import * as React from "react";
import { cn } from "@/lib/util";

function Skeleton({
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            className={cn("animate-pulse rounded-md bg-neutral/15", className)}
            {...props}
        />
    );
}

export { Skeleton };
