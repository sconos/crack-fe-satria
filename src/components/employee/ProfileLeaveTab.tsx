"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableEmpty,
} from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { RequestLeaveModal, type LeaveRequestInput } from "@/components/employee/RequestLeaveModal";
import type { LeaveBalance, LeaveHistoryItem } from "@/types/employee-profile";

type BadgeVariant = "success" | "warning" | "danger" | "info" | "neutral";

const statusVariant: Record<LeaveHistoryItem["status"], BadgeVariant> = {
  Approved: "success",
  Pending: "warning",
  Rejected: "danger",
};

export function ProfileLeaveTab({
  balances,
  history,
  onRequestLeave,
  onApprove,
  onReject,
}: {
  balances: LeaveBalance[];
  history: LeaveHistoryItem[];
  onRequestLeave: (data: LeaveRequestInput) => void;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const leaveTypes = balances.map((b) => b.type);

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {balances.map((b) => {
          const remaining = b.total - b.used;
          const pct = Math.min(100, (b.used / b.total) * 100);
          return (
            <Card key={b.type}>
              <CardContent>
                <p className="text-xs text-neutral">{b.type}</p>
                <p className="mt-1 font-heading text-2xl font-bold text-primary-dark">
                  {remaining}
                  <span className="ml-1 text-sm font-normal text-neutral">
                    of {b.total} days left
                  </span>
                </p>
                <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-neutral/10">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle>Leave history</CardTitle>
          <Button size="sm" onClick={() => setModalOpen(true)}>
            <Plus className="h-4 w-4" />
            Request leave
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Dates</TableHead>
                <TableHead>Days</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {history.map((h) => (
                <TableRow key={h.id}>
                  <TableCell>{h.type}</TableCell>
                  <TableCell className="text-neutral">{h.range}</TableCell>
                  <TableCell className="text-neutral">{h.days}</TableCell>
                  <TableCell>
                    <Badge variant={statusVariant[h.status]}>
                      {h.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {h.status === "Pending" ? (
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => onApprove(h.id)}>
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onReject(h.id)}
                        >
                          Reject
                        </Button>
                      </div>
                    ) : (
                      <span className="text-xs text-neutral">—</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
              {history.length === 0 && (
                <TableEmpty colSpan={5}>No leave requests yet.</TableEmpty>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <RequestLeaveModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        leaveTypes={leaveTypes}
        onSubmit={onRequestLeave}
      />
    </div>
  );
}