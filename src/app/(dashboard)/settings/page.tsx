"use client";

import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Tabs } from "@/components/ui/Tabs";
import { LeaveTypesTab } from "@/components/settings/LeaveTypesTab";
import { HolidaysTab } from "@/components/settings/HolidaysTab";
import { leaveTypes } from "@/lib/mock-data/leave-types";
import { holidays } from "@/lib/mock-data/holidays";
import { useState } from "react";

const tabItems = [
    { value: "leave-types", label: "Leave Types" },
    { value: "holidays", label: "Public Holidays" },
];

export default function SettingsPage() {
    const [tab, setTab] = useState("leave-types");

    return (
        <DashboardLayout title="Settings">
            <div className="flex flex-col gap-6">
                <PageHeader
                    title="Settings"
                    description="Configure leave types and the public holiday calendar"
                />

                <Tabs items={tabItems} value={tab} onValueChange={setTab} />

                {tab === "leave-types" ? (
                    <LeaveTypesTab initialLeaveTypes={leaveTypes} />
                ) : (
                    <HolidaysTab initialHolidays={holidays} />
                )}
            </div>
        </DashboardLayout>
    );
}