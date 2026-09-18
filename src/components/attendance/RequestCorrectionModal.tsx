"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { FormField } from "@/components/ui/FormField";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import type { AttendanceRecordWithEmployee } from "@/lib/api/attendance";

export interface CorrectionRequestInput {
    requestedClockIn: string;
    requestedClockOut: string;
    reason: string;
}

export function RequestCorrectionModal({
    open,
    onOpenChange,
    record,
    onSubmit,
    isSubmitting,
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    record: AttendanceRecordWithEmployee | null;
    onSubmit: (data: CorrectionRequestInput) => void | Promise<void>;
    isSubmitting?: boolean;
}) {
    const [clockIn, setClockIn] = React.useState("");
    const [clockOut, setClockOut] = React.useState("");
    const [reason, setReason] = React.useState("");
    const [error, setError] = React.useState<string | null>(null);

    const [resetKey, setResetKey] = React.useState<string | null>(null);
    const currentKey = open ? record?.id ?? null : null;

    if (currentKey !== resetKey) {
        setResetKey(currentKey);
        if (currentKey && record) {
            setClockIn(record.clockIn ?? "");
            setClockOut(record.clockOut ?? "");
            setReason("");
            setError(null);
        }
    }

    React.useEffect(() => {
        if (open) document.body.style.overflow = "hidden";
        else document.body.style.overflow = "";
        return () => {
            document.body.style.overflow = "";
        };
    }, [open]);

    if (!open || !record || typeof document === "undefined") return null;

    function handleSubmit() {
        if (!reason.trim()) {
            setError("Let HR know why you're requesting this correction.");
            return;
        }
        onSubmit({
            requestedClockIn: clockIn,
            requestedClockOut: clockOut,
            reason: reason.trim(),
        });
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
                        Request a correction
                    </h2>
                    <p className="font-body text-sm text-neutral">
                        For{" "}
                        {new Date(record.date).toLocaleDateString("en-US", {
                            month: "long",
                            day: "numeric",
                        })}
                        . HR will review before it&apos;s applied.
                    </p>
                </div>

                <div className="mt-5 flex flex-col gap-4">
                    <div className="grid grid-cols-2 gap-4">
                        <FormField label="Correct clock in" htmlFor="req-clock-in">
                            <Input
                                id="req-clock-in"
                                type="time"
                                value={clockIn}
                                onChange={(e) => setClockIn(e.target.value)}
                            />
                        </FormField>
                        <FormField label="Correct clock out" htmlFor="req-clock-out">
                            <Input
                                id="req-clock-out"
                                type="time"
                                value={clockOut}
                                onChange={(e) => setClockOut(e.target.value)}
                            />
                        </FormField>
                    </div>

                    <FormField label="Reason" htmlFor="req-reason" error={error ?? undefined}>
                        <Textarea
                            id="req-reason"
                            placeholder="e.g. Forgot to clock out before leaving"
                            value={reason}
                            onChange={(e) => {
                                setReason(e.target.value);
                                setError(null);
                            }}
                            error={!!error}
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