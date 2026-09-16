"use client";

import * as React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
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
import { getHeadcountReport } from "@/lib/api/reports";
import type { HeadcountRow } from "@/types/report";

export function HeadcountReport() {
    const [rows, setRows] = React.useState<HeadcountRow[]>([]);
    const [totalHeadcount, setTotalHeadcount] = React.useState(0);
    const [isLoading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
        let cancelled = false;

        async function load() {
            try {
                const res = await getHeadcountReport();
                if (!cancelled) {
                    setRows(res.rows);
                    setTotalHeadcount(res.totalHeadcount);
                }
            } catch {
                if (!cancelled) toast.error("Couldn't load headcount report.");
            } finally {
                if (!cancelled) setIsLoading(false);
            }
        }

        load();
        return () => {
            cancelled = true;
        };
    }, []);

    function handleExport() {
        exportToCsv(
            "headcount-by-department.csv",
            rows.map((r) => ({
                Department: r.departmentName,
                Status: r.departmentStatus ?? "—",
                Headcount: r.headcount,
            })),
        );
    }

    return (
        <Card>
            <CardHeader className="flex-row items-center justify-between">
                <CardTitle>Headcount by department</CardTitle>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={handleExport}
                    disabled={rows.length === 0}
                >
                    <Download className="h-4 w-4" />
                    Export CSV
                </Button>
            </CardHeader>
            <CardContent className="p-0">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Department</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Headcount</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableEmpty colSpan={3}>
                                Loading headcount...
                            </TableEmpty>
                        ) : rows.length === 0 ? (
                            <TableEmpty colSpan={3}>
                                No headcount data yet.
                            </TableEmpty>
                        ) : (
                            <>
                                {rows.map((r) => (
                                    <TableRow
                                        key={r.departmentId ?? "unassigned"}
                                    >
                                        <TableCell className="font-medium text-primary-dark">
                                            {r.departmentName}
                                        </TableCell>
                                        <TableCell>
                                            {r.departmentStatus ? (
                                                <Badge
                                                    variant={
                                                        r.departmentStatus ===
                                                        "active"
                                                            ? "success"
                                                            : "neutral"
                                                    }
                                                    dot
                                                >
                                                    {r.departmentStatus ===
                                                    "active"
                                                        ? "Active"
                                                        : "Inactive"}
                                                </Badge>
                                            ) : (
                                                <span className="text-xs italic text-neutral">
                                                    —
                                                </span>
                                            )}
                                        </TableCell>
                                        <TableCell>{r.headcount}</TableCell>
                                    </TableRow>
                                ))}
                                <TableRow>
                                    <TableCell className="font-semibold text-primary-dark">
                                        Total
                                    </TableCell>
                                    <TableCell />
                                    <TableCell className="font-semibold text-primary-dark">
                                        {totalHeadcount}
                                    </TableCell>
                                </TableRow>
                            </>
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}