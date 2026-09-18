"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Bell, Check } from "lucide-react";
import { cn } from "@/lib/util";
import {
    getMyNotifications,
    getUnreadNotificationCount,
    markNotificationRead,
    markAllNotificationsRead,
} from "@/lib/api/notifications";
import type { Notification } from "@/types/notification";

const POLL_INTERVAL_MS = 60_000;

function formatRelativeTime(iso: string): string {
    const diffMs = Date.now() - new Date(iso).getTime();
    const minutes = Math.floor(diffMs / 60_000);
    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;
    return new Date(iso).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
    });
}

export function NotificationBell() {
    const router = useRouter();
    const containerRef = React.useRef<HTMLDivElement>(null);

    const [open, setOpen] = React.useState(false);
    const [unreadCount, setUnreadCount] = React.useState(0);
    const [notifications, setNotifications] = React.useState<Notification[]>(
        [],
    );
    const [isLoading, setIsLoading] = React.useState(false);

    async function refreshUnreadCount() {
        try {
            const count = await getUnreadNotificationCount();
            setUnreadCount(count);
        } catch {
            // Non-fatal — the badge just stays at its last known value.
        }
    }

    React.useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect -- known FP on async fetch fns
        refreshUnreadCount();
        const interval = setInterval(refreshUnreadCount, POLL_INTERVAL_MS);
        return () => clearInterval(interval);
    }, []);

    // Close on outside click or Escape.
    React.useEffect(() => {
        function handleClick(e: MouseEvent) {
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
            document.addEventListener("mousedown", handleClick);
            document.addEventListener("keydown", handleKeyDown);
        }
        return () => {
            document.removeEventListener("mousedown", handleClick);
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [open]);

    async function handleToggle() {
        const next = !open;
        setOpen(next);
        if (next) {
            setIsLoading(true);
            try {
                const res = await getMyNotifications({ limit: 10 });
                setNotifications(res.notifications);
                setUnreadCount(res.meta.unreadCount);
            } catch {
                // Dropdown just shows nothing new; the bell itself still works.
            } finally {
                setIsLoading(false);
            }
        }
    }

    async function handleNotificationClick(notification: Notification) {
        if (!notification.isRead) {
            try {
                await markNotificationRead(notification.id);
                setNotifications((prev) =>
                    prev.map((n) =>
                        n.id === notification.id ? { ...n, isRead: true } : n,
                    ),
                );
                setUnreadCount((prev) => Math.max(0, prev - 1));
            } catch {
                // Navigation still proceeds even if marking-read failed.
            }
        }
        setOpen(false);
        if (notification.link) router.push(notification.link);
    }

    async function handleMarkAllRead() {
        try {
            await markAllNotificationsRead();
            setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
            setUnreadCount(0);
        } catch {
            // Leave state as-is on failure.
        }
    }

    return (
        <div ref={containerRef} className="relative">
            <button
                type="button"
                onClick={handleToggle}
                className="relative rounded-lg p-1.5 text-neutral transition-colors hover:bg-primary-tint hover:text-primary-dark"
            >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                    <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-danger px-1 text-[10px] font-semibold leading-none text-base-white">
                        {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                )}
            </button>

            {open && (
                <div className="absolute right-0 top-full z-50 mt-2 w-80 rounded-xl border border-neutral/15 bg-base-white shadow-lg">
                    <div className="flex items-center justify-between border-b border-neutral/10 px-4 py-3">
                        <p className="font-heading text-sm font-semibold text-primary-dark">
                            Notifications
                        </p>
                        {unreadCount > 0 && (
                            <button
                                type="button"
                                onClick={handleMarkAllRead}
                                className="flex items-center gap-1 text-xs font-medium text-primary hover:text-primary-dark"
                            >
                                <Check className="h-3 w-3" />
                                Mark all read
                            </button>
                        )}
                    </div>

                    <div className="max-h-96 overflow-y-auto">
                        {isLoading ? (
                            <p className="px-4 py-8 text-center text-sm text-neutral">
                                Loading...
                            </p>
                        ) : notifications.length === 0 ? (
                            <p className="px-4 py-8 text-center text-sm text-neutral">
                                No notifications yet.
                            </p>
                        ) : (
                            notifications.map((n) => (
                                <button
                                    key={n.id}
                                    type="button"
                                    onClick={() => handleNotificationClick(n)}
                                    className={cn(
                                        "flex w-full flex-col gap-0.5 border-b border-neutral/5 px-4 py-3 text-left transition-colors hover:bg-primary-tint/40",
                                        !n.isRead && "bg-primary-tint/20",
                                    )}
                                >
                                    <div className="flex items-start justify-between gap-2">
                                        <p className="font-body text-sm font-medium text-primary-dark">
                                            {n.title}
                                        </p>
                                        {!n.isRead && (
                                            <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                                        )}
                                    </div>
                                    <p className="font-body text-xs text-neutral">
                                        {n.message}
                                    </p>
                                    <p className="font-body text-[11px] text-neutral/70">
                                        {formatRelativeTime(n.createdAt)}
                                    </p>
                                </button>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}