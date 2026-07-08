"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { cn } from "@/lib/util";

interface ModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    children: React.ReactNode;
}

function Modal({ open, onOpenChange, children }: ModalProps) {
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

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
            if (e.key === "Escape") onOpenChange(false);
        }
        if (open) document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [open, onOpenChange]);

    if (!mounted || !open) return null;

    return createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <div
                className="absolute inset-0 bg-primary-dark/40 backdrop-blur-sm"
                onClick={() => onOpenChange(false)}
            />
            <div className="relative z-10 w-full max-w-md rounded-xl border border-neutral/15 bg-base-white p-6 shadow-lg">
                {children}
            </div>
        </div>,
        document.body,
    );
}

const ModalHeader = ({
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
    <div className={cn("flex flex-col gap-1 pr-6", className)} {...props} />
);

const ModalTitle = ({
    className,
    ...props
}: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2
        className={cn(
            "font-heading text-lg font-semibold text-primary-dark",
            className,
        )}
        {...props}
    />
);

const ModalDescription = ({
    className,
    ...props
}: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p className={cn("font-body text-sm text-neutral", className)} {...props} />
);

const ModalFooter = ({
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
    <div className={cn("mt-6 flex justify-end gap-2", className)} {...props} />
);

function ModalCloseButton({ onClose }: { onClose: () => void }) {
    return (
        <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 rounded-md text-neutral transition-colors hover:text-primary-dark"
        >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
        </button>
    );
}

export {
    Modal,
    ModalHeader,
    ModalTitle,
    ModalDescription,
    ModalFooter,
    ModalCloseButton,
};
