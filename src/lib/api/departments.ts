// src/lib/api/departments.ts
import { api } from "./client";
import type { Department, DepartmentStatus } from "@/types/department";

type ApiDepartmentStatus = "ACTIVE" | "INACTIVE";

interface ApiDepartment {
    id: string;
    name: string;
    code: string;
    parentId: string | null;
    headId: string | null;
    location: string | null;
    status: ApiDepartmentStatus;
    head: { firstName: string; lastName: string } | null;
    _count: { employees: number };
}

interface ApiPaginatedDepartments {
    data: ApiDepartment[];
    meta: { total: number; page: number; limit: number; totalPages: number };
}

interface ApiOrgChartNode {
    id: string;
    name: string;
    parentId: string | null;
}


function toFrontendStatus(status: ApiDepartmentStatus): DepartmentStatus {
    return status === "ACTIVE" ? "active" : "inactive";
}

function toApiStatus(status: DepartmentStatus): ApiDepartmentStatus {
    return status === "active" ? "ACTIVE" : "INACTIVE";
}

function initialsFromName(name: string): string {
    return name
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase() ?? "")
        .join("");
}

function mapDepartment(raw: ApiDepartment): Department {
    const headName = raw.head
        ? `${raw.head.firstName} ${raw.head.lastName}`.trim()
        : null;

    return {
        id: raw.id,
        name: raw.name,
        code: raw.code,
        parentId: raw.parentId,
        headId: raw.headId,
        headName,
        headInitials: headName ? initialsFromName(headName) : null,
        employeeCount: raw._count?.employees ?? 0,
        location: raw.location ?? undefined,
        status: toFrontendStatus(raw.status),
    };
}


export interface DepartmentQuery {
    page?: number;
    limit?: number;
    search?: string;
    status?: DepartmentStatus;
}

export interface DepartmentListResult {
    departments: Department[];
    meta: ApiPaginatedDepartments["meta"];
}

export interface DepartmentPayload {
    name: string;
    code: string;
    parentId?: string | null;
    headId?: string | null;
    location?: string;
}

export async function getDepartments(
    query: DepartmentQuery = {},
): Promise<DepartmentListResult> {
    const params = new URLSearchParams();
    if (query.page) params.set("page", String(query.page));
    if (query.limit) params.set("limit", String(query.limit));
    if (query.search) params.set("search", query.search);
    if (query.status) params.set("status", toApiStatus(query.status));

    const qs = params.toString();
    const res = await api.get<ApiPaginatedDepartments>(
        `/departments${qs ? `?${qs}` : ""}`,
    );

    return { departments: res.data.map(mapDepartment), meta: res.meta };
}

export async function getDepartment(id: string): Promise<Department> {
    const raw = await api.get<ApiDepartment>(`/departments/${id}`);
    return mapDepartment(raw);
}

export function getDepartmentOrgChart() {
    return api.get<ApiOrgChartNode[]>("/departments/org-chart");
}

export async function createDepartment(
    payload: DepartmentPayload,
): Promise<Department> {
    const raw = await api.post<ApiDepartment>("/departments", {
        ...payload,
        parentId: payload.parentId || undefined,
        headId: payload.headId || undefined,
    });
    return mapDepartment(raw);
}

export async function updateDepartment(
    id: string,
    payload: Partial<DepartmentPayload>,
): Promise<Department> {
    const raw = await api.patch<ApiDepartment>(`/departments/${id}`, {
        ...payload,
        parentId: payload.parentId || undefined,
        headId: payload.headId || undefined,
    });
    return mapDepartment(raw);
}

export async function updateDepartmentStatus(
    id: string,
    status: DepartmentStatus,
): Promise<Department> {
    const raw = await api.patch<ApiDepartment>(`/departments/${id}/status`, {
        status: toApiStatus(status),
    });
    return mapDepartment(raw);
}