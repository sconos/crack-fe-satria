"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { FormField } from "@/components/ui/FormField";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { AvatarUpload } from "@/components/employee/AvatarUpload";
import type { Employee } from "@/types/employee";

const portalProfileSchema = z.object({
    phone: z.string().min(1, "Phone number is required"),
    address: z.string().min(1, "Address is required"),
    emergencyContactName: z.string().min(1, "Emergency contact name is required"),
    emergencyContactPhone: z.string().min(1, "Emergency contact phone is required"),
});

type PortalProfileFormValues = z.infer<typeof portalProfileSchema>;
type PortalProfileFormErrors = Partial<Record<keyof PortalProfileFormValues, string>>;
type PortalProfileFormSubmitValues = PortalProfileFormValues & {
    avatar: string | null;
};

export function PortalProfileForm({
    employee,
    onSubmit,
}: {
    employee: Employee;
    onSubmit: (values: PortalProfileFormSubmitValues) => Promise<void>;
}) {
    const router = useRouter();
    const [values, setValues] = React.useState<PortalProfileFormValues>({
        phone: employee.phone ?? "",
        address: employee.address ?? "",
        emergencyContactName: employee.emergencyContactName ?? "",
        emergencyContactPhone: employee.emergencyContactPhone ?? "",
    });
    const [avatar, setAvatar] = React.useState<string | null>(
        employee.avatar ?? null,
    );
    const [errors, setErrors] = React.useState<PortalProfileFormErrors>({});
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [formError, setFormError] = React.useState<string | null>(null);

    function handleChange(field: keyof PortalProfileFormValues, value: string) {
        setValues((prev) => ({ ...prev, [field]: value }));
        setErrors((prev) => ({ ...prev, [field]: undefined }));
    }

    function validate(): boolean {
        const result = portalProfileSchema.safeParse(values);
        if (result.success) {
            setErrors({});
            return true;
        }
        const next: PortalProfileFormErrors = {};
        result.error.issues.forEach((err) => {
            const field = err.path[0] as keyof PortalProfileFormValues;
            if (!next[field]) next[field] = err.message;
        });
        setErrors(next);
        return false;
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setFormError(null);
        if (!validate()) return;

        setIsSubmitting(true);
        try {
            await onSubmit({ ...values, avatar });
        } catch {
            setFormError("Something went wrong. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {formError && <Alert variant="danger">{formError}</Alert>}

            <AvatarUpload
                name={employee.name}
                value={avatar}
                onChange={setAvatar}
            />

            <Alert variant="info">
                You can update your phone number, address, and emergency
                contact here. Other details are managed by HR — reach out if
                something needs correcting.
            </Alert>

            <FormField label="Phone" htmlFor="phone" required error={errors.phone}>
                <Input
                    id="phone"
                    type="tel"
                    error={!!errors.phone}
                    value={values.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                />
            </FormField>

            <FormField label="Address" htmlFor="address" required error={errors.address}>
                <Input
                    id="address"
                    error={!!errors.address}
                    value={values.address}
                    onChange={(e) => handleChange("address", e.target.value)}
                />
            </FormField>

            <div className="grid gap-4 border-t border-neutral/10 pt-4 sm:grid-cols-2">
                <FormField
                    label="Emergency contact name"
                    htmlFor="emergencyContactName"
                    required
                    error={errors.emergencyContactName}
                >
                    <Input
                        id="emergencyContactName"
                        error={!!errors.emergencyContactName}
                        value={values.emergencyContactName}
                        onChange={(e) =>
                            handleChange("emergencyContactName", e.target.value)
                        }
                    />
                </FormField>

                <FormField
                    label="Emergency contact phone"
                    htmlFor="emergencyContactPhone"
                    required
                    error={errors.emergencyContactPhone}
                >
                    <Input
                        id="emergencyContactPhone"
                        type="tel"
                        error={!!errors.emergencyContactPhone}
                        value={values.emergencyContactPhone}
                        onChange={(e) =>
                            handleChange("emergencyContactPhone", e.target.value)
                        }
                    />
                </FormField>
            </div>

            <div className="flex items-center justify-end gap-3 border-t border-neutral/10 pt-4">
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.back()}
                >
                    Cancel
                </Button>
                <Button type="submit" loading={isSubmitting}>
                    Save changes
                </Button>
            </div>
        </form>
    );
}