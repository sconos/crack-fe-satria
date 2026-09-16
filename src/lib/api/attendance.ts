// src/lib/api/attendance.ts
import { api } from "./client";
import {
    dateAndTimeToIso,
    isoToDateString,
    isoToTimeString,
    toApiAttendanceStatus,
    toFrontendAttendanceStatus,
    type ApiAttendanceStatus,
} from "./mappers/attendance-mappers";
import type { AttendanceRecord, AttendanceStatus } from "@/types/attendance";

interface ApiAttendance {
    id: string;
    employeeId: string;
    date: string;
    checkIn: string | null;
    checkOut: string | null;
    status: ApiAttendanceStatus;
    notes: string | null;
    employee?: {
        firstName: string;
        lastName: string;
        employeeCode: string;
        department: { id: string; name: string } | null;
    };
}

interface ApiPaginatedAttendance {
    data: ApiAttendance[];
    meta: { total: number; page: number; limit: number; totalPages: number };
}

export interface AttendanceRecordWithEmployee extends AttendanceRecord {
    employeeName?: string;
    employeeCode?: string;
    departmentName?: string;
    departmentId?: string;
    notes?: string | null;
}

function mapAttendance(raw: ApiAttendance): AttendanceRecordWithEmployee {
    return {
        id: raw.id,
        employeeId: raw.employeeId,
        date: isoToDateString(raw.date),
        clockIn: isoToTimeString(raw.checkIn),
        clockOut: isoToTimeString(raw.checkOut),
        status: toFrontendAttendanceStatus(raw.status),
        employeeName: raw.employee
            ? `${raw.employee.firstName} ${raw.employee.lastName}`.trim()
            : undefined,
        employeeCode: raw.employee?.employeeCode,
        departmentName: raw.employee?.department?.name,
        departmentId: raw.employee?.department?.id,
        notes: raw.notes,
    };
}

export interface AttendanceQuery {
    page?: number;
    limit?: number;
    employeeId?: string;
    status?: AttendanceStatus;
    startDate?: string;
    endDate?: string;
}

export interface AttendanceListResult {
    records: AttendanceRecordWithEmployee[];
    meta: ApiPaginatedAttendance["meta"];
}

function buildQueryString(query: AttendanceQuery): string {
    const params = new URLSearchParams();
    if (query.page) params.set("page", String(query.page));
    if (query.limit) params.set("limit", String(query.limit));
    if (query.employeeId) params.set("employeeId", query.employeeId);
    if (query.status) params.set("status", toApiAttendanceStatus(query.status));
    if (query.startDate) params.set("startDate", query.startDate);
    if (query.endDate) params.set("endDate", query.endDate);
    const qs = params.toString();
    return qs ? `?${qs}` : "";
}

export async function getAttendance(
    query: AttendanceQuery = {},
): Promise<AttendanceListResult> {
    const res = await api.get<ApiPaginatedAttendance>(
        `/attendance${buildQueryString(query)}`,
    );
    return { records: res.data.map(mapAttendance), meta: res.meta };
}

export async function getMyAttendance(
    query: Omit<AttendanceQuery, "employeeId"> = {},
): Promise<AttendanceListResult> {
    const res = await api.get<ApiPaginatedAttendance>(
        `/attendance/me${buildQueryString(query)}`,
    );
    return { records: res.data.map(mapAttendance), meta: res.meta };
}

export async function getAttendanceRecord(
    id: string,
): Promise<AttendanceRecordWithEmployee> {
    const raw = await api.get<ApiAttendance>(`/attendance/${id}`);
    return mapAttendance(raw);
}


export async function clockIn(): Promise<AttendanceRecordWithEmployee> {
    const raw = await api.post<ApiAttendance>("/attendance/clock-in");
    return mapAttendance(raw);
}

export async function clockOut(): Promise<AttendanceRecordWithEmployee> {
    const raw = await api.post<ApiAttendance>("/attendance/clock-out");
    return mapAttendance(raw);
}


export interface CreateAttendancePayload {
    employeeId: string;
    date: string;
    clockIn?: string | null;
    clockOut?: string | null;
    status?: AttendanceStatus;
    notes?: string;
}

export async function createAttendance(
    payload: CreateAttendancePayload,
): Promise<AttendanceRecordWithEmployee> {
    const raw = await api.post<ApiAttendance>("/attendance", {
        employeeId: payload.employeeId,
        date: dateAndTimeToIso(payload.date, "00:00"),
        checkIn: dateAndTimeToIso(payload.date, payload.clockIn),
        checkOut: dateAndTimeToIso(payload.date, payload.clockOut),
        status: payload.status
            ? toApiAttendanceStatus(payload.status)
            : undefined,
        notes: payload.notes || undefined,
    });
    return mapAttendance(raw);
}

export async function updateAttendance(
    id: string,
    recordDate: string,
    payload: {
        clockIn?: string | null;
        clockOut?: string | null;
        status?: AttendanceStatus;
        notes?: string;
    },
): Promise<AttendanceRecordWithEmployee> {
    const raw = await api.patch<ApiAttendance>(`/attendance/${id}`, {
        checkIn: dateAndTimeToIso(recordDate, payload.clockIn),
        checkOut: dateAndTimeToIso(recordDate, payload.clockOut),
        status: payload.status
            ? toApiAttendanceStatus(payload.status)
            : undefined,
        notes: payload.notes || undefined,
    });
    return mapAttendance(raw);
}

export async function deleteAttendance(id: string): Promise<void> {
    await api.delete(`/attendance/${id}`);
}