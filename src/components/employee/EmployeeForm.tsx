"use client";

import * as React from "react";
import { z } from "zod";
import { FormField } from "@/components/ui/FormField";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import type { Employee } from "@/types/employee";

const departments = [
    "Engineering",
    "Human Resources",
    "Sales",
    "Finance",
    "Marketing",
    "Operations",
];

const roles = [
    "Frontend Developer",
    "Backend Developer",
    "Fullstack Developer",
    "HR Manager",
    "HR Staff",
    "Sales Executive",
    "Finance Manager",
    "Marketing Manager",
    "Operations Manager",
];

const statuses = ["Active", "Inactive", "On Leave", "Probation"] as const;

const employeeSchema = z.object({
    name: z.string().min(1, "Full name is required"),
    email: z.string().min(1, "Email is required").email("Enter a valid email"),
    phone: z.string().optional(),
    department: z.string().min(1, "Department is required"),
    role: z.string().min(1, "Role is required"),
    status: z.enum(["Active", "Inactive", "On Leave", "Probation"], {
        error: () => ({ message: "Status is required" }),
    }),
    joinDate: z.string().min(1, "Join date is required"),
});

type EmployeeFormValues = z.infer<typeof employeeSchema>;
type EmployeeFormErrors = Partial<Record<keyof EmployeeFormValues, string>>;

interface EmployeeFormProps {
    initialValues?: Partial<Employee>;
    onSubmit: (values: EmployeeFormValues) => Promise<void>;
    submitLabel?: string;
}

function EmployeeForm({
    initialValues,
    onSubmit,
    submitLabel = "Save Employee",
}: EmployeeFormProps) {
    const [values, setValues] = React.useState<EmployeeFormValues>({
        name: initialValues?.name ?? "",
        email: initialValues?.email ?? "",
        phone: initialValues?.phone ?? "",
        department: initialValues?.department ?? "",
        role: initialValues?.role ?? "",
        status: initialValues?.status ?? "Active",
        joinDate: initialValues?.joinDate ?? "",
    });

    const [errors, setErrors] = React.useState<EmployeeFormErrors>({});
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [formError, setFormError] = React.useState<string | null>(null);

    function handleChange(field: keyof EmployeeFormValues, value: string) {
        setValues((prev) => ({ ...prev, [field]: value }));
        setErrors((prev) => ({ ...prev, [field]: undefined }));
    }

    function validate(): boolean {
        const result = employeeSchema.safeParse(values);
        if (result.success) {
            setErrors({});
            return true;
        }
        const next: EmployeeFormErrors = {};
        result.error.issues.forEach((err) => {
            const field = err.path[0] as keyof EmployeeFormValues;
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
            await onSubmit(values);
        } catch (err) {
            setFormError("Something went wrong. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {formError && <Alert variant="danger">{formError}</Alert>}

            {/* Row 1 — Name + Email */}
            <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                    label="Full name"
                    htmlFor="name"
                    required
                    error={errors.name}
                >
                    <Input
                        id="name"
                        placeholder="e.g. Satria Wijaya"
                        error={!!errors.name}
                        value={values.name}
                        onChange={(e) => handleChange("name", e.target.value)}
                    />
                </FormField>

                <FormField
                    label="Email"
                    htmlFor="email"
                    required
                    error={errors.email}
                >
                    <Input
                        id="email"
                        type="email"
                        placeholder="e.g. satria@koru.com"
                        error={!!errors.email}
                        value={values.email}
                        onChange={(e) => handleChange("email", e.target.value)}
                    />
                </FormField>
            </div>

            {/* Row 2 — Phone + Join Date */}
            <div className="grid gap-4 sm:grid-cols-2">
                <FormField label="Phone" htmlFor="phone" error={errors.phone}>
                    <Input
                        id="phone"
                        type="tel"
                        placeholder="e.g. +62 812 3456 7890"
                        error={!!errors.phone}
                        value={values.phone}
                        onChange={(e) => handleChange("phone", e.target.value)}
                    />
                </FormField>

                <FormField
                    label="Join date"
                    htmlFor="joinDate"
                    required
                    error={errors.joinDate}
                >
                    <Input
                        id="joinDate"
                        type="date"
                        error={!!errors.joinDate}
                        value={values.joinDate}
                        onChange={(e) =>
                            handleChange("joinDate", e.target.value)
                        }
                    />
                </FormField>
            </div>

            {/* Row 3 — Department + Role */}
            <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                    label="Department"
                    htmlFor="department"
                    required
                    error={errors.department}
                >
                    <Select
                        id="department"
                        placeholder="Select department"
                        error={!!errors.department}
                        value={values.department}
                        onChange={(e) =>
                            handleChange("department", e.target.value)
                        }
                    >
                        {departments.map((d) => (
                            <option key={d} value={d}>
                                {d}
                            </option>
                        ))}
                    </Select>
                </FormField>

                <FormField
                    label="Role"
                    htmlFor="role"
                    required
                    error={errors.role}
                >
                    <Select
                        id="role"
                        placeholder="Select role"
                        error={!!errors.role}
                        value={values.role}
                        onChange={(e) => handleChange("role", e.target.value)}
                    >
                        {roles.map((r) => (
                            <option key={r} value={r}>
                                {r}
                            </option>
                        ))}
                    </Select>
                </FormField>
            </div>

            {/* Row 4 — Status */}
            <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                    label="Status"
                    htmlFor="status"
                    required
                    error={errors.status}
                >
                    <Select
                        id="status"
                        error={!!errors.status}
                        value={values.status}
                        onChange={(e) => handleChange("status", e.target.value)}
                    >
                        {statuses.map((s) => (
                            <option key={s} value={s}>
                                {s}
                            </option>
                        ))}
                    </Select>
                </FormField>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 border-t border-neutral/10 pt-4">
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => window.history.back()}
                >
                    Cancel
                </Button>
                <Button type="submit" loading={isSubmitting}>
                    {submitLabel}
                </Button>
            </div>
        </form>
    );
}

export { EmployeeForm, type EmployeeFormValues };
