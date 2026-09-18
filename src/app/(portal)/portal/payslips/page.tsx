"use client";

import * as React from "react";
import { PortalLayout } from "@/components/portal/PortalLayout";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { PaySlipModal } from "@/components/payroll/PaySlipModal";
import { PayrollStatusBadge } from "@/components/payroll/PayrollStatusBadge";
import { toast } from "@/components/ui/Toast";
import { getMyPayroll, type PayrollRecordWithDetail } from "@/lib/api/payroll";

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
    const [payslips, setPayslips] = React.useState<PayrollRecordWithDetail[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const [selected, setSelected] = React.useState<PayrollRecordWithDetail | null>(null);

    React.useEffect(() => {
        let cancelled = false;

        async function load() {
            try {
                const { records } = await getMyPayroll({ limit: 100 });
                if (!cancelled) setPayslips(records);
            } catch {
                if (!cancelled) toast.error("Couldn't load your pay slips.");
            } finally {
                if (!cancelled) setIsLoading(false);
            }
        }

        load();
        return () => {
            cancelled = true;
        };
    }, []);

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
                    {isLoading ? (
                        <p className="text-sm text-neutral">Loading...</p>
                    ) : payslips.length === 0 ? (
                        <p className="text-sm text-neutral">
                            No pay slips yet.
                        </p>
                    ) : (
                        payslips.map((slip) => (
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
                                            <PayrollStatusBadge status={slip.status} />
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
                        ))
                    )}
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