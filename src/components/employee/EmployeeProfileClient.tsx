"use client";

import { useState } from "react";
import { toast } from "@/components/ui/Toast";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Tabs } from "@/components/ui/Tabs";
import { ProfileHeader } from "@/components/employee/ProfileHeader";
import { ProfileOverviewTab } from "@/components/employee/ProfileOverviewTab";
import { ProfileLeaveTab } from "@/components/employee/ProfileLeaveTab";
import { ProfileDocumentsTab } from "@/components/employee/ProfileDocumentsTab";
import type { LeaveRequestInput } from "@/components/employee/RequestLeaveModal";
import type {
    EmployeeProfile,
    LeaveBalance,
    LeaveHistoryItem,
} from "@/types/employee-profile";

const tabItems = [
    { value: "overview", label: "Profile" },
    { value: "leave", label: "Leave" },
    { value: "documents", label: "Documents" },
];

function formatRange(startDate: string, endDate: string) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const opts: Intl.DateTimeFormatOptions = { month: "short", day: "numeric" };
    if (startDate === endDate) {
        return start.toLocaleDateString("en-US", opts);
    }
    return `${start.toLocaleDateString("en-US", opts)} – ${end.toLocaleDateString("en-US", opts)}`;
}

function countDays(startDate: string, endDate: string) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diff = Math.round((end.getTime() - start.getTime()) / 86400000);
    return diff + 1;
}

export function EmployeeProfileClient({
    employee,
    leaveBalances,
    leaveHistory,
}: {
    employee: EmployeeProfile;
    leaveBalances: LeaveBalance[];
    leaveHistory: LeaveHistoryItem[];
}) {
    const [tab, setTab] = useState("overview");
    const [balances, setBalances] = useState<LeaveBalance[]>(leaveBalances);
    const [history, setHistory] = useState<LeaveHistoryItem[]>(leaveHistory);

    function handleRequestLeave(data: LeaveRequestInput) {
        const days = countDays(data.startDate, data.endDate);
        const newRequest: LeaveHistoryItem = {
            id: `l${Date.now()}`,
            type: data.type,
            range: formatRange(data.startDate, data.endDate),
            days,
            status: "Pending",
        };
        setHistory((prev) => [newRequest, ...prev]);
        toast.success("Leave request submitted", {
            description: "It's pending approval.",
        });
    }

    function handleApprove(id: string) {
        const request = history.find((h) => h.id === id);
        if (!request) return;

        setHistory((prev) =>
            prev.map((h) => (h.id === id ? { ...h, status: "Approved" } : h)),
        );
        setBalances((prev) =>
            prev.map((b) =>
                b.type === request.type
                    ? { ...b, used: Math.min(b.total, b.used + request.days) }
                    : b,
            ),
        );
        toast.success(`Approved ${request.type.toLowerCase()} request`);
    }

    function handleReject(id: string) {
        const request = history.find((h) => h.id === id);
        if (!request) return;

        setHistory((prev) =>
            prev.map((h) => (h.id === id ? { ...h, status: "Rejected" } : h)),
        );
        toast.error(`Rejected ${request.type.toLowerCase()} request`);
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
                        balances={balances}
                        history={history}
                        onRequestLeave={handleRequestLeave}
                        onApprove={handleApprove}
                        onReject={handleReject}
                    />
                )}
                {tab === "documents" && <ProfileDocumentsTab />}
            </div>
        </DashboardLayout>
    );
}
