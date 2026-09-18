export type NotificationType =
    | "leave-submitted"
    | "leave-reviewed"
    | "correction-submitted"
    | "correction-reviewed"
    | "document-uploaded"
    | "document-reviewed"
    | "payroll-generated"
    | "payroll-paid";

export interface Notification {
    id: string;
    type: NotificationType;
    title: string;
    message: string;
    link: string | null;
    isRead: boolean;
    createdAt: string; // ISO datetime
}