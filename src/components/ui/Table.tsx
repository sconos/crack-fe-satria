import * as React from "react";
import { ChevronUp, ChevronDown, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/util";

const Table = React.forwardRef<
    HTMLTableElement,
    React.TableHTMLAttributes<HTMLTableElement>
>(({ className, ...props }, ref) => (
    <div className="w-full overflow-x-auto rounded-xl border border-neutral/15">
        <table
            ref={ref}
            className={cn(
                "w-full border-collapse font-body text-sm",
                className,
            )}
            {...props}
        />
    </div>
));
Table.displayName = "Table";

const TableHeader = React.forwardRef<
    HTMLTableSectionElement,
    React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
    <thead ref={ref} className={cn("bg-primary-tint", className)} {...props} />
));
TableHeader.displayName = "TableHeader";

const TableBody = React.forwardRef<
    HTMLTableSectionElement,
    React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
    <tbody
        ref={ref}
        className={cn("divide-y divide-neutral/10", className)}
        {...props}
    />
));
TableBody.displayName = "TableBody";

const TableRow = React.forwardRef<
    HTMLTableRowElement,
    React.HTMLAttributes<HTMLTableRowElement>
>(({ className, ...props }, ref) => (
    <tr
        ref={ref}
        className={cn("transition-colors hover:bg-primary-tint/60", className)}
        {...props}
    />
));
TableRow.displayName = "TableRow";

const TableHead = React.forwardRef<
    HTMLTableCellElement,
    React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
    <th
        ref={ref}
        className={cn(
            "px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-neutral",
            className,
        )}
        {...props}
    />
));
TableHead.displayName = "TableHead";

const TableCell = React.forwardRef<
    HTMLTableCellElement,
    React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
    <td
        ref={ref}
        className={cn("px-4 py-3 text-primary-dark", className)}
        {...props}
    />
));
TableCell.displayName = "TableCell";

const TableEmpty = ({
    colSpan,
    children,
}: {
    colSpan: number;
    children: React.ReactNode;
}) => (
    <tr>
        <td
            colSpan={colSpan}
            className="px-4 py-12 text-center font-body text-sm text-neutral"
        >
            {children}
        </td>
    </tr>
);
TableEmpty.displayName = "TableEmpty";

export type SortDirection = "asc" | "desc" | null;

interface SortableHeadProps extends React.ThHTMLAttributes<HTMLTableCellElement> {
    sorted?: SortDirection;
    onSort?: () => void;
}

const SortableHead = React.forwardRef<HTMLTableCellElement, SortableHeadProps>(
    ({ className, sorted, onSort, children, ...props }, ref) => (
        <th
            ref={ref}
            className={cn(
                "px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-neutral",
                className,
            )}
            {...props}
        >
            <button
                type="button"
                onClick={onSort}
                className="inline-flex items-center gap-1 hover:text-primary-dark"
            >
                {children}
                {sorted === "asc" && <ChevronUp className="h-3.5 w-3.5" />}
                {sorted === "desc" && <ChevronDown className="h-3.5 w-3.5" />}
                {!sorted && (
                    <ChevronsUpDown className="h-3.5 w-3.5 opacity-40" />
                )}
            </button>
        </th>
    ),
);
SortableHead.displayName = "SortableHead";

export {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableHead,
    TableCell,
    TableEmpty,
    SortableHead,
};
