// src/lib/api/mappers/leave-mappers.ts
import type { LeaveStatus } from "@/types/leave";

export type ApiLeaveStatus = "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED";

const STATUS_TO_FRONTEND: Record<ApiLeaveStatus, LeaveStatus> = {
    PENDING: "Pending",
    APPROVED: "Approved",
    REJECTED: "Rejected",
    CANCELLED: "Cancelled",
};

const STATUS_TO_API: Record<LeaveStatus, ApiLeaveStatus> = {
    Pending: "PENDING",
    Approved: "APPROVED",
    Rejected: "REJECTED",
    Cancelled: "CANCELLED",
};

export function toFrontendLeaveStatus(status: ApiLeaveStatus): LeaveStatus {
    return STATUS_TO_FRONTEND[status];
}

export function toApiLeaveStatus(status: LeaveStatus): ApiLeaveStatus {
    return STATUS_TO_API[status];
}

export function formatLeaveDateRange(startDate: string, endDate: string): string {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const fmt = (d: Date) =>
        d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    return startDate === endDate ? fmt(start) : `${fmt(start)} – ${fmt(end)}`;
}