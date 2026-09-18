import type { EmployeeDocument } from "@/types/document";

export const documents: EmployeeDocument[] = [
    {
        id: "d1",
        employeeId: "1",
        fileName: "ktp-satria.pdf",
        type: "ID Card",
        uploadedAt: "2024-01-16",
        status: "verified",
    },
    {
        id: "d2",
        employeeId: "1",
        fileName: "employment-contract-2024.pdf",
        type: "Contract",
        uploadedAt: "2024-01-16",
        status: "verified",
    },
];

export function getDocumentsForEmployee(employeeId: string): EmployeeDocument[] {
    return documents
        .filter((d) => d.employeeId === employeeId)
        .sort((a, b) => b.uploadedAt.localeCompare(a.uploadedAt));
}