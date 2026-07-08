import * as React from "react";
import { cn } from "@/lib/util";

interface PageHeaderProps {
    title: string;
    description?: string;
    action?: React.ReactNode;
    className?: string;
}

function PageHeader({
    title,
    description,
    action,
    className,
}: PageHeaderProps) {
    return (
        <div
            className={cn("flex items-start justify-between gap-4", className)}
        >
            <div className="flex flex-col gap-1">
                <h1 className="font-heading text-2xl font-bold text-primary-dark">
                    {title}
                </h1>
                {description && (
                    <p className="font-body text-sm text-neutral">
                        {description}
                    </p>
                )}
            </div>
            {action && <div className="shrink-0">{action}</div>}
        </div>
    );
}

export { PageHeader };
