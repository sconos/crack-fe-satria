// src/lib/api/documents.ts
import { api, getAccessToken } from "./client";
import {
    toApiDocumentType,
    toFrontendDocumentStatus,
    toFrontendDocumentType,
    type ApiDocumentStatus,
    type ApiDocumentType,
} from "./mappers/document-mappers";
import type { DocumentStatus, DocumentType, EmployeeDocument } from "@/types/document";

// --- Raw shapes from the NestJS API ---------------------------------------

interface ApiDocument {
    id: string;
    employeeId: string;
    fileName: string;
    storedName: string;
    type: ApiDocumentType;
    status: ApiDocumentStatus;
    rejectionReason: string | null;
    uploadedAt: string; // ISO datetime
    reviewedByUserId: string | null;
    reviewedAt: string | null;
    employee?: { firstName: string; lastName: string; employeeCode: string };
}

interface ApiPaginatedDocuments {
    data: ApiDocument[];
    meta: { total: number; page: number; limit: number; totalPages: number };
}

// --- Mapping ---------------------------------------------------------------

export interface EmployeeDocumentWithDetail extends EmployeeDocument {
    employeeName?: string;
    employeeCode?: string;
    rejectionReason?: string | null;
}

function mapDocument(raw: ApiDocument): EmployeeDocumentWithDetail {
    return {
        id: raw.id,
        employeeId: raw.employeeId,
        fileName: raw.fileName,
        type: toFrontendDocumentType(raw.type),
        uploadedAt: raw.uploadedAt.slice(0, 10),
        status: toFrontendDocumentStatus(raw.status),
        employeeName: raw.employee
            ? `${raw.employee.firstName} ${raw.employee.lastName}`.trim()
            : undefined,
        employeeCode: raw.employee?.employeeCode,
        rejectionReason: raw.rejectionReason,
    };
}

// --- Queries ---------------------------------------------------------------

export interface DocumentQuery {
    page?: number;
    limit?: number;
    employeeId?: string;
    status?: DocumentStatus;
    type?: DocumentType;
}

export interface DocumentListResult {
    documents: EmployeeDocumentWithDetail[];
    meta: ApiPaginatedDocuments["meta"];
}

function buildQueryString(query: DocumentQuery): string {
    const params = new URLSearchParams();
    if (query.page) params.set("page", String(query.page));
    if (query.limit) params.set("limit", String(query.limit));
    if (query.employeeId) params.set("employeeId", query.employeeId);
    if (query.status) {
        const statusMap: Record<DocumentStatus, ApiDocumentStatus> = {
            "pending-review": "PENDING_REVIEW",
            verified: "VERIFIED",
            rejected: "REJECTED",
        };
        params.set("status", statusMap[query.status]);
    }
    if (query.type) params.set("type", toApiDocumentType(query.type));
    const qs = params.toString();
    return qs ? `?${qs}` : "";
}

// Self-service: the logged-in employee's own documents.
export async function getMyDocuments(
    query: Omit<DocumentQuery, "employeeId"> = {},
): Promise<DocumentListResult> {
    const res = await api.get<ApiPaginatedDocuments>(
        `/documents/me${buildQueryString(query)}`,
    );
    return { documents: res.data.map(mapDocument), meta: res.meta };
}

// ADMIN/HR: every employee's documents.
export async function getDocuments(
    query: DocumentQuery = {},
): Promise<DocumentListResult> {
    const res = await api.get<ApiPaginatedDocuments>(
        `/documents${buildQueryString(query)}`,
    );
    return { documents: res.data.map(mapDocument), meta: res.meta };
}

export async function getDocument(
    id: string,
): Promise<EmployeeDocumentWithDetail> {
    const raw = await api.get<ApiDocument>(`/documents/${id}`);
    return mapDocument(raw);
}

// --- Upload ------------------------------------------------------------------
// multipart/form-data, not JSON — api.post always JSON.stringifies its body
// and sets a JSON content-type, so this bypasses it and builds the request
// by hand. The browser sets the multipart boundary itself; don't set
// Content-Type manually or the boundary gets lost.

export async function uploadDocument(
    file: File,
    type: DocumentType,
): Promise<EmployeeDocumentWithDetail> {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL;
    const token = getAccessToken();

    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", toApiDocumentType(type));

    const res = await fetch(`${baseUrl}/documents`, {
        method: "POST",
        credentials: "include",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData,
    });

    if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.message ?? "Couldn't upload document");
    }

    const raw: ApiDocument = await res.json();
    return mapDocument(raw);
}

// --- Review (ADMIN/HR) -------------------------------------------------------

export async function reviewDocument(
    id: string,
    decision: "VERIFIED" | "REJECTED",
    rejectionReason?: string,
): Promise<EmployeeDocumentWithDetail> {
    const raw = await api.patch<ApiDocument>(`/documents/${id}/status`, {
        decision,
        rejectionReason,
    });
    return mapDocument(raw);
}

// --- Download ------------------------------------------------------------
// Streams the original file, not JSON — same pattern as payroll's payslip
// PDF download.

export async function downloadDocument(
    id: string,
    filename: string,
): Promise<void> {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL;
    const token = getAccessToken();

    const res = await fetch(`${baseUrl}/documents/${id}/download`, {
        method: "GET",
        credentials: "include",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
    });

    if (!res.ok) {
        throw new Error("Couldn't download document");
    }

    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
}

export async function removeDocument(id: string): Promise<void> {
    await api.delete(`/documents/${id}`);
}