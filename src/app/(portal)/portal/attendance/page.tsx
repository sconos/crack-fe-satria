"use client";

import * as React from "react";
import { PortalLayout } from "@/components/portal/PortalLayout";
import { StatCard } from "@/components/ui/StatCard";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableHead,
    TableCell,
    TableEmpty,
} from "@/components/ui/Table";
import { AttendanceStatusBadge } from "@/components/attendance/AttendanceStatusBadge";
import { Badge } from "@/components/ui/Badge";
import {
    RequestCorrectionModal,
    type CorrectionRequestInput,
} from "@/components/attendance/RequestCorrectionModal";
import { ClockInOutCard } from "@/components/portal/ClockInOutCard";
import { Button } from "@/components/ui/Button";
import { toast } from "@/components/ui/Toast";
import {
    clockIn as clockInRequest,
    clockOut as clockOutRequest,
    getMyAttendance,
    type AttendanceRecordWithEmployee,
} from "@/lib/api/attendance";
import {
    createCorrectionRequest,
    getMyCorrectionRequests,
} from "@/lib/api/attendance-corrections";
import type { AttendanceCorrectionRequest } from "@/types/attendance-correction";
import { todayDateString } from "@/lib/api/mappers/attendance-mappers";
import { ApiError } from "@/lib/api/client";

function computeHours(clockIn: string | null, clockOut: string | null): string {
    if (!clockIn || !clockOut) return "—";
    const [inH, inM] = clockIn.split(":").map(Number);
    const [outH, outM] = clockOut.split(":").map(Number);
    const totalMinutes = outH * 60 + outM - (inH * 60 + inM);
    const h = Math.floor(totalMinutes / 60);
    const m = totalMinutes % 60;
    return `${h}h ${m}m`;
}

export default function PortalAttendancePage() {
    const [history, setHistory] = React.useState<
        AttendanceRecordWithEmployee[]
    >([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [correctionTarget, setCorrectionTarget] =
        React.useState<AttendanceRecordWithEmployee | null>(null);
    const [isSubmittingCorrection, setIsSubmittingCorrection] =
        React.useState(false);
    const [corrections, setCorrections] = React.useState<
        AttendanceCorrectionRequest[]
    >([]);

    React.useEffect(() => {
        let cancelled = false;

        async function load() {
            try {
                const { records } = await getMyAttendance({ limit: 100 });
                if (!cancelled) setHistory(records);
            } catch {
                if (!cancelled) toast.error("Couldn't load your attendance.");
            } finally {
                if (!cancelled) setIsLoading(false);
            }
        }

        load();
        return () => {
            cancelled = true;
        };
    }, []);

    React.useEffect(() => {
        let cancelled = false;

        async function loadCorrections() {
            try {
                const { requests } = await getMyCorrectionRequests();
                if (!cancelled) setCorrections(requests);
            } catch {
                // Non-fatal — the page still works, just without the
                // per-row correction status indicator.
            }
        }

        loadCorrections();
        return () => {
            cancelled = true;
        };
    }, []);

    const correctionByAttendanceId = React.useMemo(() => {
        const map = new Map<string, AttendanceCorrectionRequest>();
        for (const c of corrections) {
            const existing = map.get(c.attendanceId);
            if (!existing || c.createdAt >= existing.createdAt) {
                map.set(c.attendanceId, c);
            }
        }
        return map;
    }, [corrections]);

    const today = todayDateString();
    const todayRecord = history.find((r) => r.date === today);

    function upsertRecord(updated: AttendanceRecordWithEmployee) {
        setHistory((prev) => {
            const exists = prev.some((r) => r.id === updated.id);
            if (exists) {
                return prev.map((r) => (r.id === updated.id ? updated : r));
            }
            return [updated, ...prev];
        });
    }

    async function handleClockIn() {
        setIsSubmitting(true);
        try {
            const updated = await clockInRequest();
            upsertRecord(updated);
            toast.success(`Clocked in at ${updated.clockIn}`);
        } catch (err) {
            toast.error(
                err instanceof ApiError
                    ? err.message
                    : "Couldn't clock in. Try again.",
            );
        } finally {
            setIsSubmitting(false);
        }
    }

    async function handleClockOut() {
        setIsSubmitting(true);
        try {
            const updated = await clockOutRequest();
            upsertRecord(updated);
            toast.success(`Clocked out at ${updated.clockOut}`);
        } catch (err) {
            toast.error(
                err instanceof ApiError
                    ? err.message
                    : "Couldn't clock out. Try again.",
            );
        } finally {
            setIsSubmitting(false);
        }
    }

    async function handleSubmitCorrection(data: CorrectionRequestInput) {
        if (!correctionTarget) return;
        setIsSubmittingCorrection(true);
        try {
            const created = await createCorrectionRequest({
                attendanceId: correctionTarget.id,
                date: correctionTarget.date,
                requestedClockIn: data.requestedClockIn,
                requestedClockOut: data.requestedClockOut,
                reason: data.reason,
            });
            setCorrections((prev) => [created, ...prev]);
            toast.success("Correction request submitted — pending HR review.");
            setCorrectionTarget(null);
        } catch (err) {
            toast.error(
                err instanceof ApiError
                    ? err.message
                    : "Couldn't submit correction request. Try again.",
            );
        } finally {
            setIsSubmittingCorrection(false);
        }
    }

    const presentCount = history.filter(
        (r) => r.status === "on-time" || r.status === "late",
    ).length;
    const lateCount = history.filter((r) => r.status === "late").length;
    const absentCount = history.filter((r) => r.status === "absent").length;

    return (
        <PortalLayout title="My Attendance">
            <div className="flex flex-col gap-6">
                <ClockInOutCard
                    record={todayRecord}
                    onClockIn={handleClockIn}
                    onClockOut={handleClockOut}
                    isSubmitting={isSubmitting}
                />

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <StatCard
                        label="Present this month"
                        value={presentCount}
                        accent="border-l-success"
                    />
                    <StatCard
                        label="Late this month"
                        value={lateCount}
                        accent="border-l-warning"
                    />
                    <StatCard
                        label="Absent this month"
                        value={absentCount}
                        accent="border-l-danger"
                    />
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Attendance history</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Clock in</TableHead>
                                    <TableHead>Clock out</TableHead>
                                    <TableHead>Hours</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">
                                        Actions
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isLoading ? (
                                    <TableEmpty colSpan={6}>
                                        Loading attendance...
                                    </TableEmpty>
                                ) : history.length === 0 ? (
                                    <TableEmpty colSpan={6}>
                                        No attendance records yet.
                                    </TableEmpty>
                                ) : (
                                    history.map((record) => (
                                        <TableRow key={record.id}>
                                            <TableCell>
                                                {new Date(
                                                    record.date,
                                                ).toLocaleDateString("en-US", {
                                                    month: "short",
                                                    day: "numeric",
                                                })}
                                            </TableCell>
                                            <TableCell className="text-neutral">
                                                {record.clockIn ?? "—"}
                                            </TableCell>
                                            <TableCell className="text-neutral">
                                                {record.clockOut ?? "—"}
                                            </TableCell>
                                            <TableCell className="text-neutral">
                                                {computeHours(
                                                    record.clockIn,
                                                    record.clockOut,
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <AttendanceStatusBadge
                                                    status={record.status}
                                                />
                                            </TableCell>
                                            <TableCell className="text-right">
                                                {(() => {
                                                    const correction =
                                                        correctionByAttendanceId.get(
                                                            record.id,
                                                        );
                                                    if (
                                                        correction?.status ===
                                                        "pending"
                                                    ) {
                                                        return (
                                                            <Badge
                                                                variant="warning"
                                                                dot
                                                            >
                                                                Correction
                                                                pending
                                                            </Badge>
                                                        );
                                                    }
                                                    return (
                                                        <div className="flex flex-col items-end gap-1">
                                                            {correction?.status ===
                                                                "rejected" && (
                                                                <span className="text-xs text-danger">
                                                                    Last
                                                                    request
                                                                    rejected
                                                                </span>
                                                            )}
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() =>
                                                                    setCorrectionTarget(
                                                                        record,
                                                                    )
                                                                }
                                                            >
                                                                Request
                                                                correction
                                                            </Button>
                                                        </div>
                                                    );
                                                })()}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>

            <RequestCorrectionModal
                open={!!correctionTarget}
                onOpenChange={(open) => {
                    if (!open) setCorrectionTarget(null);
                }}
                record={correctionTarget}
                onSubmit={handleSubmitCorrection}
                isSubmitting={isSubmittingCorrection}
            />
        </PortalLayout>
    );
}