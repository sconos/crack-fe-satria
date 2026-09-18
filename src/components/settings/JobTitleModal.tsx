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
import { Button } from "@/components/ui/Button";
import type { JobTitle } from "@/types/job-title";

export function JobTitleModal({
    open,
    onOpenChange,
    initialValues,
    onSubmit,
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    initialValues?: JobTitle;
    onSubmit: (name: string) => void;
}) {
    const [name, setName] = useState("");
    const [error, setError] = useState<string | undefined>(undefined);

    const [resetKey, setResetKey] = useState<string | null>(null);
    const currentKey = open ? initialValues?.id ?? "new" : null;

    if (currentKey !== resetKey) {
        setResetKey(currentKey);
        if (currentKey) {
            setName(initialValues?.name ?? "");
            setError(undefined);
        }
    }

    function handleSubmit() {
        if (!name.trim()) {
            setError("Job title name is required.");
            return;
        }
        onSubmit(name.trim());
        onOpenChange(false);
    }

    return (
        <Modal open={open} onOpenChange={onOpenChange}>
            <ModalCloseButton onClose={() => onOpenChange(false)} />
            <ModalHeader>
                <ModalTitle>
                    {initialValues ? "Edit job title" : "Add job title"}
                </ModalTitle>
            </ModalHeader>

            <div className="mt-6 flex flex-col gap-4">
                <FormField
                    label="Name"
                    htmlFor="job-title-name"
                    required
                    error={error}
                >
                    <Input
                        id="job-title-name"
                        placeholder="e.g. Frontend Engineer"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        error={!!error}
                    />
                </FormField>
            </div>

            <ModalFooter>
                <Button variant="outline" onClick={() => onOpenChange(false)}>
                    Cancel
                </Button>
                <Button onClick={handleSubmit}>
                    {initialValues ? "Save changes" : "Add job title"}
                </Button>
            </ModalFooter>
        </Modal>
    );
}