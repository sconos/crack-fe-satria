"use client";

import { useState } from "react";
import { Plus, Pencil, UserX, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableHead,
    TableCell,
    TableEmpty,
} from "@/components/ui/Table";
import { DropdownMenu } from "@/components/ui/DropdownMenu";
import { LeaveTypeModal, type LeaveTypeInput } from "./LeaveTypeModal";
import { toast } from "@/components/ui/Toast";
import type { LeaveTypeConfig } from "@/types/leave";

export function LeaveTypesTab({
    initialLeaveTypes,
}: {
    initialLeaveTypes: LeaveTypeConfig[];
}) {
    const [leaveTypes, setLeaveTypes] = useState(initialLeaveTypes);
    const [modalOpen, setModalOpen] = useState(false);
    const [editTarget, setEditTarget] = useState<LeaveTypeConfig | null>(null);

    function handleAdd() {
        setEditTarget(null);
        setModalOpen(true);
    }

    function handleEdit(type: LeaveTypeConfig) {
        setEditTarget(type);
        setModalOpen(true);
    }

    function handleSubmit(data: LeaveTypeInput) {
        if (editTarget) {
            setLeaveTypes((prev) =>
                prev.map((t) =>
                    t.id === editTarget.id ? { ...t, ...data } : t,
                ),
            );
            toast.success(`${data.name} updated`);
        } else {
            setLeaveTypes((prev) => [
                ...prev,
                {
                    id: `lt${Date.now()}`,
                    isActive: true,
                    ...data,
                },
            ]);
            toast.success(`${data.name} added`);
        }
    }

    function handleToggleActive(id: string) {
        setLeaveTypes((prev) =>
            prev.map((t) =>
                t.id === id ? { ...t, isActive: !t.isActive } : t,
            ),
        );
    }

    return (
        <div className="flex flex-col gap-4">
            <div className="flex justify-end">
                <Button onClick={handleAdd}>
                    <Plus className="h-4 w-4" />
                    Add leave type
                </Button>
            </div>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Default allocation</TableHead>
                        <TableHead>Paid</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {leaveTypes.length === 0 ? (
                        <TableEmpty colSpan={5}>No leave types configured yet.</TableEmpty>
                    ) : (
                        leaveTypes.map((type) => (
                            <TableRow key={type.id}>
                                <TableCell className="font-medium text-primary-dark">
                                    {type.name}
                                </TableCell>
                                <TableCell className="text-neutral">
                                    {type.defaultAllocation} days/year
                                </TableCell>
                                <TableCell>
                                    <Badge variant={type.isPaid ? "info" : "neutral"}>
                                        {type.isPaid ? "Paid" : "Unpaid"}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <Badge
                                        variant={type.isActive ? "success" : "neutral"}
                                        dot
                                    >
                                        {type.isActive ? "Active" : "Inactive"}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    <DropdownMenu
                                        trigger={<Pencil className="h-4 w-4" />}
                                        items={[
                                            {
                                                label: "Edit",
                                                icon: <Pencil className="h-3.5 w-3.5" />,
                                                onSelect: () => handleEdit(type),
                                            },
                                            {
                                                label: type.isActive
                                                    ? "Deactivate"
                                                    : "Reactivate",
                                                icon: type.isActive ? (
                                                    <UserX className="h-3.5 w-3.5" />
                                                ) : (
                                                    <RotateCcw className="h-3.5 w-3.5" />
                                                ),
                                                variant: type.isActive
                                                    ? "danger"
                                                    : "default",
                                                onSelect: () =>
                                                    handleToggleActive(type.id),
                                            },
                                        ]}
                                    />
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>

            <LeaveTypeModal
                open={modalOpen}
                onOpenChange={setModalOpen}
                initialValues={editTarget ?? undefined}
                onSubmit={handleSubmit}
            />
        </div>
    );
}