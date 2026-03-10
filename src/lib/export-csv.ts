type CsvColumn = {
  header: string;
  accessor: (row: Record<string, unknown>) => string;
};

function sanitize(val: string): string {
  if (/^[=+\-@\t\r]/.test(val)) {
    return `"'${val.replace(/"/g, '""')}"`;
  }
  if (/[",\n]/.test(val)) {
    return `"${val.replace(/"/g, '""')}"`;
  }
  return val;
}

export function exportToCsv(
  rows: Record<string, unknown>[],
  columns: CsvColumn[],
  filename: string
) {
  if (rows.length === 0) return;

  const headers = columns.map((c) => sanitize(c.header));
  const csvRows = rows.map((row) =>
    columns.map((col) => sanitize(col.accessor(row)))
  );

  const csv = [headers.join(","), ...csvRows.map((r) => r.join(","))].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 100);
}

export function todayFilename(section: string): string {
  const d = new Date().toISOString().split("T")[0];
  return `outlet-${section}-${d}.csv`;
}
