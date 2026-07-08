"use client";

import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Card, CardContent } from "@/components/ui/Card";
import {
    EmployeeForm,
    type EmployeeFormValues,
} from "@/components/employee/EmployeeForm";
import type { Employee } from "@/types/employee";

interface EditEmployeeClientProps {
    employee: Employee;
}

export function EditEmployeeClient({ employee }: EditEmployeeClientProps) {
    const router = useRouter();

    async function handleSubmit(values: EmployeeFormValues) {
        // TODO: replace with real API call
        await new Promise((resolve) => setTimeout(resolve, 800));
        console.log("Updated employee:", values);
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
                        <EmployeeForm
                            initialValues={employee}
                            onSubmit={handleSubmit}
                            submitLabel="Save Changes"
                        />
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    );
}
