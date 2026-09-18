// src/lib/api/mappers/notification-mappers.ts
import type { NotificationType } from "@/types/notification";

export type ApiNotificationType =
    | "LEAVE_SUBMITTED"
    | "LEAVE_REVIEWED"
    | "CORRECTION_SUBMITTED"
    | "CORRECTION_REVIEWED"
    | "DOCUMENT_UPLOADED"
    | "DOCUMENT_REVIEWED"
    | "PAYROLL_GENERATED"
    | "PAYROLL_PAID";

const TYPE_TO_FRONTEND: Record<ApiNotificationType, NotificationType> = {
    LEAVE_SUBMITTED: "leave-submitted",
    LEAVE_REVIEWED: "leave-reviewed",
    CORRECTION_SUBMITTED: "correction-submitted",
    CORRECTION_REVIEWED: "correction-reviewed",
    DOCUMENT_UPLOADED: "document-uploaded",
    DOCUMENT_REVIEWED: "document-reviewed",
    PAYROLL_GENERATED: "payroll-generated",
    PAYROLL_PAID: "payroll-paid",
};

export function toFrontendNotificationType(
    type: ApiNotificationType,
): NotificationType {
    return TYPE_TO_FRONTEND[type];
}