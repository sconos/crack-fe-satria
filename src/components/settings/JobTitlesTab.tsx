"use client";

import * as React from "react";
import { Plus, Pencil, UserX, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableHead,
    TableCell,
    TableEmpty,
} from "@/components/ui/Table";
import { DropdownMenu } from "@/components/ui/DropdownMenu";
import { JobTitleModal } from "./JobTitleModal";
import { toast } from "@/components/ui/Toast";
import {
    getJobTitles,
    createJobTitle,
    updateJobTitle,
    updateJobTitleStatus,
} from "@/lib/api/job-titles";
import type { JobTitle } from "@/types/job-title";

export function JobTitlesTab() {
    const [jobTitles, setJobTitles] = React.useState<JobTitle[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const [modalOpen, setModalOpen] = React.useState(false);
    const [editTarget, setEditTarget] = React.useState<JobTitle | null>(null);

    React.useEffect(() => {
        let cancelled = false;

        async function load() {
            try {
                const fetched = await getJobTitles(false);
                if (!cancelled) setJobTitles(fetched);
            } catch {
                if (!cancelled) toast.error("Couldn't load job titles.");
            } finally {
                if (!cancelled) setIsLoading(false);
            }
        }

        load();
        return () => {
            cancelled = true;
        };
    }, []);

    function handleAdd() {
        setEditTarget(null);
        setModalOpen(true);
    }

    function handleEdit(jobTitle: JobTitle) {
        setEditTarget(jobTitle);
        setModalOpen(true);
    }

    async function handleSubmit(name: string) {
        try {
            if (editTarget) {
                const updated = await updateJobTitle(editTarget.id, name);
                setJobTitles((prev) =>
                    prev.map((t) => (t.id === editTarget.id ? updated : t)),
                );
                toast.success(`${name} updated`);
            } else {
                const created = await createJobTitle(name);
                setJobTitles((prev) => [...prev, created]);
                toast.success(`${name} added`);
            }
        } catch {
            toast.error(
                editTarget
                    ? "Couldn't update job title. Try again."
                    : "Couldn't add job title. Try again.",
            );
        }
    }

    async function handleToggleActive(jobTitle: JobTitle) {
        try {
            const updated = await updateJobTitleStatus(
                jobTitle.id,
                !jobTitle.isActive,
            );
            setJobTitles((prev) =>
                prev.map((t) => (t.id === jobTitle.id ? updated : t)),
            );
        } catch {
            toast.error("Couldn't update status. Try again.");
        }
    }

    return (
        <div className="flex flex-col gap-4">
            <div className="flex justify-end">
                <Button onClick={handleAdd}>
                    <Plus className="h-4 w-4" />
                    Add job title
                </Button>
            </div>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {isLoading ? (
                        <TableEmpty colSpan={3}>
                            Loading job titles...
                        </TableEmpty>
                    ) : jobTitles.length === 0 ? (
                        <TableEmpty colSpan={3}>No job titles configured yet.</TableEmpty>
                    ) : (
                        jobTitles.map((jobTitle) => (
                            <TableRow key={jobTitle.id}>
                                <TableCell className="font-medium text-primary-dark">
                                    {jobTitle.name}
                                </TableCell>
                                <TableCell>
                                    <Badge
                                        variant={jobTitle.isActive ? "success" : "neutral"}
                                        dot
                                    >
                                        {jobTitle.isActive ? "Active" : "Inactive"}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    <DropdownMenu
                                        trigger={<Pencil className="h-4 w-4" />}
                                        items={[
                                            {
                                                label: "Edit",
                                                icon: <Pencil className="h-3.5 w-3.5" />,
                                                onSelect: () => handleEdit(jobTitle),
                                            },
                                            {
                                                label: jobTitle.isActive
                                                    ? "Deactivate"
                                                    : "Reactivate",
                                                icon: jobTitle.isActive ? (
                                                    <UserX className="h-3.5 w-3.5" />
                                                ) : (
                                                    <RotateCcw className="h-3.5 w-3.5" />
                                                ),
                                                variant: jobTitle.isActive
                                                    ? "danger"
                                                    : "default",
                                                onSelect: () =>
                                                    handleToggleActive(jobTitle),
                                            },
                                        ]}
                                    />
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>

            <JobTitleModal
                open={modalOpen}
                onOpenChange={setModalOpen}
                initialValues={editTarget ?? undefined}
                onSubmit={handleSubmit}
            />
        </div>
    );
}