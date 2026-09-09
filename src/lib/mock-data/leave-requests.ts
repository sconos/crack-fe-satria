import type { LeaveRequest } from "@/types/leave";

export const leaveRequests: LeaveRequest[] = [
    { id: "lr1", employeeId: "1", type: "Annual Leave", startDate: "2026-06-20", endDate: "2026-06-21", days: 2, reason: "Family trip", status: "Approved", appliedDate: "2026-06-10" },
    { id: "lr2", employeeId: "1", type: "Sick Leave", startDate: "2026-05-14", endDate: "2026-05-14", days: 1, reason: "Flu", status: "Approved", appliedDate: "2026-05-14" },
    { id: "lr3", employeeId: "1", type: "Annual Leave", startDate: "2026-07-08", endDate: "2026-07-10", days: 3, reason: "Wedding", status: "Pending", appliedDate: "2026-06-28" },
    { id: "lr4", employeeId: "2", type: "Annual Leave", startDate: "2026-06-01", endDate: "2026-06-05", days: 5, reason: "Vacation", status: "Approved", appliedDate: "2026-05-20" },
    { id: "lr5", employeeId: "3", type: "Sick Leave", startDate: "2026-08-02", endDate: "2026-08-03", days: 2, reason: "Recovery", status: "Approved", appliedDate: "2026-08-02" },
    { id: "lr6", employeeId: "4", type: "Unpaid Leave", startDate: "2026-07-15", endDate: "2026-07-16", days: 2, reason: "Personal", status: "Rejected", appliedDate: "2026-07-10" },
];

export function getLeaveRequestsForEmployee(employeeId: string): LeaveRequest[] {
    return leaveRequests.filter((r) => r.employeeId === employeeId);
}