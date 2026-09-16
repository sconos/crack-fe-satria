"use client";

import * as React from "react";
import { FileText, Plus, Download } from "lucide-react";
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
import {
    getMyDocuments,
    uploadDocument,
    downloadDocument,
    type EmployeeDocumentWithDetail,
} from "@/lib/api/documents";

export default function PortalDocumentsPage() {
    const [documents, setDocuments] = React.useState<
        EmployeeDocumentWithDetail[]
    >([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const [modalOpen, setModalOpen] = React.useState(false);
    const [isUploading, setIsUploading] = React.useState(false);
    const [downloadingId, setDownloadingId] = React.useState<string | null>(
        null,
    );

    async function loadDocuments() {
        try {
            const { documents: fetched } = await getMyDocuments({ limit: 100 });
            setDocuments(fetched);
        } catch {
            toast.error("Couldn't load your documents.");
        } finally {
            setIsLoading(false);
        }
    }

    React.useEffect(() => {
        loadDocuments();
    }, []);

    async function handleUpload(data: UploadDocumentInput) {
        setIsUploading(true);
        try {
            await uploadDocument(data.file, data.type);
            toast.success("Document uploaded — pending HR review.");
            await loadDocuments();
        } catch {
            toast.error("Couldn't upload document. Try again.");
        } finally {
            setIsUploading(false);
        }
    }

    async function handleDownload(doc: EmployeeDocumentWithDetail) {
        setDownloadingId(doc.id);
        try {
            await downloadDocument(doc.id, doc.fileName);
        } catch {
            toast.error("Couldn't download document. Try again.");
        } finally {
            setDownloadingId(null);
        }
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

                {isLoading ? (
                    <p className="px-5 py-10 text-center text-sm text-neutral">
                        Loading documents...
                    </p>
                ) : documents.length === 0 ? (
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
                                            {doc.status === "rejected" &&
                                                doc.rejectionReason && (
                                                    <p className="font-body text-xs text-danger">
                                                        {doc.rejectionReason}
                                                    </p>
                                                )}
                                        </div>
                                    </div>
                                    <div className="flex shrink-0 items-center gap-3">
                                        <DocumentStatusBadge
                                            status={doc.status}
                                        />
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-8 w-8 p-0"
                                            loading={downloadingId === doc.id}
                                            onClick={() =>
                                                handleDownload(doc)
                                            }
                                        >
                                            <Download className="h-4 w-4" />
                                            <span className="sr-only">
                                                Download {doc.fileName}
                                            </span>
                                        </Button>
                                    </div>
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
                isUploading={isUploading}
            />
        </PortalLayout>
    );
}