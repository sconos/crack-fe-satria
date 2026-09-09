"use client";

import * as React from "react";
import { Play } from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Button } from "@/components/ui/Button";
import { PayrollStatCard } from "@/components/payroll/PayrollStatCard";
import {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableHead,
    TableCell,
    TableEmpty,
} from "@/components/ui/Table";
import { PayrollStatusBadge } from "@/components/payroll/PayrollStatusBadge";
import { PaySlipModal } from "@/components/payroll/PaySlipModal";
import { toast } from "@/components/ui/Toast";
import type { PayrollRecord } from "@/types/payroll";

const mockPayroll: PayrollRecord[] = [
    {
        id: "p1",
        employeeId: "1",
        employeeName: "Satria Wijaya",
        department: "Engineering",
        role: "Frontend Developer",
        period: "2025-01",
        baseSalary: 8000000,
        allowances: 1500000,
        deductions: 500000,
        netPay: 9000000,
        status: "Pending",
    },
    {
        id: "p2",
        employeeId: "2",
        employeeName: "Jane Doe",
        department: "Human Resources",
        role: "HR Manager",
        period: "2025-01",
        baseSalary: 10000000,
        allowances: 2000000,
        deductions: 750000,
        netPay: 11250000,
        status: "Processing",
    },
    {
        id: "p3",
        employeeId: "3",
        employeeName: "Budi Santoso",
        department: "Engineering",
        role: "Backend Developer",
        period: "2025-01",
        baseSalary: 7500000,
        allowances: 1200000,
        deductions: 450000,
        netPay: 8250000,
        status: "Paid",
    },
    {
        id: "p4",
        employeeId: "4",
        employeeName: "Rina Hartati",
        department: "Sales",
        role: "Sales Executive",
        period: "2025-01",
        baseSalary: 6500000,
        allowances: 1000000,
        deductions: 350000,
        netPay: 7150000,
        status: "Cancelled",
    },
];

function formatRupiah(amount: number): string {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);
}

function formatPeriod(period: string): string {
    const [year, month] = period.split("-");
    return new Date(parseInt(year), parseInt(month) - 1).toLocaleDateString(
        "en-US",
        { month: "long", year: "numeric" },
    );
}

function getInitials(name: string) {
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export default function PayrollPage() {
    const [records, setRecords] = React.useState<PayrollRecord[]>(mockPayroll);
    const [period, setPeriod] = React.useState("2025-01");
    const [paySlipTarget, setPaySlipTarget] =
        React.useState<PayrollRecord | null>(null);
    const [isRunning, setIsRunning] = React.useState(false);

    // Stats
    const totalPayroll = records.reduce((sum, r) => sum + r.netPay, 0);
    const paidRecords = records.filter((r) => r.status === "Paid");
    const pendingCount = records.filter((r) => r.status === "Pending").length;
    const processingCount = records.filter(
        (r) => r.status === "Processing",
    ).length;
    const totalPaid = paidRecords.reduce((sum, r) => sum + r.netPay, 0);

    function handleReview(id: string) {
        setRecords((prev) =>
            prev.map((r) => (r.id === id ? { ...r, status: "Processing" } : r)),
        );
        toast.success("Moved to processing — ready for approval.");
    }

    function handleApprove(id: string) {
        setRecords((prev) =>
            prev.map((r) => (r.id === id ? { ...r, status: "Paid" } : r)),
        );
        toast.success("Payroll approved and marked as paid.");
    }

    function handleCancel(id: string) {
        setRecords((prev) =>
            prev.map((r) => (r.id === id ? { ...r, status: "Cancelled" } : r)),
        );
        toast.success("Payroll record cancelled.");
    }

    function handleRestore(id: string) {
        setRecords((prev) =>
            prev.map((r) => (r.id === id ? { ...r, status: "Pending" } : r)),
        );
        toast.success("Record restored to pending.");
    }

    async function handleRunPayroll() {
        setIsRunning(true);
        await new Promise((resolve) => setTimeout(resolve, 800));
        setRecords((prev) =>
            prev.map((r) => ({ ...r, period, status: "Pending" })),
        );
        setIsRunning(false);
        toast.success(`Payroll generated for ${formatPeriod(period)}.`);
    }

    const statCards = [
        {
            label: "Total payroll",
            value: formatRupiah(totalPayroll),
            accent: "border-l-neutral/30",
        },
        {
            label: "Paid",
            value: formatRupiah(totalPaid),
            sub: `${paidRecords.length} employees`,
            accent: "border-l-success",
        },
        {
            label: "Processing",
            value: processingCount,
            sub: "Awaiting approval",
            accent: "border-l-secondary",
        },
        {
            label: "Pending",
            value: pendingCount,
            sub: "Awaiting review",
            accent: "border-l-neutral/30",
        },
    ];

    return (
        <DashboardLayout title="Payroll">
            <div className="flex flex-col gap-6">
                {/* Header with period selector + run payroll */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <PageHeader
                        title="Payroll"
                        description={`Showing payroll for ${formatPeriod(period)}`}
                    />
                    <div className="flex shrink-0 items-center gap-2">
                        <input
                            type="month"
                            value={period}
                            onChange={(e) => setPeriod(e.target.value)}
                            className="font-body h-10 rounded-lg border border-neutral/30 bg-base-white px-3 text-sm text-primary-dark focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                        />
                        <Button loading={isRunning} onClick={handleRunPayroll}>
                            <Play className="h-4 w-4" />
                            Run Payroll
                        </Button>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                    {statCards.map((s) => (
                        <PayrollStatCard
                            key={s.label}
                            label={s.label}
                            value={s.value}
                            sub={s.sub}
                            accent={s.accent}
                        />
                    ))}
                </div>

                {/* Table */}
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Employee</TableHead>
                            <TableHead>Department</TableHead>
                            <TableHead>Base Salary</TableHead>
                            <TableHead>Allowances</TableHead>
                            <TableHead>Deductions</TableHead>
                            <TableHead>Net Pay</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">
                                Actions
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {records.length === 0 ? (
                            <TableEmpty colSpan={8}>
                                No payroll records. Click Run Payroll to
                                generate.
                            </TableEmpty>
                        ) : (
                            records.map((record) => (
                                <TableRow key={record.id}>
                                    {/* Employee */}
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-tint font-heading text-xs font-bold text-primary-dark">
                                                {getInitials(
                                                    record.employeeName,
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-body text-sm font-medium text-primary-dark">
                                                    {record.employeeName}
                                                </p>
                                                <p className="font-body text-xs text-neutral">
                                                    {record.role}
                                                </p>
                                            </div>
                                        </div>
                                    </TableCell>

                                    <TableCell className="text-neutral">
                                        {record.department}
                                    </TableCell>
                                    <TableCell>
                                        {formatRupiah(record.baseSalary)}
                                    </TableCell>
                                    <TableCell className="text-success">
                                        +{formatRupiah(record.allowances)}
                                    </TableCell>
                                    <TableCell className="text-danger">
                                        -{formatRupiah(record.deductions)}
                                    </TableCell>

                                    <TableCell>
                                        <span className="font-heading text-sm font-semibold text-primary-dark">
                                            {formatRupiah(record.netPay)}
                                        </span>
                                    </TableCell>

                                    <TableCell>
                                        <PayrollStatusBadge
                                            status={record.status}
                                        />
                                    </TableCell>

                                    {/* Actions */}
                                    <TableCell>
                                        <div className="flex items-center justify-end gap-2">
                                            {record.status === "Pending" && (
                                                <>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() =>
                                                            handleReview(
                                                                record.id,
                                                            )
                                                        }
                                                    >
                                                        Review
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="hover:bg-danger/10 hover:text-danger"
                                                        onClick={() =>
                                                            handleCancel(
                                                                record.id,
                                                            )
                                                        }
                                                    >
                                                        Cancel
                                                    </Button>
                                                </>
                                            )}
                                            {record.status === "Processing" && (
                                                <>
                                                    <Button
                                                        variant="primary"
                                                        size="sm"
                                                        onClick={() =>
                                                            handleApprove(
                                                                record.id,
                                                            )
                                                        }
                                                    >
                                                        Approve
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="hover:bg-danger/10 hover:text-danger"
                                                        onClick={() =>
                                                            handleCancel(
                                                                record.id,
                                                            )
                                                        }
                                                    >
                                                        Cancel
                                                    </Button>
                                                </>
                                            )}
                                            {record.status === "Paid" && (
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() =>
                                                        setPaySlipTarget(record)
                                                    }
                                                >
                                                    Pay Slip
                                                </Button>
                                            )}
                                            {record.status === "Cancelled" && (
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() =>
                                                        handleRestore(record.id)
                                                    }
                                                >
                                                    Restore
                                                </Button>
                                            )}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pay slip modal */}
            <PaySlipModal
                open={!!paySlipTarget}
                onOpenChange={(open) => {
                    if (!open) setPaySlipTarget(null);
                }}
                record={paySlipTarget}
            />
        </DashboardLayout>
    );
}
