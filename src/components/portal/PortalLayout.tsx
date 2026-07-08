"use client";

import * as React from "react";
import { PortalSidebar } from "./PortalSidebar";
import { PortalTopbar } from "./PortalTopbar";

interface PortalLayoutProps {
    children: React.ReactNode;
    title?: string;
}

function PortalLayout({ children, title }: PortalLayoutProps) {
    const [sidebarOpen, setSidebarOpen] = React.useState(false);

    return (
        <div className="flex h-screen bg-primary-tint">
            <PortalSidebar
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
            />
            <div className="flex min-h-0 flex-1 flex-col">
                <PortalTopbar
                    title={title}
                    onMenuClick={() => setSidebarOpen(true)}
                />
                <main className="flex-1 overflow-y-auto p-4 lg:p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}

export { PortalLayout };
