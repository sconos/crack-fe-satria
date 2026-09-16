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
import {
    getPayroll,
    generatePayrollForPeriod,
    markPayrollPaid,
    type PayrollRecordWithDetail,
} from "@/lib/api/payroll";
import { periodToMonthYear } from "@/lib/api/mappers/payroll-mappers";

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

const currentMonth = new Date();
const defaultPeriod = `${currentMonth.getFullYear()}-${String(
    currentMonth.getMonth() + 1,
).padStart(2, "0")}`;

export default function PayrollPage() {
    const [records, setRecords] = React.useState<PayrollRecordWithDetail[]>([]);
    const [period, setPeriod] = React.useState(defaultPeriod);
    const [isLoading, setIsLoading] = React.useState(true);
    const [paySlipTarget, setPaySlipTarget] =
        React.useState<PayrollRecordWithDetail | null>(null);
    const [isRunning, setIsRunning] = React.useState(false);
    const [markingPaidId, setMarkingPaidId] = React.useState<string | null>(
        null,
    );

    async function loadRecords() {
        setIsLoading(true);
        try {
            const { periodMonth, periodYear } = periodToMonthYear(period);
            const { records: fetched } = await getPayroll({
                periodMonth,
                periodYear,
                limit: 100,
            });
            setRecords(fetched);
        } catch {
            toast.error("Couldn't load payroll records.");
        } finally {
            setIsLoading(false);
        }
    }

    React.useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect -- known FP on async fetch fns
        loadRecords();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [period]);

    const totalPayroll = records.reduce((sum, r) => sum + r.netPay, 0);
    const paidRecords = records.filter((r) => r.status === "Paid");
    const pendingCount = records.filter((r) => r.status === "Pending").length;
    const totalPaid = paidRecords.reduce((sum, r) => sum + r.netPay, 0);

    async function handleMarkPaid(id: string) {
        setMarkingPaidId(id);
        try {
            const updated = await markPayrollPaid(id);
            setRecords((prev) =>
                prev.map((r) => (r.id === id ? updated : r)),
            );
            toast.success(`Marked as paid.`);
        } catch {
            toast.error("Couldn't mark this record as paid. Try again.");
        } finally {
            setMarkingPaidId(null);
        }
    }

    async function handleRunPayroll() {
        setIsRunning(true);
        try {
            const results = await generatePayrollForPeriod(period);
            const succeeded = results.filter((r) => r.success).length;
            const failed = results.length - succeeded;

            if (succeeded > 0) {
                toast.success(
                    `Generated payroll for ${succeeded} employee${
                        succeeded !== 1 ? "s" : ""
                    } — ${formatPeriod(period)}.`,
                );
            }
            if (failed > 0) {
                toast.error(
                    `${failed} employee${failed !== 1 ? "s" : ""} skipped (likely already generated for this period).`,
                );
            }

            await loadRecords();
        } catch {
            toast.error("Couldn't run payroll. Try again.");
        } finally {
            setIsRunning(false);
        }
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
            sub: `${paidRecords.length} employee${paidRecords.length !== 1 ? "s" : ""}`,
            accent: "border-l-success",
        },
        {
            label: "Pending",
            value: pendingCount,
            sub: "Awaiting payment",
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
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
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
                        {isLoading ? (
                            <TableEmpty colSpan={8}>
                                Loading payroll...
                            </TableEmpty>
                        ) : records.length === 0 ? (
                            <TableEmpty colSpan={8}>
                                No payroll records for this period yet. Click
                                Run Payroll to generate them.
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

                                    {/* TODO: add review/processing/cancel/restore step exists to call.*/}
                                    
                                    {/* Actions */}
                                    <TableCell>
                                        <div className="flex items-center justify-end gap-2">
                                            {record.status === "Pending" && (
                                                <Button
                                                    variant="primary"
                                                    size="sm"
                                                    loading={
                                                        markingPaidId ===
                                                        record.id
                                                    }
                                                    onClick={() =>
                                                        handleMarkPaid(
                                                            record.id,
                                                        )
                                                    }
                                                >
                                                    Mark as Paid
                                                </Button>
                                            )}
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() =>
                                                    setPaySlipTarget(record)
                                                }
                                            >
                                                Pay Slip
                                            </Button>
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