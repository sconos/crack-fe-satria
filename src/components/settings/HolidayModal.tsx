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

export type HolidayInput = { name: string; date: string };

export function HolidayModal({
    open,
    onOpenChange,
    onSubmit,
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (data: HolidayInput) => void;
}) {
    const [name, setName] = useState("");
    const [date, setDate] = useState("");
    const [errors, setErrors] = useState<Record<string, string>>({});

    function reset() {
        setName("");
        setDate("");
        setErrors({});
    }

    function handleClose(open: boolean) {
        if (!open) reset();
        onOpenChange(open);
    }

    function handleSubmit() {
        const nextErrors: Record<string, string> = {};
        if (!name.trim()) nextErrors.name = "Holiday name is required.";
        if (!date) nextErrors.date = "Pick a date.";

        if (Object.keys(nextErrors).length > 0) {
            setErrors(nextErrors);
            return;
        }

        onSubmit({ name: name.trim(), date });
        reset();
        onOpenChange(false);
    }

    return (
        <Modal open={open} onOpenChange={handleClose}>
            <ModalCloseButton onClose={() => handleClose(false)} />
            <ModalHeader>
                <ModalTitle>Add public holiday</ModalTitle>
            </ModalHeader>

            <div className="mt-6 flex flex-col gap-4">
                <FormField
                    label="Holiday name"
                    htmlFor="holiday-name"
                    required
                    error={errors.name}
                >
                    <Input
                        id="holiday-name"
                        placeholder="e.g. Independence Day"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        error={!!errors.name}
                    />
                </FormField>

                <FormField
                    label="Date"
                    htmlFor="holiday-date"
                    required
                    error={errors.date}
                >
                    <Input
                        id="holiday-date"
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        error={!!errors.date}
                    />
                </FormField>
            </div>

            <ModalFooter>
                <Button variant="outline" onClick={() => handleClose(false)}>
                    Cancel
                </Button>
                <Button onClick={handleSubmit}>Add holiday</Button>
            </ModalFooter>
        </Modal>
    );
}