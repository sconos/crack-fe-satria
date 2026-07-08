"use client";

import * as React from "react";
import Link from "next/link";
import { Search, Pencil, Trash2, Eye } from "lucide-react";
import {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableHead,
    TableCell,
    TableEmpty,
    SortableHead,
    type SortDirection,
} from "@/components/ui/Table";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/employee/StatusBadge";
import { cn } from "@/lib/util";
import type { Employee, EmployeeStatus } from "@/types/employee";

interface EmployeeTableProps {
    employees: Employee[];
    onDelete?: (id: string) => void;
}

type SortField = "name" | "department" | "joinDate";

const statusOptions: { label: string; value: string }[] = [
    { label: "All Status", value: "" },
    { label: "Active", value: "Active" },
    { label: "Inactive", value: "Inactive" },
    { label: "On Leave", value: "On Leave" },
    { label: "Probation", value: "Probation" },
];

function getInitials(name: string) {
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function EmployeeTable({ employees, onDelete }: EmployeeTableProps) {
    const [search, setSearch] = React.useState("");
    const [statusFilter, setStatusFilter] = React.useState("");
    const [sortField, setSortField] = React.useState<SortField | null>(null);
    const [sortDirection, setSortDirection] =
        React.useState<SortDirection>(null);

    function handleSort(field: SortField) {
        if (sortField !== field) {
            setSortField(field);
            setSortDirection("asc");
        } else if (sortDirection === "asc") {
            setSortDirection("desc");
        } else if (sortDirection === "desc") {
            setSortField(null);
            setSortDirection(null);
        }
    }

    function getSortDirection(field: SortField): SortDirection {
        return sortField === field ? sortDirection : null;
    }

    const filtered = React.useMemo(() => {
        let result = [...employees];

        // search filter
        if (search.trim()) {
            const q = search.toLowerCase();
            result = result.filter(
                (e) =>
                    e.name.toLowerCase().includes(q) ||
                    e.email.toLowerCase().includes(q) ||
                    e.department.toLowerCase().includes(q) ||
                    e.role.toLowerCase().includes(q),
            );
        }

        // status filter
        if (statusFilter) {
            result = result.filter((e) => e.status === statusFilter);
        }

        // sort
        if (sortField && sortDirection) {
            result.sort((a, b) => {
                let aVal = a[sortField];
                let bVal = b[sortField];
                const cmp = aVal.localeCompare(bVal);
                return sortDirection === "asc" ? cmp : -cmp;
            });
        }

        return result;
    }, [employees, search, statusFilter, sortField, sortDirection]);

    return (
        <div className="flex flex-col gap-4">
            {/* Filters */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="w-full sm:max-w-xs">
                    <Input
                        placeholder="Search employees..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        leftIcon={<Search className="h-4 w-4" />}
                    />
                </div>
                <div className="w-full sm:w-44">
                    <Select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        {statusOptions.map((o) => (
                            <option key={o.value} value={o.value}>
                                {o.label}
                            </option>
                        ))}
                    </Select>
                </div>
            </div>

            {/* Table */}
            <Table>
                <TableHeader>
                    <TableRow>
                        <SortableHead
                            sorted={getSortDirection("name")}
                            onSort={() => handleSort("name")}
                        >
                            Employee
                        </SortableHead>
                        <SortableHead
                            sorted={getSortDirection("department")}
                            onSort={() => handleSort("department")}
                        >
                            Department
                        </SortableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Status</TableHead>
                        <SortableHead
                            sorted={getSortDirection("joinDate")}
                            onSort={() => handleSort("joinDate")}
                        >
                            Join Date
                        </SortableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filtered.length === 0 ? (
                        <TableEmpty colSpan={6}>
                            {search || statusFilter
                                ? "No employees match your search."
                                : "No employees yet. Add your first employee."}
                        </TableEmpty>
                    ) : (
                        filtered.map((employee) => (
                            <TableRow key={employee.id}>
                                {/* Employee */}
                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-tint font-heading text-xs font-semibold text-primary-dark">
                                            {getInitials(employee.name)}
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="font-medium text-primary-dark">
                                                {employee.name}
                                            </span>
                                            <span className="text-xs text-neutral">
                                                {employee.email}
                                            </span>
                                        </div>
                                    </div>
                                </TableCell>

                                {/* Department */}
                                <TableCell>{employee.department}</TableCell>

                                {/* Role */}
                                <TableCell className="text-neutral">
                                    {employee.role}
                                </TableCell>

                                {/* Status */}
                                <TableCell>
                                    <StatusBadge status={employee.status} />
                                </TableCell>

                                {/* Join Date */}
                                <TableCell className="text-neutral">
                                    {new Date(
                                        employee.joinDate,
                                    ).toLocaleDateString("en-US", {
                                        year: "numeric",
                                        month: "short",
                                        day: "numeric",
                                    })}
                                </TableCell>

                                {/* Actions */}
                                <TableCell>
                                    <div className="flex items-center justify-end gap-2">
                                        <Link
                                            href={`/employees/${employee.id}`}
                                        >
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-8 w-8 p-0"
                                            >
                                                <Eye className="h-4 w-4" />
                                                <span className="sr-only">
                                                    View {employee.name}
                                                </span>
                                            </Button>
                                        </Link>
                                        <Link
                                            href={`/employees/${employee.id}/edit`}
                                        >
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-8 w-8 p-0"
                                            >
                                                <Pencil className="h-4 w-4" />
                                                <span className="sr-only">
                                                    Edit {employee.name}
                                                </span>
                                            </Button>
                                        </Link>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-8 w-8 p-0 hover:bg-danger/10 hover:text-danger"
                                            onClick={() =>
                                                onDelete?.(employee.id)
                                            }
                                        >
                                            <Trash2 className="h-4 w-4" />
                                            <span className="sr-only">
                                                Delete {employee.name}
                                            </span>
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>

            {/* Result count */}
            {filtered.length > 0 && (
                <p className="font-body text-xs text-neutral">
                    Showing {filtered.length} of {employees.length} employee
                    {employees.length !== 1 ? "s" : ""}
                </p>
            )}
        </div>
    );
}

export { EmployeeTable };
