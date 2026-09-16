"use client";

import * as React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableHead,
    TableCell,
    TableEmpty,
} from "@/components/ui/Table";
import { Download } from "lucide-react";
import { exportToCsv } from "@/lib/csv";
import { toast } from "@/components/ui/Toast";
import { getLeaveUtilizationReport } from "@/lib/api/reports";
import type { LeaveUtilizationRow } from "@/types/report";

const CURRENT_YEAR = new Date().getFullYear();
// A handful of recent years — the DTO accepts any year >= 2000, this is
// just a reasonable dropdown range.
const YEAR_OPTIONS = [CURRENT_YEAR, CURRENT_YEAR - 1, CURRENT_YEAR - 2];

export function LeaveUtilizationReport() {
    const [year, setYear] = React.useState(CURRENT_YEAR);
    const [rows, setRows] = React.useState<LeaveUtilizationRow[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
        let cancelled = false;

        async function load() {
            setIsLoading(true);
            try {
                const res = await getLeaveUtilizationReport(year);
                if (!cancelled) setRows(res.rows);
            } catch {
                if (!cancelled) toast.error("Couldn't load leave utilization.");
            } finally {
                if (!cancelled) setIsLoading(false);
            }
        }

        load();
        return () => {
            cancelled = true;
        };
    }, [year]);

    function handleExport() {
        exportToCsv(
            `leave-utilization-${year}.csv`,
            rows.map((r) => ({
                "Leave type": r.leaveTypeName,
                Approved: r.approvedCount,
                Pending: r.pendingCount,
                Rejected: r.rejectedCount,
                Cancelled: r.cancelledCount,
                "Approved days used": r.daysUsed,
            })),
        );
    }

    return (
        <Card>
            <CardHeader className="flex-row items-center justify-between">
                <CardTitle>Leave utilization</CardTitle>
                <div className="flex items-center gap-2">
                    <Select
                        value={String(year)}
                        onChange={(e) => setYear(Number(e.target.value))}
                        className="w-28"
                    >
                        {YEAR_OPTIONS.map((y) => (
                            <option key={y} value={y}>
                                {y}
                            </option>
                        ))}
                    </Select>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleExport}
                        disabled={rows.length === 0}
                    >
                        <Download className="h-4 w-4" />
                        Export CSV
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="p-0">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Leave type</TableHead>
                            <TableHead>Approved</TableHead>
                            <TableHead>Pending</TableHead>
                            <TableHead>Rejected</TableHead>
                            <TableHead>Cancelled</TableHead>
                            <TableHead>Days used</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableEmpty colSpan={6}>
                                Loading leave utilization...
                            </TableEmpty>
                        ) : rows.length === 0 ? (
                            <TableEmpty colSpan={6}>
                                No leave requests for {year} yet.
                            </TableEmpty>
                        ) : (
                            rows.map((r) => (
                                <TableRow key={r.leaveTypeId}>
                                    <TableCell className="font-medium text-primary-dark">
                                        {r.leaveTypeName}
                                    </TableCell>
                                    <TableCell className="text-success">
                                        {r.approvedCount}
                                    </TableCell>
                                    <TableCell className="text-warning-dark">
                                        {r.pendingCount}
                                    </TableCell>
                                    <TableCell className="text-danger">
                                        {r.rejectedCount}
                                    </TableCell>
                                    <TableCell className="text-neutral">
                                        {r.cancelledCount}
                                    </TableCell>
                                    <TableCell>{r.daysUsed}</TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}