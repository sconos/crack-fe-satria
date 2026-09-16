// src/lib/api/mappers/payroll-mappers.ts
import type { PayrollStatus } from "@/types/payroll";

export type ApiPayrollStatus = "DRAFT" | "PAID";

export function toFrontendPayrollStatus(status: ApiPayrollStatus): PayrollStatus {
    return status === "PAID" ? "Paid" : "Pending";
}

export function toApiPayrollStatus(
    status: PayrollStatus,
): ApiPayrollStatus | undefined {
    if (status === "Paid") return "PAID";
    if (status === "Pending") return "DRAFT";
    return undefined;
}

export function periodToMonthYear(period: string): {
    periodMonth: number;
    periodYear: number;
} {
    const [year, month] = period.split("-").map(Number);
    return { periodMonth: month, periodYear: year };
}

export function monthYearToPeriod(periodMonth: number, periodYear: number): string {
    return `${periodYear}-${String(periodMonth).padStart(2, "0")}`;
}