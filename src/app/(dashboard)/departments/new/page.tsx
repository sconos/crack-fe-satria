"use client";

import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { PageHeader } from "@/components/dashboard/PageHeader";
import {
    DepartmentForm,
    type DepartmentFormValues,
} from "@/components/department/DepartmentForm";
import { departments } from "@/lib/mock-data/departments";
import { toast } from "@/components/ui/Toast";

export default function NewDepartmentPage() {
    const router = useRouter();

    function handleSubmit(values: DepartmentFormValues) {
        // TODO: replace with a real API call once the departments endpoint exists
        console.log("Creating department", values);
        toast.success(`${values.name} added`);
        router.push("/employees?tab=departments");
    }

    return (
        <DashboardLayout title="Add department">
            <div className="flex flex-col gap-6">
                <PageHeader
                    title="Add department"
                    description="Create a new department and place it in your org structure"
                />
                <DepartmentForm
                    mode="add"
                    departments={departments}
                    onSubmit={handleSubmit}
                />
            </div>
        </DashboardLayout>
    );
}