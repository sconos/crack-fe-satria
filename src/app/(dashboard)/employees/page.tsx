"use client";

import * as React from "react";
import { Suspense } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { Plus } from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Tabs } from "@/components/ui/Tabs";
import { EmployeeTable } from "@/components/employee/EmployeeTable";
import { DeleteConfirmModal } from "@/components/employee/DeleteConfirmModal";
import { DepartmentsTab } from "@/components/department/DepartmentsTab";
import { EmployeeOrgChart } from "@/components/employee/EmployeeOrgChart";
import { Button } from "@/components/ui/Button";
import { toast } from "@/components/ui/Toast";
import { employees as initialEmployees } from "@/lib/mock-data/employees";
import { departments as initialDepartments } from "@/lib/mock-data/departments";
import type { Department } from "@/types/department";
import type { Employee } from "@/types/employee";

const tabItems = [
    { value: "employees", label: "Employees" },
    { value: "org-chart", label: "Org Chart" },
    { value: "departments", label: "Departments" },
];

function EmployeesPageContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const initialTab =
        searchParams.get("tab") === "departments" ? "departments" : "employees";

    const [tab, setTab] = React.useState(initialTab);
    const [employees, setEmployees] = React.useState<Employee[]>(initialEmployees);
    const [departments, setDepartments] = React.useState<Department[]>(
        initialDepartments,
    );
    const [deactivateTarget, setDeactivateTarget] =
        React.useState<Employee | null>(null);
    const [isDeactivating, setIsDeactivating] = React.useState(false);
    const [departmentDeactivateTarget, setDepartmentDeactivateTarget] =
        React.useState<Department | null>(null);
    const [isDeactivatingDepartment, setIsDeactivatingDepartment] =
        React.useState(false);

    function handleToggleEmployeeStatus(id: string) {
        const employee = employees.find((e) => e.id === id);
        if (!employee) return;

        if (employee.status === "Inactive") {
            // Reactivating is low-stakes — no confirmation needed
            setEmployees((prev) =>
                prev.map((e) =>
                    e.id === id ? { ...e, status: "Active" } : e,
                ),
            );
            toast.success(`${employee.name} has been reactivated.`);
            return;
        }

        setDeactivateTarget(employee);
    }

    async function handleDeactivateConfirm() {
        if (!deactivateTarget) return;
        setIsDeactivating(true);
        try {
            // TODO: replace with a real PATCH /employees/:id/status call
            await new Promise((resolve) => setTimeout(resolve, 600));
            setEmployees((prev) =>
                prev.map((e) =>
                    e.id === deactivateTarget.id
                        ? { ...e, status: "Inactive" }
                        : e,
                ),
            );
            toast.success(`${deactivateTarget.name} has been deactivated.`);
            setDeactivateTarget(null);
        } catch {
            toast.error("Couldn't deactivate employee. Try again.");
        } finally {
            setIsDeactivating(false);
        }
    }

    function handleToggleDepartmentStatus(id: string) {
        const department = departments.find((d) => d.id === id);
        if (!department) return;

        if (department.status === "inactive") {
            setDepartments((prev) =>
                prev.map((d) =>
                    d.id === id ? { ...d, status: "active" } : d,
                ),
            );
            toast.success(`${department.name} has been reactivated.`);
            return;
        }

        setDepartmentDeactivateTarget(department);
    }

    async function handleDeactivateDepartmentConfirm() {
        if (!departmentDeactivateTarget) return;
        setIsDeactivatingDepartment(true);
        try {
            // TODO: replace with a real PATCH /departments/:id/status call
            await new Promise((resolve) => setTimeout(resolve, 600));
            setDepartments((prev) =>
                prev.map((d) =>
                    d.id === departmentDeactivateTarget.id
                        ? { ...d, status: "inactive" }
                        : d,
                ),
            );
            toast.success(
                `${departmentDeactivateTarget.name} has been deactivated.`,
            );
            setDepartmentDeactivateTarget(null);
        } catch {
            toast.error("Couldn't deactivate department. Try again.");
        } finally {
            setIsDeactivatingDepartment(false);
        }
    }

    return (
        <DashboardLayout title="Employees">
            <div className="flex flex-col gap-6">
                <PageHeader
                    title={tab === "departments" ? "Departments" : "Employees"}
                    description={
                        tab === "departments"
                            ? "Manage departments and how your company is structured"
                            : "Manage your team members and how they're organized"
                    }
                    action={
                        tab === "employees" ? (
                            <Link href="/employees/new">
                                <Button>
                                    <Plus className="h-4 w-4" />
                                    Add Employee
                                </Button>
                            </Link>
                        ) : (
                            <Link href="/departments/new">
                                <Button>
                                    <Plus className="h-4 w-4" />
                                    Add Department
                                </Button>
                            </Link>
                        )
                    }
                />

                <Tabs items={tabItems} value={tab} onValueChange={setTab} />

                {tab === "employees" ? (
                    <>
                        <EmployeeTable
                            employees={employees}
                            onToggleStatus={handleToggleEmployeeStatus}
                        />

                        <DeleteConfirmModal
                            open={!!deactivateTarget}
                            onOpenChange={(open) => {
                                if (!open) setDeactivateTarget(null);
                            }}
                            employeeName={deactivateTarget?.name ?? ""}
                            onConfirm={handleDeactivateConfirm}
                            isDeleting={isDeactivating}
                            description="They'll be marked inactive and hidden from active views, but their attendance, leave, and payroll history are retained."
                            confirmLabel="Deactivate"
                            confirmVariant="outline"
                        />
                    </>
                ) : tab === "org-chart" ? (
                    <EmployeeOrgChart
                        employees={employees}
                        onNodeClick={(id) => router.push(`/employees/${id}`)}
                    />
                ) : (
                    <>
                        <DepartmentsTab
                            departments={departments}
                            employees={employees}
                            onToggleDepartmentStatus={handleToggleDepartmentStatus}
                        />
                        <DeleteConfirmModal
                            open={!!departmentDeactivateTarget}
                            onOpenChange={(open) => {
                                if (!open) setDepartmentDeactivateTarget(null);
                            }}
                            employeeName={departmentDeactivateTarget?.name ?? ""}
                            onConfirm={handleDeactivateDepartmentConfirm}
                            isDeleting={isDeactivatingDepartment}
                            description="Employees currently in this department will keep their assignment, but the department will be hidden from active views until reactivated."
                            confirmLabel="Deactivate"
                            confirmVariant="outline"
                        />
                    </>
                )}
            </div>
        </DashboardLayout>
    );
}

export default function EmployeesPage() {
    // useSearchParams needs a Suspense boundary in the App Router,
    // or Next.js will de-opt this whole route to fully client-rendered.
    return (
        <Suspense fallback={null}>
            <EmployeesPageContent />
        </Suspense>
    );
}