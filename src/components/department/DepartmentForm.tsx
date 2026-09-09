"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { FormField } from "@/components/ui/FormField";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/Card";
import { Alert } from "@/components/ui/Alert";
import type { Department } from "@/types/department";

export interface DepartmentFormValues {
    name: string;
    code: string;
    parentId: string | null;
    headName: string | null;
    headInitials: string | null;
    location: string;
    status: "active" | "inactive";
}

interface DepartmentFormProps {
    mode: "add" | "edit";
    departments: Department[];
    initialValues?: Department;
    onSubmit: (values: DepartmentFormValues) => void;
    submitting?: boolean;
}

function getDescendantIds(departments: Department[], id: string): Set<string> {
    const childrenByParent = new Map<string, string[]>();
    departments.forEach((d) => {
        if (d.parentId) {
            childrenByParent.set(d.parentId, [
                ...(childrenByParent.get(d.parentId) ?? []),
                d.id,
            ]);
        }
    });

    const result = new Set<string>();
    const stack = [id];
    while (stack.length > 0) {
        const current = stack.pop()!;
        for (const childId of childrenByParent.get(current) ?? []) {
            if (!result.has(childId)) {
                result.add(childId);
                stack.push(childId);
            }
        }
    }
    return result;
}

function initialsFromName(name: string): string {
    return name
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase() ?? "")
        .join("");
}

export function DepartmentForm({
    mode,
    departments,
    initialValues,
    onSubmit,
    submitting,
}: DepartmentFormProps) {
    const router = useRouter();

    const [name, setName] = React.useState(initialValues?.name ?? "");
    const [code, setCode] = React.useState(initialValues?.code ?? "");
    const [parentId, setParentId] = React.useState(initialValues?.parentId ?? "");
    const [headName, setHeadName] = React.useState(initialValues?.headName ?? "");
    const [location, setLocation] = React.useState(initialValues?.location ?? "");
    const [status, setStatus] = React.useState<"active" | "inactive">(
        initialValues?.status ?? "active",
    );
    const [errors, setErrors] = React.useState<Record<string, string>>({});

    const excludedParentIds = React.useMemo(() => {
        if (mode === "edit" && initialValues) {
            const descendants = getDescendantIds(departments, initialValues.id);
            descendants.add(initialValues.id);
            return descendants;
        }
        return new Set<string>();
    }, [departments, initialValues, mode]);

    const parentOptions = departments.filter((d) => !excludedParentIds.has(d.id));

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        const nextErrors: Record<string, string> = {};
        if (!name.trim()) nextErrors.name = "Department name is required.";
        if (!code.trim()) nextErrors.code = "Department code is required.";

        if (Object.keys(nextErrors).length > 0) {
            setErrors(nextErrors);
            return;
        }

        setErrors({});
        const trimmedHead = headName.trim();
        onSubmit({
            name: name.trim(),
            code: code.trim().toUpperCase(),
            parentId: parentId || null,
            headName: trimmedHead || null,
            headInitials: trimmedHead ? initialsFromName(trimmedHead) : null,
            location: location.trim(),
            status,
        });
    }

    return (
        <form onSubmit={handleSubmit}>
            <Card>
                <CardHeader>
                    <CardTitle>
                        {mode === "add" ? "Add department" : "Edit department"}
                    </CardTitle>
                </CardHeader>

                <CardContent className="flex flex-col gap-5">
                    {mode === "edit" && (
                        <Alert variant="info">
                            Head assignment here just updates the display name for now
                            — it&apos;ll move to the employee directory once that API
                            is wired up.
                        </Alert>
                    )}

                    <div className="grid gap-5 sm:grid-cols-2">
                        <FormField
                            label="Department name"
                            htmlFor="name"
                            required
                            error={errors.name}
                        >
                            <Input
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="e.g. Engineering"
                                error={!!errors.name}
                            />
                        </FormField>

                        <FormField
                            label="Department code"
                            htmlFor="code"
                            required
                            error={errors.code}
                            helperText="Short unique code, e.g. ENG"
                        >
                            <Input
                                id="code"
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                placeholder="e.g. ENG"
                                error={!!errors.code}
                            />
                        </FormField>
                    </div>

                    <FormField
                        label="Parent department"
                        htmlFor="parentId"
                        helperText="Leave blank for a top-level department"
                    >
                        <Select
                            id="parentId"
                            value={parentId ?? ""}
                            onChange={(e) => setParentId(e.target.value)}
                            placeholder="No parent (top-level)"
                        >
                            {parentOptions.map((dept) => (
                                <option key={dept.id} value={dept.id}>
                                    {dept.name}
                                </option>
                            ))}
                        </Select>
                    </FormField>

                    <div className="grid gap-5 sm:grid-cols-2">
                        <FormField
                            label="Department head"
                            htmlFor="headName"
                            helperText="Full name of the person leading this department"
                        >
                            <Input
                                id="headName"
                                value={headName ?? ""}
                                onChange={(e) => setHeadName(e.target.value)}
                                placeholder="e.g. Budi Santoso"
                            />
                        </FormField>

                        <FormField label="Location" htmlFor="location">
                            <Input
                                id="location"
                                value={location ?? ""}
                                onChange={(e) => setLocation(e.target.value)}
                                placeholder="e.g. Jakarta HQ"
                            />
                        </FormField>
                    </div>

                    <FormField label="Status" htmlFor="status">
                        <Select
                            id="status"
                            value={status}
                            onChange={(e) =>
                                setStatus(e.target.value as "active" | "inactive")
                            }
                        >
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </Select>
                    </FormField>
                </CardContent>

                <CardFooter className="justify-end">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.back()}
                        disabled={submitting}
                    >
                        Cancel
                    </Button>
                    <Button type="submit" loading={submitting}>
                        {mode === "add" ? "Add department" : "Save changes"}
                    </Button>
                </CardFooter>
            </Card>
        </form>
    );
}