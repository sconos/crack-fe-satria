"use client";

import { useEffect, useId, useRef } from "react";
import { OrgChart } from "d3-org-chart";
import type { Department } from "@/types/department";
import type { HierarchyNode } from "d3-hierarchy";

type LayoutNode = HierarchyNode<Department> & {
    width: number;
    height: number;
};

const VIRTUAL_ROOT_ID = "__virtual_root__";

const NODE_WIDTH = 260;
const NODE_HEIGHT = 118;
const ROOT_SIZE = 1;

const STATUS_COLORS: Record<Department["status"], string> = {
    active: "#16a34a",
    inactive: "#9ca3af",
};

function nodeHtml(data: Department): string {
    if (data.id === VIRTUAL_ROOT_ID) {
        // Invisible anchor so multiple top-level departments can share one root.
        return `<div style="width:${ROOT_SIZE}px;height:${ROOT_SIZE}px;"></div>`;
    }

    const statusColor = STATUS_COLORS[data.status];
    const statusLabel = data.status === "active" ? "Active" : "Inactive";
    const head = data.headName
        ? escapeHtml(data.headName)
        : `<span style="font-style:italic;color:#9ca3af;">Unassigned</span>`;

    return `
        <div style="
            width:${NODE_WIDTH - 4}px;
            box-sizing:border-box;
            border:1px solid #e5e7eb;
            border-radius:12px;
            background:#ffffff;
            padding:14px 16px;
            font-family:inherit;
            box-shadow:0 1px 2px rgba(0,0,0,0.04);
        ">
            <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;">
                <p style="margin:0;font-size:14px;font-weight:600;color:#064e3b;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">
                    ${escapeHtml(data.name)}
                </p>
                <span style="display:inline-flex;align-items:center;gap:4px;font-size:11px;font-weight:500;color:#374151;white-space:nowrap;">
                    <span style="width:6px;height:6px;border-radius:50%;background:${statusColor};display:inline-block;"></span>
                    ${statusLabel}
                </span>
            </div>
            <p style="margin:2px 0 10px;font-size:11px;color:#9ca3af;">${escapeHtml(data.code)}</p>
            <div style="display:flex;flex-direction:column;gap:4px;font-size:12px;color:#4b5563;">
                <div style="display:flex;justify-content:space-between;">
                    <span>Head</span>
                    <span style="color:#111827;">${head}</span>
                </div>
                <div style="display:flex;justify-content:space-between;">
                    <span>Employees</span>
                    <span style="color:#111827;">${data.employeeCount}</span>
                </div>
            </div>
        </div>
    `;
}

function escapeHtml(value: string) {
    return value
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
}

function toChartData(departments: Department[]): Department[] {
    const virtualRoot: Department = {
        id: VIRTUAL_ROOT_ID,
        name: "",
        code: "",
        parentId: null,
        headId: null,
        headName: null,
        headInitials: null,
        employeeCount: 0,
        status: "active",
    };

    const nodes = departments.map((d) => ({
        ...d,
        parentId: d.parentId ?? VIRTUAL_ROOT_ID,
    }));

    return [virtualRoot, ...nodes];
}

export function DepartmentOrgChart({
    departments,
}: {
    departments: Department[];
}) {
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
            .data(toChartData(departments))
            .nodeWidth(() => NODE_WIDTH)
            .nodeHeight((d) =>
                d.data.id === VIRTUAL_ROOT_ID ? ROOT_SIZE : NODE_HEIGHT,
            )
            .childrenMargin(() => 50)
            .compactMarginBetween(() => 25)
            .compactMarginPair(() => 30)
            .nodeContent((d) => nodeHtml(d.data))
            .render();

        chartRef.current.fit();

        return () => {
            chartRef.current = null;
        };
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
            <div
                id={containerId}
                ref={containerRef}
                className="h-full w-full"
            />
        </div>
    );
}