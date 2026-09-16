"use client";

import * as React from "react";
import { Bell } from "lucide-react";
import { useAuth } from "../auth/AuthProvider";

interface TopbarProps {
    title?: string;
}

function Topbar({ title }: TopbarProps) {
    const { user } = useAuth();
    return (
        <header className="flex h-14 items-center justify-between border-b border-neutral/15 bg-base-white px-6">
            <p className="font-heading text-sm font-semibold text-primary-dark">
                {title}
            </p>
            <div className="flex items-center gap-3">
                <button
                    type="button"
                    className="relative rounded-lg p-1.5 text-neutral transition-colors hover:bg-primary-tint hover:text-primary-dark"
                >
                    <Bell className="h-5 w-5" />
                </button>
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary font-heading text-xs font-semibold text-base-white">
                    {user?.email[0].toUpperCase()}
                </div>
            </div>
        </header>
    );
}

export { Topbar };