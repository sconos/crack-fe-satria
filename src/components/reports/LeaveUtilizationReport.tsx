"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableHead,
    TableCell,
} from "@/components/ui/Table";
import { Download } from "lucide-react";
import { exportToCsv } from "@/lib/csv";
import type { LeaveRequest } from "@/types/leave";

export function LeaveUtilizationReport({
    leaveRequests,
}: {
    leaveRequests: LeaveRequest[];
}) {
    const byType = new Map<string, { approved: number; pending: number; rejected: number; totalDays: number }>();

    leaveRequests.forEach((r) => {
        const entry = byType.get(r.type) ?? {
            approved: 0,
            pending: 0,
            rejected: 0,
            totalDays: 0,
        };
        if (r.status === "Approved") {
            entry.approved += 1;
            entry.totalDays += r.days;
        } else if (r.status === "Pending") {
            entry.pending += 1;
        } else {
            entry.rejected += 1;
        }
        byType.set(r.type, entry);
    });

    const rows = Array.from(byType.entries()).map(([type, stats]) => ({
        type,
        ...stats,
    }));

    function handleExport() {
        exportToCsv(
            "leave-utilization.csv",
            rows.map((r) => ({
                "Leave type": r.type,
                Approved: r.approved,
                Pending: r.pending,
                Rejected: r.rejected,
                "Approved days used": r.totalDays,
            })),
        );
    }

    return (
        <Card>
            <CardHeader className="flex-row items-center justify-between">
                <CardTitle>Leave utilization</CardTitle>
                <Button variant="outline" size="sm" onClick={handleExport}>
                    <Download className="h-4 w-4" />
                    Export CSV
                </Button>
            </CardHeader>
            <CardContent className="p-0">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Leave type</TableHead>
                            <TableHead>Approved</TableHead>
                            <TableHead>Pending</TableHead>
                            <TableHead>Rejected</TableHead>
                            <TableHead>Days used</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {rows.map((r) => (
                            <TableRow key={r.type}>
                                <TableCell className="font-medium text-primary-dark">
                                    {r.type}
                                </TableCell>
                                <TableCell className="text-success">{r.approved}</TableCell>
                                <TableCell className="text-warning-dark">{r.pending}</TableCell>
                                <TableCell className="text-danger">{r.rejected}</TableCell>
                                <TableCell>{r.totalDays}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}