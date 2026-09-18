"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { FormField } from "@/components/ui/FormField";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";

export function RejectReasonModal({
    open,
    onOpenChange,
    title = "Reason for rejecting",
    description,
    onSubmit,
    isSubmitting,
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title?: string;
    description?: string;
    onSubmit: (reason: string) => void | Promise<void>;
    isSubmitting?: boolean;
}) {
    const [reason, setReason] = React.useState("");
    const [error, setError] = React.useState<string | null>(null);
    const [resetKey, setResetKey] = React.useState(false);

    if (open !== resetKey) {
        setResetKey(open);
        if (open) {
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

    React.useEffect(() => {
        function handleKeyDown(e: KeyboardEvent) {
            if (e.key === "Escape" && !isSubmitting) onOpenChange(false);
        }
        if (open) document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [open, isSubmitting, onOpenChange]);

    if (!open || typeof document === "undefined") return null;

    function handleSubmit() {
        if (!reason.trim()) {
            setError("A reason is required.");
            return;
        }
        onSubmit(reason.trim());
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
                        {title}
                    </h2>
                    {description && (
                        <p className="font-body text-sm text-neutral">
                            {description}
                        </p>
                    )}
                </div>

                <div className="mt-5">
                    <FormField
                        label="Reason"
                        htmlFor="reject-reason"
                        error={error ?? undefined}
                    >
                        <Textarea
                            id="reject-reason"
                            autoFocus
                            placeholder="Explain why this is being rejected"
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
                    <Button
                        variant="danger"
                        loading={isSubmitting}
                        onClick={handleSubmit}
                    >
                        Reject
                    </Button>
                </div>
            </div>
        </div>,
        document.body,
    );
}