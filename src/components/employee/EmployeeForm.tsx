"use client";

import * as React from "react";
import { z } from "zod";
import { FormField } from "@/components/ui/FormField";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { EmployeePickerField } from "@/components/employee/EmployeePickerField";
import type { Employee } from "@/types/employee";
import type { Department } from "@/types/department";
import type { JobTitle } from "@/types/job-title";
import { ApiError } from "@/lib/api/client";

const employmentTypes = ["Full-time", "Part-time", "Contract"] as const;

const employeeSchema = z.object({
    name: z.string().min(1, "Full name is required"),
    email: z.string().min(1, "Email is required").email("Enter a valid email"),
    phone: z.string().min(1, "Phone number is required"),
    dateOfBirth: z.string().min(1, "Date of birth is required"),
    nationalId: z.string().min(1, "National ID is required"),
    address: z.string().min(1, "Address is required"),
    departmentId: z.string().min(1, "Department is required"),
    jobTitleId: z.string().min(1, "Job title is required"),
    employmentType: z.enum(["Full-time", "Part-time", "Contract"], {
        error: () => ({ message: "Employment type is required" }),
    }),
    workLocation: z.string().optional(),
    joinDate: z.string().min(1, "Join date is required"),
});

type EmployeeFormValues = z.infer<typeof employeeSchema>;
type EmployeeFormErrors = Partial<Record<keyof EmployeeFormValues, string>>;
type EmployeeFormSubmitValues = EmployeeFormValues & {
    managerId: string | null;
    baseSalary: number;
};

interface EmployeeFormProps {
    departments: Department[];
    jobTitles: JobTitle[];
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
    jobTitles,
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
        jobTitleId: initialValues?.jobTitleId ?? "",
        employmentType: initialValues?.employmentType ?? "Full-time",
        workLocation: initialValues?.workLocation ?? "",
        joinDate: initialValues?.joinDate ?? "",
    });

    const [managerId, setManagerId] = React.useState<string>(
        initialValues?.managerId ?? "",
    );

    const [baseSalary, setBaseSalary] = React.useState<string>(
        initialValues?.baseSalary !== undefined
            ? String(initialValues.baseSalary)
            : "0",
    );

    const [errors, setErrors] = React.useState<EmployeeFormErrors>({});
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [formError, setFormError] = React.useState<string | null>(null);

    const initialValueId = initialValues?.id;

    const excludedManagerIds = React.useMemo(() => {
        if (!initialValueId) return new Set<string>();
        const descendants = getDescendantIds(employees, initialValueId);
        descendants.add(initialValueId);
        return descendants;
    }, [employees, initialValueId]);

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
            await onSubmit({
                ...values,
                managerId: managerId || null,
                baseSalary: baseSalary === "" ? 0 : Number(baseSalary),
            });
        } catch (err) {
            console.error("Employee form submit failed:", err);
            let message = "Something went wrong. Please try again.";
            if (err instanceof ApiError) {
                const body = err.body as { message?: string | string[] } | null;
                if (Array.isArray(body?.message)) {
                    message = body.message.join(", ");
                } else if (typeof body?.message === "string") {
                    message = body.message;
                } else if (err.message) {
                    message = err.message;
                }
            } else if (err instanceof Error && err.message) {
                message = err.message;
            }
            setFormError(message);
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {formError && <Alert variant="danger">{formError}</Alert>}

            <Alert variant="info">
                Avatar and emergency contact aren&apos;t set here — the
                employee fills those in themselves from their own profile
                after they log in.
            </Alert>

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
                    label="Job title"
                    htmlFor="jobTitleId"
                    required
                    error={errors.jobTitleId}
                >
                    <Select
                        id="jobTitleId"
                        placeholder="Select job title"
                        error={!!errors.jobTitleId}
                        value={values.jobTitleId}
                        onChange={(e) => handleChange("jobTitleId", e.target.value)}
                    >
                        {jobTitles.map((jt) => (
                            <option key={jt.id} value={jt.id}>
                                {jt.name}
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

            {/* Row 4.5 — Base salary */}
            <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                    label="Base salary"
                    htmlFor="baseSalary"
                    helperText="Monthly, in IDR. Used to generate payroll — defaults to 0 if left blank."
                >
                    <Input
                        id="baseSalary"
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="e.g. 8000000"
                        value={baseSalary}
                        onChange={(e) => setBaseSalary(e.target.value)}
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