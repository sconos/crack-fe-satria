import * as React from "react";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

interface DashboardLayoutProps {
    children: React.ReactNode;
    title?: string;
}

function DashboardLayout({ children, title }: DashboardLayoutProps) {
    return (
        <div className="flex h-screen bg-primary-tint">
            <Sidebar />
            <div className="flex min-h-0 flex-1 flex-col">
                <Topbar title={title} />
                <main className="flex-1 overflow-y-auto p-6">{children}</main>
            </div>
        </div>
    );
}

export { DashboardLayout };
