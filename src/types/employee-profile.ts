export type { Employee as EmployeeProfile } from "./employee";

export type LeaveBalance = {
    type: string;
    used: number;
    total: number;
};

export type LeaveHistoryItem = {
    id: string;
    type: string;
    range: string;
    days: number;
    status: "Approved" | "Pending" | "Rejected" | "Cancelled";
};