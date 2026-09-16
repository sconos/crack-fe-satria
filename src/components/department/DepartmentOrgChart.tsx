"use client";

import { useEffect, useId, useRef } from "react";
import { OrgChart } from "d3-org-chart";
import type { Department } from "@/types/department";
import type { HierarchyNode } from "d3-hierarchy";

type LayoutNode = HierarchyNode<Department> & {
    width: number;
    height: number;
};

function escapeHtml(value: string) {
    return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export function DepartmentOrgChart({ departments }: { departments: Department[] }) {
    const rawId = useId();
    const containerId = `org-chart-${rawId.replace(/:/g, "")}`;
    const containerRef = useRef<HTMLDivElement>(null);
    const chartRef = useRef<OrgChart<Department> | null>(null);

    useEffect(() => {
        if (!containerRef.current || departments.length === 0) return;

        if (!chartRef.current) {
            chartRef.current = new OrgChart<Department>();
        }

        chartRef.current
            .container(`#${containerId}`)
            .data(departments)
            .nodeWidth(() => 232)
            .nodeHeight(() => 116)
            .childrenMargin(() => 50)
            .compactMarginBetween(() => 25)
            .compactMarginPair(() => 40)
            .neighbourMargin(() => 25)
            .nodeContent((d) => {
                const node = d as LayoutNode;
                const dept = node.data;
                const statusColor = dept.status === "active" ? "#16a34a" : "#9ca3af";
                const initials = dept.headInitials ?? "—";
                const headName = dept.headName ?? "Unassigned";

                return `
                    <div style="width:${node.width}px;height:${node.height}px;padding:12px;box-sizing:border-box;">
                        <div style="border:1px solid rgba(107,114,128,0.15);border-radius:12px;background:#fff;box-shadow:0 1px 2px rgba(0,0,0,0.05);padding:12px;height:100%;box-sizing:border-box;font-family:inherit;">
                            <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;">
                                <p style="margin:0;font-weight:600;font-size:13px;color:#1f2937;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${escapeHtml(dept.name)}</p>
                                <span style="flex-shrink:0;font-size:11px;font-weight:600;padding:2px 8px;border-radius:9999px;background:${statusColor}1a;color:${statusColor};">${dept.employeeCount}</span>
                            </div>
                            <div style="margin-top:10px;display:flex;align-items:center;gap:8px;">
                                <span style="width:28px;height:28px;flex-shrink:0;display:flex;align-items:center;justify-content:center;border-radius:9999px;background:#eef2ff;font-size:11px;font-weight:600;color:#1f2937;">${escapeHtml(initials)}</span>
                                <div style="min-width:0;">
                                    <p style="margin:0;font-size:12px;font-weight:500;color:#1f2937;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${escapeHtml(headName)}</p>
                                    <p style="margin:0;font-size:11px;color:#6b7280;">Department head</p>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            })
            .render();

        chartRef.current.fit();
    }, [departments, containerId]);

    if (departments.length === 0) {
        return (
            <p className="py-10 text-center text-sm text-neutral">
                No departments to display yet.
            </p>
        );
    }

    return (
        <div className="h-[600px] w-full overflow-hidden rounded-xl border border-neutral/15 bg-base-white">
            <div id={containerId} ref={containerRef} className="h-full w-full" />
        </div>
    );
}