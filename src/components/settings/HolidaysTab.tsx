"use client";

import { useMemo, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableHead,
    TableCell,
    TableEmpty,
} from "@/components/ui/Table";
import { HolidayModal, type HolidayInput } from "./HolidayModal";
import { toast } from "@/components/ui/Toast";
import type { PublicHoliday } from "@/types/leave";

export function HolidaysTab({
    initialHolidays,
}: {
    initialHolidays: PublicHoliday[];
}) {
    const [holidays, setHolidays] = useState(initialHolidays);
    const [modalOpen, setModalOpen] = useState(false);

    const sorted = useMemo(
        () => [...holidays].sort((a, b) => a.date.localeCompare(b.date)),
        [holidays],
    );

    function handleAdd(data: HolidayInput) {
        setHolidays((prev) => [
            ...prev,
            { id: `h${Date.now()}`, ...data },
        ]);
        toast.success(`${data.name} added`);
    }

    function handleDelete(id: string) {
        const holiday = holidays.find((h) => h.id === id);
        setHolidays((prev) => prev.filter((h) => h.id !== id));
        if (holiday) toast.success(`${holiday.name} removed`);
    }

    return (
        <div className="flex flex-col gap-4">
            <div className="flex justify-end">
                <Button onClick={() => setModalOpen(true)}>
                    <Plus className="h-4 w-4" />
                    Add holiday
                </Button>
            </div>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Holiday</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {sorted.length === 0 ? (
                        <TableEmpty colSpan={3}>No public holidays configured yet.</TableEmpty>
                    ) : (
                        sorted.map((holiday) => (
                            <TableRow key={holiday.id}>
                                <TableCell className="font-medium text-primary-dark">
                                    {holiday.name}
                                </TableCell>
                                <TableCell className="text-neutral">
                                    {new Date(holiday.date).toLocaleDateString(
                                        "en-US",
                                        { year: "numeric", month: "long", day: "numeric" },
                                    )}
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-8 w-8 p-0 hover:bg-danger/10 hover:text-danger"
                                        onClick={() => handleDelete(holiday.id)}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                        <span className="sr-only">
                                            Remove {holiday.name}
                                        </span>
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>

            <HolidayModal
                open={modalOpen}
                onOpenChange={setModalOpen}
                onSubmit={handleAdd}
            />
        </div>
    );
}