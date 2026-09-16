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
import { Button } from "@/components/ui/Button";
import type { DocumentType } from "@/types/document";

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

    function reset() {
        setType("ID Card");
        setFile(null);
        setError(null);
    }

    function handleClose(open: boolean) {
        if (!open) reset();
        onOpenChange(open);
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
                    <Input
                        id="doc-file"
                        type="file"
                        error={!!error}
                        onChange={(e) => {
                            setFile(e.target.files?.[0] ?? null);
                            setError(null);
                        }}
                    />
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