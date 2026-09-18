// src/lib/api/job-titles.ts
import { api } from "./client";
import type { JobTitle } from "@/types/job-title";

export async function getJobTitles(activeOnly = true): Promise<JobTitle[]> {
    const qs = activeOnly ? "?active=true" : "";
    return api.get<JobTitle[]>(`/job-titles${qs}`);
}

export async function createJobTitle(name: string): Promise<JobTitle> {
    return api.post<JobTitle>("/job-titles", { name });
}

export async function updateJobTitleStatus(
    id: string,
    isActive: boolean,
): Promise<JobTitle> {
    return api.patch<JobTitle>(`/job-titles/${id}/status`, { isActive });
}

export async function updateJobTitle(id: string, name: string): Promise<JobTitle> {
    return api.patch<JobTitle>(`/job-titles/${id}`, { name });
}