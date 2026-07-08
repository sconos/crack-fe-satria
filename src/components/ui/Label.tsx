import * as React from "react";
import { cn } from "@/lib/util";

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
    required?: boolean;
}

const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
    ({ className, required, children, ...props }, ref) => (
        <label
            ref={ref}
            className={cn(
                "font-body block text-sm font-medium text-primary-dark",
                className,
            )}
            {...props}
        >
            {children}
            {required && <span className="ml-0.5 text-danger">*</span>}
        </label>
    ),
);
Label.displayName = "Label";

export { Label };
