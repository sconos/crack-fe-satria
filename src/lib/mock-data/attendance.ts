import type { AttendanceRecord } from "@/types/attendance";

// TODO: replace with a real fetch, likely scoped server-side to the
export const attendanceRecords: AttendanceRecord[] = [
    { id: "a1", employeeId: "1", date: "2026-09-01", clockIn: "08:50", clockOut: "17:35", status: "on-time" },
    { id: "a2", employeeId: "1", date: "2026-09-02", clockIn: "09:14", clockOut: "18:02", status: "late" },
    { id: "a3", employeeId: "1", date: "2026-09-03", clockIn: "08:47", clockOut: "17:30", status: "on-time" },
    { id: "a4", employeeId: "1", date: "2026-09-04", clockIn: null, clockOut: null, status: "on-leave" },
    { id: "a5", employeeId: "1", date: "2026-09-05", clockIn: "08:55", clockOut: "17:40", status: "on-time" },
];

export function getAttendanceForEmployee(employeeId: string): AttendanceRecord[] {
    return attendanceRecords
        .filter((r) => r.employeeId === employeeId)
        .sort((a, b) => b.date.localeCompare(a.date));
}

export function getTodayRecord(employeeId: string): AttendanceRecord | undefined {
    const today = new Date().toISOString().slice(0, 10);
    return attendanceRecords.find(
        (r) => r.employeeId === employeeId && r.date === today,
    );
}