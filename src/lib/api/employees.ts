// src/lib/api/employees.ts
import { api, API_BASE_URL } from "./client";
import {
    generateTempPassword,
    toApiEmploymentStatus,
    toApiEmploymentType,
    toFrontendEmploymentStatus,
    toFrontendEmploymentType,
    type FrontendEmployeeStatus,
    type FrontendEmploymentType,
} from "./mappers/employee-mappers";
import type { Employee } from "@/types/employee";

interface ApiEmployee {
    id: string;
    employeeCode: string;
    firstName: string;
    lastName: string;
    phone: string | null;
    address: string | null;
    dateOfBirth: string | null;
    nationalId: string | null;
    jobTitleId: string;
    jobTitle: { id: string; name: string } | null;
    departmentId: string | null;
    managerId: string | null;
    workLocation: string | null;
    employmentType: "FULL_TIME" | "PART_TIME" | "CONTRACT";
    employmentStatus: "ACTIVE" | "INACTIVE" | "ON_LEAVE" | "PROBATION";
    hireDate: string | null;
    avatar: string | null;
    baseSalary: string;
    user: { email: string; role: string; isActive: boolean };
    department: { id: string; name: string } | null;
    manager: { id: string; firstName: string; lastName: string } | null;
}

interface ApiEmployeeSelf extends ApiEmployee {
    emergencyContactName: string | null;
    emergencyContactPhone: string | null;
}

interface ApiPaginatedEmployees {
    data: ApiEmployee[];
    meta: { total: number; page: number; limit: number; totalPages: number };
}

function toDateInputValue(iso: string | null): string | undefined {
    return iso ? iso.slice(0, 10) : undefined;
}

function toAvatarUrl(filename: string | null): string | null | undefined {
    if (!filename) return filename;
    return `${API_BASE_URL}/uploads/avatars/${filename}`;
}

function mapEmployee(raw: ApiEmployee): Employee {
    return {
        id: raw.id,
        employeeId: raw.employeeCode,
        name: `${raw.firstName} ${raw.lastName}`.trim(),
        email: raw.user.email,
        phone: raw.phone ?? undefined,
        dateOfBirth: toDateInputValue(raw.dateOfBirth),
        nationalId: raw.nationalId ?? undefined,
        address: raw.address ?? undefined,
        department: raw.department?.name ?? "",
        departmentId: raw.departmentId,
        role: raw.jobTitle?.name ?? "",
        jobTitleId: raw.jobTitleId,
        employmentType: toFrontendEmploymentType(raw.employmentType),
        manager: raw.manager
            ? `${raw.manager.firstName} ${raw.manager.lastName}`.trim()
            : undefined,
        managerId: raw.managerId,
        workLocation: raw.workLocation ?? undefined,
        status: toFrontendEmploymentStatus(raw.employmentStatus),
        joinDate: toDateInputValue(raw.hireDate) ?? "",
        avatar: toAvatarUrl(raw.avatar),
        baseSalary: raw.baseSalary !== undefined ? Number(raw.baseSalary) : undefined,
        emergencyContactName: undefined,
        emergencyContactPhone: undefined,
    };
}

function mapEmployeeSelf(raw: ApiEmployeeSelf): Employee {
    return {
        ...mapEmployee(raw),
        emergencyContactName: raw.emergencyContactName ?? undefined,
        emergencyContactPhone: raw.emergencyContactPhone ?? undefined,
        baseSalary: undefined,
    };
}

export interface EmployeeQuery {
    page?: number;
    limit?: number;
    search?: string;
    department?: string;
    employmentStatus?: FrontendEmployeeStatus;
}

export interface EmployeeListResult {
    employees: Employee[];
    meta: ApiPaginatedEmployees["meta"];
}

export async function getEmployees(
    query: EmployeeQuery = {},
): Promise<EmployeeListResult> {
    const params = new URLSearchParams();
    if (query.page) params.set("page", String(query.page));
    if (query.limit) params.set("limit", String(query.limit));
    if (query.search) params.set("search", query.search);
    if (query.department) params.set("department", query.department);
    if (query.employmentStatus) {
        params.set("employmentStatus", toApiEmploymentStatus(query.employmentStatus));
    }

    const qs = params.toString();
    const res = await api.get<ApiPaginatedEmployees>(
        `/employees${qs ? `?${qs}` : ""}`,
    );

    return { employees: res.data.map(mapEmployee), meta: res.meta };
}

export async function getEmployee(id: string): Promise<Employee> {
    const raw = await api.get<ApiEmployee>(`/employees/${id}`);
    return mapEmployee(raw);
}

export async function getMyEmployee(): Promise<Employee> {
    const raw = await api.get<ApiEmployeeSelf>("/employees/me");
    return mapEmployeeSelf(raw);
}

export interface UpdateMyProfilePayload {
    phone?: string;
    address?: string;
    emergencyContactName?: string;
    emergencyContactPhone?: string;
}

export async function updateMyEmployee(
    payload: UpdateMyProfilePayload,
): Promise<Employee> {
    const raw = await api.patch<ApiEmployeeSelf>("/employees/me", payload);
    return mapEmployeeSelf(raw);
}

export async function uploadMyAvatar(file: File): Promise<Employee> {
    const formData = new FormData();
    formData.append("avatar", file);
    const raw = await api.post<ApiEmployeeSelf>("/employees/me/avatar", formData);
    return mapEmployeeSelf(raw);
}

export async function removeMyAvatar(): Promise<Employee> {
    const raw = await api.delete<ApiEmployeeSelf>("/employees/me/avatar");
    return mapEmployeeSelf(raw);
}

export function getEmployeeOrgChart() {
    return api.get<
        { id: string; firstName: string; lastName: string; managerId: string | null }[]
    >("/employees/org-chart");
}

interface ApiDirectoryEmployee {
    id: string;
    firstName: string;
    lastName: string;
    jobTitle: { name: string } | null;
    avatar: string | null;
    phone: string | null;
    managerId: string | null;
    department: { name: string } | null;
    user: { email: string };
}

function mapDirectoryEmployee(raw: ApiDirectoryEmployee): Employee {
    return {
        id: raw.id,
        name: `${raw.firstName} ${raw.lastName}`.trim(),
        email: raw.user.email,
        phone: raw.phone ?? undefined,
        department: raw.department?.name ?? "",
        role: raw.jobTitle?.name ?? "",
        avatar: toAvatarUrl(raw.avatar),
        managerId: raw.managerId,
        status: "Active",
        joinDate: "",
    };
}

export async function getEmployeeDirectory(): Promise<Employee[]> {
    const raw = await api.get<ApiDirectoryEmployee[]>("/employees/directory");
    return raw.map(mapDirectoryEmployee);
}

function splitName(fullName: string): { firstName: string; lastName: string } {
    const trimmed = fullName.trim();
    const spaceIndex = trimmed.indexOf(" ");
    if (spaceIndex === -1) return { firstName: trimmed, lastName: "" };
    return {
        firstName: trimmed.slice(0, spaceIndex),
        lastName: trimmed.slice(spaceIndex + 1).trim(),
    };
}

export interface EmployeeFormPayload {
    name: string;
    email: string;
    phone?: string;
    dateOfBirth?: string;
    nationalId?: string;
    address?: string;
    departmentId?: string | null;
    jobTitleId: string;
    employmentType?: FrontendEmploymentType;
    managerId?: string | null;
    workLocation?: string;
    joinDate?: string;
    baseSalary?: number;
}

export async function createEmployee(
    payload: EmployeeFormPayload,
): Promise<{ employee: Employee; tempPassword: string }> {
    const { firstName, lastName } = splitName(payload.name);
    const tempPassword = generateTempPassword();

    const raw = await api.post<ApiEmployee>("/employees", {
        email: payload.email,
        password: tempPassword,
        firstName,
        lastName,
        phone: payload.phone || undefined,
        address: payload.address || undefined,
        dateOfBirth: payload.dateOfBirth || undefined,
        nationalId: payload.nationalId || undefined,
        jobTitleId: payload.jobTitleId,
        departmentId: payload.departmentId || undefined,
        managerId: payload.managerId || undefined,
        workLocation: payload.workLocation || undefined,
        employmentType: payload.employmentType
            ? toApiEmploymentType(payload.employmentType)
            : undefined,
        hireDate: payload.joinDate || undefined,
        baseSalary: payload.baseSalary,
    });

    return { employee: mapEmployee(raw), tempPassword };
}

export async function updateEmployee(
    id: string,
    payload: Partial<EmployeeFormPayload>,
): Promise<Employee> {
    const { firstName, lastName } = payload.name
        ? splitName(payload.name)
        : { firstName: undefined, lastName: undefined };

    const raw = await api.patch<ApiEmployee>(`/employees/${id}`, {
        firstName,
        lastName,
        email: payload.email || undefined,
        phone: payload.phone || undefined,
        address: payload.address || undefined,
        dateOfBirth: payload.dateOfBirth || undefined,
        nationalId: payload.nationalId || undefined,
        jobTitleId: payload.jobTitleId,
        departmentId: payload.departmentId || undefined,
        managerId: payload.managerId || undefined,
        workLocation: payload.workLocation || undefined,
        employmentType: payload.employmentType
            ? toApiEmploymentType(payload.employmentType)
            : undefined,
        hireDate: payload.joinDate || undefined,
        baseSalary: payload.baseSalary,
    });

    return mapEmployee(raw);
}

export async function updateEmployeeStatus(
    id: string,
    status: FrontendEmployeeStatus,
): Promise<Employee> {
    const raw = await api.patch<ApiEmployee>(`/employees/${id}/status`, {
        status: toApiEmploymentStatus(status),
    });
    return mapEmployee(raw);
}