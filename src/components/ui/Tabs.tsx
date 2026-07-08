"use client";

import * as React from "react";
import { Badge } from "./Badge";
import { cn } from "@/lib/util";

export interface TabItem {
    value: string;
    label: string;
    badge?: number;
}

export interface TabsProps {
    items: TabItem[];
    value: string;
    onValueChange: (value: string) => void;
    className?: string;
}

function Tabs({ items, value, onValueChange, className }: TabsProps) {
    return (
        <div
            className={cn(
                "flex items-center gap-6 border-b border-neutral/10",
                className,
            )}
            role="tablist"
        >
            {items.map((item) => {
                const active = item.value === value;
                return (
                    <button
                        key={item.value}
                        type="button"
                        role="tab"
                        aria-selected={active}
                        onClick={() => onValueChange(item.value)}
                        className={cn(
                            "relative flex items-center gap-2 pb-3 text-sm font-medium transition-colors",
                            active
                                ? "text-primary-dark"
                                : "text-neutral hover:text-primary-dark",
                        )}
                    >
                        {item.label}
                        {typeof item.badge === "number" && item.badge > 0 && (
                            <Badge variant="warning">{item.badge}</Badge>
                        )}
                        {active && (
                            <span className="absolute -bottom-px left-0 h-0.5 w-full bg-primary" />
                        )}
                    </button>
                );
            })}
        </div>
    );
}

export { Tabs };
