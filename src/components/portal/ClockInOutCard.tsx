"use client";

import * as React from "react";
import { Clock, LogIn, LogOut } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { AttendanceStatusBadge } from "@/components/attendance/AttendanceStatusBadge";
import type { AttendanceRecord } from "@/types/attendance";

function formatTime(date: Date): string {
    return date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
    });
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
    record,
    onClockIn,
    onClockOut,
    isSubmitting,
}: {
    record?: AttendanceRecord;
    onClockIn: () => void | Promise<void>;
    onClockOut: () => void | Promise<void>;
    isSubmitting?: boolean;
}) {
    const [now, setNow] = React.useState(() => new Date());

    React.useEffect(() => {
        const interval = setInterval(() => setNow(new Date()), 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <Card>
            <CardContent className="flex flex-col items-center gap-4 py-8 text-center">
                <div className="flex items-center gap-2 text-neutral">
                    <Clock className="h-4 w-4" />
                    <span className="font-body text-sm">
                        {now
                            ? now.toLocaleDateString("en-US", {
                                  weekday: "long",
                                  month: "long",
                                  day: "numeric",
                              })
                            : "—"}
                    </span>
                </div>

                <p className="font-heading text-4xl font-bold text-primary-dark">
                    {now ? formatTime(now) : "--:--"}
                </p>

                {record?.status && (
                    <AttendanceStatusBadge status={record.status} />
                )}

                {!record?.clockIn ? (
                    <Button
                        size="lg"
                        onClick={() => onClockIn()}
                        loading={isSubmitting}
                    >
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
                        <Button
                            size="lg"
                            variant="outline"
                            onClick={() => onClockOut()}
                            loading={isSubmitting}
                        >
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