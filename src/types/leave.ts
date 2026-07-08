export type LeaveStatus = "Approved" | "Pending" | "Rejected";
export type LeaveType = "Annual" | "Sick" | "Emergency" | "Unpaid";

export interface LeaveRequest {
    id: string;
    type: LeaveType;
    startDate: string;
    endDate: string;
    days: number;
    reason: string;
    status: LeaveStatus;
    appliedDate: string;
}
