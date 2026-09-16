"use client";

import * as React from "react";
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
import {
    getPublicHolidays,
    createPublicHoliday,
    deletePublicHoliday,
} from "@/lib/api/public-holidays";
import type { PublicHoliday } from "@/types/leave";

export function HolidaysTab() {
    const [holidays, setHolidays] = React.useState<PublicHoliday[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const [modalOpen, setModalOpen] = React.useState(false);

    React.useEffect(() => {
        let cancelled = false;

        async function load() {
            try {
                // The backend already orders by date, so no client-side
                // sort is needed here.
                const fetched = await getPublicHolidays();
                if (!cancelled) setHolidays(fetched);
            } catch {
                if (!cancelled) toast.error("Couldn't load public holidays.");
            } finally {
                if (!cancelled) setIsLoading(false);
            }
        }

        load();
        return () => {
            cancelled = true;
        };
    }, []);

    async function handleAdd(data: HolidayInput) {
        try {
            const created = await createPublicHoliday(data);
            setHolidays((prev) =>
                [...prev, created].sort((a, b) => a.date.localeCompare(b.date)),
            );
            toast.success(`${data.name} added`);
        } catch {
            toast.error("Couldn't add holiday. Try again.");
        }
    }

    async function handleDelete(id: string) {
        const holiday = holidays.find((h) => h.id === id);
        try {
            await deletePublicHoliday(id);
            setHolidays((prev) => prev.filter((h) => h.id !== id));
            if (holiday) toast.success(`${holiday.name} removed`);
        } catch {
            toast.error("Couldn't remove holiday. Try again.");
        }
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
                    {isLoading ? (
                        <TableEmpty colSpan={3}>
                            Loading public holidays...
                        </TableEmpty>
                    ) : holidays.length === 0 ? (
                        <TableEmpty colSpan={3}>No public holidays configured yet.</TableEmpty>
                    ) : (
                        holidays.map((holiday) => (
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