export interface HeadcountRow {
    departmentId: string | null;
    departmentName: string;
    departmentStatus: "active" | "inactive" | null;
    headcount: number;
}

export interface LeaveUtilizationRow {
    leaveTypeId: string;
    leaveTypeName: string;
    approvedCount: number;
    pendingCount: number;
    rejectedCount: number;
    cancelledCount: number;
    daysUsed: number;
}