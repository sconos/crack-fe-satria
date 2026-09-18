"use client";

import { useState } from "react";
import { toast } from "@/components/ui/Toast";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Tabs } from "@/components/ui/Tabs";
import { ProfileHeader } from "@/components/employee/ProfileHeader";
import { ProfileOverviewTab } from "@/components/employee/ProfileOverviewTab";
import { ProfileLeaveTab } from "@/components/employee/ProfileLeaveTab";
import { ProfileDocumentsTab } from "@/components/employee/ProfileDocumentsTab";
import { reviewLeaveRequest } from "@/lib/api/leave";
import { ApiError } from "@/lib/api/client";
import { RejectReasonModal } from "@/components/ui/RejectReasonModal";
import type { EmployeeProfile, LeaveHistoryItem } from "@/types/employee-profile";

const tabItems = [
    { value: "overview", label: "Profile" },
    { value: "leave", label: "Leave" },
    { value: "documents", label: "Documents" },
];

export function EmployeeProfileClient({
    employee,
    leaveHistory,
}: {
    employee: EmployeeProfile;
    leaveHistory: LeaveHistoryItem[];
}) {
    const [tab, setTab] = useState("overview");
    const [history, setHistory] = useState<LeaveHistoryItem[]>(leaveHistory);
    const [rejectTargetId, setRejectTargetId] = useState<string | null>(null);
    const [isRejecting, setIsRejecting] = useState(false);

    async function handleApprove(id: string) {
        try {
            await reviewLeaveRequest(id, "APPROVED");
            setHistory((prev) =>
                prev.map((h) => (h.id === id ? { ...h, status: "Approved" } : h)),
            );
            toast.success("Leave request approved");
        } catch (err) {
            toast.error(
                err instanceof ApiError
                    ? err.message
                    : "Couldn't approve request. Try again.",
            );
        }
    }

    function handleReject(id: string) {
        setRejectTargetId(id);
    }

    async function handleConfirmReject(reason: string) {
        if (!rejectTargetId) return;
        const id = rejectTargetId;
        setIsRejecting(true);
        try {
            await reviewLeaveRequest(id, "REJECTED", reason);
            setHistory((prev) =>
                prev.map((h) => (h.id === id ? { ...h, status: "Rejected" } : h)),
            );
            toast.error("Leave request rejected");
            setRejectTargetId(null);
        } catch (err) {
            toast.error(
                err instanceof ApiError
                    ? err.message
                    : "Couldn't reject request. Try again.",
            );
        } finally {
            setIsRejecting(false);
        }
    }

    return (
        <DashboardLayout title={employee.name}>
            <div className="flex flex-col gap-6">
                <ProfileHeader employee={employee} />

                <Tabs items={tabItems} value={tab} onValueChange={setTab} />

                {tab === "overview" && (
                    <ProfileOverviewTab employee={employee} />
                )}
                {tab === "leave" && (
                    <ProfileLeaveTab
                        viewerRole="reviewer"
                        history={history}
                        onApprove={handleApprove}
                        onReject={handleReject}
                    />
                )}
                {tab === "documents" && (
                    <ProfileDocumentsTab employeeId={employee.id} />
                )}
            </div>

            <RejectReasonModal
                open={!!rejectTargetId}
                onOpenChange={(open) => {
                    if (!open) setRejectTargetId(null);
                }}
                title="Reject leave request"
                onSubmit={handleConfirmReject}
                isSubmitting={isRejecting}
            />
        </DashboardLayout>
    );
}