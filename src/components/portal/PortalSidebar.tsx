"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    User,
    Receipt,
    CalendarDays,
    Clock,
    FileText,
    Users,
    Network,
    LogOut,
    ChevronRight,
    X,
} from "lucide-react";
import { cn } from "@/lib/util";
import { Avatar } from "@/components/ui/Avatar";
import { getEmployeeById } from "@/lib/mock-data/employees";
import { useRouter } from "next/navigation";
import { logout } from "@/lib/api/auth";
import { useAuth } from "@/components/auth/AuthProvider";

const navItems = [
    { label: "Dashboard", href: "/portal", icon: LayoutDashboard },
    { label: "My Profile", href: "/portal/profile", icon: User },
    { label: "My Attendance", href: "/portal/attendance", icon: Clock },
    { label: "My Documents", href: "/portal/documents", icon: FileText },
    { label: "Pay Slips", href: "/portal/payslips", icon: Receipt },
    { label: "Leave", href: "/portal/leave", icon: CalendarDays },
    { label: "Directory", href: "/portal/directory", icon: Users },
    { label: "Org Chart", href: "/portal/org-chart", icon: Network },
];

function getInitials(name: string) {
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

interface PortalSidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

function SidebarContent({ onClose }: { onClose?: () => void }) {
    const pathname = usePathname();
    const { user } = useAuth(); 
    const router = useRouter();
    const { setUser } = useAuth();

    async function handleSignOut() {
        await logout();
        setUser(null);
        router.push("/login");
    }

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
            {user && (
            <div className="mx-3 mt-3 rounded-lg bg-primary-tint px-3 py-3">
                <div className="flex items-center gap-2">
                    <Avatar
                        initials={getInitials(user.email)}
                        size="sm"
                    />
                    <div className="min-w-0">
                        <p className="truncate font-heading text-xs font-bold text-primary-dark">
                            {user.email}
                        </p>
                        <p className="truncate font-body text-xs text-neutral">
                            {user.role}
                        </p>
                    </div>
                </div>
            </div>
            )}

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
                    onClick={handleSignOut}
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
