"use client";

import * as React from "react";
import { FileText, Download } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { toast } from "@/components/ui/Toast";
import { DocumentStatusBadge } from "@/components/portal/DocumentStatusBadge";
import {
    getDocuments,
    reviewDocument,
    downloadDocument,
    type EmployeeDocumentWithDetail,
} from "@/lib/api/documents";

export function ProfileDocumentsTab({ employeeId }: { employeeId: string }) {
    const [documents, setDocuments] = React.useState<
        EmployeeDocumentWithDetail[]
    >([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const [actioningId, setActioningId] = React.useState<string | null>(null);

    React.useEffect(() => {
        let cancelled = false;

        async function load() {
            try {
                const { documents: fetched } = await getDocuments({
                    employeeId,
                    limit: 100,
                });
                if (!cancelled) setDocuments(fetched);
            } catch {
                if (!cancelled) toast.error("Couldn't load documents.");
            } finally {
                if (!cancelled) setIsLoading(false);
            }
        }

        load();
        return () => {
            cancelled = true;
        };
    }, [employeeId]);

    async function handleVerify(id: string) {
        setActioningId(id);
        try {
            const updated = await reviewDocument(id, "VERIFIED");
            setDocuments((prev) =>
                prev.map((d) => (d.id === id ? updated : d)),
            );
            toast.success("Document verified");
        } catch {
            toast.error("Couldn't verify document. Try again.");
        } finally {
            setActioningId(null);
        }
    }

    async function handleReject(id: string) {
        const reason = window.prompt("Reason for rejecting this document?");
        if (!reason || !reason.trim()) return;

        setActioningId(id);
        try {
            const updated = await reviewDocument(id, "REJECTED", reason.trim());
            setDocuments((prev) =>
                prev.map((d) => (d.id === id ? updated : d)),
            );
            toast.error("Document rejected");
        } catch {
            toast.error("Couldn't reject document. Try again.");
        } finally {
            setActioningId(null);
        }
    }

    async function handleDownload(doc: EmployeeDocumentWithDetail) {
        try {
            await downloadDocument(doc.id, doc.fileName);
        } catch {
            toast.error("Couldn't download document. Try again.");
        }
    }

    if (isLoading) {
        return (
            <p className="px-5 py-10 text-center text-sm text-neutral">
                Loading documents...
            </p>
        );
    }

    if (documents.length === 0) {
        return (
            <Card>
                <CardContent className="flex flex-col items-center gap-1 py-16 text-center">
                    <p className="text-sm font-medium text-primary-dark">
                        No documents on file
                    </p>
                    <p className="max-w-sm text-sm text-neutral">
                        This employee hasn&apos;t uploaded any documents yet.
                    </p>
                </CardContent>
            </Card>
        );
    }

    return (
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
                                    {new Date(doc.uploadedAt).toLocaleDateString(
                                        "en-US",
                                        { month: "short", day: "numeric", year: "numeric" },
                                    )}
                                </p>
                            </div>
                        </div>
                        <div className="flex shrink-0 items-center gap-2">
                            <DocumentStatusBadge status={doc.status} />
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0"
                                onClick={() => handleDownload(doc)}
                            >
                                <Download className="h-4 w-4" />
                                <span className="sr-only">
                                    Download {doc.fileName}
                                </span>
                            </Button>
                            {doc.status === "pending-review" && (
                                <>
                                    <Button
                                        size="sm"
                                        loading={actioningId === doc.id}
                                        onClick={() => handleVerify(doc.id)}
                                    >
                                        Verify
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        loading={actioningId === doc.id}
                                        onClick={() => handleReject(doc.id)}
                                    >
                                        Reject
                                    </Button>
                                </>
                            )}
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}