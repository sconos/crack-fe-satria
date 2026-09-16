import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Alert } from "@/components/ui/Alert";
import { HeadcountReport } from "@/components/reports/HeadcountReport";
import { LeaveUtilizationReport } from "@/components/reports/LeaveUtilizationReport";

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
                    — there&apos;s no backend endpoint for it (only headcount
                    and leave utilization exist today).
                </Alert>

                <HeadcountReport />
                <LeaveUtilizationReport />
            </div>
        </DashboardLayout>
    );
}