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
import type { Employee } from "@/types/employee";
import type { Department } from "@/types/department";

export function HeadcountReport({
    employees,
    departments,
}: {
    employees: Employee[];
    departments: Department[];
}) {
    const rows = departments.map((dept) => {
        const deptEmployees = employees.filter((e) => e.department === dept.name);
        return {
            department: dept.name,
            headcount: deptEmployees.length,
            active: deptEmployees.filter((e) => e.status === "Active").length,
            onLeave: deptEmployees.filter((e) => e.status === "On Leave").length,
        };
    });

    function handleExport() {
        exportToCsv(
            "headcount-by-department.csv",
            rows.map((r) => ({
                Department: r.department,
                Headcount: r.headcount,
                Active: r.active,
                "On Leave": r.onLeave,
            })),
        );
    }

    return (
        <Card>
            <CardHeader className="flex-row items-center justify-between">
                <CardTitle>Headcount by department</CardTitle>
                <Button variant="outline" size="sm" onClick={handleExport}>
                    <Download className="h-4 w-4" />
                    Export CSV
                </Button>
            </CardHeader>
            <CardContent className="p-0">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Department</TableHead>
                            <TableHead>Headcount</TableHead>
                            <TableHead>Active</TableHead>
                            <TableHead>On leave</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {rows.map((r) => (
                            <TableRow key={r.department}>
                                <TableCell className="font-medium text-primary-dark">
                                    {r.department}
                                </TableCell>
                                <TableCell>{r.headcount}</TableCell>
                                <TableCell className="text-success">{r.active}</TableCell>
                                <TableCell className="text-warning-dark">{r.onLeave}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}