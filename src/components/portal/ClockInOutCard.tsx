"use client";

import * as React from "react";
import { Clock, LogIn, LogOut } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { AttendanceStatusBadge } from "@/components/attendance/AttendanceStatusBadge";
import type { AttendanceRecord, AttendanceStatus } from "@/types/attendance";

const LATE_THRESHOLD_MINUTES = 9 * 60; // 09:00

function formatTime(date: Date): string {
    return date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
    });
}

function minutesSinceMidnight(date: Date): number {
    return date.getHours() * 60 + date.getMinutes();
}

function computeHours(clockIn: string, clockOut: string): string {
    const [inH, inM] = clockIn.split(":").map(Number);
    const [outH, outM] = clockOut.split(":").map(Number);
    const totalMinutes = outH * 60 + outM - (inH * 60 + inM);
    const h = Math.floor(totalMinutes / 60);
    const m = totalMinutes % 60;
    return `${h}h ${m}m`;
}

export function ClockInOutCard({
    initialRecord,
    onClockIn,
    onClockOut,
}: {
    initialRecord?: AttendanceRecord;
    onClockIn: (time: string, status: AttendanceStatus) => void;
    onClockOut: (time: string) => void;
}) {
    const [now, setNow] = React.useState(new Date());
    const [record, setRecord] = React.useState(initialRecord);

    React.useEffect(() => {
        const interval = setInterval(() => setNow(new Date()), 1000);
        return () => clearInterval(interval);
    }, []);

    function handleClockIn() {
        // Guard against duplicate clock-in per PRD §8.3 — the button is
        // already hidden once clockIn is set, this is a second layer.
        if (record?.clockIn) return;

        const time = formatTime(now);
        const status: AttendanceStatus =
            minutesSinceMidnight(now) > LATE_THRESHOLD_MINUTES ? "late" : "on-time";

        setRecord((prev) => ({
            id: prev?.id ?? `today-${Date.now()}`,
            employeeId: prev?.employeeId ?? "",
            date: now.toISOString().slice(0, 10),
            clockIn: time,
            clockOut: null,
            status,
        }));
        onClockIn(time, status);
    }

    function handleClockOut() {
        if (!record?.clockIn || record.clockOut) return;

        const time = formatTime(now);
        setRecord((prev) => (prev ? { ...prev, clockOut: time } : prev));
        onClockOut(time);
    }

    return (
        <Card>
            <CardContent className="flex flex-col items-center gap-4 py-8 text-center">
                <div className="flex items-center gap-2 text-neutral">
                    <Clock className="h-4 w-4" />
                    <span className="font-body text-sm">
                        {now.toLocaleDateString("en-US", {
                            weekday: "long",
                            month: "long",
                            day: "numeric",
                        })}
                    </span>
                </div>

                <p className="font-heading text-4xl font-bold text-primary-dark">
                    {formatTime(now)}
                </p>

                {record?.status && (
                    <AttendanceStatusBadge status={record.status} />
                )}

                {!record?.clockIn ? (
                    <Button size="lg" onClick={handleClockIn}>
                        <LogIn className="h-4 w-4" />
                        Clock In
                    </Button>
                ) : !record.clockOut ? (
                    <div className="flex flex-col items-center gap-2">
                        <p className="font-body text-sm text-neutral">
                            Clocked in at{" "}
                            <span className="font-medium text-primary-dark">
                                {record.clockIn}
                            </span>
                        </p>
                        <Button size="lg" variant="outline" onClick={handleClockOut}>
                            <LogOut className="h-4 w-4" />
                            Clock Out
                        </Button>
                    </div>
                ) : (
                    <p className="font-body text-sm text-neutral">
                        Done for today —{" "}
                        <span className="font-medium text-primary-dark">
                            {record.clockIn}
                        </span>{" "}
                        to{" "}
                        <span className="font-medium text-primary-dark">
                            {record.clockOut}
                        </span>{" "}
                        ({computeHours(record.clockIn, record.clockOut)})
                    </p>
                )}
            </CardContent>
        </Card>
    );
}