import Link from "next/link";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Button } from "@/components/ui/Button";
import { EmployeeProfileClient } from "@/components/employee/EmployeeProfileClient";
import { getEmployeeById } from "@/lib/mock-data/employees";
import type { LeaveBalance, LeaveHistoryItem } from "@/types/employee-profile";

// TODO: replace with real fetches keyed by params.id once leave has its own API
const mockLeaveBalances: LeaveBalance[] = [
    { type: "Annual leave", used: 6, total: 12 },
    { type: "Sick leave", used: 2, total: 10 },
    { type: "Unpaid leave", used: 0, total: 5 },
];

const mockLeaveHistory: LeaveHistoryItem[] = [
    { id: "l1", type: "Annual leave", range: "Jun 20 – Jun 21", days: 2, status: "Approved" },
    { id: "l2", type: "Sick leave", range: "May 14", days: 1, status: "Approved" },
    { id: "l3", type: "Annual leave", range: "Jul 8 – Jul 10", days: 3, status: "Pending" },
];

export default async function EmployeeProfilePage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const employee = getEmployeeById(id);

    if (!employee) {
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

    return (
        <EmployeeProfileClient
            employee={employee}
            leaveBalances={mockLeaveBalances}
            leaveHistory={mockLeaveHistory}
        />
    );
}