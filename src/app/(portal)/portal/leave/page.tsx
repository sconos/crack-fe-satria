"use client";

import * as React from "react";
import { PortalLayout } from "@/components/portal/PortalLayout";
import { ProfileLeaveTab } from "@/components/employee/ProfileLeaveTab";
import { toast } from "@/components/ui/Toast";
import {
    createLeaveRequest,
    cancelLeaveRequest,
    getMyLeaveBalances,
    getMyLeaveRequests,
    type LeaveBalance as ApiLeaveBalance,
} from "@/lib/api/leave";
import { getLeaveTypes } from "@/lib/api/leave-types";
import { formatLeaveDateRange } from "@/lib/api/mappers/leave-mappers";
import { ApiError } from "@/lib/api/client";
import type { LeaveBalance, LeaveHistoryItem } from "@/types/employee-profile";
import type { LeaveTypeOption } from "@/components/employee/RequestLeaveModal";

export default function PortalLeavePage() {
    const [balances, setBalances] = React.useState<LeaveBalance[]>([]);
    const [history, setHistory] = React.useState<LeaveHistoryItem[]>([]);
    const [leaveTypeOptions, setLeaveTypeOptions] = React.useState<
        LeaveTypeOption[]
    >([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const [isSubmitting, setIsSubmitting] = React.useState(false);

    async function loadAll() {
        try {
            const [balanceRes, historyRes, typesRes] = await Promise.all([
                getMyLeaveBalances(),
                getMyLeaveRequests({ limit: 100 }),
                getLeaveTypes(),
            ]);

            setBalances(
                balanceRes.map((b: ApiLeaveBalance) => ({
                    type: b.type,
                    used: b.used,
                    total: b.total,
                })),
            );

            setHistory(
                historyRes.requests.map((r) => ({
                    id: r.id,
                    type: r.type,
                    range: formatLeaveDateRange(r.startDate, r.endDate),
                    days: r.days,
                    status: r.status,
                })),
            );

            setLeaveTypeOptions(typesRes.map((t) => ({ id: t.id, name: t.name })));
        } catch {
            toast.error("Couldn't load your leave information.");
        } finally {
            setIsLoading(false);
        }
    }

    React.useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect -- known FP on async fetch fns
        loadAll();
    }, []);

    async function handleRequestLeave(data: {
        leaveTypeId: string;
        startDate: string;
        endDate: string;
        reason: string;
    }) {
        setIsSubmitting(true);
        try {
            await createLeaveRequest(data);
            toast.success("Leave request submitted");
            await loadAll();
        } catch (err) {
            toast.error(
                err instanceof ApiError
                    ? err.message
                    : "Couldn't submit request. Try again.",
            );
        } finally {
            setIsSubmitting(false);
        }
    }

    async function handleCancel(id: string) {
        try {
            await cancelLeaveRequest(id);
            toast.success("Request cancelled");
            await loadAll();
        } catch (err) {
            toast.error(
                err instanceof ApiError
                    ? err.message
                    : "Couldn't cancel request. Try again.",
            );
        }
    }

    if (isLoading) {
        return (
            <PortalLayout title="My Leave">
                <p className="px-5 py-10 text-center text-sm text-neutral">
                    Loading your leave information...
                </p>
            </PortalLayout>
        );
    }

    return (
        <PortalLayout title="My Leave">
            <ProfileLeaveTab
                viewerRole="self"
                balances={balances}
                history={history}
                leaveTypeOptions={leaveTypeOptions}
                onRequestLeave={handleRequestLeave}
                onCancel={handleCancel}
                isSubmittingRequest={isSubmitting}
            />
        </PortalLayout>
    );
}