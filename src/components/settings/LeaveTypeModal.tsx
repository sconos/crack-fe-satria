"use client";

import { useState } from "react";
import {
    Modal,
    ModalHeader,
    ModalTitle,
    ModalFooter,
    ModalCloseButton,
} from "@/components/ui/Modal";
import { FormField } from "@/components/ui/FormField";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import type { LeaveTypeConfig } from "@/types/leave";

export type LeaveTypeInput = {
    name: string;
    defaultAllocation: number;
    isPaid: boolean;
};

export function LeaveTypeModal({
    open,
    onOpenChange,
    initialValues,
    onSubmit,
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    initialValues?: LeaveTypeConfig;
    onSubmit: (data: LeaveTypeInput) => void;
}) {
    const [name, setName] = useState("");
    const [allocation, setAllocation] = useState("12");
    const [isPaid, setIsPaid] = useState("paid");
    const [errors, setErrors] = useState<Record<string, string>>({});

    const [resetKey, setResetKey] = useState<string | null>(null);
    const currentKey = open ? initialValues?.id ?? "new" : null;

    if (currentKey !== resetKey) {
        setResetKey(currentKey);
        if (currentKey) {
            setName(initialValues?.name ?? "");
            setAllocation(String(initialValues?.defaultAllocation ?? 12));
            setIsPaid(initialValues?.isPaid === false ? "unpaid" : "paid");
            setErrors({});
        }
    }

    function handleSubmit() {
        const nextErrors: Record<string, string> = {};
        if (!name.trim()) nextErrors.name = "Leave type name is required.";
        const allocationNum = Number(allocation);
        if (!allocation || Number.isNaN(allocationNum) || allocationNum < 0) {
            nextErrors.allocation = "Enter a valid number of days.";
        }

        if (Object.keys(nextErrors).length > 0) {
            setErrors(nextErrors);
            return;
        }

        onSubmit({
            name: name.trim(),
            defaultAllocation: allocationNum,
            isPaid: isPaid === "paid",
        });
        onOpenChange(false);
    }

    return (
        <Modal open={open} onOpenChange={onOpenChange}>
            <ModalCloseButton onClose={() => onOpenChange(false)} />
            <ModalHeader>
                <ModalTitle>
                    {initialValues ? "Edit leave type" : "Add leave type"}
                </ModalTitle>
            </ModalHeader>

            <div className="mt-6 flex flex-col gap-4">
                <FormField
                    label="Name"
                    htmlFor="leave-type-name"
                    required
                    error={errors.name}
                >
                    <Input
                        id="leave-type-name"
                        placeholder="e.g. Maternity Leave"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        error={!!errors.name}
                    />
                </FormField>

                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        label="Default allocation (days/year)"
                        htmlFor="leave-type-allocation"
                        required
                        error={errors.allocation}
                    >
                        <Input
                            id="leave-type-allocation"
                            type="number"
                            min={0}
                            value={allocation}
                            onChange={(e) => setAllocation(e.target.value)}
                            error={!!errors.allocation}
                        />
                    </FormField>

                    <FormField label="Paid status" htmlFor="leave-type-paid">
                        <Select
                            id="leave-type-paid"
                            value={isPaid}
                            onChange={(e) => setIsPaid(e.target.value)}
                        >
                            <option value="paid">Paid</option>
                            <option value="unpaid">Unpaid</option>
                        </Select>
                    </FormField>
                </div>
            </div>

            <ModalFooter>
                <Button variant="outline" onClick={() => onOpenChange(false)}>
                    Cancel
                </Button>
                <Button onClick={handleSubmit}>
                    {initialValues ? "Save changes" : "Add leave type"}
                </Button>
            </ModalFooter>
        </Modal>
    );
}