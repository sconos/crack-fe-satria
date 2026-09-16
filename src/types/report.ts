// Both reports are pre-aggregated server-side (Prisma groupBy/_count), so
// these types describe report rows, not raw records.

export interface HeadcountRow {
    departmentId: string | null; // null = the synthetic "Unassigned" row
    departmentName: string;
    departmentStatus: "active" | "inactive" | null; // null for "Unassigned"
    headcount: number; // excludes fully INACTIVE employees
}

export interface LeaveUtilizationRow {
    leaveTypeId: string;
    leaveTypeName: string;
    approvedCount: number;
    pendingCount: number;
    rejectedCount: number;
    cancelledCount: number;
    daysUsed: number; // sum of totalDays across APPROVED requests only
}