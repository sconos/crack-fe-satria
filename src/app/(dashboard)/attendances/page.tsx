"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Card, CardContent } from "@/components/ui/Card";
import {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableHead,
    TableCell,
    TableEmpty,
} from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { toast } from "@/components/ui/Toast";
import { cn } from "@/lib/util";

type AttendanceStatus = "On time" | "Late" | "Absent" | "On leave" | "Remote";
type BadgeVariant = "success" | "warning" | "danger" | "info" | "neutral";

type AttendanceRecord = {
    id: string;
    name: string;
    initials: string;
    department: string;
    clockIn: string | null;
    clockOut: string | null;
    hours: string;
    status: AttendanceStatus;
};

type CorrectionRequest = {
    id: string;
    name: string;
    initials: string;
    department: string;
    date: string;
    type: "Missed clock-out" | "Wrong clock-in time" | "Manual entry";
    requested: string;
    reason: string;
};

const badgeVariant: Record<AttendanceStatus, BadgeVariant> = {
    "On time": "success",
    Late: "warning",
    Absent: "danger",
    "On leave": "warning",
    Remote: "info",
};

const departments = [
    "All departments",
    "Engineering",
    "Product Design",
    "People Ops",
    "Finance",
];

const initialRecords: AttendanceRecord[] = [
    {
        id: "1",
        name: "Amara Yuwono",
        initials: "AY",
        department: "Product Design",
        clockIn: "08:52",
        clockOut: "17:41",
        hours: "8h 49m",
        status: "On time",
    },
    {
        id: "2",
        name: "Bagas Wirawan",
        initials: "BW",
        department: "Engineering",
        clockIn: "09:14",
        clockOut: "18:02",
        hours: "8h 48m",
        status: "Late",
    },
    {
        id: "3",
        name: "Citra Salsabila",
        initials: "CS",
        department: "People Ops",
        clockIn: null,
        clockOut: null,
        hours: "—",
        status: "On leave",
    },
    {
        id: "4",
        name: "Dimas Prakoso",
        initials: "DP",
        department: "Finance",
        clockIn: null,
        clockOut: null,
        hours: "—",
        status: "Absent",
    },
    {
        id: "5",
        name: "Elang Nararya",
        initials: "EN",
        department: "Engineering",
        clockIn: "08:47",
        clockOut: "17:30",
        hours: "8h 43m",
        status: "On time",
    },
    {
        id: "6",
        name: "Farah Az-Zahra",
        initials: "FA",
        department: "Engineering",
        clockIn: "09:01",
        clockOut: "—",
        hours: "—",
        status: "Remote",
    },
    {
        id: "7",
        name: "Guntur Aditama",
        initials: "GA",
        department: "Product Design",
        clockIn: "09:22",
        clockOut: "18:10",
        hours: "8h 48m",
        status: "Late",
    },
    {
        id: "8",
        name: "Hana Puspita",
        initials: "HP",
        department: "People Ops",
        clockIn: "08:55",
        clockOut: "17:38",
        hours: "8h 43m",
        status: "On time",
    },
];

const initialApprovals: CorrectionRequest[] = [
    {
        id: "a1",
        name: "Farah Az-Zahra",
        initials: "FA",
        department: "Engineering",
        date: "Jul 7, 2026",
        type: "Missed clock-out",
        requested: "Clock-out at 18:15",
        reason: "Forgot to tap out after a client call ran late.",
    },
    {
        id: "a2",
        name: "Guntur Aditama",
        initials: "GA",
        department: "Product Design",
        date: "Jul 6, 2026",
        type: "Wrong clock-in time",
        requested: "Clock-in at 08:58 instead of 09:22",
        reason: "Badge reader was down at the front desk this morning.",
    },
    {
        id: "a3",
        name: "Dimas Prakoso",
        initials: "DP",
        department: "Finance",
        date: "Jul 8, 2026",
        type: "Manual entry",
        requested: "Full day, on site",
        reason: "Worked from the Surabaya office, no badge access there yet.",
    },
];

function StatCard({
    label,
    value,
    accent,
}: {
    label: string;
    value: string;
    accent: string;
}) {
    return (
        <Card className={cn("border-l-4", accent)}>
            <CardContent>
                <p className="font-heading text-2xl font-bold text-primary-dark">
                    {value}
                </p>
                <p className="mt-1 text-xs text-neutral">{label}</p>
            </CardContent>
        </Card>
    );
}

function Avatar({ initials }: { initials: string }) {
    return (
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-tint text-xs font-heading font-semibold text-primary-dark ring-1 ring-inset ring-primary/10">
            {initials}
        </span>
    );
}

export default function AttendancePage() {
    const [tab, setTab] = useState<"log" | "approvals">("log");
    const [search, setSearch] = useState("");
    const [department, setDepartment] = useState("All departments");
    const [statusFilter, setStatusFilter] = useState<"All" | AttendanceStatus>(
        "All",
    );
    const [approvals, setApprovals] = useState(initialApprovals);

    const filteredRecords = useMemo(() => {
        return initialRecords.filter((r) => {
            const matchesSearch = r.name
                .toLowerCase()
                .includes(search.toLowerCase());
            const matchesDept =
                department === "All departments" || r.department === department;
            const matchesStatus =
                statusFilter === "All" || r.status === statusFilter;
            return matchesSearch && matchesDept && matchesStatus;
        });
    }, [search, department, statusFilter]);

    const stats = useMemo(() => {
        const present = initialRecords.filter(
            (r) => r.status === "On time" || r.status === "Remote",
        ).length;
        const late = initialRecords.filter((r) => r.status === "Late").length;
        const absent = initialRecords.filter(
            (r) => r.status === "Absent",
        ).length;
        const onLeave = initialRecords.filter(
            (r) => r.status === "On leave",
        ).length;
        return { present, late, absent, onLeave };
    }, []);

    function handleApprove(request: CorrectionRequest) {
        setApprovals((prev) => prev.filter((a) => a.id !== request.id));
        toast.success(`Approved ${request.name}'s correction`);
    }

    function handleReject(request: CorrectionRequest) {
        setApprovals((prev) => prev.filter((a) => a.id !== request.id));
        toast.error(`Rejected ${request.name}'s correction`);
    }

    return (
        <DashboardLayout title="Attendance">
            <div className="flex flex-col gap-6">
                <PageHeader
                    title="Attendance"
                    description="Track daily attendance and review correction requests"
                    action={<Button variant="outline">Export CSV</Button>}
                />

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                    <StatCard
                        label="Present today"
                        value={String(stats.present)}
                        accent="border-l-primary"
                    />
                    <StatCard
                        label="Late"
                        value={String(stats.late)}
                        accent="border-l-warning"
                    />
                    <StatCard
                        label="Absent"
                        value={String(stats.absent)}
                        accent="border-l-danger"
                    />
                    <StatCard
                        label="On leave"
                        value={String(stats.onLeave)}
                        accent="border-l-secondary"
                    />
                </div>

                {/* Tabs */}
                <div className="flex items-center gap-6 border-b border-neutral/10">
                    <button
                        type="button"
                        onClick={() => setTab("log")}
                        className={cn(
                            "relative pb-3 text-sm font-medium transition-colors",
                            tab === "log"
                                ? "text-primary-dark"
                                : "text-neutral hover:text-primary-dark",
                        )}
                    >
                        Daily log
                        {tab === "log" && (
                            <span className="absolute -bottom-px left-0 h-0.5 w-full bg-primary" />
                        )}
                    </button>
                    <button
                        type="button"
                        onClick={() => setTab("approvals")}
                        className={cn(
                            "relative flex items-center gap-2 pb-3 text-sm font-medium transition-colors",
                            tab === "approvals"
                                ? "text-primary-dark"
                                : "text-neutral hover:text-primary-dark",
                        )}
                    >
                        Approvals
                        {approvals.length > 0 && (
                            <Badge variant="warning">{approvals.length}</Badge>
                        )}
                        {tab === "approvals" && (
                            <span className="absolute -bottom-px left-0 h-0.5 w-full bg-primary" />
                        )}
                    </button>
                </div>

                {/* Daily log */}
                {tab === "log" && (
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                            <Input
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search by name"
                                leftIcon={<Search className="h-4 w-4" />}
                                className="sm:w-64"
                            />
                            <Select
                                value={department}
                                onChange={(e) => setDepartment(e.target.value)}
                                className="sm:w-48"
                            >
                                {departments.map((d) => (
                                    <option key={d} value={d}>
                                        {d}
                                    </option>
                                ))}
                            </Select>
                            <Select
                                value={statusFilter}
                                onChange={(e) =>
                                    setStatusFilter(
                                        e.target.value as
                                            | "All"
                                            | AttendanceStatus,
                                    )
                                }
                                className="sm:w-48"
                            >
                                <option value="All">All statuses</option>
                                <option value="On time">On time</option>
                                <option value="Late">Late</option>
                                <option value="Absent">Absent</option>
                                <option value="On leave">On leave</option>
                                <option value="Remote">Remote</option>
                            </Select>
                        </div>

                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Employee</TableHead>
                                    <TableHead>Department</TableHead>
                                    <TableHead>Clock in</TableHead>
                                    <TableHead>Clock out</TableHead>
                                    <TableHead>Hours</TableHead>
                                    <TableHead>Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredRecords.map((r) => (
                                    <TableRow key={r.id}>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <Avatar initials={r.initials} />
                                                <span className="font-medium text-primary-dark">
                                                    {r.name}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-neutral">
                                            {r.department}
                                        </TableCell>
                                        <TableCell className="text-neutral">
                                            {r.clockIn ?? "—"}
                                        </TableCell>
                                        <TableCell className="text-neutral">
                                            {r.clockOut ?? "—"}
                                        </TableCell>
                                        <TableCell className="text-neutral">
                                            {r.hours}
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant={badgeVariant[r.status]}
                                            >
                                                {r.status}
                                            </Badge>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {filteredRecords.length === 0 && (
                                    <TableEmpty colSpan={6}>
                                        No one matches these filters. Try a
                                        different search or clear a filter.
                                    </TableEmpty>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                )}

                {/* Approvals */}
                {tab === "approvals" && (
                    <div className="flex flex-col gap-4">
                        {approvals.length === 0 && (
                            <Card>
                                <CardContent className="py-10 text-center">
                                    <p className="text-sm font-medium text-primary-dark">
                                        Nothing waiting on you
                                    </p>
                                    <p className="mt-1 text-sm text-neutral">
                                        New attendance corrections will show up
                                        here as they come in.
                                    </p>
                                </CardContent>
                            </Card>
                        )}
                        {approvals.map((a) => (
                            <Card key={a.id}>
                                <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                    <div className="flex items-start gap-3">
                                        <Avatar initials={a.initials} />
                                        <div>
                                            <div className="flex flex-wrap items-center gap-2">
                                                <p className="text-sm font-medium text-primary-dark">
                                                    {a.name}
                                                </p>
                                                <span className="text-xs text-neutral">
                                                    {a.department} · {a.date}
                                                </span>
                                            </div>
                                            <p className="mt-1 text-xs font-medium uppercase tracking-wide text-secondary">
                                                {a.type}
                                            </p>
                                            <p className="mt-1 text-sm text-primary-dark">
                                                {a.requested}
                                            </p>
                                            <p className="mt-1 text-sm text-neutral">
                                                {a.reason}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex shrink-0 gap-2 sm:flex-col sm:items-end">
                                        <Button
                                            size="sm"
                                            onClick={() => handleApprove(a)}
                                        >
                                            Approve
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => handleReject(a)}
                                        >
                                            Reject
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
