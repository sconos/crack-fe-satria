import { FileText } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import { DocumentStatusBadge } from "@/components/portal/DocumentStatusBadge";
import { getDocumentsForEmployee } from "@/lib/mock-data/documents";

export function ProfileDocumentsTab({ employeeId }: { employeeId: string }) {
    const documents = getDocumentsForEmployee(employeeId);

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
                        <DocumentStatusBadge status={doc.status} />
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}