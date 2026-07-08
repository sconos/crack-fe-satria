"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    User,
    Receipt,
    CalendarDays,
    LogOut,
    ChevronRight,
    X,
} from "lucide-react";
import { cn } from "@/lib/util";

const navItems = [
    { label: "Dashboard", href: "/portal", icon: LayoutDashboard },
    { label: "My Profile", href: "/portal/profile", icon: User },
    { label: "Pay Slips", href: "/portal/payslips", icon: Receipt },
    { label: "Leave", href: "/portal/leave", icon: CalendarDays },
];

const currentEmployee = {
    name: "Satria Wijaya",
    role: "Frontend Developer",
    initials: "SW",
};

interface PortalSidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

function SidebarContent({ onClose }: { onClose?: () => void }) {
    const pathname = usePathname();

    return (
        <aside className="flex h-screen w-60 flex-col border-r border-neutral/15 bg-base-white">
            {/* Logo + close button on mobile */}
            <div className="flex items-center gap-2 border-b border-neutral/10 px-4 py-4">
                <Image
                    src="/logo-2.png"
                    alt="Koru HRM"
                    width={500}
                    height={500}
                    priority
                    className="h-12 w-auto"
                />
                <span className="font-heading text-sm font-bold text-primary-dark flex-1">
                    Koru HRM
                </span>
                {onClose && (
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-lg p-1 text-neutral hover:bg-primary-tint hover:text-primary-dark lg:hidden"
                    >
                        <X className="h-4 w-4" />
                    </button>
                )}
            </div>

            {/* Employee card */}
            <div className="mx-3 mt-3 rounded-lg bg-primary-tint px-3 py-3">
                <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary font-heading text-xs font-bold text-base-white">
                        {currentEmployee.initials}
                    </div>
                    <div className="min-w-0">
                        <p className="truncate font-heading text-xs font-bold text-primary-dark">
                            {currentEmployee.name}
                        </p>
                        <p className="truncate font-body text-xs text-neutral">
                            {currentEmployee.role}
                        </p>
                    </div>
                </div>
            </div>

            {/* Nav */}
            <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-3 py-4">
                {navItems.map(({ label, href, icon: Icon }) => {
                    const isActive =
                        href === "/portal"
                            ? pathname === "/portal"
                            : pathname.startsWith(href);
                    return (
                        <Link
                            key={href}
                            href={href}
                            onClick={onClose}
                            className={cn(
                                "group flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                                isActive
                                    ? "bg-primary-tint text-primary"
                                    : "text-neutral hover:bg-primary-tint/60 hover:text-primary-dark",
                            )}
                        >
                            <div className="flex items-center gap-3">
                                <Icon
                                    className={cn(
                                        "h-4 w-4 shrink-0",
                                        isActive
                                            ? "text-primary"
                                            : "text-neutral group-hover:text-primary-dark",
                                    )}
                                />
                                {label}
                            </div>
                            {isActive && (
                                <ChevronRight className="h-3.5 w-3.5 text-primary" />
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* Sign out */}
            <div className="border-t border-neutral/10 px-3 py-4">
                <button
                    type="button"
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-neutral transition-colors hover:bg-danger/10 hover:text-danger"
                >
                    <LogOut className="h-4 w-4 shrink-0" />
                    Sign out
                </button>
            </div>
        </aside>
    );
}

function PortalSidebar({ isOpen, onClose }: PortalSidebarProps) {
    return (
        <>
            {/* Desktop — always visible */}
            <div className="hidden lg:block">
                <SidebarContent />
            </div>

            {/* Mobile — drawer overlay */}
            {isOpen && (
                <div className="fixed inset-0 z-50 lg:hidden">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-primary-dark/40 backdrop-blur-sm"
                        onClick={onClose}
                    />
                    {/* Drawer */}
                    <div className="absolute left-0 top-0 h-full">
                        <SidebarContent onClose={onClose} />
                    </div>
                </div>
            )}
        </>
    );
}

export { PortalSidebar };
