"use client";

import { notFound, useParams, useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { PageHeader } from "@/components/dashboard/PageHeader";
import {
    DepartmentForm,
    type DepartmentFormValues,
} from "@/components/department/DepartmentForm";
import { departments, getDepartmentById } from "@/lib/mock-data/departments";
import { toast } from "@/components/ui/Toast";

export default function EditDepartmentPage() {
    const router = useRouter();
    const params = useParams<{ id: string }>();
    const departmentRecord = getDepartmentById(params.id);

    if (!departmentRecord) {
        notFound();
    }

    const department = departmentRecord;

    function handleSubmit(values: DepartmentFormValues) {
        // TODO: replace with a real API call once the departments endpoint exists
        console.log("Updating department", department.id, values);
        toast.success(`${values.name} updated`);
        router.push("/employees?tab=departments");
    }

    return (
        <DashboardLayout title="Edit department">
            <div className="flex flex-col gap-6">
                <PageHeader
                    title="Edit department"
                    description={`Update details for ${department.name}`}
                />
                <DepartmentForm
                    mode="edit"
                    departments={departments}
                    initialValues={department}
                    onSubmit={handleSubmit}
                />
            </div>
        </DashboardLayout>
    );
}