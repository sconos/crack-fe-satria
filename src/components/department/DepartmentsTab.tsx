"use client";

import { useMemo, useState } from "react";
import { ListTree, Search, Table2 } from "lucide-react";
import { StatCard } from "@/components/ui/StatCard";
import { Input } from "@/components/ui/Input";
import { DepartmentTable } from "@/components/department/DepartmentTable";
import { DepartmentOrgChart } from "@/components/department/DepartmentOrgChart";
import type { Department } from "@/types/department";
import type { Employee } from "@/types/employee";
import { cn } from "@/lib/util";

type ViewMode = "list" | "chart";

export function DepartmentsTab({
    departments,
    employees,
    onToggleDepartmentStatus,
}: {
    departments: Department[];
    employees: Employee[];
    onToggleDepartmentStatus?: (id: string) => void;
}) {
    const [view, setView] = useState<ViewMode>("list");
    const [query, setQuery] = useState("");

    const withoutHead = departments.filter((d) => !d.headId).length;
    const avgTeamSize = departments.length
        ? Math.round(employees.length / departments.length)
        : 0;

    const filteredDepartments = useMemo(() => {
        if (!query.trim()) return departments;
        const q = query.toLowerCase();
        return departments.filter(
            (d) =>
                d.name.toLowerCase().includes(q) ||
                d.code.toLowerCase().includes(q) ||
                d.headName?.toLowerCase().includes(q),
        );
    }, [departments, query]);

    return (
        <div className="flex flex-col gap-6">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <StatCard
                    label="Departments"
                    value={departments.length}
                    accent="border-l-success"
                />
                <StatCard
                    label="Total employees"
                    value={employees.length}
                    accent="border-l-secondary"
                />
                <StatCard
                    label="Avg. team size"
                    value={avgTeamSize}
                    accent="border-l-neutral/30"
                />
                <StatCard
                    label="Without a head"
                    value={withoutHead}
                    accent="border-l-warning"
                />
            </div>

            <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="inline-flex w-fit items-center gap-1 rounded-lg bg-primary-tint p-1">
                        <button
                            type="button"
                            onClick={() => setView("list")}
                            className={cn(
                                "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
                                view === "list"
                                    ? "bg-base-white text-primary-dark shadow-sm"
                                    : "text-neutral hover:text-primary-dark",
                            )}
                        >
                            <Table2 className="h-3.5 w-3.5" />
                            List
                        </button>
                        <button
                            type="button"
                            onClick={() => setView("chart")}
                            className={cn(
                                "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
                                view === "chart"
                                    ? "bg-base-white text-primary-dark shadow-sm"
                                    : "text-neutral hover:text-primary-dark",
                            )}
                        >
                            <ListTree className="h-3.5 w-3.5" />
                            Org chart
                        </button>
                    </div>

                    {view === "list" && (
                        <Input
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search departments..."
                            leftIcon={<Search className="h-3.5 w-3.5" />}
                            className="w-full sm:w-64"
                        />
                    )}
                </div>

                <div className={view === "list" ? "" : "hidden"}>
                    <DepartmentTable
                        departments={filteredDepartments}
                        onToggleStatus={onToggleDepartmentStatus}
                    />
                </div>
                <div className={view === "chart" ? "" : "hidden"}>
                    <DepartmentOrgChart departments={departments} />
                </div>
            </div>
        </div>
    );
}
