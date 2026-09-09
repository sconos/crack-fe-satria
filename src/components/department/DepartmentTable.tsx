"use client";

import { useRouter } from "next/navigation";
import { MapPin, MoreHorizontal, Pencil, UserX, RotateCcw } from "lucide-react";
import {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableHead,
    TableCell,
    TableEmpty,
} from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { DropdownMenu } from "@/components/ui/DropdownMenu";
import type { Department } from "@/types/department";

function Avatar({ initials }: { initials: string | null }) {
    return (
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-tint text-[11px] font-heading font-semibold text-primary-dark ring-1 ring-inset ring-primary/10">
            {initials ?? "—"}
        </span>
    );
}

export function DepartmentTable({
    departments,
    onToggleStatus,
}: {
    departments: Department[];
    onToggleStatus?: (id: string) => void;
}) {
    const router = useRouter();

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Department</TableHead>
                    <TableHead>Head</TableHead>
                    <TableHead>Employees</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {departments.length === 0 ? (
                    <TableEmpty colSpan={6}>
                        No departments to display yet.
                    </TableEmpty>
                ) : (
                    departments.map((dept) => (
                        <TableRow key={dept.id}>
                            <TableCell>
                                <p className="font-medium text-primary-dark">
                                    {dept.name}
                                </p>
                                <p className="text-xs text-neutral">{dept.code}</p>
                            </TableCell>
                            <TableCell>
                                {dept.headName ? (
                                    <div className="flex items-center gap-2">
                                        <Avatar initials={dept.headInitials} />
                                        <span className="text-primary-dark">
                                            {dept.headName}
                                        </span>
                                    </div>
                                ) : (
                                    <span className="text-xs italic text-neutral">
                                        Unassigned
                                    </span>
                                )}
                            </TableCell>
                            <TableCell>{dept.employeeCount}</TableCell>
                            <TableCell>
                                <span className="flex items-center gap-1 text-neutral">
                                    <MapPin className="h-3.5 w-3.5" />
                                    {dept.location ?? "—"}
                                </span>
                            </TableCell>
                            <TableCell>
                                <Badge
                                    variant={
                                        dept.status === "active"
                                            ? "success"
                                            : "neutral"
                                    }
                                    dot
                                >
                                    {dept.status === "active" ? "Active" : "Inactive"}
                                </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                                <DropdownMenu
                                    trigger={<MoreHorizontal className="h-4 w-4" />}
                                    items={[
                                        {
                                            label: "Edit",
                                            icon: <Pencil className="h-3.5 w-3.5" />,
                                            onSelect: () =>
                                                router.push(
                                                    `/departments/${dept.id}/edit`,
                                                ),
                                        },
                                        {
                                            label:
                                                dept.status === "inactive"
                                                    ? "Reactivate"
                                                    : "Deactivate",
                                            icon:
                                                dept.status === "inactive" ? (
                                                    <RotateCcw className="h-3.5 w-3.5" />
                                                ) : (
                                                    <UserX className="h-3.5 w-3.5" />
                                                ),
                                            variant:
                                                dept.status === "inactive"
                                                    ? "default"
                                                    : "danger",
                                            onSelect: () =>
                                                onToggleStatus?.(dept.id),
                                        },
                                    ]}
                                />
                            </TableCell>
                        </TableRow>
                    ))
                )}
            </TableBody>
        </Table>
    );
}