"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Button } from "@/components/ui/Button";
import { EmployeeProfileClient } from "@/components/employee/EmployeeProfileClient";
import { getEmployee } from "@/lib/api/employees";
import { getLeaveRequests } from "@/lib/api/leave";
import { formatLeaveDateRange } from "@/lib/api/mappers/leave-mappers";
import { toast } from "@/components/ui/Toast";
import type { Employee } from "@/types/employee";
import type { LeaveHistoryItem } from "@/types/employee-profile";

export default function EmployeeProfilePage() {
    const params = useParams<{ id: string }>();
    const [employee, setEmployee] = React.useState<Employee | null>(null);
    const [leaveHistory, setLeaveHistory] = React.useState<LeaveHistoryItem[]>(
        [],
    );
    const [isLoading, setIsLoading] = React.useState(true);
    const [loadFailed, setLoadFailed] = React.useState(false);

    React.useEffect(() => {
        let cancelled = false;

        async function load() {
            try {
                const fetchedEmployee = await getEmployee(params.id);
                if (cancelled) return;
                setEmployee(fetchedEmployee);
            } catch {
                if (!cancelled) {
                    setLoadFailed(true);
                    setIsLoading(false);
                }
                return;
            }

            try {
                const { requests } = await getLeaveRequests({
                    employeeId: params.id,
                    limit: 100,
                });
                if (!cancelled) {
                    setLeaveHistory(
                        requests.map((r) => ({
                            id: r.id,
                            type: r.type,
                            range: formatLeaveDateRange(r.startDate, r.endDate),
                            days: r.days,
                            status: r.status,
                        })),
                    );
                }
            } catch {
                if (!cancelled) toast.error("Couldn't load leave history.");
            } finally {
                if (!cancelled) setIsLoading(false);
            }
        }

        load();
        return () => {
            cancelled = true;
        };
    }, [params.id]);

    if (!isLoading && (loadFailed || !employee)) {
        return (
            <DashboardLayout title="Employee not found">
                <div className="flex flex-col gap-6">
                    <PageHeader
                        title="Employee not found"
                        description="This person may have been removed, or the link is out of date."
                    />
                    <Link href="/employees">
                        <Button variant="outline">Back to employees</Button>
                    </Link>
                </div>
            </DashboardLayout>
        );
    }

    if (isLoading || !employee) {
        return (
            <p className="p-6 text-sm text-neutral">Loading employee...</p>
        );
    }

    return (
        <EmployeeProfileClient employee={employee} leaveHistory={leaveHistory} />
    );
}