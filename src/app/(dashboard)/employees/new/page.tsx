"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import {
    EmployeeForm,
    type EmployeeFormSubmitValues,
} from "@/components/employee/EmployeeForm";
import { getDepartments } from "@/lib/api/departments";
import { createEmployee, getEmployees } from "@/lib/api/employees";
import { toast } from "@/components/ui/Toast";
import type { Department } from "@/types/department";
import type { Employee } from "@/types/employee";

function TempPasswordDialog({
    name,
    password,
    onDone,
}: {
    name: string;
    password: string;
    onDone: () => void;
}) {
    React.useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "";
        };
    }, []);

    if (typeof document === "undefined") return null;

    return createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <div className="absolute inset-0 bg-primary-dark/40 backdrop-blur-sm" />
            <div className="relative z-10 flex w-full max-w-md flex-col gap-4 rounded-xl border border-neutral/15 bg-base-white p-6 shadow-lg">
                <h2 className="font-heading text-lg font-semibold text-primary-dark">
                    {name} was added
                </h2>
                <p className="font-body text-sm text-neutral">
                    Share this temporary password with them directly —
                    it won&apos;t be shown again.
                </p>
                <div className="flex items-center justify-between gap-3 rounded-md border border-neutral/15 bg-primary-tint/40 px-3 py-2">
                    <code className="font-mono text-sm text-primary-dark">
                        {password}
                    </code>
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                            navigator.clipboard.writeText(password);
                            toast.success("Copied to clipboard");
                        }}
                    >
                        Copy
                    </Button>
                </div>
                <div className="mt-2 flex justify-end">
                    <Button type="button" onClick={onDone}>
                        Done
                    </Button>
                </div>
            </div>
        </div>,
        document.body,
    );
}

export default function NewEmployeePage() {
    const router = useRouter();
    const [departments, setDepartments] = React.useState<Department[]>([]);
    const [employees, setEmployees] = React.useState<Employee[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const [created, setCreated] = React.useState<{
        name: string;
        password: string;
    } | null>(null);

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

    async function handleSubmit(values: EmployeeFormSubmitValues) {
        const { employee, tempPassword } = await createEmployee(values);
        setCreated({ name: employee.name, password: tempPassword });
    }

    function handleDone() {
        router.push("/employees?tab=employees");
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
                        {isLoading ? (
                            <p className="text-sm text-neutral">
                                Loading form...
                            </p>
                        ) : (
                            <EmployeeForm
                                departments={departments}
                                employees={employees}
                                onSubmit={handleSubmit}
                                submitLabel="Add Employee"
                            />
                        )}
                    </CardContent>
                </Card>
            </div>

            {created && (
                <TempPasswordDialog
                    name={created.name}
                    password={created.password}
                    onDone={handleDone}
                />
            )}
        </DashboardLayout>
    );
}