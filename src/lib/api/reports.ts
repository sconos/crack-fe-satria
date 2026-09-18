// src/lib/api/reports.ts
import { api } from "./client";
import type { HeadcountRow, LeaveUtilizationRow } from "@/types/report";

interface ApiHeadcountRow {
    departmentId: string | null;
    departmentName: string;
    departmentStatus: "ACTIVE" | "INACTIVE" | null;
    headcount: number;
}

interface ApiHeadcountResponse {
    data: ApiHeadcountRow[];
    totalHeadcount: number;
}

function mapHeadcountRow(raw: ApiHeadcountRow): HeadcountRow {
    return {
        departmentId: raw.departmentId,
        departmentStatus:
            raw.departmentStatus === null
                ? null
                : raw.departmentStatus === "ACTIVE"
                  ? "active"
                  : "inactive",
        departmentName: raw.departmentName,
        headcount: raw.headcount,
    };
}

export async function getHeadcountReport(): Promise<{
    rows: HeadcountRow[];
    totalHeadcount: number;
}> {
    const res = await api.get<ApiHeadcountResponse>("/reports/headcount");
    return {
        rows: res.data.map(mapHeadcountRow),
        totalHeadcount: res.totalHeadcount,
    };
}

interface ApiLeaveUtilizationResponse {
    year: number;
    data: LeaveUtilizationRow[];
}

export async function getLeaveUtilizationReport(
    year?: number,
): Promise<{ year: number; rows: LeaveUtilizationRow[] }> {
    const qs = year ? `?year=${year}` : "";
    const res = await api.get<ApiLeaveUtilizationResponse>(
        `/reports/leave-utilization${qs}`,
    );
    return { year: res.year, rows: res.data };
}