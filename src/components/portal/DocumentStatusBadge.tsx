import { Badge } from "@/components/ui/Badge";
import type { DocumentStatus } from "@/types/document";

const statusMap: Record<
    DocumentStatus,
    { variant: "success" | "warning" | "danger"; label: string }
> = {
    "pending-review": { variant: "warning", label: "Pending review" },
    verified: { variant: "success", label: "Verified" },
    rejected: { variant: "danger", label: "Rejected" },
};

export function DocumentStatusBadge({ status }: { status: DocumentStatus }) {
    const { variant, label } = statusMap[status];
    return (
        <Badge variant={variant} dot>
            {label}
        </Badge>
    );
}
