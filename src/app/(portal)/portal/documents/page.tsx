"use client";

import * as React from "react";
import { FileText, Plus } from "lucide-react";
import { PortalLayout } from "@/components/portal/PortalLayout";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { DocumentStatusBadge } from "@/components/portal/DocumentStatusBadge";
import {
    UploadDocumentModal,
    type UploadDocumentInput,
} from "@/components/portal/UploadDocumentModal";
import { toast } from "@/components/ui/Toast";
import { getDocumentsForEmployee } from "@/lib/mock-data/documents";
import type { EmployeeDocument } from "@/types/document";

// TODO: replace with the logged-in user's id once auth/session is wired up
const CURRENT_EMPLOYEE_ID = "1";

export default function PortalDocumentsPage() {
    const [documents, setDocuments] = React.useState<EmployeeDocument[]>(() =>
        getDocumentsForEmployee(CURRENT_EMPLOYEE_ID),
    );
    const [modalOpen, setModalOpen] = React.useState(false);

    function handleUpload(data: UploadDocumentInput) {
        const newDoc: EmployeeDocument = {
            id: `d${Date.now()}`,
            employeeId: CURRENT_EMPLOYEE_ID,
            fileName: data.fileName,
            type: data.type,
            uploadedAt: new Date().toISOString().slice(0, 10),
            status: "pending-review",
        };
        setDocuments((prev) => [newDoc, ...prev]);
        toast.success("Document uploaded — pending HR review.");
    }

    return (
        <PortalLayout title="My Documents">
            <div className="flex flex-col gap-6">
                <PageHeader
                    title="My Documents"
                    description="Upload and track your ID, contracts, and other files on record"
                    action={
                        <Button onClick={() => setModalOpen(true)}>
                            <Plus className="h-4 w-4" />
                            Upload
                        </Button>
                    }
                />

                {documents.length === 0 ? (
                    <Card>
                        <CardContent className="flex flex-col items-center gap-1 py-16 text-center">
                            <p className="text-sm font-medium text-primary-dark">
                                No documents yet
                            </p>
                            <p className="max-w-sm text-sm text-neutral">
                                Upload your ID, signed contract, or other
                                required files here.
                            </p>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="flex flex-col gap-3">
                        {documents.map((doc) => (
                            <Card key={doc.id}>
                                <CardContent className="flex items-center justify-between gap-4">
                                    <div className="flex items-center gap-3">
                                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-tint text-primary">
                                            <FileText className="h-5 w-5" />
                                        </span>
                                        <div>
                                            <p className="font-body text-sm font-medium text-primary-dark">
                                                {doc.fileName}
                                            </p>
                                            <p className="font-body text-xs text-neutral">
                                                {doc.type} · Uploaded{" "}
                                                {new Date(
                                                    doc.uploadedAt,
                                                ).toLocaleDateString("en-US", {
                                                    month: "short",
                                                    day: "numeric",
                                                    year: "numeric",
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                    <DocumentStatusBadge status={doc.status} />
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>

            <UploadDocumentModal
                open={modalOpen}
                onOpenChange={setModalOpen}
                onSubmit={handleUpload}
            />
        </PortalLayout>
    );
}