export type AttendanceStatus =
    | "on-time"
    | "late"
    | "absent"
    | "on-leave"
    | "remote";

export interface AttendanceRecord {
    id: string;
    employeeId: string;
    date: string;
    clockIn: string | null;
    clockOut: string | null;
    status: AttendanceStatus;
}