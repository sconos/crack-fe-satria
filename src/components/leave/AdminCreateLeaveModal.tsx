"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { FormField } from "@/components/ui/FormField";
import { Select } from "@/components/ui/Select";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import type { Employee } from "@/types/employee";
import type { LeaveTypeOption } from "@/components/employee/RequestLeaveModal";

export interface AdminCreateLeaveInput {
    employeeId: string;
    leaveTypeId: string;
    startDate: string;
    endDate: string;
    reason: string;
}

export function AdminCreateLeaveModal({
    open,
    onOpenChange,
    employees,
    leaveTypes,
    onSubmit,
    isSubmitting,
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    employees: Employee[];
    leaveTypes: LeaveTypeOption[];
    onSubmit: (data: AdminCreateLeaveInput) => void | Promise<void>;
    isSubmitting?: boolean;
}) {
    const [employeeId, setEmployeeId] = React.useState("");
    const [leaveTypeId, setLeaveTypeId] = React.useState("");
    const [startDate, setStartDate] = React.useState("");
    const [endDate, setEndDate] = React.useState("");
    const [reason, setReason] = React.useState("");
    const [errors, setErrors] = React.useState<Record<string, string>>({});

    const [resetKey, setResetKey] = React.useState(false);

    if (open !== resetKey) {
        setResetKey(open);
        if (open) {
            setEmployeeId(employees[0]?.id ?? "");
            setLeaveTypeId(leaveTypes[0]?.id ?? "");
            setStartDate("");
            setEndDate("");
            setReason("");
            setErrors({});
        }
    }

    if (!open || typeof document === "undefined") return null;

    function handleSubmit() {
        const nextErrors: Record<string, string> = {};
        if (!employeeId) nextErrors.employeeId = "Pick an employee.";
        if (!leaveTypeId) nextErrors.leaveTypeId = "Pick a leave type.";
        if (!startDate) nextErrors.startDate = "Pick a start date.";
        if (!endDate) nextErrors.endDate = "Pick an end date.";
        if (startDate && endDate && endDate < startDate) {
            nextErrors.endDate = "End date can't be before the start date.";
        }
        if (!reason.trim()) nextErrors.reason = "Give a reason for the request.";

        if (Object.keys(nextErrors).length > 0) {
            setErrors(nextErrors);
            return;
        }

        onSubmit({ employeeId, leaveTypeId, startDate, endDate, reason: reason.trim() });
    }

    return createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <div
                className="absolute inset-0 bg-primary-dark/40 backdrop-blur-sm"
                onClick={() => !isSubmitting && onOpenChange(false)}
            />

            <div className="relative z-10 w-full max-w-md rounded-xl border border-neutral/15 bg-base-white p-6 shadow-lg">
                <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={() => onOpenChange(false)}
                    className="absolute right-4 top-4 rounded-md text-neutral hover:text-primary-dark disabled:opacity-50"
                >
                    <X className="h-4 w-4" />
                    <span className="sr-only">Close</span>
                </button>

                <div className="flex flex-col gap-1 pr-6">
                    <h2 className="font-heading text-lg font-semibold text-primary-dark">
                        New leave request
                    </h2>
                    <p className="font-body text-sm text-neutral">
                        Files a request on the employee&apos;s behalf. It still
                        lands as Pending and needs review, same as a
                        self-submitted one.
                    </p>
                </div>

                <div className="mt-5 flex flex-col gap-4">
                    <FormField
                        label="Employee"
                        htmlFor="admin-leave-employee"
                        error={errors.employeeId}
                    >
                        <Select
                            id="admin-leave-employee"
                            value={employeeId}
                            onChange={(e) => setEmployeeId(e.target.value)}
                            error={!!errors.employeeId}
                        >
                            {employees.map((e) => (
                                <option key={e.id} value={e.id}>
                                    {e.name}
                                </option>
                            ))}
                        </Select>
                    </FormField>

                    <FormField
                        label="Leave type"
                        htmlFor="admin-leave-type"
                        error={errors.leaveTypeId}
                    >
                        <Select
                            id="admin-leave-type"
                            value={leaveTypeId}
                            onChange={(e) => setLeaveTypeId(e.target.value)}
                            error={!!errors.leaveTypeId}
                        >
                            {leaveTypes.map((t) => (
                                <option key={t.id} value={t.id}>
                                    {t.name}
                                </option>
                            ))}
                        </Select>
                    </FormField>

                    <div className="grid grid-cols-2 gap-4">
                        <FormField
                            label="Start date"
                            htmlFor="admin-leave-start"
                            error={errors.startDate}
                        >
                            <Input
                                id="admin-leave-start"
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                error={!!errors.startDate}
                            />
                        </FormField>
                        <FormField
                            label="End date"
                            htmlFor="admin-leave-end"
                            error={errors.endDate}
                        >
                            <Input
                                id="admin-leave-end"
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                error={!!errors.endDate}
                            />
                        </FormField>
                    </div>

                    <FormField
                        label="Reason"
                        htmlFor="admin-leave-reason"
                        error={errors.reason}
                    >
                        <Textarea
                            id="admin-leave-reason"
                            placeholder="A short note for the record"
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            error={!!errors.reason}
                        />
                    </FormField>
                </div>

                <div className="mt-6 flex justify-end gap-2">
                    <Button
                        variant="outline"
                        disabled={isSubmitting}
                        onClick={() => onOpenChange(false)}
                    >
                        Cancel
                    </Button>
                    <Button loading={isSubmitting} onClick={handleSubmit}>
                        Submit request
                    </Button>
                </div>
            </div>
        </div>,
        document.body,
    );
}