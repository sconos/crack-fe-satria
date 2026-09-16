// src/lib/api/payroll.ts
import { api, getAccessToken } from "./client";
import {
    monthYearToPeriod,
    periodToMonthYear,
    toApiPayrollStatus,
    toFrontendPayrollStatus,
    type ApiPayrollStatus,
} from "./mappers/payroll-mappers";
import type { PayrollRecord, PayrollStatus } from "@/types/payroll";


interface ApiPayroll {
    id: string;
    employeeId: string;
    periodMonth: number;
    periodYear: number;
    baseSalary: string | number;
    allowances: string | number;
    deductions: string | number;
    netPay: string | number;
    absentDays: number;
    lateDays: number;
    status: ApiPayrollStatus;
    notes: string | null;
    paidAt: string | null;
    employee?: {
        firstName: string;
        lastName: string;
        employeeCode: string;
        position?: string;
        department?: { id: string; name: string } | null;
    };
}

interface ApiPaginatedPayroll {
    data: ApiPayroll[];
    meta: { total: number; page: number; limit: number; totalPages: number };
}

export interface PayrollRecordWithDetail extends PayrollRecord {
    employeeCode?: string;
    absentDays: number;
    lateDays: number;
    notes?: string | null;
    paidAt?: string | null;
}

function mapPayroll(raw: ApiPayroll): PayrollRecordWithDetail {
    return {
        id: raw.id,
        employeeId: raw.employeeId,
        employeeName: raw.employee
            ? `${raw.employee.firstName} ${raw.employee.lastName}`.trim()
            : "",
        employeeCode: raw.employee?.employeeCode,
        department: raw.employee?.department?.name ?? "",
        role: raw.employee?.position ?? "",
        period: monthYearToPeriod(raw.periodMonth, raw.periodYear),
        baseSalary: Number(raw.baseSalary),
        allowances: Number(raw.allowances),
        deductions: Number(raw.deductions),
        netPay: Number(raw.netPay),
        status: toFrontendPayrollStatus(raw.status),
        absentDays: raw.absentDays,
        lateDays: raw.lateDays,
        notes: raw.notes,
        paidAt: raw.paidAt,
    };
}

export interface PayrollQuery {
    page?: number;
    limit?: number;
    employeeId?: string;
    periodMonth?: number;
    periodYear?: number;
    status?: PayrollStatus;
}

export interface PayrollListResult {
    records: PayrollRecordWithDetail[];
    meta: ApiPaginatedPayroll["meta"];
}

function buildQueryString(query: PayrollQuery): string {
    const params = new URLSearchParams();
    if (query.page) params.set("page", String(query.page));
    if (query.limit) params.set("limit", String(query.limit));
    if (query.employeeId) params.set("employeeId", query.employeeId);
    if (query.periodMonth) params.set("periodMonth", String(query.periodMonth));
    if (query.periodYear) params.set("periodYear", String(query.periodYear));
    if (query.status) {
        const apiStatus = toApiPayrollStatus(query.status);
        if (apiStatus) params.set("status", apiStatus);
    }
    const qs = params.toString();
    return qs ? `?${qs}` : "";
}

export async function getPayroll(
    query: PayrollQuery = {},
): Promise<PayrollListResult> {
    const res = await api.get<ApiPaginatedPayroll>(
        `/payroll${buildQueryString(query)}`,
    );
    return { records: res.data.map(mapPayroll), meta: res.meta };
}

export async function getMyPayroll(
    query: Omit<PayrollQuery, "employeeId"> = {},
): Promise<PayrollListResult> {
    const res = await api.get<ApiPaginatedPayroll>(
        `/payroll/me${buildQueryString(query)}`,
    );
    return { records: res.data.map(mapPayroll), meta: res.meta };
}

export async function getPayrollRecord(
    id: string,
): Promise<PayrollRecordWithDetail> {
    const raw = await api.get<ApiPayroll>(`/payroll/${id}`);
    return mapPayroll(raw);
}

export async function generatePayrollForEmployee(
    employeeId: string,
    period: string,
): Promise<PayrollRecordWithDetail> {
    const { periodMonth, periodYear } = periodToMonthYear(period);
    const raw = await api.post<ApiPayroll>("/payroll/generate", {
        employeeId,
        periodMonth,
        periodYear,
    });
    return mapPayroll(raw);
}

export interface GeneratePeriodResult {
    employeeId: string;
    success: boolean;
    error?: string;
}

export async function generatePayrollForPeriod(
    period: string,
): Promise<GeneratePeriodResult[]> {
    const { periodMonth, periodYear } = periodToMonthYear(period);
    return api.post<GeneratePeriodResult[]>("/payroll/generate-period", {
        periodMonth,
        periodYear,
    });
}

export async function updatePayroll(
    id: string,
    payload: { allowances?: number; notes?: string },
): Promise<PayrollRecordWithDetail> {
    const raw = await api.patch<ApiPayroll>(`/payroll/${id}`, payload);
    return mapPayroll(raw);
}

export async function markPayrollPaid(
    id: string,
): Promise<PayrollRecordWithDetail> {
    const raw = await api.patch<ApiPayroll>(`/payroll/${id}/mark-paid`);
    return mapPayroll(raw);
}

export async function downloadPayslip(
    id: string,
    filename?: string,
): Promise<void> {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL;
    const token = getAccessToken();

    const res = await fetch(`${baseUrl}/payroll/${id}/payslip`, {
        method: "GET",
        credentials: "include",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
    });

    if (!res.ok) {
        throw new Error("Couldn't download payslip");
    }

    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename ?? `payslip-${id}.pdf`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
}