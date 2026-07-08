"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface DeleteConfirmModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    employeeName: string;
    onConfirm: () => void;
    isDeleting?: boolean;
}

function DeleteConfirmModal({
    open,
    onOpenChange,
    employeeName,
    onConfirm,
    isDeleting,
}: DeleteConfirmModalProps) {
    React.useEffect(() => {
        if (open) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [open]);

    React.useEffect(() => {
        function handleKeyDown(e: KeyboardEvent) {
            if (e.key === "Escape" && !isDeleting) onOpenChange(false);
        }
        if (open) document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [open, isDeleting, onOpenChange]);

    // Don't render on server or when closed
    if (typeof document === "undefined" || !open) return null;

    return createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-primary-dark/40 backdrop-blur-sm"
                onClick={() => !isDeleting && onOpenChange(false)}
            />

            {/* Modal box */}
            <div className="relative z-10 w-full max-w-md rounded-xl border border-neutral/15 bg-base-white p-6 shadow-lg">
                {/* Close button */}
                <button
                    type="button"
                    disabled={isDeleting}
                    onClick={() => onOpenChange(false)}
                    className="absolute right-4 top-4 rounded-md text-neutral transition-colors hover:text-primary-dark disabled:opacity-50"
                >
                    <X className="h-4 w-4" />
                    <span className="sr-only">Close</span>
                </button>

                {/* Header */}
                <div className="flex flex-col gap-1 pr-6">
                    <h2 className="font-heading text-lg font-semibold text-primary-dark">
                        Delete {employeeName}?
                    </h2>
                    <p className="font-body text-sm text-neutral">
                        This action can&apos;t be undone. All records for this
                        employee will be permanently removed.
                    </p>
                </div>

                {/* Footer */}
                <div className="mt-6 flex justify-end gap-2">
                    <Button
                        variant="outline"
                        disabled={isDeleting}
                        onClick={() => onOpenChange(false)}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="danger"
                        loading={isDeleting}
                        onClick={onConfirm}
                    >
                        Delete Employee
                    </Button>
                </div>
            </div>
        </div>,
        document.body,
    );
}

export { DeleteConfirmModal };
