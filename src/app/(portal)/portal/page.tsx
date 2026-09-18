"use client";

import { useEffect, useState } from "react";
import { PortalLayout } from "@/components/portal/PortalLayout";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { getMyEmployee } from "@/lib/api/employees";
import { getMyPayroll, type PayrollRecordWithDetail } from "@/lib/api/payroll";
import {
    getMyLeaveBalances,
    getMyLeaveRequests,
    type LeaveBalance,
    type LeaveRequestWithEmployee,
} from "@/lib/api/leave";
import type { Employee } from "@/types/employee";

const bannerStatusColor: Record<Employee["status"], string> = {
    Active: "text-success",
    Inactive: "text-danger",
    "On Leave": "text-warning",
    Probation: "text-info",
};

function formatRupiah(amount: number) {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);
}

function getInitials(name: string) {
    return name
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase())
        .join("");
}

export default function PortalDashboardPage() {
    const [employee, setEmployee] = useState<Employee | null>(null);
    const [latestPayslip, setLatestPayslip] =
        useState<PayrollRecordWithDetail | null>(null);
    const [leaveBalances, setLeaveBalances] = useState<LeaveBalance[]>([]);
    const [recentLeave, setRecentLeave] = useState<LeaveRequestWithEmployee[]>(
        [],
    );
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;

        async function load() {
            try {
                const [emp, payroll, balances, leave] = await Promise.all([
                    getMyEmployee(),
                    getMyPayroll({ limit: 1 }),
                    getMyLeaveBalances(),
                    getMyLeaveRequests({ limit: 3 }),
                ]);

                if (cancelled) return;
                setEmployee(emp);
                setLatestPayslip(payroll.records[0] ?? null);
                setLeaveBalances(balances);
                setRecentLeave(leave.requests);
            } catch (err) {
                if (!cancelled) {
                    setError(
                        err instanceof Error
                            ? err.message
                            : "Couldn't load your dashboard.",
                    );
                }
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        load();
        return () => {
            cancelled = true;
        };
    }, []);

    if (loading) {
        return (
            <PortalLayout title="My Dashboard">
                <p className="font-body text-sm text-neutral">
                    Loading your dashboard…
                </p>
            </PortalLayout>
        );
    }

    if (error || !employee) {
        return (
            <PortalLayout title="My Dashboard">
                <p className="font-body text-sm text-danger">
                    {error ?? "Couldn't load your dashboard."}
                </p>
            </PortalLayout>
        );
    }

    const leaveRemaining = leaveBalances.reduce((sum, b) => sum + b.remaining, 0);

    const stats = [
        { label: "Employment Status", value: employee.status },
        { label: "Leave Balance", value: `${leaveRemaining} days` },
        { label: "Department", value: employee.department || "—" },
        {
            label: "This Month Pay",
            value: latestPayslip ? formatRupiah(latestPayslip.netPay) : "—",
        },
    ];

    return (
        <PortalLayout title="My Dashboard">
            <div className="flex flex-col gap-6">
                {/* Welcome banner */}
                <div
                    className="flex items-center gap-4 rounded-xl px-5 py-5"
                    style={{ background: "#15803D" }}
                >
                    {employee.avatar ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                            src={employee.avatar}
                            alt={employee.name}
                            className="h-12 w-12 shrink-0 rounded-full object-cover"
                            style={{ boxShadow: "0 0 0 2px rgba(255,255,255,0.2)" }}
                        />
                    ) : (
                        <div
                            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full font-heading text-base font-bold text-base-white"
                            style={{ background: "rgba(255,255,255,0.2)" }}
                        >
                            {getInitials(employee.name)}
                        </div>
                    )}
                    <div className="min-w-0">
                        <p
                            className="font-body text-sm"
                            style={{ color: "rgba(255,255,255,0.75)" }}
                        >
                            Welcome back
                        </p>
                        <h1 className="font-heading text-xl font-bold text-base-white truncate">
                            {employee.name}
                        </h1>
                        <p
                            className="font-body text-sm truncate"
                            style={{ color: "rgba(255,255,255,0.75)" }}
                        >
                            {employee.role} · {employee.department}
                        </p>
                    </div>
                    <div className="ml-auto flex shrink-0 items-center gap-1.5 rounded-full bg-base-white px-3 py-1">
                        <span
                            className={`h-1.5 w-1.5 rounded-full ${
                                bannerStatusColor[employee.status]
                            } bg-current`}
                        />
                        <span
                            className={`font-body text-xs font-semibold ${
                                bannerStatusColor[employee.status]
                            }`}
                        >
                            {employee.status}
                        </span>
                    </div>
                </div>

                {/* Quick stats */}
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(2, 1fr)",
                        gap: "1rem",
                    }}
                >
                    {stats.map((s) => (
                        <Card key={s.label}>
                            <CardContent className="px-4 py-4">
                                <p className="font-body text-xs text-neutral">
                                    {s.label}
                                </p>
                                <p className="font-heading mt-1 text-base font-bold text-primary-dark">
                                    {s.value}
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Cards row */}
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns:
                            "repeat(auto-fit, minmax(280px, 1fr))",
                        gap: "1rem",
                    }}
                >
                    {/* Latest pay slip */}
                    <Card>
                        <CardContent className="px-5 py-5">
                            <div className="mb-4 flex items-center justify-between">
                                <p className="font-heading text-sm font-semibold text-primary-dark">
                                    Latest Pay Slip
                                </p>
                                {latestPayslip && (
                                    <Badge
                                        variant={
                                            latestPayslip.status === "Paid"
                                                ? "success"
                                                : "info"
                                        }
                                        dot
                                    >
                                        {latestPayslip.status}
                                    </Badge>
                                )}
                            </div>
                            {latestPayslip ? (
                                <>
                                    <p className="font-body text-xs text-neutral mb-3">
                                        {latestPayslip.period}
                                    </p>
                                    <div className="flex flex-col gap-2">
                                        <div className="flex justify-between font-body text-sm">
                                            <span className="text-neutral">
                                                Base salary
                                            </span>
                                            <span className="text-primary-dark">
                                                {formatRupiah(
                                                    latestPayslip.baseSalary,
                                                )}
                                            </span>
                                        </div>
                                        <div className="flex justify-between font-body text-sm">
                                            <span className="text-neutral">
                                                Allowances
                                            </span>
                                            <span className="text-success">
                                                +
                                                {formatRupiah(
                                                    latestPayslip.allowances,
                                                )}
                                            </span>
                                        </div>
                                        <div className="flex justify-between font-body text-sm">
                                            <span className="text-neutral">
                                                Deductions
                                            </span>
                                            <span className="text-danger">
                                                -
                                                {formatRupiah(
                                                    latestPayslip.deductions,
                                                )}
                                            </span>
                                        </div>
                                        <div className="flex justify-between border-t border-neutral/10 pt-2 font-heading text-sm font-bold">
                                            <span className="text-primary-dark">
                                                Net Pay
                                            </span>
                                            <span className="text-primary">
                                                {formatRupiah(
                                                    latestPayslip.netPay,
                                                )}
                                            </span>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <p className="font-body text-sm text-neutral">
                                    No payslips yet.
                                </p>
                            )}
                        </CardContent>
                    </Card>

                    {/* Recent leave */}
                    <Card>
                        <CardContent className="px-5 py-5">
                            <div className="mb-4 flex items-center justify-between">
                                <p className="font-heading text-sm font-semibold text-primary-dark">
                                    Recent Leave
                                </p>
                                <Badge variant="info">
                                    {leaveRemaining} days left
                                </Badge>
                            </div>
                            {recentLeave.length > 0 ? (
                                <div className="flex flex-col gap-3">
                                    {recentLeave.map((l) => (
                                        <div
                                            key={l.id}
                                            className="flex items-center justify-between"
                                        >
                                            <div>
                                                <p className="font-body text-sm font-medium text-primary-dark">
                                                    {l.type} Leave ·{" "}
                                                    {l.days} day
                                                    {l.days > 1 ? "s" : ""}
                                                </p>
                                                <p className="font-body text-xs text-neutral">
                                                    {new Date(
                                                        l.startDate,
                                                    ).toLocaleDateString(
                                                        "en-US",
                                                        {
                                                            month: "short",
                                                            day: "numeric",
                                                            year: "numeric",
                                                        },
                                                    )}
                                                </p>
                                            </div>
                                            <Badge
                                                variant={
                                                    l.status === "Approved"
                                                        ? "success"
                                                        : "info"
                                                }
                                                dot
                                            >
                                                {l.status}
                                            </Badge>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="font-body text-sm text-neutral">
                                    No leave requests yet.
                                </p>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </PortalLayout>
    );
}