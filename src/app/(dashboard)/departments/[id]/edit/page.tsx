"use client";

import * as React from "react";
import { notFound, useParams, useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { PageHeader } from "@/components/dashboard/PageHeader";
import {
    DepartmentForm,
    type DepartmentFormValues,
} from "@/components/department/DepartmentForm";
import {
    getDepartment,
    getDepartments,
    updateDepartment,
} from "@/lib/api/departments";
import { getEmployees } from "@/lib/api/employees";
import { ApiError } from "@/lib/api/client";
import { toast } from "@/components/ui/Toast";
import type { Department } from "@/types/department";
import type { Employee } from "@/types/employee";

export default function EditDepartmentPage() {
    const router = useRouter();
    const params = useParams<{ id: string }>();

    const [department, setDepartment] = React.useState<Department | null>(null);
    const [departments, setDepartments] = React.useState<Department[]>([]);
    const [employees, setEmployees] = React.useState<Employee[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [notFoundFlag, setNotFoundFlag] = React.useState(false);

    React.useEffect(() => {
        let cancelled = false;

        async function load() {
            try {
                const [current, list, employeeList] = await Promise.all([
                    getDepartment(params.id),
                    getDepartments({ limit: 100 }),
                    getEmployees({ limit: 100 }),
                ]);
                if (cancelled) return;
                setDepartment(current);
                setDepartments(list.departments);
                setEmployees(employeeList.employees);
            } catch (err) {
                if (cancelled) return;
                if (err instanceof ApiError && err.status === 404) {
                    setNotFoundFlag(true);
                } else {
                    toast.error("Couldn't load department.");
                }
            } finally {
                if (!cancelled) setIsLoading(false);
            }
        }

        load();
        return () => {
            cancelled = true;
        };
    }, [params.id]);

    if (notFoundFlag) {
        notFound();
    }

    async function handleSubmit(values: DepartmentFormValues) {
        if (!department) return;
        setIsSubmitting(true);
        try {
            await updateDepartment(department.id, values);
            toast.success(`${values.name} updated`);
            router.push("/employees?tab=departments");
        } catch {
            toast.error("Couldn't update department. Try again.");
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <DashboardLayout title="Edit department">
            <div className="flex flex-col gap-6">
                <PageHeader
                    title="Edit department"
                    description={
                        department
                            ? `Update details for ${department.name}`
                            : "Loading department details"
                    }
                />
                {isLoading || !department ? (
                    <p className="text-sm text-neutral">Loading form...</p>
                ) : (
                    <DepartmentForm
                        mode="edit"
                        departments={departments}
                        employees={employees}
                        initialValues={department}
                        onSubmit={handleSubmit}
                        submitting={isSubmitting}
                    />
                )}
            </div>
        </DashboardLayout>
    );
}