import * as React from "react";
import { cn } from "@/lib/util";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    error?: boolean;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({ className, error, disabled, rows = 3, ...props }, ref) => {
        return (
            <textarea
                ref={ref}
                disabled={disabled}
                rows={rows}
                aria-invalid={error || undefined}
                className={cn(
                    "font-body w-full resize-none rounded-lg border bg-base-white px-3 py-2 text-sm text-primary-dark transition-colors placeholder:text-neutral/70",
                    "border-neutral/30 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30",
                    "disabled:cursor-not-allowed disabled:bg-neutral/10 disabled:text-neutral",
                    error &&
                        "border-danger focus:border-danger focus:ring-danger/30",
                    className,
                )}
                {...props}
            />
        );
    },
);
Textarea.displayName = "Textarea";

export { Textarea };
