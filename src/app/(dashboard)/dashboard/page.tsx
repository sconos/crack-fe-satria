import Link from "next/link";
import {
    Users,
    Clock,
    CalendarClock,
    ClipboardCheck,
    ArrowRight,
} from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/util";

type BadgeVariant = "success" | "warning" | "danger" | "info" | "neutral";

type ActivityItem = {
    id: string;
    name: string;
    initials: string;
    action: string;
    detail: string;
    time: string;
    variant: BadgeVariant;
    tag: string;
};

const activity: ActivityItem[] = [
    {
        id: "1",
        name: "Farah Az-Zahra",
        initials: "FA",
        action: "requested a correction",
        detail: "Missed clock-out on Jul 7",
        time: "2h ago",
        variant: "warning",
        tag: "Attendance",
    },
    {
        id: "2",
        name: "Rina Hartati",
        initials: "RH",
        action: "was marked inactive",
        detail: "Sales · last day Jul 5",
        time: "5h ago",
        variant: "neutral",
        tag: "Employee",
    },
    {
        id: "3",
        name: "Budi Santoso",
        initials: "BS",
        action: "completed probation review",
        detail: "Engineering · moved to Active",
        time: "1d ago",
        variant: "success",
        tag: "Employee",
    },
    {
        id: "4",
        name: "Jane Doe",
        initials: "JD",
        action: "approved 2 leave requests",
        detail: "Human Resources",
        time: "1d ago",
        variant: "info",
        tag: "Approval",
    },
];

const departmentBreakdown = [
    { label: "Engineering", count: 14, color: "bg-primary" },
    { label: "Product Design", count: 6, color: "bg-secondary" },
    { label: "Human Resources", count: 3, color: "bg-warning" },
    { label: "Sales", count: 5, color: "bg-danger" },
    { label: "Finance", count: 4, color: "bg-neutral" },
];

const upcomingLeave = [
    {
        name: "Citra Salsabila",
        initials: "CS",
        range: "Jul 8 – Jul 10",
        type: "Annual leave",
    },
    {
        name: "Dimas Prakoso",
        initials: "DP",
        range: "Jul 9",
        type: "Sick leave",
    },
];

function StatCard({
    icon: Icon,
    label,
    value,
    href,
}: {
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    value: string;
    href?: string;
}) {
    const content = (
        <Card className="transition-shadow hover:shadow-md">
            <CardContent className="flex items-center justify-between">
                <div>
                    <p className="text-xs text-neutral">{label}</p>
                    <p className="mt-1 font-heading text-2xl font-bold text-primary-dark">
                        {value}
                    </p>
                </div>
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-tint text-primary">
                    <Icon className="h-5 w-5" />
                </span>
            </CardContent>
        </Card>
    );

    return href ? <Link href={href}>{content}</Link> : content;
}

function Avatar({ initials }: { initials: string }) {
    return (
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-tint text-xs font-heading font-semibold text-primary-dark ring-1 ring-inset ring-primary/10">
            {initials}
        </span>
    );
}

export default function DashboardPage() {
    const totalEmployees = departmentBreakdown.reduce(
        (sum, d) => sum + d.count,
        0,
    );
    const maxDeptCount = Math.max(...departmentBreakdown.map((d) => d.count));

    return (
        <DashboardLayout title="Dashboard">
            <div className="flex flex-col gap-6">
                <PageHeader
                    title="Dashboard"
                    description="Here's what's happening across your team today"
                />

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                    <StatCard
                        icon={Users}
                        label="Total employees"
                        value={String(totalEmployees)}
                        href="/employees"
                    />
                    <StatCard
                        icon={Clock}
                        label="Present today"
                        value="19"
                        href="/attendance"
                    />
                    <StatCard
                        icon={CalendarClock}
                        label="On leave"
                        value="2"
                        href="/attendance"
                    />
                    <StatCard
                        icon={ClipboardCheck}
                        label="Pending approvals"
                        value="3"
                        href="/attendance"
                    />
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Recent activity */}
                    <Card className="lg:col-span-2">
                        <CardHeader className="flex-row items-center justify-between">
                            <CardTitle>Recent activity</CardTitle>
                            <Link
                                href="/employees"
                                className="flex items-center gap-1 text-xs font-medium text-secondary hover:underline"
                            >
                                View all
                                <ArrowRight className="h-3 w-3" />
                            </Link>
                        </CardHeader>
                        <CardContent className="flex flex-col divide-y divide-neutral/10 p-0">
                            {activity.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex items-start gap-3 px-5 py-4"
                                >
                                    <Avatar initials={item.initials} />
                                    <div className="flex-1">
                                        <p className="text-sm text-primary-dark">
                                            <span className="font-medium">
                                                {item.name}
                                            </span>{" "}
                                            {item.action}
                                        </p>
                                        <p className="mt-0.5 text-xs text-neutral">
                                            {item.detail}
                                        </p>
                                    </div>
                                    <div className="flex shrink-0 flex-col items-end gap-1.5">
                                        <Badge variant={item.variant}>
                                            {item.tag}
                                        </Badge>
                                        <span className="text-xs text-neutral">
                                            {item.time}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    {/* Side column */}
                    <div className="flex flex-col gap-6">
                        {/* Department breakdown */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Team by department</CardTitle>
                            </CardHeader>
                            <CardContent className="flex flex-col gap-3">
                                {departmentBreakdown.map((d) => (
                                    <div key={d.label}>
                                        <div className="flex items-center justify-between text-xs">
                                            <span className="text-primary-dark">
                                                {d.label}
                                            </span>
                                            <span className="text-neutral">
                                                {d.count}
                                            </span>
                                        </div>
                                        <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-neutral/10">
                                            <div
                                                className={cn(
                                                    "h-full rounded-full",
                                                    d.color,
                                                )}
                                                style={{
                                                    width: `${(d.count / maxDeptCount) * 100}%`,
                                                }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                        {/* Upcoming leave */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Upcoming leave</CardTitle>
                            </CardHeader>
                            <CardContent className="flex flex-col gap-4">
                                {upcomingLeave.map((l) => (
                                    <div
                                        key={l.name}
                                        className="flex items-center gap-3"
                                    >
                                        <Avatar initials={l.initials} />
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-primary-dark">
                                                {l.name}
                                            </p>
                                            <p className="text-xs text-neutral">
                                                {l.type}
                                            </p>
                                        </div>
                                        <span className="text-xs text-neutral">
                                            {l.range}
                                        </span>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                        {/* Quick action */}
                        <Link href="/employees/new">
                            <Button className="w-full" variant="outline">
                                Add employee
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
