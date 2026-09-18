"use client";

import * as React from "react";
import { useAuth } from "../auth/AuthProvider";
import { NotificationBell } from "@/components/notifications/NotificationBell";

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
                <NotificationBell />
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary font-heading text-xs font-semibold text-base-white">
                    {user?.email[0].toUpperCase()}
                </div>
            </div>
        </header>
    );
}

export { Topbar };