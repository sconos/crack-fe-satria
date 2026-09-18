// src/lib/api/leave.ts
import { api } from "./client";
import {
    toApiLeaveStatus,
    toFrontendLeaveStatus,
    type ApiLeaveStatus,
} from "./mappers/leave-mappers";
import type { LeaveRequest, LeaveStatus } from "@/types/leave";

interface ApiLeaveRequest {
    id: string;
    employeeId: string;
    leaveTypeId: string;
    startDate: string;
    endDate: string;
    totalDays: number;
    reason: string;
    status: ApiLeaveStatus;
    rejectionReason: string | null;
    reviewedByUserId: string | null;
    reviewedAt: string | null;
    createdAt: string;
    employee?: { firstName: string; lastName: string; employeeCode: string };
    leaveType?: { name: string; isPaid: boolean };
}

interface ApiPaginatedLeaveRequests {
    data: ApiLeaveRequest[];
    meta: { total: number; page: number; limit: number; totalPages: number };
}

export interface ApiLeaveBalance {
    leaveType: string;
    quota: number;
    used: number;
    remaining: number;
}

function toDateString(iso: string): string {
    return iso.slice(0, 10);
}

export interface LeaveRequestWithEmployee extends LeaveRequest {
    employeeName?: string;
    employeeCode?: string;
}

function mapLeaveRequest(raw: ApiLeaveRequest): LeaveRequestWithEmployee {
    return {
        id: raw.id,
        employeeId: raw.employeeId,
        leaveTypeId: raw.leaveTypeId,
        type: raw.leaveType?.name ?? "",
        startDate: toDateString(raw.startDate),
        endDate: toDateString(raw.endDate),
        days: raw.totalDays,
        reason: raw.reason,
        status: toFrontendLeaveStatus(raw.status),
        rejectionReason: raw.rejectionReason,
        appliedDate: toDateString(raw.createdAt),
        employeeName: raw.employee
            ? `${raw.employee.firstName} ${raw.employee.lastName}`.trim()
            : undefined,
        employeeCode: raw.employee?.employeeCode,
    };
}

export interface CreateLeaveRequestPayload {
    leaveTypeId: string;
    startDate: string;
    endDate: string;
    reason: string;
}

export async function createLeaveRequest(
    payload: CreateLeaveRequestPayload,
): Promise<LeaveRequestWithEmployee> {
    const raw = await api.post<ApiLeaveRequest>("/leave", payload);
    return mapLeaveRequest(raw);
}

export interface LeaveQuery {
    page?: number;
    limit?: number;
    employeeId?: string;
    status?: LeaveStatus;
    leaveTypeId?: string;
}

function buildQueryString(query: LeaveQuery): string {
    const params = new URLSearchParams();
    if (query.page) params.set("page", String(query.page));
    if (query.limit) params.set("limit", String(query.limit));
    if (query.employeeId) params.set("employeeId", query.employeeId);
    if (query.status) params.set("status", toApiLeaveStatus(query.status));
    if (query.leaveTypeId) params.set("leaveTypeId", query.leaveTypeId);
    const qs = params.toString();
    return qs ? `?${qs}` : "";
}

export interface LeaveListResult {
    requests: LeaveRequestWithEmployee[];
    meta: ApiPaginatedLeaveRequests["meta"];
}

export async function getMyLeaveRequests(
    query: Omit<LeaveQuery, "employeeId"> = {},
): Promise<LeaveListResult> {
    const res = await api.get<ApiPaginatedLeaveRequests>(
        `/leave/me${buildQueryString(query)}`,
    );
    return { requests: res.data.map(mapLeaveRequest), meta: res.meta };
}

export interface LeaveBalance {
    type: string;
    used: number;
    total: number;
    remaining: number;
}

export async function getMyLeaveBalances(
    year?: number,
): Promise<LeaveBalance[]> {
    const qs = year ? `?year=${year}` : "";
    const raw = await api.get<ApiLeaveBalance[]>(`/leave/me/balance${qs}`);
    return raw.map((b) => ({
        type: b.leaveType,
        used: b.used,
        total: b.quota,
        remaining: b.remaining,
    }));
}

export async function cancelLeaveRequest(
    id: string,
): Promise<LeaveRequestWithEmployee> {
    const raw = await api.patch<ApiLeaveRequest>(`/leave/${id}/cancel`);
    return mapLeaveRequest(raw);
}

export async function getLeaveRequests(
    query: LeaveQuery = {},
): Promise<LeaveListResult> {
    const res = await api.get<ApiPaginatedLeaveRequests>(
        `/leave${buildQueryString(query)}`,
    );
    return { requests: res.data.map(mapLeaveRequest), meta: res.meta };
}

export async function getLeaveRequest(
    id: string,
): Promise<LeaveRequestWithEmployee> {
    const raw = await api.get<ApiLeaveRequest>(`/leave/${id}`);
    return mapLeaveRequest(raw);
}

export async function reviewLeaveRequest(
    id: string,
    decision: "APPROVED" | "REJECTED",
    rejectionReason?: string,
): Promise<LeaveRequestWithEmployee> {
    const raw = await api.patch<ApiLeaveRequest>(`/leave/${id}/review`, {
        decision,
        rejectionReason,
    });
    return mapLeaveRequest(raw);
}

export interface AdminCreateLeaveRequestPayload extends CreateLeaveRequestPayload {
    employeeId: string;
}

export async function createLeaveRequestForEmployee(
    payload: AdminCreateLeaveRequestPayload,
): Promise<LeaveRequestWithEmployee> {
    const raw = await api.post<ApiLeaveRequest>("/leave/admin", payload);
    return mapLeaveRequest(raw);
}