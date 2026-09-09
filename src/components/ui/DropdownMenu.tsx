"use client";

import * as React from "react";
import { cn } from "@/lib/util";

export interface DropdownMenuItem {
    label: string;
    icon?: React.ReactNode;
    onSelect: () => void;
    variant?: "default" | "danger";
}

interface DropdownMenuProps {
    trigger: React.ReactNode;
    items: DropdownMenuItem[];
    align?: "start" | "end";
}

function DropdownMenu({ trigger, items, align = "end" }: DropdownMenuProps) {
    const [open, setOpen] = React.useState(false);
    const containerRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (
                containerRef.current &&
                !containerRef.current.contains(e.target as Node)
            ) {
                setOpen(false);
            }
        }
        function handleKeyDown(e: KeyboardEvent) {
            if (e.key === "Escape") setOpen(false);
        }
        if (open) {
            document.addEventListener("mousedown", handleClickOutside);
            document.addEventListener("keydown", handleKeyDown);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [open]);

    return (
        <div className="relative inline-block" ref={containerRef}>
            <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                aria-haspopup="menu"
                aria-expanded={open}
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-neutral transition-colors hover:bg-neutral/10 hover:text-primary-dark"
            >
                {trigger}
            </button>

            {open && (
                <div
                    role="menu"
                    className={cn(
                        "absolute z-20 mt-1 w-40 overflow-hidden rounded-lg border border-neutral/15 bg-base-white py-1 shadow-lg",
                        align === "end" ? "right-0" : "left-0",
                    )}
                >
                    {items.map((item) => (
                        <button
                            key={item.label}
                            type="button"
                            role="menuitem"
                            onClick={() => {
                                setOpen(false);
                                item.onSelect();
                            }}
                            className={cn(
                                "flex w-full items-center gap-2 px-3 py-2 text-left text-sm transition-colors",
                                item.variant === "danger"
                                    ? "text-danger hover:bg-danger/10"
                                    : "text-primary-dark hover:bg-primary-tint",
                            )}
                        >
                            {item.icon}
                            {item.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

export { DropdownMenu };