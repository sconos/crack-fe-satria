export function exportToCsv(filename: string, rows: Record<string, string | number>[]) {
    if (rows.length === 0) return;

    const headers = Object.keys(rows[0]);
    const escapeCell = (value: string | number) => {
        const str = String(value);
        return /[",\n]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str;
    };

    const csv = [
        headers.join(","),
        ...rows.map((row) => headers.map((h) => escapeCell(row[h])).join(",")),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
}