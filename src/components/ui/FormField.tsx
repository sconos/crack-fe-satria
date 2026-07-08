import * as React from "react";
import { Label } from "./Label";
import { cn } from "@/lib/util";

export interface FormFieldProps {
    label?: string;
    htmlFor?: string;
    required?: boolean;
    error?: string;
    helperText?: string;
    className?: string;
    children: React.ReactNode;
}

function FormField({
    label,
    htmlFor,
    required,
    error,
    helperText,
    className,
    children,
}: FormFieldProps) {
    return (
        <div className={cn("flex flex-col gap-1.5", className)}>
            {label && (
                <Label htmlFor={htmlFor} required={required}>
                    {label}
                </Label>
            )}
            {children}
            {error ? (
                <p className="font-body text-xs text-danger" role="alert">
                    {error}
                </p>
            ) : helperText ? (
                <p className="font-body text-xs text-neutral">{helperText}</p>
            ) : null}
        </div>
    );
}

export { FormField };
