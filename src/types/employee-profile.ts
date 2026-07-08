import type { Employee } from "./employee";

/**
 * Extends the base Employee type with fields only needed on the profile
 * page. Merge these fields into your existing Employee type (or keep this
 * as a separate EmployeeProfile type) once this is backed by a real API —
 * this file is just scaffolding for the mock data below.
 */
export type EmployeeProfile = Employee & {
    phone: string;
    address: string;
    manager: string;
    employmentType: "Full-time" | "Part-time" | "Contract";
    workLocation: string;
    emergencyContactName: string;
    emergencyContactPhone: string;
};

export type LeaveBalance = {
    type: string;
    used: number;
    total: number;
};

export type LeaveHistoryItem = {
    id: string;
    type: string;
    range: string;
    days: number;
    status: "Approved" | "Pending" | "Rejected";
};
