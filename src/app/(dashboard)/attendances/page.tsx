"use client";

import * as React from "react";
import { Search } from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { StatCard } from "@/components/ui/StatCard";
import {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableHead,
    TableCell,
    TableEmpty,
} from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";
import { RejectReasonModal } from "@/components/ui/RejectReasonModal";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Badge } from "@/components/ui/Badge";
import { toast } from "@/components/ui/Toast";
import { AttendanceStatusBadge } from "@/components/attendance/AttendanceStatusBadge";
import { cn } from "@/lib/util";
import {
    getAttendance,
    type AttendanceRecordWithEmployee,
} from "@/lib/api/attendance";
import {
    getCorrectionRequests,
    reviewCorrectionRequest,
    type CorrectionListResult,
} from "@/lib/api/attendance-corrections";
import { getDepartments } from "@/lib/api/departments";
import { todayDateString } from "@/lib/api/mappers/attendance-mappers";
import { ApiError } from "@/lib/api/client";
import type { AttendanceStatus } from "@/types/attendance";
import type { AttendanceCorrectionRequest } from "@/types/attendance-correction";
import type { Department } from "@/types/department";

const ALL_DEPARTMENTS = "All departments";

const statusOptions: { label: string; value: "All" | AttendanceStatus }[] = [
    { label: "All statuses", value: "All" },
    { label: "On time", value: "on-time" },
    { label: "Late", value: "late" },
    { label: "Absent", value: "absent" },
    { label: "On leave", value: "on-leave" },
];

function initialsFrom(name: string): string {
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function computeHours(clockIn: string | null, clockOut: string | null): string {
    if (!clockIn || !clockOut) return "—";
    const [inH, inM] = clockIn.split(":").map(Number);
    const [outH, outM] = clockOut.split(":").map(Number);
    const totalMinutes = outH * 60 + outM - (inH * 60 + inM);
    const h = Math.floor(totalMinutes / 60);
    const m = totalMinutes % 60;
    return `${h}h ${m}m`;
}

function Avatar({ initials }: { initials: string }) {
    return (
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-tint text-xs font-heading font-semibold text-primary-dark ring-1 ring-inset ring-primary/10">
            {initials}
        </span>
    );
}

export default function AttendancePage() {
    const [tab, setTab] = React.useState<"log" | "approvals">("log");
    const [search, setSearch] = React.useState("");
    const [department, setDepartment] = React.useState(ALL_DEPARTMENTS);
    const [statusFilter, setStatusFilter] = React.useState<
        "All" | AttendanceStatus
    >("All");

    const [records, setRecords] = React.useState<AttendanceRecordWithEmployee[]>(
        [],
    );
    const [departments, setDepartments] = React.useState<Department[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);

    const [corrections, setCorrections] = React.useState<
        AttendanceCorrectionRequest[]
    >([]);
    const [isLoadingCorrections, setIsLoadingCorrections] =
        React.useState(true);
    const [correctionsLoaded, setCorrectionsLoaded] = React.useState(false);
    const [reviewingId, setReviewingId] = React.useState<string | null>(null);
    const [rejectTargetId, setRejectTargetId] = React.useState<string | null>(
        null,
    );

    const today = todayDateString();

    React.useEffect(() => {
        let cancelled = false;

        async function load() {
            setIsLoading(true);
            try {
                const { records: fetched } = await getAttendance({
                    limit: 100,
                    startDate: today,
                    endDate: today,
                    ...(statusFilter !== "All" && { status: statusFilter }),
                });
                if (!cancelled) setRecords(fetched);
            } catch {
                if (!cancelled) toast.error("Couldn't load attendance.");
            } finally {
                if (!cancelled) setIsLoading(false);
            }
        }

        load();
        return () => {
            cancelled = true;
        };
    }, [today, statusFilter]);

    React.useEffect(() => {
        if (tab !== "approvals" || correctionsLoaded) return;
        let cancelled = false;

        async function loadCorrections() {
            setIsLoadingCorrections(true);
            try {
                const res: CorrectionListResult = await getCorrectionRequests({
                    limit: 100,
                });
                if (!cancelled) {
                    setCorrections(res.requests);
                    setCorrectionsLoaded(true);
                }
            } catch {
                if (!cancelled) toast.error("Couldn't load correction requests.");
            } finally {
                if (!cancelled) setIsLoadingCorrections(false);
            }
        }

        loadCorrections();
        return () => {
            cancelled = true;
        };
    }, [tab, correctionsLoaded]);

    React.useEffect(() => {
        let cancelled = false;

        async function loadDepartments() {
            try {
                const { departments: fetched } = await getDepartments({
                    limit: 100,
                });
                if (!cancelled) setDepartments(fetched);
            } catch {
                // Non-fatal: the filter just stays on "All departments".
            }
        }

        loadDepartments();
        return () => {
            cancelled = true;
        };
    }, []);

    async function handleApproveCorrection(id: string) {
        setReviewingId(id);
        try {
            const updated = await reviewCorrectionRequest(id, "approved");
            setCorrections((prev) =>
                prev.map((c) => (c.id === id ? updated : c)),
            );
            toast.success("Correction approved.");
        } catch (err) {
            toast.error(
                err instanceof ApiError
                    ? err.message
                    : "Couldn't approve this request. Try again.",
            );
        } finally {
            setReviewingId(null);
        }
    }

    function handleRejectCorrection(id: string) {
        setRejectTargetId(id);
    }

    async function handleConfirmRejectCorrection(reason: string) {
        if (!rejectTargetId) return;
        const id = rejectTargetId;
        setReviewingId(id);
        try {
            const updated = await reviewCorrectionRequest(
                id,
                "rejected",
                reason,
            );
            setCorrections((prev) =>
                prev.map((c) => (c.id === id ? updated : c)),
            );
            toast.error("Correction rejected.");
            setRejectTargetId(null);
        } catch (err) {
            toast.error(
                err instanceof ApiError
                    ? err.message
                    : "Couldn't reject this request. Try again.",
            );
        } finally {
            setReviewingId(null);
        }
    }

    const filteredRecords = React.useMemo(() => {
        return records.filter((r) => {
            const matchesSearch = (r.employeeName ?? "")
                .toLowerCase()
                .includes(search.toLowerCase());
            const matchesDept =
                department === ALL_DEPARTMENTS ||
                r.departmentName === department;
            return matchesSearch && matchesDept;
        });
    }, [records, search, department]);

    const stats = React.useMemo(() => {
        const present = records.filter((r) => r.status === "on-time").length;
        const late = records.filter((r) => r.status === "late").length;
        const absent = records.filter((r) => r.status === "absent").length;
        const onLeave = records.filter((r) => r.status === "on-leave").length;
        return { present, late, absent, onLeave };
    }, [records]);

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
                                <option value={ALL_DEPARTMENTS}>
                                    {ALL_DEPARTMENTS}
                                </option>
                                {departments.map((d) => (
                                    <option key={d.id} value={d.name}>
                                        {d.name}
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
                                {statusOptions.map((o) => (
                                    <option key={o.value} value={o.value}>
                                        {o.label}
                                    </option>
                                ))}
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
                                {isLoading ? (
                                    <TableEmpty colSpan={6}>
                                        Loading attendance...
                                    </TableEmpty>
                                ) : filteredRecords.length === 0 ? (
                                    <TableEmpty colSpan={6}>
                                        No one matches these filters. Try a
                                        different search or clear a filter.
                                    </TableEmpty>
                                ) : (
                                    filteredRecords.map((r) => (
                                        <TableRow key={r.id}>
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <Avatar
                                                        initials={initialsFrom(
                                                            r.employeeName ?? "?",
                                                        )}
                                                    />
                                                    <span className="font-medium text-primary-dark">
                                                        {r.employeeName ?? "—"}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-neutral">
                                                {r.departmentName ?? "—"}
                                            </TableCell>
                                            <TableCell className="text-neutral">
                                                {r.clockIn ?? "—"}
                                            </TableCell>
                                            <TableCell className="text-neutral">
                                                {r.clockOut ?? "—"}
                                            </TableCell>
                                            <TableCell className="text-neutral">
                                                {computeHours(
                                                    r.clockIn,
                                                    r.clockOut,
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <AttendanceStatusBadge
                                                    status={r.status}
                                                />
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                )}

                {/* Approvals */}
                {tab === "approvals" && (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Employee</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Original</TableHead>
                                <TableHead>Requested</TableHead>
                                <TableHead>Reason</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">
                                    Actions
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoadingCorrections ? (
                                <TableEmpty colSpan={7}>
                                    Loading correction requests...
                                </TableEmpty>
                            ) : corrections.length === 0 ? (
                                <TableEmpty colSpan={7}>
                                    No correction requests yet.
                                </TableEmpty>
                            ) : (
                                corrections.map((c) => (
                                    <TableRow key={c.id}>
                                        <TableCell>
                                            <div>
                                                <p className="font-medium text-primary-dark">
                                                    {c.employeeName ?? "—"}
                                                </p>
                                                <p className="text-xs text-neutral">
                                                    {c.employeeCode}
                                                </p>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-neutral">
                                            {new Date(
                                                c.date,
                                            ).toLocaleDateString("en-US", {
                                                month: "short",
                                                day: "numeric",
                                            })}
                                        </TableCell>
                                        <TableCell className="text-neutral">
                                            {c.originalClockIn ?? "—"} –{" "}
                                            {c.originalClockOut ?? "—"}
                                        </TableCell>
                                        <TableCell className="text-primary-dark">
                                            {c.requestedClockIn ?? "—"} –{" "}
                                            {c.requestedClockOut ?? "—"}
                                        </TableCell>
                                        <TableCell className="max-w-xs text-neutral">
                                            {c.reason}
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant={
                                                    c.status === "approved"
                                                        ? "success"
                                                        : c.status ===
                                                            "rejected"
                                                          ? "danger"
                                                          : "warning"
                                                }
                                                dot
                                            >
                                                {c.status === "pending"
                                                    ? "Pending"
                                                    : c.status === "approved"
                                                      ? "Approved"
                                                      : "Rejected"}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            {c.status === "pending" && (
                                                <div className="flex justify-end gap-2">
                                                    <Button
                                                        size="sm"
                                                        loading={
                                                            reviewingId ===
                                                            c.id
                                                        }
                                                        onClick={() =>
                                                            handleApproveCorrection(
                                                                c.id,
                                                            )
                                                        }
                                                    >
                                                        Approve
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        loading={
                                                            reviewingId ===
                                                            c.id
                                                        }
                                                        onClick={() =>
                                                            handleRejectCorrection(
                                                                c.id,
                                                            )
                                                        }
                                                    >
                                                        Reject
                                                    </Button>
                                                </div>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                )}
            </div>

            <RejectReasonModal
                open={!!rejectTargetId}
                onOpenChange={(open) => {
                    if (!open) setRejectTargetId(null);
                }}
                title="Reject correction request"
                onSubmit={handleConfirmRejectCorrection}
                isSubmitting={!!reviewingId}
            />
        </DashboardLayout>
    );
}