"use client";

import { useState } from "react";
import {
    Modal,
    ModalHeader,
    ModalTitle,
    ModalDescription,
    ModalFooter,
    ModalCloseButton,
} from "@/components/ui/Modal";
import { FormField } from "@/components/ui/FormField";
import { Select } from "@/components/ui/Select";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";

export type LeaveRequestInput = {
    type: string;
    startDate: string;
    endDate: string;
    reason: string;
};

export function RequestLeaveModal({
    open,
    onOpenChange,
    leaveTypes,
    onSubmit,
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    leaveTypes: string[];
    onSubmit: (data: LeaveRequestInput) => void;
}) {
    const [type, setType] = useState(leaveTypes[0] ?? "");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [reason, setReason] = useState("");
    const [errors, setErrors] = useState<Record<string, string>>({});

    function reset() {
        setType(leaveTypes[0] ?? "");
        setStartDate("");
        setEndDate("");
        setReason("");
        setErrors({});
    }

    function handleClose(open: boolean) {
        if (!open) reset();
        onOpenChange(open);
    }

    function handleSubmit() {
        const nextErrors: Record<string, string> = {};
        if (!startDate) nextErrors.startDate = "Pick a start date.";
        if (!endDate) nextErrors.endDate = "Pick an end date.";
        if (startDate && endDate && endDate < startDate) {
            nextErrors.endDate = "End date can't be before the start date.";
        }
        if (!reason.trim()) nextErrors.reason = "Let them know why you're out.";

        if (Object.keys(nextErrors).length > 0) {
            setErrors(nextErrors);
            return;
        }

        onSubmit({ type, startDate, endDate, reason: reason.trim() });
        reset();
        onOpenChange(false);
    }

    return (
        <Modal open={open} onOpenChange={handleClose}>
            <ModalCloseButton onClose={() => handleClose(false)} />
            <ModalHeader>
                <ModalTitle>Request leave</ModalTitle>
                <ModalDescription>
                    This goes to their manager as a pending request.
                </ModalDescription>
            </ModalHeader>

            <div className="mt-6 flex flex-col gap-4">
                <FormField label="Leave type" htmlFor="leave-type">
                    <Select
                        id="leave-type"
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                    >
                        {leaveTypes.map((t) => (
                            <option key={t} value={t}>
                                {t}
                            </option>
                        ))}
                    </Select>
                </FormField>

                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        label="Start date"
                        htmlFor="leave-start"
                        error={errors.startDate}
                    >
                        <Input
                            id="leave-start"
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            error={!!errors.startDate}
                        />
                    </FormField>
                    <FormField
                        label="End date"
                        htmlFor="leave-end"
                        error={errors.endDate}
                    >
                        <Input
                            id="leave-end"
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            error={!!errors.endDate}
                        />
                    </FormField>
                </div>

                <FormField
                    label="Reason"
                    htmlFor="leave-reason"
                    error={errors.reason}
                >
                    <Textarea
                        id="leave-reason"
                        placeholder="A short note for their manager"
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        error={!!errors.reason}
                    />
                </FormField>
            </div>

            <ModalFooter>
                <Button variant="outline" onClick={() => handleClose(false)}>
                    Cancel
                </Button>
                <Button onClick={handleSubmit}>Submit request</Button>
            </ModalFooter>
        </Modal>
    );
}
