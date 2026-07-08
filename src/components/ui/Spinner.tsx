import * as React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/util";

type SpinnerSize = "sm" | "md" | "lg";

const sizes: Record<SpinnerSize, string> = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8",
};

export interface SpinnerProps extends React.SVGAttributes<SVGSVGElement> {
    size?: SpinnerSize;
    label?: string;
}

function Spinner({
    className,
    size = "md",
    label = "Loading",
    ...props
}: SpinnerProps) {
    return (
        <span role="status" className="inline-flex items-center gap-2">
            <Loader2
                className={cn(
                    "animate-spin text-primary",
                    sizes[size],
                    className,
                )}
                {...props}
            />
            <span className="sr-only">{label}</span>
        </span>
    );
}

export { Spinner };
