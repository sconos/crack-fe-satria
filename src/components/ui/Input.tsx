import * as React from "react";
import { cn } from "@/lib/util";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    error?: boolean;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    (
        {
            className,
            type = "text",
            error,
            leftIcon,
            rightIcon,
            disabled,
            ...props
        },
        ref,
    ) => {
        return (
            <div className="relative flex items-center">
                {leftIcon && (
                    <span className="pointer-events-none absolute left-3 flex items-center text-neutral">
                        {leftIcon}
                    </span>
                )}
                <input
                    ref={ref}
                    type={type}
                    disabled={disabled}
                    aria-invalid={error || undefined}
                    className={cn(
                        "font-body h-10 w-full rounded-lg border bg-base-white px-3 text-sm text-primary-dark transition-colors placeholder:text-neutral/70",
                        "border-neutral/30 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30",
                        "disabled:cursor-not-allowed disabled:bg-neutral/10 disabled:text-neutral",
                        error &&
                            "border-danger focus:border-danger focus:ring-danger/30",
                        !!leftIcon && "pl-9",
                        !!rightIcon && "pr-9",
                        className,
                    )}
                    {...props}
                />
                {rightIcon && (
                    <span className="absolute right-3 flex items-center text-neutral">
                        {rightIcon}
                    </span>
                )}
            </div>
        );
    },
);
Input.displayName = "Input";

export { Input };
