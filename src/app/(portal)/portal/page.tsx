import { PortalLayout } from "@/components/portal/PortalLayout";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { StatusBadge } from "@/components/employee/StatusBadge";

const mockEmployee = {
    name: "Satria Wijaya",
    role: "Frontend Developer",
    department: "Engineering",
    status: "Active" as const,
    initials: "SW",
};

const mockStats = [
    { label: "Employment Status", value: "Active" },
    { label: "Leave Balance", value: "12 days" },
    { label: "Department", value: "Engineering" },
    { label: "This Month Pay", value: "Rp 9.000.000" },
];

const mockLeave = [
    {
        type: "Annual",
        days: 2,
        startDate: "2024-12-24",
        endDate: "2024-12-25",
        status: "Approved",
    },
    {
        type: "Sick",
        days: 1,
        startDate: "2024-11-10",
        endDate: "2024-11-10",
        status: "Approved",
    },
];

function formatRupiah(amount: number) {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);
}

const mockPayslip = {
    period: "January 2025",
    baseSalary: 8000000,
    allowances: 1500000,
    deductions: 500000,
    netPay: 9000000,
};

export default function PortalDashboardPage() {
    return (
        <PortalLayout title="My Dashboard">
            <div className="flex flex-col gap-6">
                {/* Welcome banner */}
                <div
                    className="flex items-center gap-4 rounded-xl px-5 py-5"
                    style={{ background: "#15803D" }}
                >
                    <div
                        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full font-heading text-base font-bold text-base-white"
                        style={{ background: "rgba(255,255,255,0.2)" }}
                    >
                        {mockEmployee.initials}
                    </div>
                    <div className="min-w-0">
                        <p
                            className="font-body text-sm"
                            style={{ color: "rgba(255,255,255,0.75)" }}
                        >
                            Welcome back
                        </p>
                        <h1 className="font-heading text-xl font-bold text-base-white truncate">
                            {mockEmployee.name}
                        </h1>
                        <p
                            className="font-body text-sm truncate"
                            style={{ color: "rgba(255,255,255,0.75)" }}
                        >
                            {mockEmployee.role} · {mockEmployee.department}
                        </p>
                    </div>
                    <div className="ml-auto shrink-0">
                        <StatusBadge status={mockEmployee.status} />
                    </div>
                </div>

                {/* Quick stats */}
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(2, 1fr)",
                        gap: "1rem",
                    }}
                >
                    {mockStats.map((s) => (
                        <Card key={s.label}>
                            <CardContent className="px-4 py-4">
                                <p className="font-body text-xs text-neutral">
                                    {s.label}
                                </p>
                                <p className="font-heading mt-1 text-base font-bold text-primary-dark">
                                    {s.value}
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Cards row */}
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns:
                            "repeat(auto-fit, minmax(280px, 1fr))",
                        gap: "1rem",
                    }}
                >
                    {/* Latest pay slip */}
                    <Card>
                        <CardContent className="px-5 py-5">
                            <div className="mb-4 flex items-center justify-between">
                                <p className="font-heading text-sm font-semibold text-primary-dark">
                                    Latest Pay Slip
                                </p>
                                <Badge variant="success" dot>
                                    Paid
                                </Badge>
                            </div>
                            <p className="font-body text-xs text-neutral mb-3">
                                {mockPayslip.period}
                            </p>
                            <div className="flex flex-col gap-2">
                                <div className="flex justify-between font-body text-sm">
                                    <span className="text-neutral">
                                        Base salary
                                    </span>
                                    <span className="text-primary-dark">
                                        {formatRupiah(mockPayslip.baseSalary)}
                                    </span>
                                </div>
                                <div className="flex justify-between font-body text-sm">
                                    <span className="text-neutral">
                                        Allowances
                                    </span>
                                    <span className="text-success">
                                        +{formatRupiah(mockPayslip.allowances)}
                                    </span>
                                </div>
                                <div className="flex justify-between font-body text-sm">
                                    <span className="text-neutral">
                                        Deductions
                                    </span>
                                    <span className="text-danger">
                                        -{formatRupiah(mockPayslip.deductions)}
                                    </span>
                                </div>
                                <div className="flex justify-between border-t border-neutral/10 pt-2 font-heading text-sm font-bold">
                                    <span className="text-primary-dark">
                                        Net Pay
                                    </span>
                                    <span className="text-primary">
                                        {formatRupiah(mockPayslip.netPay)}
                                    </span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Recent leave */}
                    <Card>
                        <CardContent className="px-5 py-5">
                            <div className="mb-4 flex items-center justify-between">
                                <p className="font-heading text-sm font-semibold text-primary-dark">
                                    Recent Leave
                                </p>
                                <Badge variant="info">12 days left</Badge>
                            </div>
                            <div className="flex flex-col gap-3">
                                {mockLeave.map((l, i) => (
                                    <div
                                        key={i}
                                        className="flex items-center justify-between"
                                    >
                                        <div>
                                            <p className="font-body text-sm font-medium text-primary-dark">
                                                {l.type} Leave · {l.days} day
                                                {l.days > 1 ? "s" : ""}
                                            </p>
                                            <p className="font-body text-xs text-neutral">
                                                {new Date(
                                                    l.startDate,
                                                ).toLocaleDateString("en-US", {
                                                    month: "short",
                                                    day: "numeric",
                                                    year: "numeric",
                                                })}
                                            </p>
                                        </div>
                                        <Badge variant="success" dot>
                                            {l.status}
                                        </Badge>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </PortalLayout>
    );
}
