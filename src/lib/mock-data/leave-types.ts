import type { LeaveTypeConfig } from "@/types/leave";

export const leaveTypes: LeaveTypeConfig[] = [
    { id: "lt1", name: "Annual Leave", defaultAllocation: 12, isPaid: true, isActive: true },
    { id: "lt2", name: "Sick Leave", defaultAllocation: 10, isPaid: true, isActive: true },
    { id: "lt3", name: "Emergency Leave", defaultAllocation: 3, isPaid: true, isActive: true },
    { id: "lt4", name: "Unpaid Leave", defaultAllocation: 5, isPaid: false, isActive: true },
];

export function getActiveLeaveTypes(): LeaveTypeConfig[] {
    return leaveTypes.filter((t) => t.isActive);
}