export type PayrollStatus = "Paid" | "Pending" | "Processing" | "Cancelled";

export interface PayrollRecord {
    id: string;
    employeeId: string;
    employeeName: string;
    department: string;
    role: string;
    period: string;
    baseSalary: number;
    allowances: number;
    deductions: number;
    netPay: number;
    status: PayrollStatus;
}
