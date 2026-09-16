import Link from "next/link";
import { Pencil, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/employee/StatusBadge";
import { cn } from "@/lib/util";
import type { Employee } from "@/types/employee";
import { Avatar } from "@/components/ui/Avatar";

interface EmployeeProfileHeaderProps {
    employee: Employee;
    className?: string;
}

function getInitials(name: string) {
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function EmployeeProfileHeader({
    employee,
    className,
}: EmployeeProfileHeaderProps) {
    return (
        <div className={cn("flex flex-col gap-6", className)}>
            {/* Back link */}
            <Link
                href="/employees"
                className="inline-flex items-center gap-1.5 font-body text-sm text-neutral hover:text-primary-dark"
            >
                <ArrowLeft className="h-4 w-4" />
                Back to Employees
            </Link>

            {/* Profile header card */}
            <div className="flex flex-col gap-4 rounded-xl border border-neutral/15 bg-base-white p-6 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                    {/* Avatar */}
                    <Avatar
                        initials={getInitials(employee.name)}
                        src={employee.avatar}
                        size="xl"
                    />

                    {/* Info */}
                    <div className="flex flex-col gap-1">
                        <h1 className="font-heading text-xl font-bold text-primary-dark">
                            {employee.name}
                        </h1>
                        <p className="font-body text-sm text-neutral">
                            {employee.role} · {employee.department}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5">
                            <StatusBadge status={employee.status} />
                            <span className="font-body text-xs text-neutral">
                                Joined{" "}
                                {new Date(employee.joinDate).toLocaleDateString(
                                    "en-US",
                                    {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                    },
                                )}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Action */}
                <Link href={`/employees/${employee.id}/edit`}>
                    <Button variant="outline" size="sm">
                        <Pencil className="h-4 w-4" />
                        Edit Profile
                    </Button>
                </Link>
            </div>
        </div>
    );
}

export { EmployeeProfileHeader };
