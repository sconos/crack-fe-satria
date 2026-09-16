"use client";

import * as React from "react";
import { notFound, useParams } from "next/navigation";
import { EditEmployeeClient } from "./EditEmployeeClient";
import { getEmployee } from "@/lib/api/employees";
import { ApiError } from "@/lib/api/client";
import { toast } from "@/components/ui/Toast";
import type { Employee } from "@/types/employee";

export default function EditEmployeePage() {
    const params = useParams<{ id: string }>();
    const [employee, setEmployee] = React.useState<Employee | null>(null);
    const [isLoading, setIsLoading] = React.useState(true);
    const [notFoundFlag, setNotFoundFlag] = React.useState(false);

    React.useEffect(() => {
        let cancelled = false;

        async function load() {
            try {
                const fetched = await getEmployee(params.id);
                if (!cancelled) setEmployee(fetched);
            } catch (err) {
                if (cancelled) return;
                if (err instanceof ApiError && err.status === 404) {
                    setNotFoundFlag(true);
                } else {
                    toast.error("Couldn't load employee.");
                }
            } finally {
                if (!cancelled) setIsLoading(false);
            }
        }

        load();
        return () => {
            cancelled = true;
        };
    }, [params.id]);

    if (notFoundFlag) {
        notFound();
    }

    if (isLoading || !employee) {
        return (
            <p className="p-6 text-sm text-neutral">Loading employee...</p>
        );
    }

    return <EditEmployeeClient employee={employee} />;
}