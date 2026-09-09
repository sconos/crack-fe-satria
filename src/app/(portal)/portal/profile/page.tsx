import { PortalLayout } from "@/components/portal/PortalLayout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { StatusBadge } from "@/components/employee/StatusBadge";
import { Button } from "@/components/ui/Button";
import { getEmployeeById } from "@/lib/mock-data/employees";
import Link from "next/link";

// TODO: replace with the logged-in user's id once auth/session is wired up
const CURRENT_EMPLOYEE_ID = "1";

function getInitials(name: string) {
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export default function PortalProfilePage() {
    const employee = getEmployeeById(CURRENT_EMPLOYEE_ID);

    if (!employee) {
        return (
            <PortalLayout title="My Profile">
                <p className="text-sm text-neutral">
                    Couldn&apos;t load your profile. Please contact HR.
                </p>
            </PortalLayout>
        );
    }

    const employmentFields = [
        { label: "Department", value: employee.department },
        { label: "Role", value: employee.role },
        { label: "Employment type", value: employee.employmentType ?? "—" },
        { label: "Reports to", value: employee.manager ?? "—" },
        { label: "Work location", value: employee.workLocation ?? "—" },
        {
            label: "Join date",
            value: new Date(employee.joinDate).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
            }),
        },
    ];

    const personalFields = [
        { label: "Email", value: employee.email },
        { label: "Phone", value: employee.phone ?? "—" },
        { label: "Address", value: employee.address ?? "—" },
        {
            label: "Date of birth",
            value: employee.dateOfBirth
                ? new Date(employee.dateOfBirth).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                  })
                : "—",
        },
        { label: "National ID", value: employee.nationalId ?? "—" },
    ];

    const emergencyFields = [
        { label: "Contact name", value: employee.emergencyContactName ?? "—" },
        {
            label: "Contact phone",
            value: employee.emergencyContactPhone ?? "—",
        },
    ];

    function FieldGrid({
        fields,
    }: {
        fields: { label: string; value: string }[];
    }) {
        return (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                {fields.map((f) => (
                    <div key={f.label} className="flex flex-col gap-1">
                        <dt className="font-body text-xs font-medium text-neutral">
                            {f.label}
                        </dt>
                        <dd className="font-body text-sm text-primary-dark">
                            {f.value}
                        </dd>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <PortalLayout title="My Profile">
            <div className="flex flex-col gap-6">
                {/* Header */}
                <Card>
                    <CardContent className="px-6 py-6">
                        <div className="flex flex-col items-center gap-3 text-center sm:flex-row sm:items-center sm:justify-between sm:text-left">
                            <div className="flex flex-col items-center gap-3 sm:flex-row">
                                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-primary font-heading text-xl font-bold text-base-white">
                                    {getInitials(employee.name)}
                                </div>
                                <div>
                                    <h1 className="font-heading text-xl font-bold text-primary-dark">
                                        {employee.name}
                                    </h1>
                                    <p className="font-body text-sm text-neutral">
                                        {employee.role} · {employee.department}
                                    </p>
                                    <div className="mt-1.5">
                                        <StatusBadge status={employee.status} />
                                    </div>
                                </div>
                            </div>
                            <Link
                                href="/portal/profile/edit"
                                className="shrink-0"
                            >
                                <Button variant="outline" size="sm">
                                    Edit profile
                                </Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>

                {/* Employment info */}
                <Card>
                    <CardHeader>
                        <CardTitle>Employment</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <FieldGrid fields={employmentFields} />
                    </CardContent>
                </Card>

                {/* Personal info — self-editable per PRD §8.1 */}
                <Card>
                    <CardHeader>
                        <CardTitle>Personal information</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <FieldGrid fields={personalFields} />
                    </CardContent>
                </Card>

                {/* Emergency contact — self-editable per PRD §8.1 */}
                <Card>
                    <CardHeader>
                        <CardTitle>Emergency contact</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <FieldGrid fields={emergencyFields} />
                    </CardContent>
                </Card>
            </div>
        </PortalLayout>
    );
}
