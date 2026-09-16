export type CorrectionStatus = "pending" | "approved" | "rejected";

export interface AttendanceCorrectionRequest {
    id: string;
    attendanceId: string;
    employeeId: string;
    employeeName?: string;
    employeeCode?: string;
    date: string; // the attendance record's date, YYYY-MM-DD
    originalClockIn: string | null;
    originalClockOut: string | null;
    requestedClockIn: string | null;
    requestedClockOut: string | null;
    reason: string;
    status: CorrectionStatus;
    rejectionReason?: string | null;
    createdAt: string; // YYYY-MM-DD
}