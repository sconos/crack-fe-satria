"use client";

import * as React from "react";
import { PortalLayout } from "@/components/portal/PortalLayout";
import { EmployeeOrgChart } from "@/components/employee/EmployeeOrgChart";
import { toast } from "@/components/ui/Toast";
import { getEmployeeDirectory } from "@/lib/api/employees";
import type { Employee } from "@/types/employee";

export default function PortalOrgChartPage() {
    const [employees, setEmployees] = React.useState<Employee[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
        (async () => {
            try {
                const fetched = await getEmployeeDirectory();
                setEmployees(fetched);
            } catch {
                toast.error("Couldn't load the org chart.");
            } finally {
                setIsLoading(false);
            }
        })();
    }, []);

    return (
        <PortalLayout title="Org Chart">
            {isLoading ? (
                <p className="font-body text-sm text-neutral">
                    Loading org chart...
                </p>
            ) : (
                <EmployeeOrgChart employees={employees} />
            )}
        </PortalLayout>
    );
}