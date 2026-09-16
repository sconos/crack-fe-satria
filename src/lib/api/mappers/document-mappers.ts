// src/lib/api/mappers/document-mappers.ts
import type { DocumentType, DocumentStatus } from "@/types/document";

export type ApiDocumentType =
    | "ID_CARD"
    | "CONTRACT"
    | "CERTIFICATE"
    | "TAX_FORM"
    | "OTHER";

export type ApiDocumentStatus = "PENDING_REVIEW" | "VERIFIED" | "REJECTED";

const TYPE_TO_FRONTEND: Record<ApiDocumentType, DocumentType> = {
    ID_CARD: "ID Card",
    CONTRACT: "Contract",
    CERTIFICATE: "Certificate",
    TAX_FORM: "Tax Form",
    OTHER: "Other",
};

const TYPE_TO_API: Record<DocumentType, ApiDocumentType> = {
    "ID Card": "ID_CARD",
    Contract: "CONTRACT",
    Certificate: "CERTIFICATE",
    "Tax Form": "TAX_FORM",
    Other: "OTHER",
};

export function toFrontendDocumentType(type: ApiDocumentType): DocumentType {
    return TYPE_TO_FRONTEND[type];
}

export function toApiDocumentType(type: DocumentType): ApiDocumentType {
    return TYPE_TO_API[type];
}

const STATUS_TO_FRONTEND: Record<ApiDocumentStatus, DocumentStatus> = {
    PENDING_REVIEW: "pending-review",
    VERIFIED: "verified",
    REJECTED: "rejected",
};

const STATUS_TO_API: Record<DocumentStatus, ApiDocumentStatus> = {
    "pending-review": "PENDING_REVIEW",
    verified: "VERIFIED",
    rejected: "REJECTED",
};

export function toFrontendDocumentStatus(
    status: ApiDocumentStatus,
): DocumentStatus {
    return STATUS_TO_FRONTEND[status];
}

export function toApiDocumentStatus(
    status: DocumentStatus,
): ApiDocumentStatus {
    return STATUS_TO_API[status];
}