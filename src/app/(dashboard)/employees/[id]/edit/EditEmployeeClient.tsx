"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Card, CardContent } from "@/components/ui/Card";
import {
    EmployeeForm,
    type EmployeeFormSubmitValues,
} from "@/components/employee/EmployeeForm";
import { getDepartments } from "@/lib/api/departments";
import { getJobTitles } from "@/lib/api/job-titles";
import { getEmployees, updateEmployee } from "@/lib/api/employees";
import { toast } from "@/components/ui/Toast";
import type { Department } from "@/types/department";
import type { JobTitle } from "@/types/job-title";
import type { Employee } from "@/types/employee";

interface EditEmployeeClientProps {
    employee: Employee;
}

export function EditEmployeeClient({ employee }: EditEmployeeClientProps) {
    const router = useRouter();
    const [departments, setDepartments] = React.useState<Department[]>([]);
    const [jobTitles, setJobTitles] = React.useState<JobTitle[]>([]);
    const [employees, setEmployees] = React.useState<Employee[]>([]);
    const [isLoadingForm, setIsLoadingForm] = React.useState(true);

    React.useEffect(() => {
        let cancelled = false;

        async function loadFormData() {
            try {
                const [
                    { departments: fetchedDepartments },
                    fetchedJobTitles,
                    { employees: fetchedEmployees },
                ] = await Promise.all([
                    getDepartments({ limit: 100 }),
                    getJobTitles(),
                    getEmployees({ limit: 1000 }),
                ]);
                if (!cancelled) {
                    setDepartments(fetchedDepartments);
                    setJobTitles(fetchedJobTitles);
                    setEmployees(fetchedEmployees);
                }
            } catch {
                if (!cancelled) toast.error("Couldn't load form data.");
            } finally {
                if (!cancelled) setIsLoadingForm(false);
            }
        }

        loadFormData();
        return () => {
            cancelled = true;
        };
    }, []);

    async function handleSubmit(values: EmployeeFormSubmitValues) {
        await updateEmployee(employee.id, values);
        toast.success(`${values.name} updated`);
        router.push(`/employees/${employee.id}`);
    }

    return (
        <DashboardLayout title="Edit Employee">
            <div className="flex flex-col gap-6">
                <PageHeader
                    title="Edit Employee"
                    description={`Editing profile for ${employee.name}`}
                />
                <Card>
                    <CardContent className="p-6">
                        {isLoadingForm ? (
                            <p className="text-sm text-neutral">
                                Loading form...
                            </p>
                        ) : (
                            <EmployeeForm
                                departments={departments}
                                jobTitles={jobTitles}
                                employees={employees}
                                initialValues={employee}
                                onSubmit={handleSubmit}
                                submitLabel="Save Changes"
                            />
                        )}
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    );
}