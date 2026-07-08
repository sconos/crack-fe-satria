import Link from "next/link";
import { ArrowLeft, Mail, Pencil } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import type { EmployeeProfile } from "@/types/employee-profile";

type BadgeVariant = "success" | "warning" | "danger" | "info" | "neutral";

const statusVariant: Record<EmployeeProfile["status"], BadgeVariant> = {
    Active: "success",
    "On Leave": "warning",
    Probation: "info",
    Inactive: "neutral",
};

function initialsOf(name: string) {
    return name
        .split(" ")
        .map((p) => p[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();
}

export function ProfileHeader({ employee }: { employee: EmployeeProfile }) {
    return (
        <div className="flex flex-col gap-4">
            <Link
                href="/employees"
                className="flex w-fit items-center gap-1.5 text-sm text-neutral transition-colors hover:text-primary-dark"
            >
                <ArrowLeft className="h-4 w-4" />
                Back to employees
            </Link>

            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div className="flex items-center gap-4">
                    <Avatar initials={initialsOf(employee.name)} size="xl" />
                    <div>
                        <div className="flex flex-wrap items-center gap-2">
                            <h1 className="font-heading text-2xl font-bold text-primary-dark">
                                {employee.name}
                            </h1>
                            <Badge variant={statusVariant[employee.status]}>
                                {employee.status}
                            </Badge>
                        </div>
                        <p className="mt-0.5 text-sm text-neutral">
                            {employee.role} · {employee.department}
                        </p>
                        <a
                            href={`mailto:${employee.email}`}
                            className="mt-1 flex items-center gap-1.5 text-xs text-secondary hover:underline"
                        >
                            <Mail className="h-3 w-3" />
                            {employee.email}
                        </a>
                    </div>
                </div>
                <Button variant="outline">
                    <Pencil className="h-4 w-4" />
                    Edit profile
                </Button>
            </div>
        </div>
    );
}
