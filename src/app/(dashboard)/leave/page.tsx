"use client";

import * as React from "react";
import { Plus } from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Button } from "@/components/ui/Button";
import { RejectReasonModal } from "@/components/ui/RejectReasonModal";
import { Select } from "@/components/ui/Select";
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
import { toast } from "@/components/ui/Toast";
import {
    AdminCreateLeaveModal,
    type AdminCreateLeaveInput,
} from "@/components/leave/AdminCreateLeaveModal";
import {
    getLeaveRequests,
    reviewLeaveRequest,
    createLeaveRequestForEmployee,
    type LeaveRequestWithEmployee,
} from "@/lib/api/leave";
import { getLeaveTypes } from "@/lib/api/leave-types";
import { getEmployees } from "@/lib/api/employees";
import { formatLeaveDateRange } from "@/lib/api/mappers/leave-mappers";
import { ApiError } from "@/lib/api/client";
import type { LeaveStatus } from "@/types/leave";
import type { Employee } from "@/types/employee";
import type { LeaveTypeOption } from "@/components/employee/RequestLeaveModal";

const statusOptions: { label: string; value: "All" | LeaveStatus }[] = [
    { label: "All statuses", value: "All" },
    { label: "Pending", value: "Pending" },
    { label: "Approved", value: "Approved" },
    { label: "Rejected", value: "Rejected" },
    { label: "Cancelled", value: "Cancelled" },
];

const statusVariant: Record<
    LeaveStatus,
    "success" | "warning" | "danger" | "neutral"
> = {
    Approved: "success",
    Pending: "warning",
    Rejected: "danger",
    Cancelled: "neutral",
};

export default function LeavePage() {
    const [statusFilter, setStatusFilter] = React.useState<"All" | LeaveStatus>(
        "All",
    );
    const [requests, setRequests] = React.useState<LeaveRequestWithEmployee[]>(
        [],
    );
    const [isLoading, setIsLoading] = React.useState(true);
    const [reviewingId, setReviewingId] = React.useState<string | null>(null);
    const [rejectTargetId, setRejectTargetId] = React.useState<string | null>(
        null,
    );

    const [employees, setEmployees] = React.useState<Employee[]>([]);
    const [leaveTypeOptions, setLeaveTypeOptions] = React.useState<
        LeaveTypeOption[]
    >([]);
    const [modalOpen, setModalOpen] = React.useState(false);
    const [isCreating, setIsCreating] = React.useState(false);

    async function loadRequests() {
        setIsLoading(true);
        try {
            const { requests: fetched } = await getLeaveRequests({
                limit: 100,
                ...(statusFilter !== "All" && { status: statusFilter }),
            });
            setRequests(fetched);
        } catch {
            toast.error("Couldn't load leave requests.");
        } finally {
            setIsLoading(false);
        }
    }

    React.useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect -- known FP on async fetch fns
        loadRequests();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [statusFilter]);

    async function loadModalData() {
        try {
            const [employeesRes, typesRes] = await Promise.all([
                getEmployees({ limit: 200 }),
                getLeaveTypes(),
            ]);
            setEmployees(employeesRes.employees);
            setLeaveTypeOptions(typesRes.map((t) => ({ id: t.id, name: t.name })));
        } catch {
            toast.error("Couldn't load employees or leave types.");
        }
    }

    function handleOpenModal() {
        setModalOpen(true);
        if (employees.length === 0) loadModalData();
    }

    async function handleCreate(data: AdminCreateLeaveInput) {
        setIsCreating(true);
        try {
            await createLeaveRequestForEmployee(data);
            toast.success("Leave request filed — pending review.");
            setModalOpen(false);
            await loadRequests();
        } catch (err) {
            toast.error(
                err instanceof ApiError
                    ? err.message
                    : "Couldn't file this leave request. Try again.",
            );
        } finally {
            setIsCreating(false);
        }
    }

    async function handleApprove(id: string) {
        setReviewingId(id);
        try {
            const updated = await reviewLeaveRequest(id, "APPROVED");
            setRequests((prev) =>
                prev.map((r) => (r.id === id ? updated : r)),
            );
            toast.success("Leave request approved.");
        } catch (err) {
            toast.error(
                err instanceof ApiError
                    ? err.message
                    : "Couldn't approve this request. Try again.",
            );
        } finally {
            setReviewingId(null);
        }
    }

    function handleReject(id: string) {
        setRejectTargetId(id);
    }

    async function handleConfirmReject(reason: string) {
        if (!rejectTargetId) return;
        const id = rejectTargetId;
        setReviewingId(id);
        try {
            const updated = await reviewLeaveRequest(id, "REJECTED", reason);
            setRequests((prev) =>
                prev.map((r) => (r.id === id ? updated : r)),
            );
            toast.error("Leave request rejected.");
            setRejectTargetId(null);
        } catch (err) {
            toast.error(
                err instanceof ApiError
                    ? err.message
                    : "Couldn't reject this request. Try again.",
            );
        } finally {
            setReviewingId(null);
        }
    }

    return (
        <DashboardLayout title="Leave">
            <div className="flex flex-col gap-6">
                <PageHeader
                    title="Leave"
                    description="Review leave requests across the company"
                    action={
                        <Button onClick={handleOpenModal}>
                            <Plus className="h-4 w-4" />
                            New leave request
                        </Button>
                    }
                />

                <Select
                    value={statusFilter}
                    onChange={(e) =>
                        setStatusFilter(e.target.value as "All" | LeaveStatus)
                    }
                    className="w-48"
                >
                    {statusOptions.map((o) => (
                        <option key={o.value} value={o.value}>
                            {o.label}
                        </option>
                    ))}
                </Select>

                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Employee</TableHead>
                            <TableHead>Leave type</TableHead>
                            <TableHead>Dates</TableHead>
                            <TableHead>Days</TableHead>
                            <TableHead>Reason</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">
                                Actions
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableEmpty colSpan={7}>
                                Loading leave requests...
                            </TableEmpty>
                        ) : requests.length === 0 ? (
                            <TableEmpty colSpan={7}>
                                No leave requests yet.
                            </TableEmpty>
                        ) : (
                            requests.map((r) => (
                                <TableRow key={r.id}>
                                    <TableCell>
                                        <div>
                                            <p className="font-medium text-primary-dark">
                                                {r.employeeName ?? "—"}
                                            </p>
                                            <p className="text-xs text-neutral">
                                                {r.employeeCode}
                                            </p>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-neutral">
                                        {r.type}
                                    </TableCell>
                                    <TableCell className="text-neutral">
                                        {formatLeaveDateRange(
                                            r.startDate,
                                            r.endDate,
                                        )}
                                    </TableCell>
                                    <TableCell className="text-neutral">
                                        {r.days}
                                    </TableCell>
                                    <TableCell className="max-w-xs text-neutral">
                                        {r.reason}
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={statusVariant[r.status]}
                                            dot
                                        >
                                            {r.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {r.status === "Pending" && (
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    size="sm"
                                                    loading={
                                                        reviewingId === r.id
                                                    }
                                                    onClick={() =>
                                                        handleApprove(r.id)
                                                    }
                                                >
                                                    Approve
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    loading={
                                                        reviewingId === r.id
                                                    }
                                                    onClick={() =>
                                                        handleReject(r.id)
                                                    }
                                                >
                                                    Reject
                                                </Button>
                                            </div>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            <AdminCreateLeaveModal
                open={modalOpen}
                onOpenChange={setModalOpen}
                employees={employees}
                leaveTypes={leaveTypeOptions}
                onSubmit={handleCreate}
                isSubmitting={isCreating}
            />

            <RejectReasonModal
                open={!!rejectTargetId}
                onOpenChange={(open) => {
                    if (!open) setRejectTargetId(null);
                }}
                title="Reject leave request"
                onSubmit={handleConfirmReject}
                isSubmitting={!!reviewingId}
            />
        </DashboardLayout>
    );
}