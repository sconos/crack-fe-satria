// src/lib/api/employee-mappers.ts

export type ApiEmploymentStatus =
    | "ACTIVE"
    | "INACTIVE"
    | "ON_LEAVE"
    | "PROBATION";

export type FrontendEmployeeStatus =
    | "Active"
    | "Inactive"
    | "On Leave"
    | "Probation";

const STATUS_TO_FRONTEND: Record<ApiEmploymentStatus, FrontendEmployeeStatus> = {
    ACTIVE: "Active",
    INACTIVE: "Inactive",
    ON_LEAVE: "On Leave",
    PROBATION: "Probation",
};

const STATUS_TO_API: Record<FrontendEmployeeStatus, ApiEmploymentStatus> = {
    Active: "ACTIVE",
    Inactive: "INACTIVE",
    "On Leave": "ON_LEAVE",
    Probation: "PROBATION",
};

export function toFrontendEmploymentStatus(
    status: ApiEmploymentStatus,
): FrontendEmployeeStatus {
    return STATUS_TO_FRONTEND[status];
}

export function toApiEmploymentStatus(
    status: FrontendEmployeeStatus,
): ApiEmploymentStatus {
    return STATUS_TO_API[status];
}

export type ApiEmploymentType = "FULL_TIME" | "PART_TIME" | "CONTRACT";

export type FrontendEmploymentType = "Full-time" | "Part-time" | "Contract";

const TYPE_TO_FRONTEND: Record<ApiEmploymentType, FrontendEmploymentType> = {
    FULL_TIME: "Full-time",
    PART_TIME: "Part-time",
    CONTRACT: "Contract",
};

const TYPE_TO_API: Record<FrontendEmploymentType, ApiEmploymentType> = {
    "Full-time": "FULL_TIME",
    "Part-time": "PART_TIME",
    Contract: "CONTRACT",
};

export function toFrontendEmploymentType(
    type: ApiEmploymentType,
): FrontendEmploymentType {
    return TYPE_TO_FRONTEND[type];
}

export function toApiEmploymentType(
    type: FrontendEmploymentType,
): ApiEmploymentType {
    return TYPE_TO_API[type];
}

const PASSWORD_CHARS =
    "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%";

export function generateTempPassword(length = 12): string {
    let password = "";
    for (let i = 0; i < length; i++) {
        password += PASSWORD_CHARS[Math.floor(Math.random() * PASSWORD_CHARS.length)];
    }
    return password;
}