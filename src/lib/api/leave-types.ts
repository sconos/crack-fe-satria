// src/lib/api/leave-types.ts
import { api } from "./client";
import type { LeaveTypeConfig } from "@/types/leave";

export function getLeaveTypes(): Promise<LeaveTypeConfig[]> {
    return api.get<LeaveTypeConfig[]>("/leave-types");
}

export function getAllLeaveTypes(): Promise<LeaveTypeConfig[]> {
    return api.get<LeaveTypeConfig[]>("/leave-types/all");
}

export function getLeaveType(id: string): Promise<LeaveTypeConfig> {
    return api.get<LeaveTypeConfig>(`/leave-types/${id}`);
}

export interface LeaveTypePayload {
    name: string;
    defaultAllocation: number;
    isPaid?: boolean;
}

export function createLeaveType(
    payload: LeaveTypePayload,
): Promise<LeaveTypeConfig> {
    return api.post<LeaveTypeConfig>("/leave-types", payload);
}

export function updateLeaveType(
    id: string,
    payload: Partial<LeaveTypePayload>,
): Promise<LeaveTypeConfig> {
    return api.patch<LeaveTypeConfig>(`/leave-types/${id}`, payload);
}

export function updateLeaveTypeStatus(
    id: string,
    isActive: boolean,
): Promise<LeaveTypeConfig> {
    return api.patch<LeaveTypeConfig>(`/leave-types/${id}/status`, {
        isActive,
    });
}