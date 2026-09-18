// src/lib/api/attendance-corrections.ts
import { api } from "./client";
import { isoToDateString, isoToTimeString } from "./mappers/attendance-mappers";
import type {
    AttendanceCorrectionRequest,
    CorrectionStatus,
} from "@/types/attendance-correction";

type ApiCorrectionStatus = "PENDING" | "APPROVED" | "REJECTED";

interface ApiAttendance {
    date: string;
    checkIn: string | null;
    checkOut: string | null;
}

interface ApiCorrectionRequest {
    id: string;
    attendanceId: string;
    employeeId: string;
    requestedCheckIn: string | null;
    requestedCheckOut: string | null;
    reason: string;
    status: ApiCorrectionStatus;
    rejectionReason: string | null;
    reviewedByUserId: string | null;
    reviewedAt: string | null;
    createdAt: string;
    attendance?: ApiAttendance;
    employee?: { firstName: string; lastName: string; employeeCode: string };
}

interface ApiPaginatedCorrections {
    data: ApiCorrectionRequest[];
    meta: { total: number; page: number; limit: number; totalPages: number };
}

function toFrontendStatus(status: ApiCorrectionStatus): CorrectionStatus {
    return status.toLowerCase() as CorrectionStatus;
}

function toApiStatus(status: "approved" | "rejected"): "APPROVED" | "REJECTED" {
    return status === "approved" ? "APPROVED" : "REJECTED";
}

function mapCorrection(raw: ApiCorrectionRequest): AttendanceCorrectionRequest {
    return {
        id: raw.id,
        attendanceId: raw.attendanceId,
        employeeId: raw.employeeId,
        employeeName: raw.employee
            ? `${raw.employee.firstName} ${raw.employee.lastName}`.trim()
            : undefined,
        employeeCode: raw.employee?.employeeCode,
        date: raw.attendance ? isoToDateString(raw.attendance.date) : "",
        originalClockIn: raw.attendance
            ? isoToTimeString(raw.attendance.checkIn)
            : null,
        originalClockOut: raw.attendance
            ? isoToTimeString(raw.attendance.checkOut)
            : null,
        requestedClockIn: isoToTimeString(raw.requestedCheckIn),
        requestedClockOut: isoToTimeString(raw.requestedCheckOut),
        reason: raw.reason,
        status: toFrontendStatus(raw.status),
        rejectionReason: raw.rejectionReason,
        createdAt: isoToDateString(raw.createdAt),
    };
}

export interface CreateCorrectionPayload {
    attendanceId: string;
    date: string;
    requestedClockIn?: string | null;
    requestedClockOut?: string | null;
    reason: string;
}

function timeToIso(date: string, time: string | null | undefined): string | undefined {
    if (!time) return undefined;
    const [hours, minutes] = time.split(":").map(Number);
    const d = new Date(`${date}T00:00:00`);
    d.setHours(hours, minutes, 0, 0);
    return d.toISOString();
}

export async function createCorrectionRequest(
    payload: CreateCorrectionPayload,
): Promise<AttendanceCorrectionRequest> {
    const raw = await api.post<ApiCorrectionRequest>("/attendance-corrections", {
        attendanceId: payload.attendanceId,
        requestedCheckIn: timeToIso(payload.date, payload.requestedClockIn),
        requestedCheckOut: timeToIso(payload.date, payload.requestedClockOut),
        reason: payload.reason,
    });
    return mapCorrection(raw);
}

export interface CorrectionListResult {
    requests: AttendanceCorrectionRequest[];
    meta: ApiPaginatedCorrections["meta"];
}

export async function getMyCorrectionRequests(): Promise<CorrectionListResult> {
    const res = await api.get<ApiPaginatedCorrections>(
        "/attendance-corrections/me?limit=100",
    );
    return { requests: res.data.map(mapCorrection), meta: res.meta };
}

export interface CorrectionQuery {
    page?: number;
    limit?: number;
    employeeId?: string;
    status?: "pending" | "approved" | "rejected";
}

export async function getCorrectionRequests(
    query: CorrectionQuery = {},
): Promise<CorrectionListResult> {
    const params = new URLSearchParams();
    if (query.page) params.set("page", String(query.page));
    if (query.limit) params.set("limit", String(query.limit));
    if (query.employeeId) params.set("employeeId", query.employeeId);
    if (query.status) params.set("status", query.status.toUpperCase());
    const qs = params.toString();

    const res = await api.get<ApiPaginatedCorrections>(
        `/attendance-corrections${qs ? `?${qs}` : ""}`,
    );
    return { requests: res.data.map(mapCorrection), meta: res.meta };
}

export async function reviewCorrectionRequest(
    id: string,
    status: "approved" | "rejected",
    rejectionReason?: string,
): Promise<AttendanceCorrectionRequest> {
    const raw = await api.patch<ApiCorrectionRequest>(
        `/attendance-corrections/${id}/review`,
        { status: toApiStatus(status), rejectionReason },
    );
    return mapCorrection(raw);
}