"use client";

import { useRef, useState } from "react";
import { File as FileIcon, Upload, X } from "lucide-react";
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
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/util";
import type { DocumentType } from "@/types/document";

const ACCEPTED_EXTENSIONS = [".pdf", ".jpg", ".jpeg", ".png"];
const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB

function formatFileSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

const documentTypes: DocumentType[] = [
    "ID Card",
    "Contract",
    "Certificate",
    "Tax Form",
    "Other",
];

export type UploadDocumentInput = {
    type: DocumentType;
    file: File;
};

export function UploadDocumentModal({
    open,
    onOpenChange,
    onSubmit,
    isUploading,
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (data: UploadDocumentInput) => void | Promise<void>;
    isUploading?: boolean;
}) {
    const [type, setType] = useState<DocumentType>("ID Card");
    const [file, setFile] = useState<File | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    function reset() {
        setType("ID Card");
        setFile(null);
        setError(null);
        setIsDragging(false);
    }

    function handleClose(open: boolean) {
        if (!open) reset();
        onOpenChange(open);
    }

    function validateAndSetFile(candidate: File | undefined | null) {
        if (!candidate) return;

        const hasAcceptedExtension = ACCEPTED_EXTENSIONS.some((ext) =>
            candidate.name.toLowerCase().endsWith(ext),
        );
        if (!hasAcceptedExtension) {
            setError("Only PDF, JPG, or PNG files are supported.");
            return;
        }
        if (candidate.size > MAX_FILE_SIZE_BYTES) {
            setError("File is too large — max size is 10MB.");
            return;
        }

        setFile(candidate);
        setError(null);
    }

    function handleDrop(e: React.DragEvent<HTMLDivElement>) {
        e.preventDefault();
        setIsDragging(false);
        validateAndSetFile(e.dataTransfer.files?.[0]);
    }

    async function handleSubmit() {
        if (!file) {
            setError("Choose a file to upload.");
            return;
        }

        await onSubmit({ type, file });
        reset();
        onOpenChange(false);
    }

    return (
        <Modal open={open} onOpenChange={handleClose}>
            <ModalCloseButton onClose={() => handleClose(false)} />
            <ModalHeader>
                <ModalTitle>Upload document</ModalTitle>
                <ModalDescription>
                    HR will review it before it&apos;s marked verified.
                </ModalDescription>
            </ModalHeader>

            <div className="mt-6 flex flex-col gap-4">
                <FormField label="Document type" htmlFor="doc-type">
                    <Select
                        id="doc-type"
                        value={type}
                        onChange={(e) => setType(e.target.value as DocumentType)}
                    >
                        {documentTypes.map((t) => (
                            <option key={t} value={t}>
                                {t}
                            </option>
                        ))}
                    </Select>
                </FormField>

                <FormField label="File" htmlFor="doc-file" error={error ?? undefined}>
                    <input
                        ref={fileInputRef}
                        id="doc-file"
                        type="file"
                        accept={ACCEPTED_EXTENSIONS.join(",")}
                        className="hidden"
                        onChange={(e) => {
                            validateAndSetFile(e.target.files?.[0]);
                            e.target.value = "";
                        }}
                    />

                    {file ? (
                        <div className="flex items-center justify-between gap-3 rounded-lg border border-neutral/10 bg-primary-tint/40 px-4 py-3">
                            <div className="flex items-center gap-3 overflow-hidden">
                                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary-tint text-primary">
                                    <FileIcon className="h-4 w-4" />
                                </span>
                                <div className="overflow-hidden">
                                    <p className="truncate text-sm font-medium text-primary-dark">
                                        {file.name}
                                    </p>
                                    <p className="text-xs text-neutral">
                                        {formatFileSize(file.size)}
                                    </p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => {
                                    setFile(null);
                                    setError(null);
                                }}
                                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-neutral transition-colors hover:bg-neutral/10 hover:text-primary-dark"
                            >
                                <X className="h-4 w-4" />
                                <span className="sr-only">Remove file</span>
                            </button>
                        </div>
                    ) : (
                        <div
                            role="button"
                            tabIndex={0}
                            onClick={() => fileInputRef.current?.click()}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" || e.key === " ") {
                                    e.preventDefault();
                                    fileInputRef.current?.click();
                                }
                            }}
                            onDragOver={(e) => {
                                e.preventDefault();
                                setIsDragging(true);
                            }}
                            onDragLeave={() => setIsDragging(false)}
                            onDrop={handleDrop}
                            className={cn(
                                "flex cursor-pointer flex-col items-center gap-2 rounded-lg border-2 border-dashed px-4 py-8 text-center transition-colors",
                                isDragging
                                    ? "border-primary bg-primary-tint/40"
                                    : error
                                      ? "border-danger/40 hover:bg-danger/5"
                                      : "border-neutral/20 hover:border-primary/40 hover:bg-primary-tint/20",
                            )}
                        >
                            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-tint text-primary">
                                <Upload className="h-4 w-4" />
                            </span>
                            <p className="text-sm font-medium text-primary-dark">
                                Click to upload or drag and drop
                            </p>
                            <p className="text-xs text-neutral">
                                PDF, JPG, or PNG — up to 10MB
                            </p>
                        </div>
                    )}
                </FormField>
            </div>

            <ModalFooter>
                <Button variant="outline" onClick={() => handleClose(false)}>
                    Cancel
                </Button>
                <Button onClick={handleSubmit} loading={isUploading}>
                    Upload
                </Button>
            </ModalFooter>
        </Modal>
    );
}