"use client";

import * as React from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { EmployeeTable } from "@/components/employee/EmployeeTable";
import { DeleteConfirmModal } from "@/components/employee/DeleteConfirmModal";
import { Button } from "@/components/ui/Button";
import { toast } from "@/components/ui/Toast";
import type { Employee } from "@/types/employee";

const mockEmployees: Employee[] = [
    {
        id: "1",
        name: "Satria Wijaya",
        email: "satria@koru.com",
        department: "Engineering",
        role: "Frontend Developer",
        status: "Active",
        joinDate: "2024-01-15",
    },
    {
        id: "2",
        name: "Jane Doe",
        email: "jane@koru.com",
        department: "Human Resources",
        role: "HR Manager",
        status: "On Leave",
        joinDate: "2023-06-01",
    },
    {
        id: "3",
        name: "Budi Santoso",
        email: "budi@koru.com",
        department: "Engineering",
        role: "Backend Developer",
        status: "Probation",
        joinDate: "2024-11-01",
    },
    {
        id: "4",
        name: "Rina Hartati",
        email: "rina@koru.com",
        department: "Sales",
        role: "Sales Executive",
        status: "Inactive",
        joinDate: "2022-03-20",
    },
];

export default function EmployeesPage() {
    const [employees, setEmployees] = React.useState<Employee[]>(mockEmployees);
    const [deleteTarget, setDeleteTarget] = React.useState<Employee | null>(
        null,
    );
    const [isDeleting, setIsDeleting] = React.useState(false);

    // Called when trash icon is clicked in the table
    function handleDeleteRequest(id: string) {
        console.log("handleDeleteRequest called with id:", id);
        const employee = employees.find((e) => e.id === id);
        console.log("found employee:", employee);
        if (employee) setDeleteTarget(employee);
    }

    // Called when user confirms inside the modal
    async function handleDeleteConfirm() {
        if (!deleteTarget) return;
        setIsDeleting(true);
        try {
            // TODO: replace with real delete API call
            await new Promise((resolve) => setTimeout(resolve, 600));
            setEmployees((prev) =>
                prev.filter((e) => e.id !== deleteTarget.id),
            );
            toast.success(`${deleteTarget.name} has been removed.`);
            setDeleteTarget(null);
        } catch {
            toast.error("Couldn't delete employee. Try again.");
        } finally {
            setIsDeleting(false);
        }
    }

    return (
        <DashboardLayout title="Employees">
            <div className="flex flex-col gap-6">
                <PageHeader
                    title="Employees"
                    description="Manage your team members"
                    action={
                        <Link href="/employees/new">
                            <Button>
                                <Plus className="h-4 w-4" />
                                Add Employee
                            </Button>
                        </Link>
                    }
                />

                <EmployeeTable
                    employees={employees}
                    onDelete={handleDeleteRequest}
                />

                <DeleteConfirmModal
                    open={!!deleteTarget}
                    onOpenChange={(open) => {
                        if (!open) setDeleteTarget(null);
                    }}
                    employeeName={deleteTarget?.name ?? ""}
                    onConfirm={handleDeleteConfirm}
                    isDeleting={isDeleting}
                />
            </div>
        </DashboardLayout>
    );
}
