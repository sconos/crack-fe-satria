import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Alert } from "@/components/ui/Alert";
import { HeadcountReport } from "@/components/reports/HeadcountReport";
import { LeaveUtilizationReport } from "@/components/reports/LeaveUtilizationReport";
import { employees } from "@/lib/mock-data/employees";
import { departments } from "@/lib/mock-data/departments";
import { leaveRequests } from "@/lib/mock-data/leave-requests";

export default function ReportsPage() {
    return (
        <DashboardLayout title="Reports">
            <div className="flex flex-col gap-6">
                <PageHeader
                    title="Reports"
                    description="Fixed reports with CSV export"
                />

                <Alert variant="info">
                    A company-wide attendance report isn&apos;t included yet
                    — mock attendance data currently only exists for one
                    employee, so a real report would be misleading until
                    real attendance data is available for everyone.
                </Alert>

                <HeadcountReport employees={employees} departments={departments} />
                <LeaveUtilizationReport leaveRequests={leaveRequests} />
            </div>
        </DashboardLayout>
    );
}