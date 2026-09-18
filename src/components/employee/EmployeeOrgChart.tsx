"use client";

import { useEffect, useId, useRef } from "react";
import { OrgChart } from "d3-org-chart";
import type { HierarchyNode } from "d3-hierarchy";
import type { Employee } from "@/types/employee";

type LayoutNode = HierarchyNode<ChartDatum> & {
    width: number;
    height: number;
};

interface ChartDatum extends Employee {
    parentId: string | null;
}

const VIRTUAL_ROOT_ID = "__virtual_root__";

function escapeHtml(value: string) {
    return value
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
}

function getInitials(name: string) {
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function toChartData(employees: Employee[]): ChartDatum[] {
    const idByName = new Map(employees.map((e) => [e.name, e.id]));

    const virtualRoot: ChartDatum = {
        id: VIRTUAL_ROOT_ID,
        name: "",
        email: "",
        department: "",
        role: "",
        status: "Active",
        joinDate: "",
        parentId: null,
    };

    const nodes: ChartDatum[] = employees.map((e) => ({
        ...e,
        parentId: e.manager ? (idByName.get(e.manager) ?? VIRTUAL_ROOT_ID) : VIRTUAL_ROOT_ID,
    }));

    return [virtualRoot, ...nodes];
}

export function EmployeeOrgChart({
    employees,
    onNodeClick,
}: {
    employees: Employee[];
    onNodeClick?: (employeeId: string) => void;
}) {
    const rawId = useId();
    const containerId = `employee-org-chart-${rawId.replace(/:/g, "")}`;
    const containerRef = useRef<HTMLDivElement>(null);
    const chartRef = useRef<OrgChart<ChartDatum> | null>(null);

    useEffect(() => {
        if (!containerRef.current || employees.length === 0) return;

        if (!chartRef.current) {
            chartRef.current = new OrgChart<ChartDatum>();
        }

        chartRef.current
            .container(`#${containerId}`)
            .data(toChartData(employees))
            .nodeWidth((d) => (d.data.id === VIRTUAL_ROOT_ID ? 0 : 220))
            .nodeHeight((d) => (d.data.id === VIRTUAL_ROOT_ID ? 0 : 100))
            .childrenMargin(() => 50)
            .compactMarginBetween(() => 25)
            .compactMarginPair(() => 40)
            .neighbourMargin(() => 25)
            .onNodeClick((datum) => {
                if (datum.data.id === VIRTUAL_ROOT_ID) return;
                onNodeClick?.(datum.data.id);
            })
            .nodeContent((d) => {
                const node = d as LayoutNode;
                const emp = node.data;
                if (emp.id === VIRTUAL_ROOT_ID) return "";

                const initials = getInitials(emp.name);
                const avatarHtml = emp.avatar
                    ? `<img src="${escapeHtml(emp.avatar)}" alt="${escapeHtml(emp.name)}" style="width:32px;height:32px;border-radius:9999px;object-fit:cover;flex-shrink:0;" />`
                    : `<span style="width:32px;height:32px;flex-shrink:0;display:flex;align-items:center;justify-content:center;border-radius:9999px;background:#eef2ff;font-size:12px;font-weight:600;color:#1f2937;">${escapeHtml(initials)}</span>`;

                return `
                    <div style="width:${node.width}px;height:${node.height}px;padding:10px;box-sizing:border-box;cursor:pointer;">
                        <div style="border:1px solid rgba(107,114,128,0.15);border-radius:12px;background:#fff;box-shadow:0 1px 2px rgba(0,0,0,0.05);padding:10px;height:100%;box-sizing:border-box;display:flex;align-items:center;gap:10px;font-family:inherit;">
                            ${avatarHtml}
                            <div style="min-width:0;">
                                <p style="margin:0;font-weight:600;font-size:13px;color:#1f2937;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${escapeHtml(emp.name)}</p>
                                <p style="margin:0;font-size:11px;color:#6b7280;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${escapeHtml(emp.role)}</p>
                            </div>
                        </div>
                    </div>
                `;
            })
            .render();

        chartRef.current.fit();
    }, [employees, containerId, onNodeClick]);

    if (employees.length === 0) {
        return (
            <p className="py-10 text-center text-sm text-neutral">
                No employees to display yet.
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