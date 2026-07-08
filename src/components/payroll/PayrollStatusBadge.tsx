import { Badge } from "@/components/ui/Badge";
import type { PayrollStatus } from "@/types/payroll";

type BadgeVariant = "success" | "warning" | "info" | "danger" | "neutral";

const statusMap: Record<
    PayrollStatus,
    { variant: BadgeVariant; label: string }
> = {
    Paid: { variant: "success", label: "Paid" },
    Pending: { variant: "neutral", label: "Pending" },
    Processing: { variant: "info", label: "Processing" },
    Cancelled: { variant: "danger", label: "Cancelled" },
};

function PayrollStatusBadge({ status }: { status: PayrollStatus }) {
    const { variant, label } = statusMap[status];
    return (
        <Badge variant={variant} dot>
            {label}
        </Badge>
    );
}

export { PayrollStatusBadge };
