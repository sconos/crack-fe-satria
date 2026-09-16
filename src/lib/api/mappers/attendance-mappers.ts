// src/lib/api/mappers/attendance-mappers.ts
import type { AttendanceStatus } from "@/types/attendance";

export type ApiAttendanceStatus = "PRESENT" | "LATE" | "ABSENT" | "ON_LEAVE";

const STATUS_TO_FRONTEND: Record<ApiAttendanceStatus, AttendanceStatus> = {
    PRESENT: "on-time",
    LATE: "late",
    ABSENT: "absent",
    ON_LEAVE: "on-leave",
};

const STATUS_TO_API: Record<AttendanceStatus, ApiAttendanceStatus> = {
    "on-time": "PRESENT",
    late: "LATE",
    absent: "ABSENT",
    "on-leave": "ON_LEAVE",
};

export function toFrontendAttendanceStatus(
    status: ApiAttendanceStatus,
): AttendanceStatus {
    return STATUS_TO_FRONTEND[status];
}

export function toApiAttendanceStatus(
    status: AttendanceStatus,
): ApiAttendanceStatus {
    return STATUS_TO_API[status];
}

export function isoToDateString(iso: string): string {
    const d = new Date(iso);
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${d.getFullYear()}-${month}-${day}`;
}

export function isoToTimeString(iso: string | null): string | null {
    if (!iso) return null;
    const d = new Date(iso);
    return `${String(d.getHours()).padStart(2, "0")}:${String(
        d.getMinutes(),
    ).padStart(2, "0")}`;
}

export function dateAndTimeToIso(
    date: string,
    time: string | null | undefined,
): string | undefined {
    if (!time) return undefined;
    const [hours, minutes] = time.split(":").map(Number);
    const d = new Date(`${date}T00:00:00`);
    d.setHours(hours, minutes, 0, 0);
    return d.toISOString();
}

export function todayDateString(): string {
    return isoToDateString(new Date().toISOString());
}