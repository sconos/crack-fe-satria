"use client";

import * as React from "react";
import { X, Printer, Download } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { PayrollStatusBadge } from "./PayrollStatusBadge";
import { downloadPayslip } from "@/lib/api/payroll";
import { toast } from "@/components/ui/Toast";
import type { PayrollRecord } from "@/types/payroll";
import Image from "next/image";

interface PaySlipModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    record: PayrollRecord | null;
}

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
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

function getInitials(name: string) {
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function PaySlipModal({ open, onOpenChange, record }: PaySlipModalProps) {
    const [isDownloading, setIsDownloading] = React.useState(false);

    React.useEffect(() => {
        if (open) document.body.style.overflow = "hidden";
        else document.body.style.overflow = "";
        return () => {
            document.body.style.overflow = "";
        };
    }, [open]);

    React.useEffect(() => {
        function handleKeyDown(e: KeyboardEvent) {
            if (e.key === "Escape") onOpenChange(false);
        }
        if (open) document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [open, onOpenChange]);

    if (!open || !record) return null;

    const totalEarnings = record.baseSalary + record.allowances;

    async function handleDownload() {
        if (!record) return;
        setIsDownloading(true);
        try {
            await downloadPayslip(record.id, `payslip-${record.period}.pdf`);
        } catch {
            toast.error("Couldn't download the payslip. Try again.");
        } finally {
            setIsDownloading(false);
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-primary-dark/40 backdrop-blur-sm"
                onClick={() => onOpenChange(false)}
            />

            {/* Modal */}
            <div className="relative z-10 w-full max-w-lg rounded-xl border border-neutral/15 bg-base-white shadow-lg">
                {/* Close */}
                <button
                    type="button"
                    onClick={() => onOpenChange(false)}
                    className="absolute right-4 top-4 rounded-md text-neutral hover:text-primary-dark"
                >
                    <X className="h-4 w-4" />
                    <span className="sr-only">Close</span>
                </button>

                <div className="px-6 py-6">
                    {/* Header */}
                    <div className="mb-5 flex flex-col items-center gap-1 text-center">
                        <Image
                            src="/logo-2.png"
                            alt="Kuro HRM"
                            width={500}
                            height={500}
                            priority
                            className="h-24 w-auto"
                        />
                        <h2 className="font-heading text-lg font-bold text-primary-dark">
                            Pay Slip
                        </h2>
                        <p className="font-body text-sm text-neutral">
                            {formatPeriod(record.period)}
                        </p>
                    </div>

                    {/* Employee info */}
                    <div className="mb-5 flex items-center gap-3 rounded-lg bg-primary-tint px-4 py-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary font-heading text-sm font-bold text-base-white">
                            {getInitials(record.employeeName)}
                        </div>
                        <div>
                            <p className="font-heading text-sm font-bold text-primary-dark">
                                {record.employeeName}
                            </p>
                            <p className="font-body text-xs text-neutral">
                                {record.role} · {record.department}
                            </p>
                        </div>
                        <div className="ml-auto">
                            <PayrollStatusBadge status={record.status} />
                        </div>
                    </div>

                    {/* Earnings */}
                    <div className="mb-4">
                        <p className="mb-2 font-body text-xs font-semibold uppercase tracking-wider text-neutral">
                            Earnings
                        </p>
                        <div className="flex flex-col gap-2">
                            <div className="flex justify-between font-body text-sm text-primary-dark">
                                <span>Base salary</span>
                                <span>{formatRupiah(record.baseSalary)}</span>
                            </div>
                            <div className="flex justify-between font-body text-sm text-primary-dark">
                                <span>Allowances</span>
                                <span>{formatRupiah(record.allowances)}</span>
                            </div>
                            <div className="flex justify-between border-t border-neutral/15 pt-2 font-body text-sm font-semibold text-primary-dark">
                                <span>Total earnings</span>
                                <span>{formatRupiah(totalEarnings)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Deductions */}
                    <div className="mb-4">
                        <p className="mb-2 font-body text-xs font-semibold uppercase tracking-wider text-neutral">
                            Deductions
                        </p>
                        <div className="flex flex-col gap-2">
                            <div className="flex justify-between font-body text-sm text-primary-dark">
                                <span>Deductions</span>
                                <span className="text-danger">
                                    - {formatRupiah(record.deductions)}
                                </span>
                            </div>
                            <div className="flex justify-between border-t border-neutral/15 pt-2 font-body text-sm font-semibold text-primary-dark">
                                <span>Total deductions</span>
                                <span className="text-danger">
                                    - {formatRupiah(record.deductions)}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Net pay */}
                    <div className="flex items-center justify-between rounded-lg bg-primary px-4 py-3">
                        <span className="font-heading text-sm font-semibold text-base-white">
                            Net Pay
                        </span>
                        <span className="font-heading text-lg font-bold text-base-white">
                            {formatRupiah(record.netPay)}
                        </span>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-2 border-t border-neutral/10 px-6 py-4">
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                    >
                        Close
                    </Button>
                    <Button
                        variant="outline"
                        onClick={handleDownload}
                        loading={isDownloading}
                    >
                        <Download className="h-4 w-4" />
                        Download PDF
                    </Button>
                    <Button variant="primary" onClick={() => window.print()}>
                        <Printer className="h-4 w-4" />
                        Print
                    </Button>
                </div>
            </div>
        </div>
    );
}

export { PaySlipModal };