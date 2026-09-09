import { PortalLayout } from "@/components/portal/PortalLayout";
import { EmployeeOrgChart } from "@/components/employee/EmployeeOrgChart";
import { employees } from "@/lib/mock-data/employees";

export default function PortalOrgChartPage() {
    return (
        <PortalLayout title="Org Chart">
            <EmployeeOrgChart employees={employees} />
        </PortalLayout>
    );
}