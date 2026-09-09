export type LeaveStatus = "Approved" | "Pending" | "Rejected";

export interface LeaveRequest {
    id: string;
    employeeId: string;
    type: string;
    startDate: string;
    endDate: string;
    days: number;
    reason: string;
    status: LeaveStatus;
    appliedDate: string;
}

export interface LeaveTypeConfig {
    id: string;
    name: string;
    defaultAllocation: number;
    isPaid: boolean;
    isActive: boolean;
}

export interface PublicHoliday {
    id: string;
    name: string;
    date: string; 
}
