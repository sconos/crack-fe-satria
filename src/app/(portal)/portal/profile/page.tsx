import { PortalLayout } from "@/components/portal/PortalLayout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { StatusBadge } from "@/components/employee/StatusBadge";

const mockEmployee = {
    name: "Satria Wijaya",
    email: "satria@koru.com",
    phone: "+62 812 3456 7890",
    department: "Engineering",
    role: "Frontend Developer",
    status: "Active" as const,
    joinDate: "2024-01-15",
    initials: "SW",
};

const fields = [
    { label: "Full name", value: mockEmployee.name },
    { label: "Email", value: mockEmployee.email },
    { label: "Phone", value: mockEmployee.phone },
    { label: "Department", value: mockEmployee.department },
    { label: "Role", value: mockEmployee.role },
    {
        label: "Join date",
        value: new Date(mockEmployee.joinDate).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        }),
    },
];

export default function PortalProfilePage() {
    return (
        <PortalLayout title="My Profile">
            <div className="flex flex-col gap-6">
                {/* Header */}
                <Card>
                    <CardContent className="px-6 py-6">
                        <div className="flex flex-col items-center gap-3 text-center sm:flex-row sm:text-left">
                            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-primary font-heading text-xl font-bold text-base-white">
                                {mockEmployee.initials}
                            </div>
                            <div>
                                <h1 className="font-heading text-xl font-bold text-primary-dark">
                                    {mockEmployee.name}
                                </h1>
                                <p className="font-body text-sm text-neutral">
                                    {mockEmployee.role} ·{" "}
                                    {mockEmployee.department}
                                </p>
                                <div className="mt-1.5">
                                    <StatusBadge status={mockEmployee.status} />
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Info grid */}
                <Card>
                    <CardHeader>
                        <CardTitle>Personal Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <dl
                            style={{
                                display: "grid",
                                gridTemplateColumns:
                                    "repeat(auto-fit, minmax(200px, 1fr))",
                                gap: "1.25rem",
                            }}
                        >
                            {fields.map((f) => (
                                <div
                                    key={f.label}
                                    className="flex flex-col gap-1"
                                >
                                    <dt className="font-body text-xs font-medium text-neutral">
                                        {f.label}
                                    </dt>
                                    <dd className="font-body text-sm text-primary-dark">
                                        {f.value}
                                    </dd>
                                </div>
                            ))}
                        </dl>
                    </CardContent>
                </Card>
            </div>
        </PortalLayout>
    );
}
