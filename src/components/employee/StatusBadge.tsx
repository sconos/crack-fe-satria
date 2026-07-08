import { Badge } from "@/components/ui/Badge";

type EmployeeStatus = "Active" | "Inactive" | "On Leave" | "Probation";

const statusMap: Record<
    EmployeeStatus,
    { variant: "success" | "danger" | "warning" | "info"; label: string }
> = {
    Active: { variant: "success", label: "Active" },
    Inactive: { variant: "danger", label: "Inactive" },
    "On Leave": { variant: "warning", label: "On Leave" },
    Probation: { variant: "info", label: "Probation" },
};

interface StatusBadgeProps {
    status: EmployeeStatus;
}

function StatusBadge({ status }: StatusBadgeProps) {
    const { variant, label } = statusMap[status];
    return (
        <Badge variant={variant} dot>
            {label}
        </Badge>
    );
}

export { StatusBadge, type EmployeeStatus };
