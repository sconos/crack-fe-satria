// src/lib/api/employees.ts
import { api } from "./client";
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

// --- Raw shapes coming back from the NestJS API ----------------------------

interface ApiEmployee {
    id: string;
    employeeCode: string;
    firstName: string;
    lastName: string;
    phone: string | null;
    address: string | null;
    dateOfBirth: string | null; // ISO datetime string
    nationalId: string | null;
    position: string;
    departmentId: string | null;
    managerId: string | null;
    workLocation: string | null;
    employmentType: "FULL_TIME" | "PART_TIME" | "CONTRACT";
    employmentStatus: "ACTIVE" | "INACTIVE" | "ON_LEAVE" | "PROBATION";
    hireDate: string | null; // ISO datetime string
    avatar: string | null;
    emergencyContactName: string | null;
    emergencyContactPhone: string | null;
    user: { email: string; role: string; isActive: boolean };
    department: { id: string; name: string } | null;
    manager: { id: string; firstName: string; lastName: string } | null;
}

interface ApiPaginatedEmployees {
    data: ApiEmployee[];
    meta: { total: number; page: number; limit: number; totalPages: number };
}

// --- Mapping --------------------------------------------------------------

// Prisma dates come back as full ISO datetime strings; <input type="date">
// wants just the YYYY-MM-DD part.
function toDateInputValue(iso: string | null): string | undefined {
    return iso ? iso.slice(0, 10) : undefined;
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
        role: raw.position,
        employmentType: toFrontendEmploymentType(raw.employmentType),
        manager: raw.manager
            ? `${raw.manager.firstName} ${raw.manager.lastName}`.trim()
            : undefined,
        managerId: raw.managerId,
        workLocation: raw.workLocation ?? undefined,
        status: toFrontendEmploymentStatus(raw.employmentStatus),
        joinDate: toDateInputValue(raw.hireDate) ?? "",
        avatar: raw.avatar,
        // The repository uses `include` rather than `select` for these
        // relations, and Prisma returns all scalar columns by default when
        // you use `include` — so these ARE present on every read endpoint
        // (list, detail, and /me), not just the self-update response.
        emergencyContactName: raw.emergencyContactName ?? undefined,
        emergencyContactPhone: raw.emergencyContactPhone ?? undefined,
    };
}

// --- Public API -------------------------------------------------------------

export interface EmployeeQuery {
    page?: number;
    limit?: number;
    search?: string;
    department?: string; // departmentId, per QueryEmployeeDto
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

export function getEmployeeOrgChart() {
    return api.get<
        { id: string; firstName: string; lastName: string; managerId: string | null }[]
    >("/employees/org-chart");
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

// Fields the Add/Edit form can actually produce and that the backend
// accepts on create/update. Notably absent: status (separate route),
// avatar and emergency contact (self-service only — see mapEmployee).
export interface EmployeeFormPayload {
    name: string;
    email: string;
    phone?: string;
    dateOfBirth?: string;
    nationalId?: string;
    address?: string;
    departmentId?: string | null;
    role: string; // job title -> backend `position`
    employmentType?: FrontendEmploymentType;
    managerId?: string | null;
    workLocation?: string;
    joinDate?: string;
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
        position: payload.role,
        departmentId: payload.departmentId || undefined,
        managerId: payload.managerId || undefined,
        workLocation: payload.workLocation || undefined,
        employmentType: payload.employmentType
            ? toApiEmploymentType(payload.employmentType)
            : undefined,
        hireDate: payload.joinDate || undefined,
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
        phone: payload.phone || undefined,
        address: payload.address || undefined,
        dateOfBirth: payload.dateOfBirth || undefined,
        nationalId: payload.nationalId || undefined,
        position: payload.role,
        departmentId: payload.departmentId || undefined,
        managerId: payload.managerId || undefined,
        workLocation: payload.workLocation || undefined,
        employmentType: payload.employmentType
            ? toApiEmploymentType(payload.employmentType)
            : undefined,
        hireDate: payload.joinDate || undefined,
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

// --- Self-service (portal) --------------------------------------------------
// GET/PATCH /employees/me — the backend derives the employee from the JWT,
// no id needed. This is the only place avatar and emergency contact can
// actually be saved; the admin create/update endpoints don't accept them.

export async function getMyEmployee(): Promise<Employee> {
    const raw = await api.get<ApiEmployee>("/employees/me");
    return mapEmployee(raw);
}

export interface UpdateMyEmployeePayload {
    phone?: string;
    address?: string;
    emergencyContactName?: string;
    emergencyContactPhone?: string;
    // string | null — null explicitly clears the avatar. UpdateEmployeeSelfDto's
    // @IsOptional() skips validation for both null and undefined, and Prisma
    // accepts null to clear a nullable column, so this reaches the backend
    // as-is rather than being coerced to undefined.
    avatar?: string | null;
}

export async function updateMyEmployee(
    payload: UpdateMyEmployeePayload,
): Promise<Employee> {
    const raw = await api.patch<ApiEmployee>("/employees/me", payload);
    return mapEmployee(raw);
}