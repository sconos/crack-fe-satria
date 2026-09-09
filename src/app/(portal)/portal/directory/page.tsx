"use client";

import * as React from "react";
import { Search, Mail, Phone } from "lucide-react";
import { PortalLayout } from "@/components/portal/PortalLayout";
import { Input } from "@/components/ui/Input";
import { Card, CardContent } from "@/components/ui/Card";
import { employees } from "@/lib/mock-data/employees";

function getInitials(name: string) {
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export default function PortalDirectoryPage() {
    const [query, setQuery] = React.useState("");

    const filtered = React.useMemo(() => {
        if (!query.trim()) return employees;
        const q = query.toLowerCase();
        return employees.filter(
            (e) =>
                e.name.toLowerCase().includes(q) ||
                e.department.toLowerCase().includes(q) ||
                e.role.toLowerCase().includes(q),
        );
    }, [query]);

    return (
        <PortalLayout title="Company Directory">
            <div className="flex flex-col gap-4">
                <Input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search by name, department, or role..."
                    leftIcon={<Search className="h-4 w-4" />}
                    className="w-full sm:w-80"
                />

                {filtered.length === 0 ? (
                    <p className="py-10 text-center text-sm text-neutral">
                        No one matches &ldquo;{query}&rdquo;.
                    </p>
                ) : (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {filtered.map((employee) => (
                            <Card key={employee.id}>
                                <CardContent className="flex flex-col gap-3">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-tint font-heading text-sm font-semibold text-primary-dark">
                                            {getInitials(employee.name)}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="truncate font-body text-sm font-medium text-primary-dark">
                                                {employee.name}
                                            </p>
                                            <p className="truncate font-body text-xs text-neutral">
                                                {employee.role}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-1 border-t border-neutral/10 pt-3">
                                        <span className="font-body text-xs text-neutral">
                                            {employee.department}
                                        </span>
                                        
                                        <a    href={`mailto:${employee.email}`}
                                            className="flex items-center gap-1.5 font-body text-xs text-secondary hover:underline"
                                        >
                                            <Mail className="h-3 w-3" />
                                            {employee.email}
                                        </a>
                                        {employee.phone && (
                                            <span className="flex items-center gap-1.5 font-body text-xs text-neutral">
                                                <Phone className="h-3 w-3" />
                                                {employee.phone}
                                            </span>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </PortalLayout>
    );
}