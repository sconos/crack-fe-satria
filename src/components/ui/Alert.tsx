import * as React from "react";
import { CheckCircle2, AlertTriangle, XCircle, Info, X } from "lucide-react";
import { cn } from "@/lib/util";

type AlertVariant = "success" | "warning" | "danger" | "info";

const variants: Record<AlertVariant, string> = {
    success: "border-success/20 bg-success/10 text-success",
    warning: "border-warning/20 bg-warning/10 text-warning-dark",
    danger: "border-danger/20 bg-danger/10 text-danger",
    info: "border-secondary/20 bg-secondary/10 text-secondary",
};

const icons = {
    success: CheckCircle2,
    warning: AlertTriangle,
    danger: XCircle,
    info: Info,
};

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: AlertVariant;
    title?: string;
    onClose?: () => void;
}

function Alert({
    className,
    variant = "info",
    title,
    children,
    onClose,
    ...props
}: AlertProps) {
    const Icon = icons[variant];
    return (
        <div
            className={cn(
                "flex items-start gap-3 rounded-lg border px-4 py-3 font-body text-sm",
                variants[variant],
                className,
            )}
            role="alert"
            {...props}
        >
            <Icon className="mt-0.5 h-4 w-4 shrink-0" />
            <div className="flex-1">
                {title && <p className="font-medium">{title}</p>}
                {children && (
                    <div className={cn(title && "mt-0.5", "opacity-90")}>
                        {children}
                    </div>
                )}
            </div>
            {onClose && (
                <button
                    onClick={onClose}
                    className="opacity-70 hover:opacity-100"
                    aria-label="Dismiss"
                >
                    <X className="h-4 w-4" />
                </button>
            )}
        </div>
    );
}

export { Alert };
