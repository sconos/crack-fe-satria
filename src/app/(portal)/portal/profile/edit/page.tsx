"use client";

import { useRouter } from "next/navigation";
import { PortalLayout } from "@/components/portal/PortalLayout";
import { PortalProfileForm } from "@/components/portal/PortalProfileForm";
import { getEmployeeById } from "@/lib/mock-data/employees";
import { toast } from "@/components/ui/Toast";

// TODO: replace with the logged-in user's id once auth/session is wired up
const CURRENT_EMPLOYEE_ID = "1";

export default function PortalProfileEditPage() {
    const router = useRouter();
    const employee = getEmployeeById(CURRENT_EMPLOYEE_ID);

    if (!employee) {
        return (
            <PortalLayout title="My Profile">
                <p className="text-sm text-neutral">
                    Couldn&apos;t load your profile. Please contact HR.
                </p>
            </PortalLayout>
        );
    }

    async function handleSubmit(values: {
        phone: string;
        address: string;
        emergencyContactName: string;
        emergencyContactPhone: string;
        avatar: string | null;
    }) {
        // TODO: replace with a real PATCH /employees/:id (self-service scope) call
        console.log("Updating own profile", values);
        await new Promise((resolve) => setTimeout(resolve, 500));
        toast.success("Profile updated");
        router.push("/portal/profile");
    }

    return (
        <PortalLayout title="Edit My Profile">
            <div className="flex max-w-2xl flex-col gap-6">
                <PortalProfileForm employee={employee} onSubmit={handleSubmit} />
            </div>
        </PortalLayout>
    );
}