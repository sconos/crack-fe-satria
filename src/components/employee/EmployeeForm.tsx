"use client";

import * as React from "react";
import { z } from "zod";
import { FormField } from "@/components/ui/FormField";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { AvatarUpload } from "@/components/employee/AvatarUpload";
import { EmployeePickerField } from "@/components/employee/EmployeePickerField";
import type { Employee } from "@/types/employee";
import type { Department } from "@/types/department";

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

const employmentTypes = ["Full-time", "Part-time", "Contract"] as const;

const employeeSchema = z.object({
    name: z.string().min(1, "Full name is required"),
    email: z.string().min(1, "Email is required").email("Enter a valid email"),
    phone: z.string().min(1, "Phone number is required"),
    dateOfBirth: z.string().min(1, "Date of birth is required"),
    nationalId: z.string().min(1, "National ID is required"),
    address: z.string().min(1, "Address is required"),
    departmentId: z.string().min(1, "Department is required"),
    role: z.string().min(1, "Role is required"),
    employmentType: z.enum(["Full-time", "Part-time", "Contract"], {
        error: () => ({ message: "Employment type is required" }),
    }),
    workLocation: z.string().optional(),
    joinDate: z.string().min(1, "Join date is required"),
    emergencyContactName: z.string().min(1, "Emergency contact name is required"),
    emergencyContactPhone: z.string().min(1, "Emergency contact phone is required"),
});

type EmployeeFormValues = z.infer<typeof employeeSchema>;
type EmployeeFormErrors = Partial<Record<keyof EmployeeFormValues, string>>;
type EmployeeFormSubmitValues = EmployeeFormValues & {
    avatar: string | null;
    managerId: string | null;
};

interface EmployeeFormProps {
    departments: Department[];
    employees: Employee[];
    initialValues?: Partial<Employee>;
    onSubmit: (values: EmployeeFormSubmitValues) => Promise<void>;
    submitLabel?: string;
}

function getDescendantIds(employees: Employee[], id: string): Set<string> {
    const reportsByManager = new Map<string, string[]>();
    employees.forEach((e) => {
        if (e.managerId) {
            reportsByManager.set(e.managerId, [
                ...(reportsByManager.get(e.managerId) ?? []),
                e.id,
            ]);
        }
    });

    const result = new Set<string>();
    const stack = [id];
    while (stack.length > 0) {
        const current = stack.pop()!;
        for (const reportId of reportsByManager.get(current) ?? []) {
            if (!result.has(reportId)) {
                result.add(reportId);
                stack.push(reportId);
            }
        }
    }
    return result;
}

function EmployeeForm({
    departments,
    employees,
    initialValues,
    onSubmit,
    submitLabel = "Save Employee",
}: EmployeeFormProps) {
    const [values, setValues] = React.useState<EmployeeFormValues>({
        name: initialValues?.name ?? "",
        email: initialValues?.email ?? "",
        phone: initialValues?.phone ?? "",
        dateOfBirth: initialValues?.dateOfBirth ?? "",
        nationalId: initialValues?.nationalId ?? "",
        address: initialValues?.address ?? "",
        departmentId: initialValues?.departmentId ?? "",
        role: initialValues?.role ?? "",
        employmentType: initialValues?.employmentType ?? "Full-time",
        workLocation: initialValues?.workLocation ?? "",
        joinDate: initialValues?.joinDate ?? "",
        emergencyContactName: initialValues?.emergencyContactName ?? "",
        emergencyContactPhone: initialValues?.emergencyContactPhone ?? "",
    });

    const [avatar, setAvatar] = React.useState<string | null>(
        initialValues?.avatar ?? null,
    );

    const [managerId, setManagerId] = React.useState<string>(
        initialValues?.managerId ?? "",
    );

    const [errors, setErrors] = React.useState<EmployeeFormErrors>({});
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [formError, setFormError] = React.useState<string | null>(null);

    const excludedManagerIds = React.useMemo(() => {
        if (!initialValues?.id) return new Set<string>();
        const descendants = getDescendantIds(employees, initialValues.id);
        descendants.add(initialValues.id);
        return descendants;
    }, [employees, initialValues?.id]);

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
            await onSubmit({ ...values, avatar, managerId: managerId || null });
        } catch (err) {
            setFormError("Something went wrong. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {formError && <Alert variant="danger">{formError}</Alert>}

            <Alert variant="info">
                Avatar and emergency contact are saved to the
                employee&apos;s self-service profile, not from this form
                yet.
            </Alert>

            <AvatarUpload
                name={values.name || "New employee"}
                value={avatar}
                onChange={setAvatar}
            />

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
                    label="Date of birth"
                    htmlFor="dateOfBirth"
                    required
                    error={errors.dateOfBirth}
                >
                    <Input
                        id="dateOfBirth"
                        type="date"
                        error={!!errors.dateOfBirth}
                        value={values.dateOfBirth}
                        onChange={(e) =>
                            handleChange("dateOfBirth", e.target.value)
                        }
                    />
                </FormField>
            </div>

            {/* Row 2.5 — National ID + Address */}
            <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                    label="National ID"
                    htmlFor="nationalId"
                    required
                    error={errors.nationalId}
                >
                    <Input
                        id="nationalId"
                        placeholder="e.g. KTP number"
                        error={!!errors.nationalId}
                        value={values.nationalId}
                        onChange={(e) =>
                            handleChange("nationalId", e.target.value)
                        }
                    />
                </FormField>

                <FormField
                    label="Address"
                    htmlFor="address"
                    required
                    error={errors.address}
                >
                    <Input
                        id="address"
                        placeholder="e.g. Jl. Sudirman No. 1, Jakarta"
                        error={!!errors.address}
                        value={values.address}
                        onChange={(e) => handleChange("address", e.target.value)}
                    />
                </FormField>
            </div>

            {/* Row 3 — Department + Role */}
            <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                    label="Department"
                    htmlFor="departmentId"
                    required
                    error={errors.departmentId}
                >
                    <Select
                        id="departmentId"
                        placeholder="Select department"
                        error={!!errors.departmentId}
                        value={values.departmentId}
                        onChange={(e) =>
                            handleChange("departmentId", e.target.value)
                        }
                    >
                        {departments.map((d) => (
                            <option key={d.id} value={d.id}>
                                {d.name}
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

            {/* Row 4 — Employment type + Join date */}
            <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                    label="Employment type"
                    htmlFor="employmentType"
                    required
                    error={errors.employmentType}
                >
                    <Select
                        id="employmentType"
                        error={!!errors.employmentType}
                        value={values.employmentType}
                        onChange={(e) =>
                            handleChange("employmentType", e.target.value)
                        }
                    >
                        {employmentTypes.map((t) => (
                            <option key={t} value={t}>
                                {t}
                            </option>
                        ))}
                    </Select>
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

            {/* Row 5 — Manager + Work location */}
            <div className="grid gap-4 sm:grid-cols-2">
                <EmployeePickerField
                    label="Reports to"
                    htmlFor="managerId"
                    employees={employees}
                    excludeIds={excludedManagerIds}
                    value={managerId}
                    onChange={setManagerId}
                    placeholder="Unassigned"
                />

                <FormField label="Work location" htmlFor="workLocation">
                    <Input
                        id="workLocation"
                        placeholder="e.g. Jakarta HQ, Remote"
                        value={values.workLocation}
                        onChange={(e) =>
                            handleChange("workLocation", e.target.value)
                        }
                    />
                </FormField>
            </div>

            {/* Row 6 — Emergency contact */}
            <div className="grid gap-4 sm:grid-cols-2 border-t border-neutral/10 pt-4">
                <FormField
                    label="Emergency contact name"
                    htmlFor="emergencyContactName"
                    required
                    error={errors.emergencyContactName}
                >
                    <Input
                        id="emergencyContactName"
                        placeholder="e.g. Siti Wijaya"
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
                        placeholder="e.g. +62 813 9876 5432"
                        error={!!errors.emergencyContactPhone}
                        value={values.emergencyContactPhone}
                        onChange={(e) =>
                            handleChange("emergencyContactPhone", e.target.value)
                        }
                    />
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

export { EmployeeForm, type EmployeeFormValues, type EmployeeFormSubmitValues };