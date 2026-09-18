export function exportToCsv(
    filename: string,
    rows: Record<string, string | number | null | undefined>[],
) {
    if (rows.length === 0) return;

    const headers = Object.keys(rows[0]);
    const escapeCell = (value: string | number | null | undefined) => {
        const str = String(value ?? "");
        return /[",\n]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str;
    };

    const csv = [
        "sep=,",
        headers.join(","),
        ...rows.map((row) => headers.map((h) => escapeCell(row[h])).join(",")),
    ].join("\r\n");

    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}