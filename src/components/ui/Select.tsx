import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/util";

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    error?: boolean;
    placeholder?: string;
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
    ({ className, error, disabled, placeholder, children, ...props }, ref) => {
        return (
            <div className="relative flex items-center">
                <select
                    ref={ref}
                    disabled={disabled}
                    aria-invalid={error || undefined}
                    className={cn(
                        "font-body h-10 w-full appearance-none rounded-lg border bg-base-white px-3 pr-9 text-sm text-primary-dark transition-colors",
                        "border-neutral/30 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30",
                        "disabled:cursor-not-allowed disabled:bg-neutral/10 disabled:text-neutral",
                        error &&
                            "border-danger focus:border-danger focus:ring-danger/30",
                        className,
                    )}
                    {...props}
                >
                    {placeholder && (
                        <option value="" disabled hidden>
                            {placeholder}
                        </option>
                    )}
                    {children}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 h-4 w-4 text-neutral" />
            </div>
        );
    },
);
Select.displayName = "Select";

export { Select };
