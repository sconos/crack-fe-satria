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
import { ClockInOutCard } from "@/components/portal/ClockInOutCard";
import { toast } from "@/components/ui/Toast";
import {
    getAttendanceForEmployee,
    getTodayRecord,
} from "@/lib/mock-data/attendance";
import type { AttendanceRecord, AttendanceStatus } from "@/types/attendance";

// TODO: replace with the logged-in user's id once auth/session is wired up
const CURRENT_EMPLOYEE_ID = "1";

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
    const [history, setHistory] = React.useState<AttendanceRecord[]>(() =>
        getAttendanceForEmployee(CURRENT_EMPLOYEE_ID),
    );
    const todayRecord = getTodayRecord(CURRENT_EMPLOYEE_ID);

    function handleClockIn(time: string, status: AttendanceStatus) {
        const today = new Date().toISOString().slice(0, 10);
        setHistory((prev) => [
            {
                id: `today-${Date.now()}`,
                employeeId: CURRENT_EMPLOYEE_ID,
                date: today,
                clockIn: time,
                clockOut: null,
                status,
            },
            ...prev.filter((r) => r.date !== today),
        ]);
        toast.success(`Clocked in at ${time}`);
    }

    function handleClockOut(time: string) {
        const today = new Date().toISOString().slice(0, 10);
        setHistory((prev) =>
            prev.map((r) => (r.date === today ? { ...r, clockOut: time } : r)),
        );
        toast.success(`Clocked out at ${time}`);
    }

    const presentCount = history.filter(
        (r) => r.status === "on-time" || r.status === "late" || r.status === "remote",
    ).length;
    const lateCount = history.filter((r) => r.status === "late").length;
    const absentCount = history.filter((r) => r.status === "absent").length;

    return (
        <PortalLayout title="My Attendance">
            <div className="flex flex-col gap-6">
                <ClockInOutCard
                    initialRecord={todayRecord}
                    onClockIn={handleClockIn}
                    onClockOut={handleClockOut}
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
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {history.length === 0 ? (
                                    <TableEmpty colSpan={5}>
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
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </PortalLayout>
    );
}