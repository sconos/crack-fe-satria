"use client";

import * as React from "react";
import { FileText, Download, Check, X } from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableHead,
    TableCell,
    TableEmpty,
} from "@/components/ui/Table";
import { DocumentStatusBadge } from "@/components/portal/DocumentStatusBadge";
import { RejectReasonModal } from "@/components/ui/RejectReasonModal";
import { toast } from "@/components/ui/Toast";
import {
    getDocuments,
    reviewDocument,
    downloadDocument,
    type EmployeeDocumentWithDetail,
} from "@/lib/api/documents";
import type { DocumentStatus } from "@/types/document";

const STATUS_FILTERS: { label: string; value: DocumentStatus | "" }[] = [
    { label: "All statuses", value: "" },
    { label: "Pending review", value: "pending-review" },
    { label: "Verified", value: "verified" },
    { label: "Rejected", value: "rejected" },
];

export default function DocumentsPage() {
    const [documents, setDocuments] = React.useState<
        EmployeeDocumentWithDetail[]
    >([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const [statusFilter, setStatusFilter] = React.useState<DocumentStatus | "">(
        "pending-review",
    );
    const [actingId, setActingId] = React.useState<string | null>(null);
    const [downloadingId, setDownloadingId] = React.useState<string | null>(
        null,
    );
    const [rejectTarget, setRejectTarget] =
        React.useState<EmployeeDocumentWithDetail | null>(null);
    const [isRejecting, setIsRejecting] = React.useState(false);

    async function loadDocuments() {
        setIsLoading(true);
        try {
            const { documents: fetched } = await getDocuments({
                limit: 100,
                ...(statusFilter && { status: statusFilter }),
            });
            setDocuments(fetched);
        } catch {
            toast.error("Couldn't load documents.");
        } finally {
            setIsLoading(false);
        }
    }

    React.useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect -- known FP on async fetch fns
        loadDocuments();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [statusFilter]);

    async function handleVerify(doc: EmployeeDocumentWithDetail) {
        setActingId(doc.id);
        try {
            await reviewDocument(doc.id, "VERIFIED");
            toast.success(`${doc.fileName} verified.`);
            await loadDocuments();
        } catch {
            toast.error("Couldn't verify this document. Try again.");
        } finally {
            setActingId(null);
        }
    }

    async function handleConfirmReject(reason: string) {
        if (!rejectTarget) return;

        setIsRejecting(true);
        try {
            await reviewDocument(rejectTarget.id, "REJECTED", reason);
            toast.success(`${rejectTarget.fileName} rejected.`);
            setRejectTarget(null);
            await loadDocuments();
        } catch {
            toast.error("Couldn't reject this document. Try again.");
        } finally {
            setIsRejecting(false);
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
        <DashboardLayout title="Documents">
            <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <PageHeader
                        title="Documents"
                        description="Review employee-submitted IDs, contracts, and other files"
                    />
                    <Select
                        value={statusFilter}
                        onChange={(e) =>
                            setStatusFilter(e.target.value as DocumentStatus | "")
                        }
                    >
                        {STATUS_FILTERS.map((f) => (
                            <option key={f.value} value={f.value}>
                                {f.label}
                            </option>
                        ))}
                    </Select>
                </div>

                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Employee</TableHead>
                            <TableHead>File</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Uploaded</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">
                                Actions
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableEmpty colSpan={6}>
                                Loading documents...
                            </TableEmpty>
                        ) : documents.length === 0 ? (
                            <TableEmpty colSpan={6}>
                                No documents match this filter.
                            </TableEmpty>
                        ) : (
                            documents.map((doc) => (
                                <TableRow key={doc.id}>
                                    <TableCell>
                                        <p className="font-body text-sm font-medium text-primary-dark">
                                            {doc.employeeName ?? "—"}
                                        </p>
                                        <p className="font-body text-xs text-neutral">
                                            {doc.employeeCode}
                                        </p>
                                    </TableCell>

                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <FileText className="h-4 w-4 text-neutral" />
                                            <span className="font-body text-sm text-primary-dark">
                                                {doc.fileName}
                                            </span>
                                        </div>
                                    </TableCell>

                                    <TableCell className="text-neutral">
                                        {doc.type}
                                    </TableCell>

                                    <TableCell className="text-neutral">
                                        {new Date(
                                            doc.uploadedAt,
                                        ).toLocaleDateString("en-US", {
                                            month: "short",
                                            day: "numeric",
                                            year: "numeric",
                                        })}
                                    </TableCell>

                                    <TableCell>
                                        <DocumentStatusBadge
                                            status={doc.status}
                                        />
                                        {doc.status === "rejected" &&
                                            doc.rejectionReason && (
                                                <p className="mt-1 font-body text-xs text-danger">
                                                    {doc.rejectionReason}
                                                </p>
                                            )}
                                    </TableCell>

                                    <TableCell>
                                        <div className="flex items-center justify-end gap-2">
                                            {doc.status ===
                                                "pending-review" && (
                                                <>
                                                    <Button
                                                        variant="primary"
                                                        size="sm"
                                                        loading={
                                                            actingId ===
                                                            doc.id
                                                        }
                                                        onClick={() =>
                                                            handleVerify(doc)
                                                        }
                                                    >
                                                        <Check className="h-4 w-4" />
                                                        Verify
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() =>
                                                            setRejectTarget(
                                                                doc,
                                                            )
                                                        }
                                                    >
                                                        <X className="h-4 w-4" />
                                                        Reject
                                                    </Button>
                                                </>
                                            )}
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-8 w-8 p-0"
                                                loading={
                                                    downloadingId === doc.id
                                                }
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
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            <RejectReasonModal
                open={!!rejectTarget}
                onOpenChange={(open) => {
                    if (!open) setRejectTarget(null);
                }}
                title="Reason for rejecting"
                description={
                    rejectTarget
                        ? `This will reject "${rejectTarget.fileName}" and notify the employee.`
                        : undefined
                }
                onSubmit={handleConfirmReject}
                isSubmitting={isRejecting}
            />
        </DashboardLayout>
    );
}