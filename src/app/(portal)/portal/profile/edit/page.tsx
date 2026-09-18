"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { PortalLayout } from "@/components/portal/PortalLayout";
import { PortalProfileForm } from "@/components/portal/PortalProfileForm";
import { toast } from "@/components/ui/Toast";
import { getMyEmployee, updateMyEmployee } from "@/lib/api/employees";
import type { Employee } from "@/types/employee";

export default function PortalProfileEditPage() {
    const router = useRouter();
    const [employee, setEmployee] = React.useState<Employee | null>(null);
    const [isLoading, setIsLoading] = React.useState(true);
    const [loadFailed, setLoadFailed] = React.useState(false);

    React.useEffect(() => {
        (async () => {
            try {
                const me = await getMyEmployee();
                setEmployee(me);
            } catch {
                setLoadFailed(true);
                toast.error("Couldn't load your profile.");
            } finally {
                setIsLoading(false);
            }
        })();
    }, []);

    async function handleSubmit(values: {
        phone: string;
        address: string;
        emergencyContactName: string;
        emergencyContactPhone: string;
    }) {
        try {
            await updateMyEmployee(values);
            toast.success("Profile updated");
            router.push("/portal/profile");
        } catch {
            toast.error("Couldn't update your profile. Try again.");
        }
    }

    if (isLoading) {
        return (
            <PortalLayout title="Edit My Profile">
                <p className="font-body text-sm text-neutral">
                    Loading your profile...
                </p>
            </PortalLayout>
        );
    }

    if (loadFailed || !employee) {
        return (
            <PortalLayout title="My Profile">
                <p className="font-body text-sm text-neutral">
                    Couldn&apos;t load your profile. Please contact HR.
                </p>
            </PortalLayout>
        );
    }

    return (
        <PortalLayout title="Edit My Profile">
            <div className="flex max-w-2xl flex-col gap-6">
                <PortalProfileForm employee={employee} onSubmit={handleSubmit} />
            </div>
        </PortalLayout>
    );
}