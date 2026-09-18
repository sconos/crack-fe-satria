// src/lib/api/notifications.ts
import { api } from "./client";
import {
    toFrontendNotificationType,
    type ApiNotificationType,
} from "./mappers/notification-mappers";
import type { Notification } from "@/types/notification";

interface ApiNotification {
    id: string;
    type: ApiNotificationType;
    title: string;
    message: string;
    link: string | null;
    isRead: boolean;
    createdAt: string;
}

interface ApiNotificationMeta {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    unreadCount: number;
}

interface ApiPaginatedNotifications {
    data: ApiNotification[];
    meta: ApiNotificationMeta;
}

function mapNotification(raw: ApiNotification): Notification {
    return {
        id: raw.id,
        type: toFrontendNotificationType(raw.type),
        title: raw.title,
        message: raw.message,
        link: raw.link,
        isRead: raw.isRead,
        createdAt: raw.createdAt,
    };
}

export interface NotificationQuery {
    page?: number;
    limit?: number;
    unreadOnly?: boolean;
}

export interface NotificationListResult {
    notifications: Notification[];
    meta: ApiNotificationMeta;
}

export async function getMyNotifications(
    query: NotificationQuery = {},
): Promise<NotificationListResult> {
    const params = new URLSearchParams();
    if (query.page) params.set("page", String(query.page));
    if (query.limit) params.set("limit", String(query.limit));
    if (query.unreadOnly) params.set("unreadOnly", "true");
    const qs = params.toString();

    const res = await api.get<ApiPaginatedNotifications>(
        `/notifications/me${qs ? `?${qs}` : ""}`,
    );
    return { notifications: res.data.map(mapNotification), meta: res.meta };
}

export async function getUnreadNotificationCount(): Promise<number> {
    const res = await api.get<{ unreadCount: number }>(
        "/notifications/me/unread-count",
    );
    return res.unreadCount;
}

export async function markNotificationRead(id: string): Promise<Notification> {
    const raw = await api.patch<ApiNotification>(`/notifications/${id}/read`);
    return mapNotification(raw);
}

export async function markAllNotificationsRead(): Promise<void> {
    await api.patch("/notifications/me/read-all");
}