// src/lib/api/public-holidays.ts
import { api } from "./client";
import type { PublicHoliday } from "@/types/leave";

interface ApiPublicHoliday {
    id: string;
    name: string;
    date: string;
}

function mapHoliday(raw: ApiPublicHoliday): PublicHoliday {
    return {
        id: raw.id,
        name: raw.name,
        date: raw.date.slice(0, 10),
    };
}

export async function getPublicHolidays(): Promise<PublicHoliday[]> {
    const raw = await api.get<ApiPublicHoliday[]>("/public-holidays");
    return raw.map(mapHoliday);
}

export interface PublicHolidayPayload {
    name: string;
    date: string;
}

export async function createPublicHoliday(
    payload: PublicHolidayPayload,
): Promise<PublicHoliday> {
    const raw = await api.post<ApiPublicHoliday>("/public-holidays", payload);
    return mapHoliday(raw);
}

export async function deletePublicHoliday(id: string): Promise<void> {
    await api.delete(`/public-holidays/${id}`);
}