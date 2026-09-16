"use client";

import * as React from "react";
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
import {
    getAllLeaveTypes,
    createLeaveType,
    updateLeaveType,
    updateLeaveTypeStatus,
} from "@/lib/api/leave-types";
import type { LeaveTypeConfig } from "@/types/leave";

export function LeaveTypesTab() {
    const [leaveTypes, setLeaveTypes] = React.useState<LeaveTypeConfig[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const [modalOpen, setModalOpen] = React.useState(false);
    const [editTarget, setEditTarget] = React.useState<LeaveTypeConfig | null>(
        null,
    );

    React.useEffect(() => {
        let cancelled = false;

        async function load() {
            try {
                const fetched = await getAllLeaveTypes();
                if (!cancelled) setLeaveTypes(fetched);
            } catch {
                if (!cancelled) toast.error("Couldn't load leave types.");
            } finally {
                if (!cancelled) setIsLoading(false);
            }
        }

        load();
        return () => {
            cancelled = true;
        };
    }, []);

    function handleAdd() {
        setEditTarget(null);
        setModalOpen(true);
    }

    function handleEdit(type: LeaveTypeConfig) {
        setEditTarget(type);
        setModalOpen(true);
    }

    async function handleSubmit(data: LeaveTypeInput) {
        try {
            if (editTarget) {
                const updated = await updateLeaveType(editTarget.id, data);
                setLeaveTypes((prev) =>
                    prev.map((t) => (t.id === editTarget.id ? updated : t)),
                );
                toast.success(`${data.name} updated`);
            } else {
                const created = await createLeaveType(data);
                setLeaveTypes((prev) => [...prev, created]);
                toast.success(`${data.name} added`);
            }
        } catch {
            toast.error(
                editTarget
                    ? "Couldn't update leave type. Try again."
                    : "Couldn't add leave type. Try again.",
            );
        }
    }

    async function handleToggleActive(type: LeaveTypeConfig) {
        try {
            const updated = await updateLeaveTypeStatus(
                type.id,
                !type.isActive,
            );
            setLeaveTypes((prev) =>
                prev.map((t) => (t.id === type.id ? updated : t)),
            );
        } catch {
            toast.error("Couldn't update status. Try again.");
        }
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
                    {isLoading ? (
                        <TableEmpty colSpan={5}>
                            Loading leave types...
                        </TableEmpty>
                    ) : leaveTypes.length === 0 ? (
                        <TableEmpty colSpan={5}>No leave types configured yet.</TableEmpty>
                    ) : (
                        leaveTypes.map((type) => (
                            <TableRow key={type.id}>
                                <TableCell className="font-medium text-primary-dark">
                                    {type.name}
                                </TableCell>
                                <TableCell className="text-neutral">
                                    {type.defaultAllocation === 0
                                        ? "No limit"
                                        : `${type.defaultAllocation} days/year`}
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
                                                    handleToggleActive(type),
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