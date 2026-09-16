import { Badge } from "@/components/ui/Badge";
import type { AttendanceStatus } from "@/types/attendance";

const statusMap: Record<
    AttendanceStatus,
    {
        variant: "success" | "warning" | "danger" | "info" | "neutral";
        label: string;
    }
> = {
    "on-time": { variant: "success", label: "On time" },
    late: { variant: "warning", label: "Late" },
    absent: { variant: "danger", label: "Absent" },
    "on-leave": { variant: "warning", label: "On leave" },
};

export function AttendanceStatusBadge({
    status,
}: {
    status: AttendanceStatus;
}) {
    const { variant, label } = statusMap[status];
    return (
        <Badge variant={variant} dot>
            {label}
        </Badge>
    );
}