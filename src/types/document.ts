export type DocumentType =
    | "ID Card"
    | "Contract"
    | "Certificate"
    | "Tax Form"
    | "Other";

export type DocumentStatus = "pending-review" | "verified" | "rejected";

export interface EmployeeDocument {
    id: string;
    employeeId: string;
    fileName: string;
    type: DocumentType;
    uploadedAt: string;
    status: DocumentStatus;
}