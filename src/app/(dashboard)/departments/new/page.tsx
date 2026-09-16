"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { PageHeader } from "@/components/dashboard/PageHeader";
import {
    DepartmentForm,
    type DepartmentFormValues,
} from "@/components/department/DepartmentForm";
import { getDepartments, createDepartment } from "@/lib/api/departments";
import { getEmployees } from "@/lib/api/employees";
import { toast } from "@/components/ui/Toast";
import type { Department } from "@/types/department";
import type { Employee } from "@/types/employee";

export default function NewDepartmentPage() {
    const router = useRouter();
    const [departments, setDepartments] = React.useState<Department[]>([]);
    const [employees, setEmployees] = React.useState<Employee[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const [isSubmitting, setIsSubmitting] = React.useState(false);

    React.useEffect(() => {
        let cancelled = false;

        async function loadFormData() {
            try {
                const [{ departments: fetchedDepartments }, { employees: fetchedEmployees }] =
                    await Promise.all([
                        getDepartments({ limit: 100 }),
                        getEmployees({ limit: 100 }),
                    ]);
                if (!cancelled) {
                    setDepartments(fetchedDepartments);
                    setEmployees(fetchedEmployees);
                }
            } catch {
                if (!cancelled) toast.error("Couldn't load form data.");
            } finally {
                if (!cancelled) setIsLoading(false);
            }
        }

        loadFormData();
        return () => {
            cancelled = true;
        };
    }, []);

    async function handleSubmit(values: DepartmentFormValues) {
        setIsSubmitting(true);
        try {
            await createDepartment(values);
            toast.success(`${values.name} added`);
            router.push("/employees?tab=departments");
        } catch {
            toast.error("Couldn't create department. Try again.");
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <DashboardLayout title="Add department">
            <div className="flex flex-col gap-6">
                <PageHeader
                    title="Add department"
                    description="Create a new department and place it in your org structure"
                />
                {isLoading ? (
                    <p className="text-sm text-neutral">Loading form...</p>
                ) : (
                    <DepartmentForm
                        mode="add"
                        departments={departments}
                        employees={employees}
                        onSubmit={handleSubmit}
                        submitting={isSubmitting}
                    />
                )}
            </div>
        </DashboardLayout>
    );
}