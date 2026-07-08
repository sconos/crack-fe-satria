import { PortalLayout } from "@/components/portal/PortalLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { StatusBadge } from "@/components/employee/StatusBadge";
import type { LeaveRequest } from "@/types/leave";

const mockLeave: LeaveRequest[] = [
    {
        id: "l1",
        type: "Annual",
        startDate: "2024-12-24",
        endDate: "2024-12-25",
        days: 2,
        reason: "Christmas holiday",
        status: "Approved",
        appliedDate: "2024-12-10",
    },
    {
        id: "l2",
        type: "Sick",
        startDate: "2024-11-10",
        endDate: "2024-11-10",
        days: 1,
        reason: "Fever",
        status: "Approved",
        appliedDate: "2024-11-10",
    },
    {
        id: "l3",
        type: "Annual",
        startDate: "2025-02-10",
        endDate: "2025-02-12",
        days: 3,
        reason: "Family event",
        status: "Pending",
        appliedDate: "2025-01-20",
    },
];

const leaveBalance = [
    { type: "Annual", total: 14, used: 2, remaining: 12 },
    { type: "Sick", total: 12, used: 1, remaining: 11 },
    { type: "Emergency", total: 3, used: 0, remaining: 3 },
];

const statusVariant: Record<string, "success" | "warning" | "danger"> = {
    Approved: "success",
    Pending: "warning",
    Rejected: "danger",
};

const typeVariant: Record<string, "info" | "warning" | "danger" | "neutral"> = {
    Annual: "info",
    Sick: "warning",
    Emergency: "danger",
    Unpaid: "neutral",
};

export default function PortalLeavePage() {
    return (
        <PortalLayout title="My Leave">
            <div className="flex flex-col gap-6">
                <div>
                    <h1 className="font-heading text-2xl font-bold text-primary-dark">
                        Leave Status
                    </h1>
                    <p className="font-body text-sm text-neutral">
                        Your leave balance and history
                    </p>
                </div>

                {/* Employment status */}
                <Card>
                    <CardContent className="px-5 py-4">
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <p className="font-body text-xs text-neutral">
                                    Current employment status
                                </p>
                                <p className="font-heading mt-0.5 text-sm font-semibold text-primary-dark">
                                    Satria Wijaya · Frontend Developer
                                </p>
                            </div>
                            <StatusBadge status="Active" />
                        </div>
                    </CardContent>
                </Card>

                {/* Leave balance */}
                <Card>
                    <CardHeader>
                        <CardTitle>Leave Balance</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns:
                                    "repeat(auto-fit, minmax(140px, 1fr))",
                                gap: "0.75rem",
                            }}
                        >
                            {leaveBalance.map((b) => (
                                <div
                                    key={b.type}
                                    className="rounded-lg bg-primary-tint px-4 py-3"
                                >
                                    <p className="font-body text-xs text-neutral">
                                        {b.type} Leave
                                    </p>
                                    <p className="font-heading mt-1 text-2xl font-bold text-primary-dark">
                                        {b.remaining}
                                        <span className="font-body text-sm font-normal text-neutral">
                                            /{b.total}
                                        </span>
                                    </p>
                                    <p className="font-body mt-0.5 text-xs text-neutral">
                                        {b.used} day{b.used !== 1 ? "s" : ""}{" "}
                                        used
                                    </p>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Leave history */}
                <Card>
                    <CardHeader>
                        <CardTitle>Leave History</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col gap-3">
                            {mockLeave.map((l) => (
                                <div
                                    key={l.id}
                                    className="flex flex-col gap-2 rounded-lg border border-neutral/10 px-4 py-3 sm:flex-row sm:items-start sm:justify-between"
                                >
                                    <div className="flex flex-col gap-1">
                                        <div className="flex items-center gap-2">
                                            <Badge
                                                variant={typeVariant[l.type]}
                                            >
                                                {l.type}
                                            </Badge>
                                            <span className="font-body text-xs text-neutral">
                                                {l.days} day
                                                {l.days > 1 ? "s" : ""}
                                            </span>
                                        </div>
                                        <p className="font-body text-sm text-primary-dark">
                                            {l.reason}
                                        </p>
                                        <p className="font-body text-xs text-neutral">
                                            {new Date(
                                                l.startDate,
                                            ).toLocaleDateString("en-US", {
                                                month: "short",
                                                day: "numeric",
                                                year: "numeric",
                                            })}
                                            {l.startDate !== l.endDate && (
                                                <>
                                                    {" "}
                                                    →{" "}
                                                    {new Date(
                                                        l.endDate,
                                                    ).toLocaleDateString(
                                                        "en-US",
                                                        {
                                                            month: "short",
                                                            day: "numeric",
                                                            year: "numeric",
                                                        },
                                                    )}
                                                </>
                                            )}
                                        </p>
                                    </div>
                                    <Badge
                                        variant={statusVariant[l.status]}
                                        dot
                                    >
                                        {l.status}
                                    </Badge>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </PortalLayout>
    );
}
