"use client";

import * as React from "react";
import { PortalLayout } from "@/components/portal/PortalLayout";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { PaySlipModal } from "@/components/payroll/PaySlipModal";
import type { PayrollRecord } from "@/types/payroll";

const mockPayslips: PayrollRecord[] = [
    {
        id: "ps1",
        employeeId: "1",
        employeeName: "Satria Wijaya",
        department: "Engineering",
        role: "Frontend Developer",
        period: "2025-01",
        baseSalary: 8000000,
        allowances: 1500000,
        deductions: 500000,
        netPay: 9000000,
        status: "Paid",
    },
    {
        id: "ps2",
        employeeId: "1",
        employeeName: "Satria Wijaya",
        department: "Engineering",
        role: "Frontend Developer",
        period: "2024-12",
        baseSalary: 8000000,
        allowances: 1500000,
        deductions: 500000,
        netPay: 9000000,
        status: "Paid",
    },
    {
        id: "ps3",
        employeeId: "1",
        employeeName: "Satria Wijaya",
        department: "Engineering",
        role: "Frontend Developer",
        period: "2024-11",
        baseSalary: 8000000,
        allowances: 1200000,
        deductions: 450000,
        netPay: 8750000,
        status: "Paid",
    },
];

function formatRupiah(amount: number) {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);
}

function formatPeriod(period: string) {
    const [year, month] = period.split("-");
    return new Date(parseInt(year), parseInt(month) - 1).toLocaleDateString(
        "en-US",
        { month: "long", year: "numeric" },
    );
}

export default function PortalPayslipsPage() {
    const [selected, setSelected] = React.useState<PayrollRecord | null>(null);

    return (
        <PortalLayout title="My Pay Slips">
            <div className="flex flex-col gap-4">
                <div>
                    <h1 className="font-heading text-2xl font-bold text-primary-dark">
                        Pay Slips
                    </h1>
                    <p className="font-body text-sm text-neutral">
                        Your payroll history
                    </p>
                </div>

                <div className="flex flex-col gap-3">
                    {mockPayslips.map((slip) => (
                        <Card key={slip.id}>
                            <CardContent className="px-5 py-4">
                                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                    <div className="flex flex-col gap-0.5">
                                        <p className="font-heading text-sm font-semibold text-primary-dark">
                                            {formatPeriod(slip.period)}
                                        </p>
                                        <p className="font-body text-xs text-neutral">
                                            Net Pay:{" "}
                                            <span className="font-semibold text-primary">
                                                {formatRupiah(slip.netPay)}
                                            </span>
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Badge variant="success" dot>
                                            Paid
                                        </Badge>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setSelected(slip)}
                                        >
                                            View
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>

            <PaySlipModal
                open={!!selected}
                onOpenChange={(open) => {
                    if (!open) setSelected(null);
                }}
                record={selected}
            />
        </PortalLayout>
    );
}
