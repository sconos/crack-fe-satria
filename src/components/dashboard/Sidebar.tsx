"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, ChevronRight, ListChecks, DollarSign, LogOut } from "lucide-react";
import { cn } from "@/lib/util";

const navItems = [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "Employees", href: "/employees", icon: Users },
    { label: "Attendances", href: "/attendances", icon: ListChecks },
    { label: "Payroll", href: "/payroll", icon: DollarSign },
];

function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="flex h-screen w-60 flex-col border-r border-neutral/15 bg-base-white">
            {/* Logo */}
            <div className="flex items-center gap-2 border-b border-neutral/10 px-4 py-4">
                <Image
                    src="/logo-2.png"
                    alt="Koru HRM"
                    width={50}
                    height={50}
                    priority
                />
                <span className="font-heading text-base font-bold text-primary-dark">
                    Koru HRM
                </span>
            </div>

            {/* Nav */}
            <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-3 py-4">
                {navItems.map(({ label, href, icon: Icon }) => {
                    const isActive =
                        pathname === href || pathname.startsWith(href + "/");
                    return (
                        <Link
                            key={href}
                            href={href}
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

            {/* User section */}
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

export { Sidebar };
