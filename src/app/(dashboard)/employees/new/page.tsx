"use client";

import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Card, CardContent } from "@/components/ui/Card";
import {
    EmployeeForm,
    type EmployeeFormValues,
} from "@/components/employee/EmployeeForm";

export default function NewEmployeePage() {
    const router = useRouter();

    async function handleSubmit(values: EmployeeFormValues) {
        // TODO: replace with real API call e.g. await createEmployee(values)
        await new Promise((resolve) => setTimeout(resolve, 800));
        console.log("New employee:", values);
        router.push("/employees");
    }

    return (
        <DashboardLayout title="Add Employee">
            <div className="flex flex-col gap-6">
                <PageHeader
                    title="Add Employee"
                    description="Fill in the details to add a new team member"
                />
                <Card>
                    <CardContent className="p-6">
                        <EmployeeForm
                            onSubmit={handleSubmit}
                            submitLabel="Add Employee"
                        />
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    );
}
